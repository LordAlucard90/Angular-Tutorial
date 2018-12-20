# Part 01 - Recap

## nfgFor and ngIf

On an element could be placed only one structural directive, this code generate an error:

```angular2html
<li
  class="list-group-item"
  *ngFor="let number of numbers"
  *ngIf="number % 2 ==0">
    {{number}}
</li>
```
`ngFor` and `ngIf` can be conbined in this way:

```angular2html
<div *ngIf="onlyOdd">
  <li
    class="list-group-item"
    *ngFor="let odd of oddNumbers">
      {{odd}}
  </li>
</div>
```
---

## ngClass and ngStyle

This is an example of `ngClass` and `ngStyle` usage:

```angular2html
<li
  class="list-group-item"
  [ngClass]="{odd: odd % 2 !== 0}"
  [ngStyle]="{backgroundColor: odd % 2 !== 0 ? 'yellow' : 'transparent'}"
  *ngFor="let odd of oddNumbers">
    {{odd}}
</li>
```
---

## Create Custom Directive

Create a folder with the `directive-name` in the app folder and create e new file named  `directive-name.directive.ts`:

```
app
└── directive-name
    └── directive-name.directive.ts
```

Like the **Components**, **Directives** need their decorator `@Directive` with the custom unique selector:

```typescript
import {Directive, ElementRef, OnInit} from '@angular/core';

@Directive({
  selector: '[appBasicHighlight]'
})
export class BasicHighlightDirective implements OnInit{
  constructor(private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    this.elementRef.nativeElement.style.backgroundColor = 'green';
  }
}
```
And is must be added to **app.module.ts**:
```typescript
...
import {BasicHighlightDirective} from './basic-highlight/basic-highlight.directive';

@NgModule({
  declarations: [
    ...
    BasicHighlightDirective
  ],
  ...
})
```

In the constructor the Directive receive the element it is placed on:
```
constructor(private elementRef: ElementRef) {}
```
The `private` before make `elementRef` a property of the class and directly assign the value to the property.

The Directives have the `OnInit` and `OnDestroy` lifeCycle but not all the others because Directives do not have templates.

