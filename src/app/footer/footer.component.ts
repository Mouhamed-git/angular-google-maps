import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <mat-toolbar color="primary">

      <span>Week 3 Of Challenge -</span>

      <span>&nbsp; Google Map With Angular - &nbsp;by Mouhamad DIACK </span>

    </mat-toolbar>
  `,
  styles: [
    `
      mat-toolbar {
        position: fixed;
        bottom: 0;
        width: 100%;
      }
    `
  ]
})
export class FooterComponent {

}
