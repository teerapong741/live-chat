import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'sign-in-component',
  templateUrl: './sign-in.component.html',
  imports: [SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnInit {
  private _cdr = inject(ChangeDetectorRef);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  ngOnInit() {}

  goToCreateRoom() {
    localStorage.setItem('userId', '1');
    this._router.navigate(['/create-room'], { relativeTo: this._route });
  }

  goToRoomList() {
    localStorage.setItem('userId', 'guest');
    this._router.navigate(['/person-list'], { relativeTo: this._route });
  }
}
