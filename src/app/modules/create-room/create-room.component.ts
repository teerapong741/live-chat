import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PEER_TRC_CONNECTION,
  RoomService,
} from 'src/app/services/room.service';
import { SharedModule } from 'src/app/shared/shared.module';

export const PEER: PEER_TRC_CONNECTION = new RTCPeerConnection();
export let LOCAL_STREAM!: MediaStream;

@Component({
  standalone: true,
  selector: 'create-room',
  templateUrl: './create-room.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule],
})
export class CreateRoomComponent implements OnInit {
  private _cdr = inject(ChangeDetectorRef);
  private _zone = inject(NgZone);
  private _roomSV = inject(RoomService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  ngOnInit() {}

  onSubmit() {
    this.openCamera();
  }

  async openCamera() {
    try {
      LOCAL_STREAM = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      LOCAL_STREAM.getTracks().forEach((track) => {
        PEER.addTrack(track, LOCAL_STREAM);
      });
      this.onCreateRoom();
      this._cdr.markForCheck();
    } catch (error) {
      console.error('ไม่สามารถเปิดกล้องได้');
    }
  }

  async onCreateRoom() {
    const userId = localStorage.getItem('userId') ?? 'guest';
    const { roomId } = await this._roomSV.createRoom(userId);
    this._roomSV.roomIdSelected = roomId;

    this._router.navigate([`/room-live/${roomId}`], {
      relativeTo: this._route,
    });
  }
}
