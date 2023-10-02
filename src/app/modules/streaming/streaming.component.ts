import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnInit,
  inject,
} from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { RoomWithOffer } from 'src/app/models/room-with-offer.model';
import { PEER } from 'src/app/modules/admin/create-room/create-room.component';
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
  selector: 'streaming',
  templateUrl: './streaming.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule],
})
export class StreamingComponent implements OnInit {
  private _roomSV = inject(RoomService);
  private _authSV = inject(AuthService);
  private _cdr = inject(ChangeDetectorRef);
  private _zone = inject(NgZone);
  private _http = inject(HttpClient);

  localStream!: MediaStream;
  deviceItems = {
    videos: [] as MediaDeviceInfo[],
    audios: [] as MediaDeviceInfo[],
  };

  isCheckedOwnerPermission: boolean = false;
  isOwner: boolean = false;
  isAnswered: boolean = false;

  userId: string = '';
  roomId: string = '';

  message: string = '';
  messages: Message[] = [];

  peers: any = {};

  ngOnInit() {
    this.roomId = this._authSV.authRoom?.room.id ?? '';
    this._initializeLoadDevices();
    this.openStream();
    this._roomSV
      .joinRoom({
        roomId: this.roomId,
        isStreamer: true,
      })
      .subscribe({
        next: (res: any) => {},
      });
    this.imOwner();

    this._cdr.markForCheck();
  }

  sendMessagesInRoom() {
    if (!this.roomId) return;
    this._roomSV
      .sendMessages(this.roomId, MessageType.TEXT, this.message, 'STREAMER')
      .subscribe((res) => {
        this.message = '';
        this._cdr.markForCheck();
      });
  }

  handlerConnectStatusChanged() {
    PEER.onconnectionstatechange = () => {
      this._zone.run(() => {
        console.log(`status: ${PEER.connectionState}`);
        switch (PEER.connectionState) {
          case 'new':
            break;
          case 'closed':
            break;
          case 'connected':
            break;
          case 'connecting':
            break;
          case 'disconnected':
            break;
          case 'failed':
            break;
          default:
            break;
        }
      });
    };
  }

  imOwner() {
    this._roomSV.getRoomContent(this.roomId).subscribe((res: any) => {
      switch (res.type) {
        case SocketMessageType.REQ_OFFER:
          this.reqOffer(res.data.viewerId);
          break;
        case SocketMessageType.SEND_ANSWER:
          this.peers[res.data.viewerId]?.setRemoteDescription(res.data.answer.answer);
          break;
        case SocketMessageType.VIEWER_JOIN_ROOM:
          break;
        case SocketMessageType.NEW_MESSAGE:
          this.messages.push(res.data);
          this._cdr.markForCheck();
          break;
      }
    });
  }

  private reqOffer(viewerId: string) {
    const peer: PEER_TRC_CONNECTION = new RTCPeerConnection();
    peer.dc = peer.createDataChannel(`channel@${this.roomId}@${viewerId}`);
    this.localStream.getTracks().forEach(item => {
      peer.addTrack(item, this.localStream);
      console.log('add track')
    });

    if (this.peers[viewerId]) {
      this.peers[viewerId] = null;
    }
    

  setTimeout(() => {
    let isCreated = false;
    peer.onicecandidate = (e) => {
      if (!e.candidate || isCreated) return;
      isCreated = true;

      const roomWithOffer: RoomWithOffer = {
        offer: {
          type: peer.localDescription!.type,
          sdp: peer.localDescription!.sdp,
        },
      };

      this.peers[viewerId] = peer;
      this._cdr.markForCheck();
      
      this._http
        .post(environment.serviceUrl + '/room/send-offer', {
          roomId: this.roomId,
          viewerId,
          offer: roomWithOffer
        })
        .subscribe((res: any) => {});
    };

    peer.createOffer().then((offer) => peer.setLocalDescription(offer));
  }, 500);
  }

  private async _initializeLoadDevices() {
    const deviceItems = await navigator.mediaDevices.enumerateDevices();
    deviceItems.forEach((item) => {
      switch (item.kind) {
        case 'audioinput':
          this.deviceItems.audios.push(item);
          break;
        case 'videoinput':
          this.deviceItems.videos.push(item);
          break;
      }
    });
  }

  async openStream() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      this._cdr.markForCheck();
    } catch (error) {}
  }
}
