import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

const SHARED = [CommonModule, FormsModule, ReactiveFormsModule, RouterModule];

@NgModule({
  imports: [...SHARED],
  exports: [...SHARED],
  declarations: [],
  providers: [],
})
export class SharedModule {}
