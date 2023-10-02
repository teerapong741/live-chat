import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class UserService {
  private _http = inject(HttpClient);
  
  streamers() {
    return this._http.get(environment.serviceUrl + '/user/streamers');
  }
}