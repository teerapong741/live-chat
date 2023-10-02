import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LOCAL_STORAGE_KEY } from '../core/local-storage-key.core';
import { Auth, AuthRoom } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _http = inject(HttpClient);

  private _auth$ = new BehaviorSubject<Auth | null>(null);
  private _authRoom$ = new BehaviorSubject<AuthRoom | null>(null);
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor() {
    const auth = localStorage.getItem(LOCAL_STORAGE_KEY.AUTH);
    const authRoom = localStorage.getItem(LOCAL_STORAGE_KEY.AUTH_ROOM);
    if (auth) {
      this._auth$.next(JSON.parse(auth));
    } else {
      this._auth$.next(null);
    }

    if (authRoom) {
      this._authRoom$.next(JSON.parse(authRoom));
    } else {
      this._authRoom$.next(null);
    }

    if (auth || authRoom) {
      this._isLoggedIn$.next(true);
    } else {
      this._isLoggedIn$.next(false);
    }
    
  }

  get auth() {
    return this._auth$.value;
  }

  set auth(value: Auth | null) {
    this._auth$.next(value);
    localStorage.setItem(LOCAL_STORAGE_KEY.AUTH, JSON.stringify(value, ));
  }

  get authRoom() {
    return this._authRoom$.value;
  }

  set authRoom(value: AuthRoom | null) {
    this._authRoom$.next(value);
    localStorage.setItem(LOCAL_STORAGE_KEY.AUTH_ROOM, JSON.stringify(value, ));
  }

  get isLoggedIn() {
    return this._isLoggedIn$.value;
  }

  set isLoggedIn(value: boolean) {
    this._isLoggedIn$.next(value);
  }

  signIn(payload: SignInPayload) {
    return this._http.post(environment.serviceUrl + '/auth/sign-in', { ...payload });
  }

  signInStream(key: string) {
    return this._http.post(environment.serviceUrl + '/auth/sign-in-streamer', { key });
  }

  signUp(payload: SignUpPayload) {
    return this._http.post(environment.serviceUrl + '/auth/sign-up', { ...payload });
  }
}

export interface SignInPayload {
  username: string;
  password: string;
}

export interface SignUpPayload {
  username: string;
  password: string;
}
