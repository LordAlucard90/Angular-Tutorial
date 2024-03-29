import { Component, OnInit } from '@angular/core';
import {
    AbstractControl,
    UntypedFormControl,
    UntypedFormGroup,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    myForm: UntypedFormGroup;
    status_list = ['Stable', 'Critical', 'Finished'];

    constructor() {
        this.myForm = new UntypedFormGroup({
            project: new UntypedFormControl(null, Validators.required, this.checkProjectName),
            email: new UntypedFormControl(null, [Validators.required, Validators.email]),
            status: new UntypedFormControl('', Validators.required),
        });
    }

    ngOnInit(): void { }

    onSubmit() {
        if (this.myForm) {
            console.log('Project: ' + this.myForm.get('project')?.value);
            console.log('Email: ' + this.myForm.get('email')?.value);
            console.log('Status: ' + this.myForm.get('status')?.value);
        }
    }

    checkProjectName(
        control: AbstractControl,
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        return new Promise<ValidationErrors | null>((resolve, reject) => {
            setTimeout(() => {
                if (control.value === 'Test') {
                    resolve({ nameNotAllowed: true });
                } else {
                    resolve(null);
                }
            }, 1500);
        });
    }

    get project() {
        return this.myForm.get('project');
    }
}
