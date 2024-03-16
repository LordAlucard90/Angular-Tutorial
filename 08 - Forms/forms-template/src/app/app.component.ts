import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    @ViewChild('f') myForm!: NgForm;
    defaultQuestion = 'pet';
    answer: string = '';
    genders = ['male', 'female'];
    user = {
        username: '',
        email: '',
        secretQuestion: '',
        answer: '',
        gender: '',
    };
    submitted = false;

    suggestUserName() {
        const suggestedName = 'Superuser';
        // this.myForm.setValue({
        //   userData: {
        //     username: suggestedName,
        //     email: ''
        //   },
        //   secret: 'pet',
        //   questionAnswer: '',
        //   gender: 'male'
        // });
        if (this.myForm) {
            this.myForm.form.patchValue({
                userData: {
                    username: suggestedName,
                },
            });
        }
    }

    // onSubmit(form: HTMLFormElement) {
    // onSubmit(form: NgForm) {
    //   console.log('submitted');
    //   console.log(form);
    // }

    onSubmit() {
        // console.log(this.myForm);
        this.submitted = true;
        if (this.myForm) {
            this.user.username = this.myForm.value.userData.username;
            this.user.email = this.myForm.value.userData.email;
            this.user.secretQuestion = this.myForm.value.secret;
            this.user.answer = this.myForm.value.questionAnswer;
            this.user.gender = this.myForm.value.gender;

            this.myForm.reset();
        }
    }
}
