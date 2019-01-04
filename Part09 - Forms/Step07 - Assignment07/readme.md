# Step 07 - Assignment 07

## Exercise

Create a Form with the following Controls and Validators
1. Project Name (should not be empty)
2. Mail (should not be a empty and a valid email)
3. Project Status Dropdown, with three values: 'Stable', 'Critical', 'Finished'
4. Submit Button

Add your own Validator which doesn't allow "Test" as a Project Name

Also implement that Validator as an async Validator (replace the other one)

Upon submitting the form, simply print the value to the console

---

## Solution

#### app.component.ts

```typescript
export class AppComponent implements OnInit {
  myForm: FormGroup;
  status_list = ['Stable', 'Critical', 'Finished'];

  ngOnInit(): void {
    this.myForm = new FormGroup({
      'project': new FormControl(null, Validators.required, this.chackProjectName),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'status': new FormControl('', Validators.required),
    });
  }

  onSubmit(param) {
    console.log('Project: ' + this.myForm.get('project').value);
    console.log('Email: ' + this.myForm.get('email').value);
    console.log('Status: ' + this.myForm.get('status').value);
  }

  chackProjectName(control: FormControl): Promise<any> | Observable<any> {
    return new Promise<any>((resolve, reject1) => {
      setTimeout(() => {
        if (control.value === 'Test') {
          resolve({'nameNotAllowed': true});
        } else {
          resolve(null);
        }
      }, 1500);
    });
  }
}
```

#### app.component.html

```angular2html
<form [formGroup]="myForm" (ngSubmit)="onSubmit()">
  <div class="form-group">
    <label>Project Name</label>
    <input
      type="text"
      formControlName="project"
      class="form-control">
    <span
      *ngIf="myForm.get('project').invalid && myForm.get('project').touched"
      class="help-message">
      <span *ngIf="myForm.get('project').errors['nameNotAllowed']">
        Please enter a valid project name!
      </span>
      <span *ngIf="myForm.get('project').errors['required']">
        Please enter a project name!
      </span>
    </span>
  </div>
  <div class="form-group">
    <label>Mail</label>
    <input
      type="text"
      formControlName="email"
      class="form-control">
    <span
      *ngIf="myForm.get('email').invalid && myForm.get('email').touched"
      class="help-message">
        Please enter a valid email!
    </span>
  </div>
  <div class="form-group">
    <label></label>
    <select
      formControlName="status"
      class="form-control">
        <option value="">Select a Status</option>
        <option *ngFor="let status of status_list" value="{{status}}">
            {{status}}
        </option>
    </select>
    <span
      *ngIf="myForm.get('status').invalid && myForm.get('status').touched"
      class="help-message">
        Please select a status!
    </span>
  </div>
  <button type="submit" class="btn btn-primary" [disabled]="myForm.invalid">Submit!</button>
</form>
```
#### app.component.css

```css
.help-message{
  color: red;
}

input.ng-touched.ng-invalid, select.ng-touched.ng-invalid {
  border: 1px solid red;
}
```
