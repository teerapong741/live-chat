import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from 'src/app/services/room.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'home-page',
  templateUrl: './home.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule],
})
export class HomePage implements OnInit {
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
  }

  async onJoinRoom(room: any) {
    const { id } = room;
    this._roomSV.roomIdSelected = id;
    this._router.navigate([`./../room-live/${id}`], { relativeTo: this._route });
  }
}
