import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { LOCAL_STORAGE_KEY } from 'src/app/core/local-storage-key.core';
import { AuthService } from 'src/app/services/auth.service';
import { SharedModule } from 'src/app/shared/shared.module';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'sign-in-stream-component',
  templateUrl: './sign-in-stream.component.html',
  imports: [SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInStreamComponent implements OnInit {
  private _authService = inject(AuthService);
  private _router = inject(Router);

  key: string = '';

  ngOnInit() {
    this._authService.auth = null;
    this._authService.authRoom = null;
    this._authService.isLoggedIn = false;
    localStorage.removeItem(LOCAL_STORAGE_KEY.AUTH);
    localStorage.removeItem(LOCAL_STORAGE_KEY.AUTH_ROOM);
  }

  onLogin() {
    const key = this.key.trim();
    if (!key) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        titleText: 'Please provide fields.',
      });
      return;
    }

    this._authService.signInStream(key).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Login success!',
          titleText: "Let's have fun.",
        }).then(() => {
          this._authService.authRoom = res;
          this._authService.isLoggedIn = true;
          this._router.navigate(['/streaming']);
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
}
