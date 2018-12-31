# Step 05 - Reactive

## SetUp

For the reactive approach **ReactiveFormsModule** is needed:
```typescript
@NgModule({
  ...,
  imports: [
    ...,
    ReactiveFormsModule
  ],
  ...
})
```

---

## Creating Forms

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
`FormControl` represents a single input, it needs a default value and can receive validator and asynchronous validators.

---

## Connecting Form To Template

To connect the `FormGroup` object with the form declared in the template it is necessary:

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
  ...
</form>
```

---

## Submitting Form

Like the previous approach it is necessary to bind `ngSubmit` to a `onSubmit` method:

```angular2html
<form [formGroup]="myForm" (ngSubmit)="onSubmit()">
    ...
</form>
```

Nevertheless this time it is not necessary to pass the form to the `onSubmit` method, it is possible to call it:

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

---

## Adding Validation

In this case it is not possible to add validators form the template, it is necessary to add validators from the `FormControl` constructor:

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

  ...
}
```

---

## Error Messages

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

It is still possibile add css classes for user experience:

```css
.help-block {
  color: red;
}

select.ng-invalid.ng-touched, input.ng-invalid.ng-touched {
  border: 1px solid red;
}
```
---

## Grouping Inputs

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

  ...
}
```

In the template it is necessary to replicate the same structure:

```angular2html
<div formGroupName="userData">
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
  ...
</div>
```

