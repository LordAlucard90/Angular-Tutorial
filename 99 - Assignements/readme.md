# Assignments

## Content

**The Basics**:
- [Assignment 01](#assignment-01)
- [Assignment 02](#assignment-02)
- [Assignment 03](#assignment-03)
- [Assignment 04](#assignment-04)

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


