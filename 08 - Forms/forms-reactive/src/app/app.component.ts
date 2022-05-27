import { Component, OnInit } from '@angular/core';
import {
    AbstractControl,
    AsyncValidatorFn,
    FormArray,
    FormControl,
    FormGroup,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
// import { reject } from 'q';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    genders = ['male', 'female'];
    myForm: FormGroup;
    forbiddenUsernames = ['pinco', 'pallino'];

    constructor() {
        this.myForm = new FormGroup({
            userData: new FormGroup({
                username: new FormControl(null, [
                    Validators.required,
                    this.forbiddenNames.bind(this),
                ]),
                email: new FormControl(
                    null,
                    [Validators.required, Validators.email],
                    this.forbiddenEmails,
                ),
            }),
            gender: new FormControl('male'),
            hobbies: new FormArray([]),
        });
    }

    ngOnInit(): void {
        this.myForm.valueChanges.subscribe(value => {
            console.log(value);
        });
        this.myForm.statusChanges.subscribe(status => {
            console.log(status);
        });
        this.myForm.setValue({
            userData: {
                username: 'Max',
                email: 'max@test.com',
            },
            gender: 'male',
            hobbies: [],
        });
        this.myForm.patchValue({
            gender: 'female',
        });
    }

    onSubmit() {
        if (this.myForm) {
            console.log(this.myForm);
            this.myForm.reset({ gender: 'male' });
            // this.myForm.reset();
        }
    }

    addHobby() {
        if (this.myForm) {
            (<FormArray>this.myForm.get('hobbies')).push(
                new FormControl(null, Validators.required),
            );
        }
    }

    forbiddenNames(control: FormControl): { [s: string]: boolean } {
        if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
            return { nameIsForbidden: true };
            // return {'nameIsAllowed': false};
        }
        return {};
    }

    forbiddenEmails(
        control: AbstractControl,
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        const promise = new Promise<any>((resolve, reject) => {
            setTimeout(() => {
                if (control.value === 'test@test.com') {
                    resolve({ emailIfForbidden: true });
                } else {
                    resolve({});
                }
            }, 1500);
        });
        return promise;
    }

    get username() {
        return this.myForm.get('userData.username');
    }

    get email() {
        return this.myForm.get('userData.email');
    }

    get hobbies() {
        return this.myForm.get('hobbies') as FormArray;
    }
}
