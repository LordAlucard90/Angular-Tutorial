import { Component, OnInit } from '@angular/core';
import {
    AbstractControl,
    AsyncValidatorFn,
    UntypedFormArray,
    UntypedFormControl,
    UntypedFormGroup,
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
    myForm: UntypedFormGroup;
    forbiddenUsernames = ['pinco', 'pallino'];

    constructor() {
        this.myForm = new UntypedFormGroup({
            userData: new UntypedFormGroup({
                username: new UntypedFormControl(null, [
                    Validators.required,
                    this.forbiddenNames.bind(this),
                ]),
                email: new UntypedFormControl(
                    null,
                    [Validators.required, Validators.email],
                    this.forbiddenEmails,
                ),
            }),
            gender: new UntypedFormControl('male'),
            hobbies: new UntypedFormArray([]),
        });
    }

    ngOnInit(): void {
        this.myForm.valueChanges.subscribe(value => {
            console.log("subscribe: ", value);
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
            console.log("submit:", this.myForm.value);
            this.myForm.reset({ gender: 'male' });
            // this.myForm.reset();
        }
    }

    addHobby() {
        if (this.myForm) {
            (<UntypedFormArray>this.myForm.get('hobbies')).push(
                new UntypedFormControl(null, Validators.required),
            );
        }
    }

    forbiddenNames(control: UntypedFormControl): { [s: string]: boolean } {
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
        return <UntypedFormArray>this.myForm.get('hobbies') ;
    }
}
