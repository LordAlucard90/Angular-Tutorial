# Step 06 - Advanced Reactive

## Creating Inputs Dynamically

It it possible to create input fields dynamically:

```typescript
import {FormArray, ...} from '@angular/forms';

@Component({...})
export class AppComponent implements OnInit{
  ...

  ngOnInit(): void {
    this.myForm = new FormGroup({
      ...,
      'hobbies': new FormArray([]),
    });
  }

  onSubmit() {... }

  addHobby() {
    (<FormArray>this.myForm.get('hobbies')).push(
      new FormControl(null, Validators.required)
    );
  }
}
```
`FormArray` contains a variable array of input where each element has its own index used to identify it.

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
    *ngFor="let hobbyControl of myForm.get('hobbies').controls; let i = index"
    class="form-group">
    <input
      class="form-control"
      type="text"
      [formControlName]="i">
  </div>
</div>
```
---

## Custom Validators

It is possible to create custom validators and pass them to the `FormControl`:

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

A validator function wants a `null` or `empty` return is there is no error or a `bool` result with he `string key values` of the invalid property.

`this.forbiddenUsernames.bind(this)` because the code is executed by another object, the `this` reference must be installed in this way.

---

## Using Error Codes

The error codes are stored in:

`Form`>`Controls`>`Variable or PathToTheVariable`>`Errors`

It is possible to use this information to add more details on input errors:

```angular2html
<span
  class="help-block"
  *ngIf="!myForm.get('userData.username').valid && myForm.get('userData.username').touched">
    <span *ngIf="myForm.get('userData.username').errors['nameIfForbidden']">
        This name is invalid!
    </span>
    <span *ngIf="myForm.get('userData.username').errors['required']">
        This name is required!
    </span>
</span>
```

The `required` error is the default error on empty input when it is required.

---

## Asynchronous Validators

It is possible to create asynchronous validators that ask to a server the validity of an input:

```typescript
export class AppComponent implements OnInit{
  ...

  ngOnInit(): void {
    this.myForm = new FormGroup({
      'userData': new FormGroup({
        ...
        'email': new FormControl(
                null, 
                [Validators.required, Validators.email], 
                this.forbiddenEmails),
      }),
      ...
    });
  }

  onSubmit() {
    console.log(this.myForm);
  }

  addHobby() {...}

  forbiddenNames(control: FormControl): {[s: string]: boolean}{...}

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
```

During the request the input has the class `ng-pending`.

---

## Status And Value Observable

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

---

## Changing Values

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