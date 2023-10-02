import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/noAuth.guard';
import { Layout, LayoutType } from './layouts/layout';
import { CreateRoomComponent } from './modules/admin/create-room/create-room.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { SignInStreamComponent } from './modules/auth/sign-in-stream/sign-in-stream.component';
import { SignInComponent } from './modules/auth/sign-in/sign-in.component';
import { HomePage as HomeStream } from './modules/streamer/home/home.page';
import { StreamingComponent } from './modules/streaming/streaming.component';
import { HomePage as HomeViewer } from './modules/viewer/home/home.page';
import { RoomLiveComponent } from './modules/viewer/room-live/room-live.component';
import { RoleType } from './types/role.type';

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    component: Layout,
    data: {
      layout: LayoutType.GENERAL,
    },
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/register',
        pathMatch: 'full',
      },
      {
        path: 'sign-in',
        component: SignInComponent,
      },
      {
        path: 'sign-in-stream',
        component: SignInStreamComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
  {
    path: 'admin',
    component: Layout,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: {
      layout: LayoutType.ADMIN,
      role: RoleType.ADMIN,
    },
    children: [
      {
        path: '',
        redirectTo: '/create-room',
        pathMatch: 'full',
      },
      {
        path: 'create-room',
        component: CreateRoomComponent,
      },
    ],
  },
  {
    path: 'streaming',
    component: Layout,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: {
      layout: LayoutType.USER,
      isStreaming: true,
    },
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: '',
        component: StreamingComponent,
      },
    ],
  },
  {
    path: 'streamer',
    component: Layout,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: {
      layout: LayoutType.USER,
      role: RoleType.STREAMER,
    },
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeStream,
      },
    ],
  },
  {
    path: 'viewer',
    component: Layout,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: {
      layout: LayoutType.USER,
      role: RoleType.VIEWER,
    },
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeViewer,
      },
      {
        path: 'room-live/:id',
        component: RoomLiveComponent,
      },
      // {
      //   path: 'person-list',
      //   component: PersonListComponent,
      // },
    ],
  },
  {
    path: '**',
    redirectTo: 'sign-in',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
