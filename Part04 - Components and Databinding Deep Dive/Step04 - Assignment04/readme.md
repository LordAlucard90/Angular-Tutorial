# Step 04 - Assignment04

## Exercise

1. Create three new components: GameControl, Odd and Even
2. The GameControl Component should have buttons to start and stop the game
3. When starting the game, an event (holding a incrementing number) should get emitted each second (ref = setInterval())
4. The event should be listenable from outside the component
5. When stopping the game, no more events should get emitted (clearInterval(ref))
6. A new Odd component should get created for every odd number emitted, the same should happen for the Even Component (on even numbers)
7. Simply output Odd - NUMBER or Even - NUMBER in the two components
8. Style the element (e.g. paragraph) holding your output text differently in both components

---

## Solution

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
  private ref: number;

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
  @Input() number: number;
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
