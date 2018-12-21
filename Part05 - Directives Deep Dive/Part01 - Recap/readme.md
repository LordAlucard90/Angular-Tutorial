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

---

## Alternative Directive Creation Method

Another way to create custom directives is :

```bash
$ ng generate directive directive-name 
// or 
$ ng g d directive-name 
```

By default the files are created in the app folder, is a goo practice put them into a `directive-name` folder or into a `directives` folder .

When the directive's files are moved remember to modify **app.module-ts** with the new directive path.

---

## Better Method To Change DOM

```typescript
import {Directive, ElementRef, OnInit, Renderer2} from '@angular/core';
@Directive({
  selector: '[appBetterHighlight]'
})
export class BetterHighlightDirective implements OnInit{
  constructor(private elementRef: ElementRef,
              private renderer: Renderer2) { }
  ngOnInit(): void {
    this.renderer.setStyle(this.elementRef.nativeElement,
                            'background-color',
                            'blue');
  }
}
```

Since in some cases there is not direct access to the DOM, such as when the app is not run in the browser, it is a better practice use the `render` to access the DOM. 

---

## React To Events

It is possible to react to user events with `@HostListener`:

```typescript
import {..., HostListener} from '@angular/core';
export class BetterHighlightDirective {
  constructor(private elementRef: ElementRef,
              private renderer: Renderer2) { }
  @HostListener('mouseenter') mouseover(eventData: Event){
    this.renderer.setStyle(this.elementRef.nativeElement,
                            'background-color',
                            'blue');
  }
  @HostListener('mouseleave') mouseleave(eventData: Event){
    this.renderer.setStyle(this.elementRef.nativeElement,
                            'background-color',
                            'transparent');
  }
}
```

`@ HostListener` allows you to associate a custom event and receive data from the event or from custom data.



