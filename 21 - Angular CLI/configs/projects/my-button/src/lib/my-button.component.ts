import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-my-button',
  template: `
    <p>
      my-button works!
    </p>
  `,
  styles: [
  ]
})
export class MyButtonComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
