import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { Router } from '@angular/router';
import { LOCAL_STORAGE_KEY } from 'src/app/core/local-storage-key.core';
import { AuthService } from 'src/app/services/auth.service';
import { SharedModule } from 'src/app/shared/shared.module';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'sign-in-component',
  templateUrl: './sign-in.component.html',
  imports: [SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnInit {
  private _authService = inject(AuthService);
  private _router = inject(Router);

  username: string = '';
  password: string = '';

  ngOnInit() {
    this._authService.auth = null;
    this._authService.authRoom = null;
    this._authService.isLoggedIn = false;
    localStorage.removeItem(LOCAL_STORAGE_KEY.AUTH);
    localStorage.removeItem(LOCAL_STORAGE_KEY.AUTH_ROOM);
  }

  onLogin() {
    const username = this.username.trim();
    const password = this.password.trim();
    if (!username || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        titleText: 'Please provide fields.',
      });
      return;
    }

    this._authService
      .signIn({
        username,
        password,
      })
      .subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Login success!',
            titleText: "Let's have fun.",
          }).then(() => {
            this._authService.auth = res;
            this._authService.isLoggedIn = true;
            this._router.navigate(['']);
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
