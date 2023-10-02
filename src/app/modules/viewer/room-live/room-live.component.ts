import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { RoomWithOffer } from 'src/app/models/room-with-offer.model';
import { LOCAL_STREAM } from 'src/app/modules/admin/create-room/create-room.component';
import { AuthService } from 'src/app/services/auth.service';
import {
  PEER_TRC_CONNECTION,
  RoomService,
} from 'src/app/services/room.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { MessageType } from 'src/app/types/message.type';
import { SocketMessageType } from 'src/app/types/socket-message.type';
import { environment } from 'src/environments/environment';

@Component({
  standalone: true,
  selector: 'room-live',
  templateUrl: './room-live.component.html',
  imports: [SharedModule],
})
export class RoomLiveComponent implements OnInit {
  private _authSV = inject(AuthService);
  private _roomSV = inject(RoomService);
  private _cdr = inject(ChangeDetectorRef);
  private _route = inject(ActivatedRoute);
  private _zone = inject(NgZone);
  private _http = inject(HttpClient);

  localStream: MediaStream = LOCAL_STREAM;
  isCheckedOwnerPermission$ = new BehaviorSubject<boolean>(false);
  isOwner: boolean = false;
  isAnswered: boolean = false;

  userId: string = '';
  roomId: string = '';

  message: string = '';
  messages: Message[] = [];

  peer: PEER_TRC_CONNECTION = new RTCPeerConnection();

  ngOnInit() {
    this.userId = this._authSV.auth?.user.id ?? '';
    this._route.params.subscribe((item) => {
      this.roomId = item['id'];
      this.joinRoom();
    });

    this._roomSV
      .getRoomContent(this.roomId)
      .subscribe((res: any) => {
        switch (res.type) {
          case SocketMessageType.NEW_MESSAGE:
            console.log(res.data);
            this.messages.push(res.data);
            this._cdr.markForCheck();
            break;
        }
      });

    this._roomSV
      .getRoomViewerContent(this.roomId, this.userId)
      .subscribe((res: any) => {
        switch (res.type) {
          case SocketMessageType.SEND_OFFER:
            this.createAnswer(res.data.offer);
            break;
        }
      });
  }

  async createAnswer(offer: RoomWithOffer) {
    this.peer.onicecandidate = (ev) => {
      if (!ev.candidate || this.isAnswered) return;
      this._zone.run(() => {
        const roomWithAnswer = {
          answer: this.peer.localDescription,
        };
        this.isAnswered = true;
        this._cdr.markForCheck();

        this._http
          .post(environment.serviceUrl + '/room/send-answer', {
            roomId: this.roomId,
            viewerId: this.userId,
            answer: roomWithAnswer,
          })
          .subscribe((res: any) => {});
      });
    };

    this.peer.setRemoteDescription(offer.offer);
    this.peer
      .createAnswer()
      .then((answer) => this.peer.setLocalDescription(answer));

    this.peer.ondatachannel = (e) => {
      this._zone.run(() => {
        this.peer.dc = e.channel;
        this.peer.dc.onopen = () => {
          console.log('open x');
        };
      });
    };

    this.peer.ontrack = (e) => this.onTrack(e);
  }

  onTrack(e: RTCTrackEvent) {
    this._zone.run(() => {
      if (e.streams.length < 1) return;
      const stream = e.streams[0];
      this.localStream = stream;
      this.isCheckedOwnerPermission$.next(true);
      this._cdr.detectChanges();
    });
  }

  joinRoom() {
    this._roomSV
      .joinRoom({
        roomId: this.roomId,
        userId: this.userId,
        isStreamer: false,
      })
      .subscribe({
        next: (res) => {
          console.log(res);
        },
      });
  }

  sendMessagesInRoom() {
    const id = this._roomSV.roomIdSelected;
    if (!id) return;
    this._roomSV
      .sendMessages(id, MessageType.TEXT, this.message, this.userId)
      .subscribe((res) => {
        this.message = '';
        this._cdr.markForCheck();
      });
  }

  // handlerConnectStatusChanged() {
  //   PEER.onconnectionstatechange = () => {
  //     this._zone.run(() => {
  //       console.log(`status: ${PEER.connectionState}`);
  //       switch (PEER.connectionState) {
  //         case 'new':
  //           break;
  //         case 'closed':
  //           break;
  //         case 'connected':
  //           break;
  //         case 'connecting':
  //           break;
  //         case 'disconnected':
  //           break;
  //         case 'failed':
  //           break;
  //         default:
  //           break;
  //       }
  //     });
  //   };
  // }
}
