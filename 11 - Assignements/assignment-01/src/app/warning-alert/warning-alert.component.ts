import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'warning-alert',
  templateUrl: 'warning-alert.component.html',
  styleUrls: ['warning-alert.component.css']
})

export class WarningAlertComponent implements OnInit {
  message = "It isn't working! =(";

  constructor() {}

  ngOnInit() {
  }

}
