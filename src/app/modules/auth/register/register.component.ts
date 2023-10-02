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
  selector: 'register-component',
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule],
})
export class RegisterComponent implements OnInit {
  private _authService = inject(AuthService);
  private _router = inject(Router);

  username: string = '';
  password: string = '';
  confirmPassword: string = '';

  ngOnInit() {
    this._authService.auth = null;
    this._authService.authRoom = null;
    this._authService.isLoggedIn = false;
    localStorage.removeItem(LOCAL_STORAGE_KEY.AUTH);
    localStorage.removeItem(LOCAL_STORAGE_KEY.AUTH_ROOM);
  }

  onRegister() {
    const username = this.username.trim();
    const password = this.password.trim();
    const confirmPassword = this.confirmPassword.trim();
    if (!username || !password || !confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        titleText: 'Please provide fields.',
      });
      return;
    }
    if (password != confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        titleText: 'Password and Confirm Password do not match.',
      });
      return;
    }

    this._authService
      .signUp({
        username,
        password,
      })
      .subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Register success!',
            titleText: "Let's log in.",
          }).then((res) => {
            this._router.navigate(['./sign-in']);
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
