# Angular Animations

## Content

- [Intro](#intro)
- [Change State](#change-state)
- [Transition](#transition)
- [Callbacks](#callbacks)

---

## Intro

The animations used by a component are defined in the `animations` section:
```typescript
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    animations: [
        trigger('divState', [
            state('normal', style({
                'background-color': 'red',
                transform: 'translateX(0)'
            })),
            state('highlighted', style({
                'background-color': 'blue',
                transform: 'translateX(100px)'
            })),
        ])
    ]
})
export class AppComponent {
    state = 'normal'

    // ...
}
```
Elements:
- **trigger**: is the animation definition. 
It required a name, that is used in the template, and a list of states.
- **state**: is one of the possible states of the animation.
It has a name, used to identify the current, and a style definition associated.

In the template must be associated the name of the animation with the wanted state:
```angular2html
<!-- ... -->
<div 
  style="width: 100px; height: 100px;"
  [@divState]="state"
  >
</div>
<!-- ... -->
```

## Change State

It is possible to change the state of the animation just assignign the new one:
```typescript
@Component({
    // ...
})
export class AppComponent {
    // ...

    onAnimate() {
        this.state = this.state === 'normal' ? 'highlighted' : 'normal';
    }

    // ...
}
```
```angular2html
<!-- ... -->
<button class="btn btn-primary" (click)="onAnimate()">Animate!</button>
<!-- ... -->
```

## Transition

In order to create a nice transition between two states it is possible to:
```typescript
@Component({
    animations: [
        trigger('divState', [
            state(
                'normal',
                // ...
            ),
            state(
                'highlighted',
                // ...
            ),
            transition('normal => highlighted', animate(300)),
            transition('highlighted => normal', animate(600)),
        ]),
    ],
})
export class AppComponent {
    // ...
}
```
The **transition** just need a starting and ending state as first argument,
and as second the first implementation can just be the time needed to be completed.\
All the intermediate color and position changes are automatically calculated
by the framework.

If the timing of both transitions is the same, can used only one definition
with `<=>` instead of `=>`:
```typescript
    transition('normal <=> highlighted', animate(300)),
```
It is also possible to use the wild chart `*` to select any possible state:
```typescript
    transition('shrunken <=> *', animate(500)),
```

### Intermediate Transitions

It is possible to define intermediate transitions in this way:
```typescript
transition('shrunken <=> *', [
    style({
        'background-color': 'orange',
    }),
    animate(
        1000,
        style({
            borderRadius: '50px',
        }),
    ),
    animate(500),
]),
```

### Creation And Deletion Transitions

When an element is create or removed can be the state `void`:
```typescript
trigger('list1', [
    state(
        'in', // dummy name
        style({
            opacity: 1,
            transform: 'translateX(0)',
        }),
    ),
    transition('void => *', [
        style({
            opacity: 0,
            transform: 'translateX(-100px)',
        }),
        animate(300),
    ]),
    transition('* => void', [
        animate(
            300,
            style({
                opacity: 0,
                transform: 'translateX(100px)',
            }),
        ),
    ]),
]),
```
in this case the current state is not interesting, 
therefore is used the `*` in the component and can be omitted
the state binding in the template:
```angular2html
<!-- ... -->
  <ul class="list-group">
    <li
      class="list-group-item"
      (click)="onDelete(item)"
      [@list1]
      *ngFor="let item of list">
      {{ item }}
    </li>
  </ul>
<!-- ... -->
```

### KeyFrames

It is possible to better control all the intermediate states of
a transition with the `KeyFrames`:
```typescript
transition('void => *', [
    animate(
        1000,
        keyframes([
            style({
                opacity: 0,
                transform: 'translateX(-100px)',
                offset: 0
            }),
            style({
                opacity: 0.5,
                transform: 'translateX(-50px)',
                offset: 0.3
            }),
            style({
                opacity: 1,
                transform: 'translateX(-20px)',
                offset: 0.8
            }),
            style({
                opacity: 1,
                transform: 'translateX(0px)',
                offset: 1
            }),
        ]),
    ),
]),
```

### Grouping Animations

It is possible to perform two different animations on the same object 
and at the same time using `group`:
```typescript
transition('* => void', [
    group([
        animate(
            300,
            style({
                color: 'red'
            }),
        ),
        animate(
            800,
            style({
                opacity: 0,
                transform: 'translateX(100px)',
            }),
        ),
    ]),
]),
```

## Callbacks

It is possible to setup callbacks using:
```angular2html
<!-- ... -->
  <div 
      style="width: 100px; height: 100px;"
      [@divState]="state"
      (@divState.start)="onAnimationStarted($event)"
      (@divState.done)="onAnimationFinished($event)"
      >
  </div>
<!-- ... -->
```
```typescript
@Component({
    // ...
})
export class AppComponent {
    // ...

    onAnimationStarted(event: any) {
        console.log(event);
    }

    onAnimationFinished(event: any) {
        console.log(event);
    }
}
```
