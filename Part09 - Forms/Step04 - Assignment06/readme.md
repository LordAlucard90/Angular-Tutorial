# Step 04 - Assignment 06

## Exercise

Add a Form with the following Inputs (and Validators)
1. Mail address (should not be empty and should be an email address)
2. A Dropdown which allows the user to select from three different Subscriptions ("Basic", "Advanced", "Pro"), set "Advanced" as Default
3. A Password field (should not be empty)
4. A Submit Button

Display a warning message if the Form is invalid AND was touched. Display a warning message below each input if it's invalid.

Upon submitting the form, you should simply print the Value of the Form to the Console.
Optionally, display it in your template.

---

## Solution

#### app.component.html

```angular2html
<div class="container">
  <div class="row">
    <div class="col-xs-12 col-sm-10 col-md-8 col-sm-offset-1 col-md-offset-2 pt-4">
      <form (ngSubmit)="onSubmit()" #form="ngForm">
        <div class="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            ngModel
            email
            #email='ngModel'
            required
            class="form-control">
          <div
            class="error-message"
            *ngIf="!email.valid && email.touched">
              Please enter a valid Email!
          </div>
        </div>
        <div class="form-group">
          <label>Subscription Type</label>
          <select
            name="subscriptions"
            #subscription="ngModel"
            [ngModel]="defaultSubscription"
            required
            class="form-control">
            <option
              *ngFor="let option of subscriptionOptions"
              value="{{option}}">
                {{option}}
            </option>
          </select>
          <div
            class="error-message"
            *ngIf="!subscription.valid && subscription.touched">
              Please select a Subscription!
          </div>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            #password="ngModel"
            ngModel
            required
            class="form-control">
          <div
            class="error-message"
            *ngIf="!password.valid && password.touched">
              Please enter a valid Password!
          </div>
        </div>
        <button type="submit" [disabled]="!form.valid">Submit</button>
      </form>
      <hr>
      <div *ngIf="formSubmitted">
        <h4>Values</h4>
        <p>Email: {{formValues.email}}</p>
        <p>Subscription: {{formValues.subscription}}</p>
        <p>Password: {{formValues.password}}</p>
      </div>
    </div>
  </div>
</div>
```

#### app.component.css

```css
.error-message {
  color: red;
}

select.ng-invalid.ng-touched, input.ng-invalid.ng-touched {
  border: 1px solid red;
}
```

#### app.component.ts

```typescript
export class AppComponent {
  @ViewChild('form') myForm: NgForm;
  subscriptionOptions = ['Basic', 'Advanced', 'Pro'];
  defaultSubscription = 'Advanced';
  formSubmitted = false;
  formValues = {
    email: '',
    subscription: '',
    password: ''
  };

  onSubmit() {
    console.log('Email: ' + this.myForm.value.email);
    console.log('Subscription: ' + this.myForm.value.subscriptions);
    console.log('Password: ' + this.myForm.value.password);
    this.formSubmitted = true;
    this.formValues.email = this.myForm.value.email;
    this.formValues.subscription = this.myForm.value.subscriptions;
    this.formValues.password = this.myForm.value.password;
  }
}
```