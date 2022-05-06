import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'success-alert',
  templateUrl: './success-alert.component.html',
  // styleUrls: ['./success-alert.component.css']
  styles: [
    `
      .alert-success {
        padding: 10px;
        background-color: lightgreen;
        border: 1px solid green;
      }
    `,
  ],
})
export class SuccessAlertComponent implements OnInit {
  message = "It's working! =) ";

  constructor() {}

  ngOnInit() {}
}
