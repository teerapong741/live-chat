import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { User } from 'src/app/models/user.model';
import { PrimeNgModule } from 'src/app/primeng.module';
import {
  PEER_TRC_CONNECTION,
  RoomService,
} from 'src/app/services/room.service';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import Swal from 'sweetalert2';

export const PEER: PEER_TRC_CONNECTION = new RTCPeerConnection();
export let LOCAL_STREAM!: MediaStream;

@Component({
  standalone: true,
  selector: 'create-room',
  templateUrl: './create-room.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule, PrimeNgModule],
})
export class CreateRoomComponent implements OnInit {
  private _cdr = inject(ChangeDetectorRef);
  private _userSV = inject(UserService);
  private _roomSV = inject(RoomService);

  isCreateRoom$$ = signal<boolean>(false);

  roomName: string = '';
  price: number = 0;
  imageRoomUrl: string = '';
  streamersSelected: string[] = [];

  streamersOption = [];
  roomList: any[] = [];

  ngOnInit() {
    this._userSV.streamers().subscribe({
      next: (res: any) => {
        this.streamersOption = res.data.map((item: User) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        this._cdr.markForCheck();
      },
    });

    this.getRooms();
  }

  getRooms() {
    this._roomSV.getRoomList().subscribe({
      next: (res: any) => {
        this.roomList = res;
        this._cdr.markForCheck();
      },
    });
  }

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

  onCancelCreateRoom() {
    this.isCreateRoom$$.set(false);
    this.roomName = '';
    this.price = 0;
    this.imageRoomUrl = '';
    this.streamersSelected = [];
    this._cdr.markForCheck();
  }

  async onCreateRoom() {
    const roomName = this.roomName.trim();
    const price = this.price;
    const imageRoomUrl = this.imageRoomUrl.trim();
    const streamersSelected = this.streamersSelected;

    if (!roomName || price < 1 || !imageRoomUrl) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        titleText: 'Please provide fields.',
      });
      return;
    }

    if (streamersSelected.length < 1) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        titleText: 'Please select streamers more 1',
      });
      return;
    }

    this._roomSV
      .createRoom({
        roomName,
        imageRoomUrl,
        price,
        streamers: streamersSelected,
      })
      .subscribe({
        next: (res: any) => {
          this.isCreateRoom$$.set(false);
          this.getRooms();
          Swal.fire({
            icon: 'success',
            title: 'Create Room Success',
            titleText: "Let's have fun.",
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            titleText: err?.error?.message,
          });
        },
      });

    // const userId = localStorage.getItem('userId') ?? 'guest';
    // const { roomId } = await this._roomSV.createRoom(userId);
    // this._roomSV.roomIdSelected = roomId;

    // this._router.navigate([`/room-live/${roomId}`], {
    //   relativeTo: this._route,
    // });
  }

  onRemoveRoom(id: string) {
    Swal.fire({
      icon: 'question',
      title: 'Question...',
      titleText: 'Do you want to delete the room?',
      showCancelButton: true,
    }).then((ans) => {
      if (ans.isConfirmed) {
        this._roomSV
          .removeRoom({
            roomId: id,
          })
          .subscribe({
            next: (res: any) => {
              this.getRooms();
              Swal.fire({
                icon: 'success',
                title: 'Remove Room Success',
                titleText: "",
              });
            },
            error: (err) => {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                titleText: err?.error?.message,
              });
            },
          });
      }
    });
  }
}
