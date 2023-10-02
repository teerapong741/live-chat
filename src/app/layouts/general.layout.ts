import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@Component({
  standalone: true,
  selector: 'general-layout',
  imports: [SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative">
      <div class="w-screen h-12 bg-neutral-950 flex justify-between items-center p-4">
        <p
          class="text-yellow-400 font-extrabold text-2xl cursor-pointer"
          [routerLink]="'/sign-in-stream'"
        >
          L<span class="text-red-400 animate-ping">i</span>ve Stream
        </p>

        <div class="flex justify-between items-center gap-4">
          <span class="text-white font-normal text-sm cursor-pointer" [routerLink]="'/sign-in'" [routerLinkActive]="'text-yellow-400'">LOGIN</span>
          <span class="text-white font-normal text-sm cursor-pointer" [routerLink]="'/register'" [routerLinkActive]="'text-yellow-400'">REGISTER</span>
        </div>
      </div>
    </div>
    <div class="p-5">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class GeneralLayout implements OnInit {
  ngOnInit() {}
}
