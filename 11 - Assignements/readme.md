# Assignments

## Content

**The Basics**:
- [Assignment 01](#assignment-01)
- [Assignment 02](#assignment-02)
- [Assignment 03](#assignment-03)
**Components and Data Binding Deep Dive**
- [Assignment 04](#assignment-04)
**Services And Dependency Injection**
- [Assignment 05](#assignment-05)
**Forms**
- [Assignment 06](#assignment-06)
- [Assignment 07](#assignment-07)
**Pipes**
- [Assignment 08](#assignment-08)

---

## Assignment 01

### Exercise

1. Create two new Components (manually or with CLI): WarningAlert and SuccessAlert
2. Output them beneath each other in the AppComponent
3. Output a warning or success message in the Components
4. Style the Components appropriately (maybe some red/ green text?)

Use external or internal templates and styles!

Feel free to create more components, nest them into each other or play around with different types of selectors!

### Solution

I used two components created with the CLI.

Each component has:
- A **message** variable with the text to displayed.
- A html file with a span with the **{{ message }}**
and a bootstrap class for manage the colors.

In the **app.component.html** there are two separate div-col with the alerts tag.

### Issues

Angular does not crate a new project with a number or a underscore in the name.

```bash
ng new assignment-01    // does not work
ng new assignment_01    // does not work
ng new assignment-one   // works
```

New version of Angular (13.3.5) allows it:
```bash
ng new assignment-01
```

## Assignment 02

### Exercise

1. Add a Input field which updates a property ('username') via Two-Way-Binding
2. Output the username property via String Interpolation (in a paragraph below the input)
3. Add a button which may only be clicked if the username is NOT an empty string
4. Upon clicking the button, the username should be reset to an empty string

### Solution

I used `ngModel` to link the username variable to the `input`
field and a String Interpolation to display the value into a paragraph.

To active the reset button I used a Property Binding:
`[disabled]="!isUsernameEmpty()"` 
who checked le username length.

To reset the `username` I used a Event Binding: `(click)="resetUsername()"`.

## Assignment 03

### Exercise

1. Add A button which says 'Display Details'
2. Add a paragraph with any content of your choice (e.g. 'Secret Password = tuna')
3. Toggle the displaying of that paragraph with the button created in the first step
4. Log all button clicks in an array and output that array below the secret paragraph (maybe log a timestamp or simply an incrementing number)
5. Starting at the 5th log item, give all future log items a blue background (via ngStyle) and white color (ngClass)

### Solution

I used an `Event Binding` on the button for the click event with a function who changed the value of the boolean field associated to the visibility of the paragraph.

The paragraph visibility was managed by an `*ngIf`.

For the event logging I have associated a paragraph:
- `*ngFor` associated to a list of clicks.
- `ngStyle` associated to the text color.
- `ngClass` associated to the background color.

### Improvement

It is possible extract the index of the current element
and use it with this syntax:

```angular2html
<p *ngFor="let click of clickLogs; let i = index"
  [ngClass]="{'high-log': i > 4}"
  [ngStyle]="{color: i > 4 ? 'white' : ''}"
>{{click}}</p>
```

## Assignment 04


### Exercise

1. Create three new components: GameControl, Odd and Even
2. The GameControl Component should have buttons to start and stop the game
3. When starting the game, an event (holding a incrementing number) should get emitted each second (ref = setInterval())
4. The event should be listenable from outside the component
5. When stopping the game, no more events should get emitted (clearInterval(ref))
6. A new Odd component should get created for every odd number emitted, the same should happen for the Even Component (on even numbers)
7. Simply output Odd - NUMBER or Even - NUMBER in the two components
8. Style the element (e.g. paragraph) holding your output text differently in both components

---

### Solution

**GameControlComponent**:

- HTML
```angular2html
<button class="btn btn-success" (click)="startGame()">Start Game</button>
<button class="btn btn-danger" (click)="stopGame()">Stop Game</button>
```
- Typescript
```typescript
export class GameControlComponent implements OnInit {
  @Output() numberEmitter = new EventEmitter<number>();
  private isRunning: boolean = false;
  private curNumber = 0;
  private ref: any;

  startGame() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.ref = setInterval(() => {
        this.numberEmitter.emit(this.curNumber);
        this.curNumber += 1;
      }, 1000);
    }
  }

  stopGame() {
    if (this.isRunning) {
      clearInterval(this.ref);
      this.isRunning = false;
      this.curNumber = 0;
    }
  }
}
```

**GameControlComponent**:

**AppComponent**:

- HTML
```angular2html
<app-game-control
  (numberEmitter)="onNumberEmitted($event)">
</app-game-control>
<br>
<div class="row">
<div class="col-6">
  <app-even
    *ngFor="let even of evensEmitted"
    [number]="even"></app-even>
</div>
<div class="col-6">
  <app-odd
    *ngFor="let odd of oddsEmitted"
    [number]="odd"></app-odd>
</div>
```

- Typescript
```typescript
export class AppComponent {
  oddsEmitted: number[] = [];
  evensEmitted: number[] = [];

  onNumberEmitted(emittedNumber: number) {
    if (emittedNumber % 2 === 0){
      this.evensEmitted.push(emittedNumber);
    } else {
      this.oddsEmitted.push(emittedNumber);
    }
  }
}
```

**EvenComponent** end **OddComponent** differ only for style: 

- HTML
```angular2html
<p> {{number}} </p>
```
- Typescript
```typescript
export class EvenComponent implements OnInit {
  @Input() number: number = 0;
}
```

- CSS
```css
/*Even*/
p {
  font-weight: bold;
  color: red;
}
/*Odd*/
p {
  font-weight: bold;
  color: darkblue;
}
```

## Assignment 05

### Exercise

- Optimize this app by adding a UsersService which manages the active and inactive users.

- Also add a CounterService which counts the number of active -> inactive and inactive -> active actions.

### Solution

#### AppModule

```typescript
@NgModule({
  // ...
  providers: [UsersService, CounterService],
  // ...
})
```

#### UsersService

```typescript
@Injectable()
export class UsersService {
  activeUsers = ['Max', 'Anna'];
  inactiveUsers = ['Chris', 'Manu'];

  constructor(private counterService: CounterService) {}

  setUserToActive(id: number) {
    this.activeUsers.push(this.inactiveUsers[id]);
    this.inactiveUsers.splice(id, 1);
    this.counterService.incrementActivations();
  }

  setUserToInactive(id: number) {
    this.inactiveUsers.push(this.activeUsers[id]);
    this.activeUsers.splice(id, 1);
    this.counterService.incrementDeactivations();
  }
}
```

#### CounterService

```typescript
export class CounterService {
  public activations: number = 0;
  public deactivations: number = 0;

  incrementActivations(){
    this.activations++;
  }

  incrementDeactivations(){
    this.deactivations++;
  }
}
```

#### AppComponent

```typescript
export class AppComponent implements OnInit {
  activeUsers: string[] = [];
  inactiveUsers: string[] = [];

  constructor(private usersService: UsersService,
              public counterService: CounterService) {
  }

  ngOnInit(): void {
    this.activeUsers = this.usersService.activeUsers;
    this.inactiveUsers = this.usersService.inactiveUsers;
  }
}
```

```angular2html
<div class="container">
  <div class="row">
    <div class="col-xs-12 col-md-8 col-md-offset-2">
      <app-active-users></app-active-users>
      <app-inactive-users></app-inactive-users>
      <hr>
      <div class="col-sm-6 text-success">Activations: {{counterService.activations}}</div>
      <div class="col-sm-6 text-danger">Deactivations: {{counterService.deactivations}}</div>
    </div>
  </div>
</div>
```

#### ActiveUsersComponent

```typescript
export class ActiveUsersComponent implements OnInit{
  users: string[] = [];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.users = this.usersService.activeUsers;
  }

  onSetToInactive(id: number) {
    this.usersService.setUserToInactive(id);
  }
}
```

#### InactiveUsersComponent

```typescript
export class InactiveUsersComponent implements OnInit{
  users: string[] = [];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.users = this.usersService.inactiveUsers;
  }

  onSetToActive(id: number) {
    this.usersService.setUserToActive(id);
  }
}
```

## Assignment 06

### Exercise

Add a Form with the following Inputs (and Validators)
1. Mail address (should not be empty and should be an email address)
2. A Dropdown which allows the user to select from three different Subscriptions ("Basic", "Advanced", "Pro"), set "Advanced" as Default
3. A Password field (should not be empty)
4. A Submit Button

Display a warning message if the Form is invalid AND was touched. Display a warning message below each input if it's invalid.

Upon submitting the form, you should simply print the Value of the Form to the Console.
Optionally, display it in your template.

### Solution

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
```

## Assignment 07

### Exercise

Create a Form with the following Controls and Validators
1. Project Name (should not be empty)
2. Mail (should not be a empty and a valid email)
3. Project Status Dropdown, with three values: 'Stable', 'Critical', 'Finished'
4. Submit Button

Add your own Validator which doesn't allow "Test" as a Project Name

Also implement that Validator as an async Validator (replace the other one)

Upon submitting the form, simply print the value to the console

### Solution

#### app.component.ts

```typescript
export class AppComponent implements OnInit {
    myForm: FormGroup;
    status_list = ['Stable', 'Critical', 'Finished'];

    constructor() {
        this.myForm = new FormGroup({
            project: new FormControl(null, Validators.required, this.checkProjectName),
            email: new FormControl(null, [Validators.required, Validators.email]),
            status: new FormControl('', Validators.required),
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
}
```

#### app.component.html

```angular2html
<div class="container">
  <div class="row">
    <div class="col-xs-12 col-sm-10 col-md-8 col-sm-offset-1 col-md-offset-2">
      <form [formGroup]="myForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Project Name</label>
          <input
            type="text"
            formControlName="project"
            class="form-control">
          <span
            *ngIf="project?.invalid && myForm?.get('project')?.touched"
            class="help-message">
            <span *ngIf="project?.errors?.['nameNotAllowed']">
              Please enter a valid project name!
            </span>
            <span *ngIf="project?.errors?.['required']">
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
            *ngIf="myForm?.get('email')?.invalid && myForm?.get('email')?.touched"
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
            *ngIf="myForm?.get('status')?.invalid && myForm?.get('status')?.touched"
            class="help-message">
              Please select a status!
          </span>
        </div>
        <button type="submit" class="btn btn-primary" [disabled]="myForm.invalid">Submit!</button>
      </form>
    </div>
  </div>
</div>
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

## Assignment 08

### Exercise

Create two pipes:

- **reverse** - reverse the characters of a string.
- **sort** - sort list elements.

### Solution

#### app.component.html

```angular2html
<li
  class="list-group-item"
  *ngFor="let server of servers | filter:filteredStatus:'status' | sort "
  [ngClass]="getStatusClasses(server)">

  <strong>{{ server.name | shorten:15 }}</strong> |
  {{ server.instanceType | uppercase | reverse }} |

  {{ server.started | date:'fullDate' | uppercase }}

  <span
    class="badge badge-dark badge-pill float-right">
    {{ server.status }}
  </span>
</li>
```

#### reverse.pipe.ts
```typescript
@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return value.split('').reverse().join('');
  }
}
```

#### sort.pipe.ts

```typescript
@Pipe({
  name: 'sort',
  pure: false
})
export class SortPipe implements PipeTransform {
  transform(value: { name: string }[], args?: any): any {
    return value.sort((a, b) => {
      return a.name > b.name ? 1 : -1;
    });
  }
}
```
