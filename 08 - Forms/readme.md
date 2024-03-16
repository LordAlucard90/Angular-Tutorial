# Forms

## Content

- [Intro](#intro)
- [Template Driven](#template-driven)
- [Validation](#validation)
- [Reactive](#reactive)
- [Advanced Reactive](#advanced-reactive)

---

## Intro

Since Angular is a single page application,
the forms are not submitted to the server but they are handled by Angular.

Angular creates an object that allows to retrieve easily form values
and check if the form is valid.

Angular offers two different types of approach.

- **Template Driven**:\
This approach allows to declare the form into the template
and Angular will infer the form structure.
- **Reactive**\
This approach allows to declare the form structure with typescript code
and the template, therefore with greater control.

## Template Driven

### Requests

Since Angular is a single page application, and there are no requests to other 
pages, the forms have no `action` or `method` parameter: 

```angular2html
<form> 
    ...
</form>
```

### Registering Form Elements

A form element to be registered into Angular needs:

```angular2html
<input
  type="email"
  id="email"
  class="form-control"
  ngModel
  name="email">
```

`ngModel` is used to made it visible and the `name` to retrieve the values.

### Retrieving Forms

It is possible to connect the submit action to a component method using `ngSubmit`:

```angular2html
<form (ngSubmit)="onSubmit()">
    ...
</form>
```
```typescript
onSubmit(){
  console.log('submitted');
}
```

A wrong way to retrieve the form data is to use a generic reference
and pass it to the submit method:

```angular2html
<form (ngSubmit)="onSubmit(f)" #f>
    ...
</form>
```

This is wrong because an element of type `HTMLFormElement` is retrieved:

```typescript
onSubmit(form: HTMLFormElement) {
  console.log('submitted');
  console.log(form);
}
```

The correct way is to assign `ngForm` to the local reference:

```angular2html
<form (ngSubmit)="onSubmit(f)" #f="ngForm">
    ...
</form>
```

In this way an element of type `NgForm` is retrieved:

```typescript
onSubmit(form: NgForm) {
  console.log('submitted');
  console.log(form);
}
```

`NgForm` exposes a lot of method to manage the forms and get their status.

### Retrieving Forms With ViewChild

Another way to retrieve the `ngForm` is `@ViewChild`:

```angular2html
<form (ngSubmit)="onSubmit()" #f="ngForm">
    ...
</form>
```

```typescript
export class AppComponent {
  @ViewChild('f') myForm: NgForm;
  
  // ...

  onSubmit() {
    console.log(this.myForm);
  }
}
```

## Validation

### Validators

In addiction to the html `required` validator,
Angular offers a list of validators:

- [**Template Driven**](https://angular.io/api?query=validator&type=directive)
- [**Reactive**](https://angular.io/api/forms/Validators)

In the Template Driven approach,
the validators are added to the field in the template:

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

### Submit Control

It is possible to disable the submit button if there are some invalid inputs:

```angular2html
<form (ngSubmit)="onSubmit()" #f="ngForm">
    <!-- ... -->
    <button
      class="btn btn-primary"
      type="submit"
      [disabled]="!f.valid">
        Submit
    </button>
</form>
```

### Styling Validation

Angular automatically adds css classes to detect if the form or a single input
is valid.

- **ng-invalid** - if the input or form is invalid.
- **ng-valid** - if the input or form is valid.
- **ng-touched** - if the input or form has been touched by the user.

This classes can be used to style the user inputs:

```css
input.ng-invalid.ng-touched, select.ng-invalid.ng-touched {
  border: 1px solid red;
}
```

### Showing Validation Massages

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

### Default Values

It is possible to set the default value of an input in this way:

```typescript
export class AppComponent {
  @ViewChild('f') myForm: NgForm;
  defaultQuestion = 'pet';  
  // ...
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

### Binding Values

Is is also possible to use Two-Way Data Binding
to automatically interact with input values:

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
  // ...
  answer: string;
  // ...
}
```

### Grouping Form Controls

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

### Radio Buttons

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

### Changing Values

It is possible to dynamically change the input values of a form:

```angular2html
<button
  class="btn btn-light"
  type="button"
  (click)="suggestUserName()">
    Suggest an Username
</button>
```

#### ngForm setValue

With `ngForm.setValue` all the input values of the form 
must passed so all the values will be replaced:

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

With `ngForm.form.patchValue` it is possible to pass only the specific fields
to replace:

```typescript
export class AppComponent {
  @ViewChild('f') myForm: NgForm;
  // ...
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

### Retrieving Input Values

The input values of a form can easily be retrieved from the `ngForm` object:

```typescript
export class AppComponent {
  @ViewChild('f') myForm: NgForm;
  // ...
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
    <p>Question: {{user.secretQuestion}}</p>
    <p>Answer: {{user.answer}}</p>
    <p>Gender: {{user.gender}}</p>
  </div>
</div>
```

### Resetting Form

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

It is also possible to reset a single input value like in `patchValue`.


## Reactive

### SetUp

For the reactive approach **ReactiveFormsModule** is needed:
```typescript
@NgModule({
  // ...,
  imports: [
    // ...,
    ReactiveFormsModule
  ],
  // ...
})
```

### Creating Forms

A form can be created with `FormGroup` class:

```typescript
import {FormControl, FormGroup} from '@angular/forms';

@Component(...)
export class AppComponent implements OnInit{
  genders = ['male', 'female'];
  myForm: FormGroup;

  ngOnInit(): void {
    this.myForm = new FormGroup({
      'username': new FormControl(null),
      'email': new FormControl(null),
      'gender': new FormControl('male'),
    });
  }
}
```
`FormControl` represents a single input,
it needs a default value and can receive validator and asynchronous validators.

### Connecting Form To Template

To connect the `FormGroup` object with the form declared in the template,
it is necessary:

- to bind the form with `formGroup`
- to bind the inputs with `formControlName`

```angular2html
<form [formGroup]="myForm">
  <div class="form-group">
    <label for="username">Username</label>
    <input
      type="text"
      id="username"
      formControlName="username"
      class="form-control">
  </div>
  <!-- ... -->
</form>
```

### Submitting Form

Like in the previous approach it is necessary to bind `ngSubmit`
to a `onSubmit` method:

```angular2html
<form [formGroup]="myForm" (ngSubmit)="onSubmit()">
    <!-- ... -->
</form>
```

Nevertheless this time it is not necessary to pass the form 
to the `onSubmit` method, it is possible to call it:

```typescript
export class AppComponent implements OnInit{
  genders = ['male', 'female'];
  myForm: FormGroup;

  ngOnInit(): void {...}

  onSubmit() {
    console.log(this.myForm);
  }
}
```

### Adding Validation

In this case it is not possible to add validators form the template,
it is necessary to add validators from the `FormControl` constructor:

```typescript
export class AppComponent implements OnInit{
  genders = ['male', 'female'];
  myForm: FormGroup;

  ngOnInit(): void {
    this.myForm = new FormGroup({
      'username': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'gender': new FormControl('male'),
    });
  }
  // ...
}
```

### Error Messages

Whit this approach is is possible to access a input 

```angular2html
<div class="form-group">
  <label for="username">Username</label>
  <input
    type="text"
    id="username"
    formControlName="username"
    class="form-control">
  <span
    class="help-block"
    *ngIf="!myForm.get('username').valid && myForm.get('username').touched">
      Please enter a valid username!
  </span>
</div>
```

It is still possible add CSS classes for user experience:

```css
.help-block {
  color: red;
}

select.ng-invalid.ng-touched, input.ng-invalid.ng-touched {
  border: 1px solid red;
}
```

### Grouping Inputs

It is possible to group data using nested `FormGroup`:

```typescript
export class AppComponent implements OnInit{
  genders = ['male', 'female'];
  myForm: FormGroup;

  ngOnInit(): void {
    this.myForm = new FormGroup({
      'userData': new FormGroup({
        'username': new FormControl(null, Validators.required),
        'email': new FormControl(null, [Validators.required, Validators.email]),
      }),
      'gender': new FormControl('male'),
    });
  }

  // ...
}
```

In the template it is necessary to replicate the same structure:

```angular2html
<div formGroupName="userData">
   div formGroupName="userData">
    <div class="form-group">
      <label for="username">Username</label>
      <input
        type="text"
        id="username"
        formControlName="username"
        class="form-control">
      <span
        class="help-block"
        *ngIf="!myForm.get('userData.username').valid && myForm.get('userData.username').touched">
          Please enter a valid username!
      </span>
    </div>
    <!-- ... -->
  </div>
</div>
```

## Advanced Reactive

It order to make it work I had to set in the `tsconfig.json`: 
```json
"strict": false,
```

### Creating Inputs Dynamically

It it possible to create input fields dynamically:

```typescript
import {FormArray, ...} from '@angular/forms';

@Component({...})
export class AppComponent implements OnInit{
  // ...

  ngOnInit(): void {
    this.myForm = new FormGroup({
      // ...,
      'hobbies': new FormArray([]),
    });
  }

  onSubmit() {... }

  addHobby() {
    (<FormArray>this.myForm.get('hobbies')).push(
      new FormControl(null, Validators.required)
    );
  }

  get hobbies() {
      return this.myForm.get('hobbies') as FormArray;
  }
}
```
`FormArray` contains a variable array of input
where each element has its own index used to identify it.

```angular2html
<div formArrayName="hobbies">
  <h4>Your Hobbies</h4>
  <button
    class="btn btn-light"
    type="button"
    (click)="addHobby()">
      Add Hobby
  </button>
  <div
    *ngFor="let hobbyControl of hobbies.controls; let i = index"
    class="form-group">
    <input
      class="form-control"
      type="text"
      [formControlName]="i">
  </div>
</div>
```

### Custom Validators

It is possible to create custom validators
and pass them to the `FormControl`:

```typescript
export class AppComponent implements OnInit{
  ...
  forbiddenUsernames = ['pinco', 'pallino'];

  ngOnInit(): void {
    this.myForm = new FormGroup({
      'userData': new FormGroup({
        'username': new FormControl(
                null, 
                [Validators.required, this.forbiddenNames.bind(this)]),
        ...
      }),
      ...
    });
  }

  onSubmit() {...}

  addHobby() {...}

  forbiddenNames(control: FormControl): {[s: string]: boolean}{
    if (this.forbiddenUsernames.indexOf(control.value) !== -1){
      // return {'nameIfForbidden': true};
      return {'nameIsAllowed': false};
    }
    return null;
  }
}
```

A validator function wants a `null` or `empty` return if is there is no error,
or a `bool` result with he `string key values` of the invalid property.

`this.forbiddenUsernames.bind(this)` because the code is executed 
by another object, the `this` reference must be installed in this way.

### Using Error Codes

The error codes are stored in:

`Form`>`Controls`>`Variable or PathToTheVariable`>`Errors`

It is possible to use this information to add more details on input errors:

```angular2html
<span
  class="help-block"
  *ngIf="!username.valid && username.touched">
    <span *ngIf="userName?.errors['nameIfForbidden']">
        This name is invalid!
    </span>
    <span *ngIf="username?.errors['required']">
        This name is required!
    </span>
</span>
```

The `required` error is the default error on empty input when it is required.

### Asynchronous Validators

It is possible to create asynchronous validators that ask to a server the validity
of an input:

```typescript
export class AppComponent implements OnInit{
  // ...

  ngOnInit(): void {
    this.myForm = new FormGroup({
      'userData': new FormGroup({
        // ...
        'email': new FormControl(
                null, 
                [Validators.required, Validators.email], 
                this.forbiddenEmails),
      }),
      // ...
    });
  }

  onSubmit() {
    console.log(this.myForm);
  }

  addHobby() {...}

  forbiddenNames(control: FormControl): {[s: string]: boolean}{...}

  forbiddenEmails(
      control: AbstractControl,
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
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

  get username() {
      return this.myForm.get('userData.username');
  }

  get email() {
      return this.myForm.get('userData.email');
  }

  get hobbies() {
      // important to correctly use *ngFor
      return this.myForm.get('hobbies') as FormArray;
  }
}
```

During the request the input has the class `ng-pending`.

### Status And Value Observable

`FormControl` has two observable :

- `StatusChanges` - reacts to any status change, like: invalid, pending, valid.
- `ValueChanges` - reacts to any input change.

```typescript
this.myForm.valueChanges.subscribe(
  (value) => {console.log(value); }
);
this.myForm.statusChanges.subscribe(
  (status) => {console.log(status); }
);
```

### Changing Values

It is possible set all values to a default value:

```typescript
this.myForm.setValue({
  'userData':{
    'username': 'Max',
    'email': 'max@test.com'
  },
  'gender': 'male',
  'hobbies': []
});
```

Or just some of them:

```typescript
this.myForm.patchValue({
  'gender': 'female',
});
```

And reset all or some values:

```typescript
this.myForm.reset();
// this.myForm.reset({'gender': 'male'});
```

