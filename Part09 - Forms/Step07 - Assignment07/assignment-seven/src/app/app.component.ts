import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  myForm: FormGroup;
  status_list = ['Stable', 'Critical', 'Finished'];

  ngOnInit(): void {
    this.myForm = new FormGroup({
      'project': new FormControl(null, Validators.required, this.chackProjectName),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'status': new FormControl('', Validators.required),
    });
  }

  onSubmit(param) {
    console.log('Project: ' + this.myForm.get('project').value);
    console.log('Email: ' + this.myForm.get('email').value);
    console.log('Status: ' + this.myForm.get('status').value);
  }

  chackProjectName(control: FormControl): Promise<any> | Observable<any> {
    return new Promise<any>((resolve, reject1) => {
      setTimeout(() => {
        if (control.value === 'Test') {
          resolve({'nameNotAllowed': true});
        } else {
          resolve(null);
        }
      }, 1500);
    });
  }
}
