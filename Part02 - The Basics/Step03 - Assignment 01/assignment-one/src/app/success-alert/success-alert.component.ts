import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'success-alert',
  templateUrl: './success-alert.component.html',
  styleUrls: ['./success-alert.component.css']
})

export class SuccessAlertComponent implements OnInit {
  message = "It's working! =) ";

  constructor() { }

  ngOnInit() {
  }

}
