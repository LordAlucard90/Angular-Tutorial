import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    @ViewChild('form') myForm: NgForm | undefined;
    subscriptionOptions = ['Basic', 'Advanced', 'Pro'];
    defaultSubscription = 'Advanced';
    formSubmitted = false;
    formValues = {
        email: '',
        subscription: '',
        password: '',
    };

    onSubmit() {
        if (this.myForm) {
            console.log('Email: ' + this.myForm.value.email);
            console.log('Subscription: ' + this.myForm.value.subscriptions);
            console.log('Password: ' + this.myForm.value.password);
            this.formSubmitted = true;
            this.formValues.email = this.myForm.value.email;
            this.formValues.subscription = this.myForm.value.subscriptions;
            this.formValues.password = this.myForm.value.password;
        }
    }
}
