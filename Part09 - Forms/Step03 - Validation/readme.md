# Step 03 - Validation

## Validators

In addiction to the html `required` validator, Angular offers a list of validators:

- **Template Driven**
  - https://angular.io/api?query=validator&type=directive
- **Reactive**
  - https://angular.io/api/forms/Validators

In the Template Driven approach the validators are added to the field in the template:

```angular2html
<input
  type="email"
  id="email"
  class="form-control"
  ngModel
  name="email"
  required
  email>
```

`email` is the email validators.

---

## Submit Control

It is possible disable the submit button if there are some invalid inputs:

```angular2html
<form (ngSubmit)="onSubmit()" #f="ngForm">
    ...
    <button
      class="btn btn-primary"
      type="submit"
      [disabled]="!f.valid">
        Submit
    </button>
</form>
```

---

## Styling Validation

Angular automatically adds css classes to detect if the form or a single input is valid.

- **ng-invalid** - if the input or form is invalid.
- **ng-valid** - if the input or form is valid.
- **ng-touched** - if the input or form has been touched by the user.

This classes can be used to style the user inputs:

```css
input.ng-invalid.ng-touched, select.ng-invalid.ng-touched {
  border: 1px solid red;
}
```

---

## Showing Validation Massages

It is possible to conditionally show an help message with an incorrect input:

```angular2html
<div class="form-group">
  <label for="email">Mail</label>
  <input
    type="email"
    id="email"
    class="form-control"
    ngModel
    name="email"
    required
    email
    #email="ngModel">
  <span class="help-block" *ngIf="!email.valid && email.touched">Please Enter a Valid Email!</span>
</div>
```

`ngModel` creates an object that exposes useful properties as valid or touched.

---

## Default Values

It is possible to set the default value of an input in this way:

```typescript
export class AppComponent {
  @ViewChild('f') myForm: NgForm;
  defaultQuestion = 'pet';  
  ...
}
```

```angular2html
<select
  id="secret"
  class="form-control"
  [ngModel]="defaultQuestion"
  name="secret">
    <option value="pet">Your first Pet?</option>
    <option value="teacher">Your first teacher?</option>
</select>
```

---

## Binding Values

Is is also possible to use Two-Way Data Binding to automatically interact with input values:

```angular2html
<div class="form-group">
  <textarea
    class="form-control"
    name="questionAnswer"
    rows="3"
    [(ngModel)]="answer">
  </textarea>
</div>
<p>Your reply is:<br/>{{ answer }}</p>
```

```typescript
export class AppComponent {
  ...
  answer: string;
  ...
}
```
---

## Grouping Form Controls

It is possible to group some inputs into a single group:

```angular2html
<form>
    <div 
      ngModelGroup="userData"
      #userData="ngModelGroup">
        <!-- Some Inputs -->
    </div>
    <p *ngIf="!userData.valid && userData.touched">
        User Data is invalid!
    </p>
    <!-- Other Inputs -->
</form>
```

---

## Radio Buttons

Radio buttons can be created dynamically very easily:

```typescript
export class AppComponent {
  ...
  genders = ['male', 'female'];
  ...
}
```

```angular2html
<div class="radio" *ngFor="let gender of genders">
  <label>
    <input
      type="radio"
      name="gender"
      ngModel
      [value]="gender"
      required>
    {{gender}}
  </label>
</div>
```

---

## Changing Values

it is possible to dynamically change the input values of a form:

```angular2html
<button
  class="btn btn-light"
  type="button"
  (click)="suggestUserName()">
    Suggest an Username
</button>
```

#### ngForm setValue

With `ngForm.setValue` all the input values of the form  must passed so all the values will be replaced:

```typescript
export class AppComponent {
  @ViewChild('f') myForm: NgForm;
  ...

  suggestUserName() {
    const suggestedName = 'Superuser';
    this.myForm.setValue({
      userData: {
        username: suggestedName,
        email: ''
      },
      secret: 'pet',
      questionAnswer: '',
      gender: 'male'
    });
  }
  ...
}
```

#### ngForm form patchValue

With `ngForm.form.patchValue` it is possible to pass only the specific fields to replace:

```angular2html
export class AppComponent {
  @ViewChild('f') myForm: NgForm;
  ---
  suggestUserName() {
    const suggestedName = 'Superuser';
    this.myForm.form.patchValue({
      userData: {
        username: suggestedName,
      },

    });
  }
}
```

---

## Retrieving Input Values

The input values of a form can easily retrieved from the `ngForm` object:

```typescript
export class AppComponent {
  @ViewChild('f') myForm: NgForm;
  ...
  user = {
    username: '',
    email: '',
    secretQuestion: '',
    answer: '',
    gender: ''
  };
  submitted = false;

  ...
  
  onSubmit() {
    // console.log(this.myForm);
    this.submitted = true;
    this.user.username = this.myForm.value.userData.username;
    this.user.email = this.myForm.value.userData.email;
    this.user.secretQuestion = this.myForm.value.secret;
    this.user.answer = this.myForm.value.questionAnswer;
    this.user.gender = this.myForm.value.gender;
  }
}
```

```angular2html
<div class="row" *ngIf="submitted">
  <div class="col-sm-12">
    <h3>Your Data:</h3>
    <p>Username: {{user.username}}</p>
    <p>Email: {{user.email}}</p>
    <p>Quesstion: {{user.secretQuestion}}</p>
    <p>Answer: {{user.answer}}</p>
    <p>Gender: {{user.gender}}</p>
  </div>
</div>
```

---

## Resetting Form

It is possible to reset all the form values at once:

```typescript
export class AppComponent {
  @ViewChild('f') myForm: NgForm;
  ...
  
  onSubmit() {
    ...
    this.myForm.reset();
  }
}
```

With `reset` it is also possible to set single input values like `patchValue`.

