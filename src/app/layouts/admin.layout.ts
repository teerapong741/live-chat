import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@Component({
  standalone: true,
  selector: 'admin-layout',
  imports: [SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<router-outlet></router-outlet>`,
})
export class AdminLayout implements OnInit {
  ngOnInit() {}
}
