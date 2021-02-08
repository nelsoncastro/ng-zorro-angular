import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome-two',
  styleUrls: ['./welcome-two.component.css'],
  template: `
    <nz-breadcrumb [nzSeparator]="iconTemplate" style="padding-bottom: 20px;">
      <nz-breadcrumb-item>Home</nz-breadcrumb-item>
      <nz-breadcrumb-item>Navigation Two</nz-breadcrumb-item>
      <nz-breadcrumb-item>Item Menu</nz-breadcrumb-item>
    </nz-breadcrumb>
    <ng-template #iconTemplate><em nz-icon nzType="arrow-right"></em></ng-template>

    <input id="twoInput" nz-input placeholder="Informe algo..." [(ngModel)]="value" />
  `
})
export class WelcomeTwoComponent implements OnInit {

  value?: string;

  constructor() { }

  ngOnInit(): void { }

}
