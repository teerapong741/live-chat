import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'home-page',
  templateUrl: './home.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule],
})
export class HomePage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
