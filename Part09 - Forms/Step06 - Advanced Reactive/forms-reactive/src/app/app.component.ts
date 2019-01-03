import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from "rxjs";
import {reject} from "q";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  genders = ['male', 'female'];
  myForm: FormGroup;
  forbiddenUsernames = ['pinco', 'pallino'];

  ngOnInit(): void {
    this.myForm = new FormGroup({
      'userData': new FormGroup({
        'username': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]),
        'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails),
      }),
      'gender': new FormControl('male'),
      'hobbies': new FormArray([]),
    });
    this.myForm.valueChanges.subscribe(
      (value) => {console.log(value); }
    );
    this.myForm.statusChanges.subscribe(
      (status) => {console.log(status); }
    );
    this.myForm.setValue({
      'userData':{
        'username': 'Max',
        'email': 'max@test.com'
      },
      'gender': 'male',
      'hobbies': []
    });
    this.myForm.patchValue({
      'gender': 'female',
    });
  }

  onSubmit() {
    console.log(this.myForm);
    this.myForm.reset({'gender': 'male'});
    // this.myForm.reset();
  }

  addHobby() {
    (<FormArray>this.myForm.get('hobbies')).push(
      new FormControl(null, Validators.required)
    );
  }

  forbiddenNames(control: FormControl): {[s: string]: boolean}{
    if (this.forbiddenUsernames.indexOf(control.value) !== -1){
      return {'nameIfForbidden': true};
      // return {'nameIsAllowed': false};
    }
    return null;
  }

  forbiddenEmails(control: FormControl): Promise<any> | Observable<any>{
    const  promise = new Promise<any>((resolve, reject1) => {
      setTimeout(() => {
        if (control.value === 'test@test.com'){
          resolve({'emailIfForbidden': true});
        } else {
          resolve(null);
        }
      }, 1500);
    });
    return promise;
  }
}
