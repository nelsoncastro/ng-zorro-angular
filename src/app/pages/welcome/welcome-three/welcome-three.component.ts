import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome-three',
  styleUrls: ['./welcome-three.component.css'],
  template: `
    <nz-breadcrumb [nzSeparator]="iconTemplate" style="padding-bottom: 20px;">
      <nz-breadcrumb-item>Home</nz-breadcrumb-item>
      <nz-breadcrumb-item>Navigation Two</nz-breadcrumb-item>
      <nz-breadcrumb-item>Sub Menu</nz-breadcrumb-item>
      <nz-breadcrumb-item>Item Sub Menu</nz-breadcrumb-item>
    </nz-breadcrumb>
    <ng-template #iconTemplate><em nz-icon nzType="arrow-right"></em></ng-template>

    <input id="threeInput" nz-input placeholder="Informe algo..." />
  `
})

export class WelcomeThreeComponent implements OnInit {

  value?: string;

  constructor() { }

  ngOnInit(): void { }

}
