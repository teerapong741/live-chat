import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout, LayoutType } from './layouts/layout';
import { CreateRoomComponent } from './modules/create-room/create-room.component';
import { PersonListComponent } from './modules/person-list/person-list.component';
import { RegisterComponent } from './modules/register/register.component';
import { RoomLiveComponent } from './modules/room-live/room-live.component';
import { SignInComponent } from './modules/sign-in/sign-in.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  },
  {
    path: '',
    component: Layout,
    data: {
      layout: LayoutType.GENERAL,
    },
    children: [
      {
        path: 'sign-in',
        component: SignInComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
  {
    path: '',
    component: Layout,
    data: {
      layout: LayoutType.ADMIN,
    },
    children: [
      {
        path: 'create-room',
        component: CreateRoomComponent,
      },
    ],
  },
  {
    path: '',
    component: Layout,
    data: {
      layout: LayoutType.USER,
    },
    children: [
      {
        path: 'room-live/:id',
        component: RoomLiveComponent,
      },
      {
        path: 'person-list',
        component: PersonListComponent,
      },
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
