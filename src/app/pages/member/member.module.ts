import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalModule } from './../../global.module';


import { MemberRoutingModule } from './member-routing.module';

import { MemberComponent } from './member.component';
import { MemberAddComponent } from './member-add/member-add.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MemberRoutingModule,
    GlobalModule
  ],
  declarations: [MemberComponent, MemberAddComponent],
  exports: [MemberComponent]
})
export class MemberModule { }
