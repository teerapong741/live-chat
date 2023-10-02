import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { io } from "socket.io-client";
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Layout } from './layouts/layout';
import { PrimeNgModule } from './primeng.module';
import { SharedModule } from './shared/shared.module';

export const socket = io(environment.socketUrl);

const config: SocketIoConfig = { url: environment.socketUrl, options: {} };

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    Layout,
    PrimeNgModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
