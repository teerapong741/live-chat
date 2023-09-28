import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AdminLayout } from './admin.layout';
import { GeneralLayout } from './general.layout';
import { UserLayout } from './user.layout';

export enum LayoutType {
  GENERAL = 'GENERAL',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Component({
  standalone: true,
  selector: 'layout',
  imports: [SharedModule, AdminLayout, UserLayout, GeneralLayout],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <admin-layout *ngIf="isAdmin$$()"></admin-layout>
    <user-layout *ngIf="isUser$$()"></user-layout>
    <general-layout *ngIf="isGeneral$$()"></general-layout>
  `,
})
export class Layout implements OnInit {
  private route = inject(ActivatedRoute);

  layout$$ = signal<string>(LayoutType.GENERAL);

  isAdmin$$ = computed(() => this.layout$$() === LayoutType.ADMIN);
  isUser$$ = computed(() => this.layout$$() === LayoutType.USER);
  isGeneral$$ = computed(() => this.layout$$() === LayoutType.GENERAL);

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.layout$$.set(data['layout'] as LayoutType);
    });
  }
}
