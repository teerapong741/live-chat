import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnInit,
  inject,
} from '@angular/core';
import { Message } from 'src/app/models/message.model';
import {
  LOCAL_STREAM,
  PEER,
} from 'src/app/modules/create-room/create-room.component';
import { RoomService } from 'src/app/services/room.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { MessageType } from 'src/app/types/message.type';
import { SocketMessageType } from 'src/app/types/socket-message.type';

@Component({
  standalone: true,
  selector: 'room-live',
  templateUrl: './room-live.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule],
})
export class RoomLiveComponent implements OnInit {
  private _roomSV = inject(RoomService);
  private _cdr = inject(ChangeDetectorRef);
  private _zone = inject(NgZone);

  localStream: MediaStream = LOCAL_STREAM;
  isCheckedOwnerPermission: boolean = false;
  isOwner: boolean = false;
  isAnswered: boolean = false;

  userId: string = '';

  message: string = '';
  messages: Message[] = [];

  ngOnInit() {
    const userId = localStorage.getItem('userId') ?? 'guest';
    this.userId = userId;

    this._roomSV.checkIsOwnerRoom(userId).subscribe((res: any) => {
      this.isCheckedOwnerPermission = true;
      this.isOwner = res.data;
      this.handlerConnectStatusChanged();
      this.handlerContentRoomChanged();
      this.getMessagesInRoom();

      if (this.isOwner) {
        this.imOwner();
      } else {
        this.imViewer();
      }
      this._cdr.markForCheck();
    });
  }

  getMessagesInRoom() {
    const id = this._roomSV.roomIdSelected;
    if (!id) return;
    this._roomSV.getMessages(id).subscribe((res: any) => {
      this.messages = res.data;
    });
  }

  sendMessagesInRoom() {
    const id = this._roomSV.roomIdSelected;
    const userId = localStorage.getItem('userId') ?? 'guest';
    if (!id) return;
    this._roomSV
      .sendMessages(id, MessageType.TEXT, this.message, userId)
      .subscribe((res) => {
        this.message = '';
        this._cdr.markForCheck();
      });
  }

  handlerContentRoomChanged() {
    const id = this._roomSV.roomIdSelected;
    if (!id) return;
    this._roomSV.getRoomContent(id).subscribe((res: any) => {
      switch (res.type as SocketMessageType) {
        case SocketMessageType.NEW_MESSAGE:
          this.messages.push(res.data);
          this._cdr.markForCheck();
          break;
        default:
          break;
      }
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
    this.getRoomOnlyOwner();
  }

  async imViewer() {
    const userId = localStorage.getItem('userId') ?? 'guest';
    PEER.ondatachannel = (e) => {
      PEER.dc = e.channel;
      PEER.dc.onopen = () => {
        console.log('open x');
      };
    };
    PEER.ontrack = (e) => this._onTrackStream(e);

    const offer = this._roomSV.roomWithOffer;
    const id = this._roomSV.roomIdSelected;
    if (!offer || !id) return;

    const { answer } = await this._roomSV.joinRoom(id, userId, offer);
    this._roomSV.roomWithAnswer = answer;
  }

  getRoomOnlyOwner() {
    const userId = localStorage.getItem('userId') ?? 'guest';

    this._roomSV.getRoom(userId).subscribe((res: any) => {
      if (!res.answer || this.isAnswered) return;

      this.isAnswered = true;
      PEER.setRemoteDescription(res.answer);
    });
  }

  private _onTrackStream(e: RTCTrackEvent) {
    this._zone.run(() => {
      if (e.streams.length < 1) return;
      const stream = e.streams[0];
      this.localStream = stream;
      this._cdr.markForCheck();
    });
  }
}
