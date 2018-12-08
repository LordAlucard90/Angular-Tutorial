import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'assignment-three';
  secretVisible = false;
  clickLogs= [];

  toggleSecret() {
    this.secretVisible = !this.secretVisible;
    this.clickLogs.push(new Date());
  }
}
