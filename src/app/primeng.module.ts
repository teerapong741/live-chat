import { NgModule } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';

const MODULES = [DialogModule,InputNumberModule,MultiSelectModule]

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES],
})
export class PrimeNgModule { }
