import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PEER } from 'src/app/modules/create-room/create-room.component';
import { RoomService } from 'src/app/services/room.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'person-list',
  templateUrl: './person-list.component.html',
  imports: [SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonListComponent implements OnInit {
  private _roomSV = inject(RoomService);
  private _cdr = inject(ChangeDetectorRef);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  roomList: any[] = [];

  ngOnInit() {
    this._roomSV.getRoomList().subscribe((res: any) => {
      this.roomList = res;
      this._cdr.markForCheck();
    });

    PEER.ondatachannel = (e) => {
      if (!PEER) return;

      PEER.dc = e.channel;
      PEER.dc.onopen = () => {
        console.log('open');
      };
    };
  }

  async onJoinRoom(room: any) {
    const { id, offer } = room;
    this._roomSV.roomWithOffer = offer;
    this._roomSV.roomIdSelected = id;
    this._router.navigate([`/room-live/${id}`], { relativeTo: this._route });
  }
}
