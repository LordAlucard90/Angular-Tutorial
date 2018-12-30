import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('f') myForm: NgForm;

  suggestUserName() {
    const suggestedName = 'Superuser';
  }

  // onSubmit(form: HTMLFormElement) {
  // onSubmit(form: NgForm) {
  //   console.log('submitted');
  //   console.log(form);
  // }

  onSubmit() {
    console.log(this.myForm);
  }
}
