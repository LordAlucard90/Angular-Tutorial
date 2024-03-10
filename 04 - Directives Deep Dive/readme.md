# Directives Deep Dive

## Content

- [Recap](#recap)
- [Custom Style Directives](#custom-style-directives)
- [Custom Structural Directives](#custom-structural-directives)

---

## Recap

### ngFor and ngIf

On an element could be placed only one structural directive,
this code generate an error:

```angular2html
<li
  class="list-group-item"
  *ngFor="let number of numbers"
  *ngIf="number % 2 ==0">
    {{number}}
</li>
```
`ngFor` and `ngIf` can be combined in this way:

```angular2html
<div *ngIf="onlyOdd">
  <li
    class="list-group-item"
    *ngFor="let odd of oddNumbers">
      {{odd}}
  </li>
</div>
```

### ngClass and ngStyle

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

## Custom Style Directives

### Create Custom Directives

Create a folder with the `directive-name` in the app folder
and create a new file named  `directive-name.directive.ts`:

```
app
└── directive-name
    └── directive-name.directive.ts
```

Like the **Components**, **Directives** need their decorator
`@Directive` with the custom unique selector:

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
// ...
import {BasicHighlightDirective} from './basic-highlight/basic-highlight.directive';

@NgModule({
  declarations: [
    // ...
    BasicHighlightDirective
  ],
  // ...
})
```

In the constructor the Directive receive the element it is placed on:
```
constructor(private elementRef: ElementRef) {}
```
The `private` makes `elementRef` a property of the class
and directly assign the value to the property.

The Directives have the `OnInit` and `OnDestroy` lifeCycle
but not all the others because Directives do not have templates.

### Alternative Directive Creation Method

Another way to create custom directives is :

```bash
ng generate directive directive-name 
# or 
ng g d directive-name 
```

By default the files are created in the app folder,
is a goo practice put them into a `directive-name` folder 
or into a `directives` folder.\
When the directive's files are moved remember,
to modify **app.module-ts** with the new directive path.

### Better Method To Change DOM

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
Since in some cases there is no direct access to the DOM,
such as when the app is not run in the browser,
it is a better practice use the `renderer` to access the DOM. 

### React To Events

It is possible to react to user events with `@HostListener`:

```typescript
import {/* ... */, HostListener} from '@angular/core';
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
`@HostListener` allows to associate a custom event
and receive data from the event or from custom data.

### Binding DOM Properties

Another method to change a DOM element is the `@HostBinding` decorator:

```typescript
import {/* ... */, HostBinding} from '@angular/core';
@Directive({
  selector: '[appBetterHighlight]'
})
export class BetterHighlightDirective {
  @HostBinding('style.backgroundColor') backgroundColor: string = 'transparent';
  constructor(private elementRef: ElementRef,
              private renderer: Renderer2) { }
  @HostListener('mouseenter') mouseover(eventData: Event){
    this.backgroundColor = 'blue';
  }
  @HostListener('mouseleave') mouseleave(eventData: Event){
    this.backgroundColor = 'transparent';
  }
}
```
`@HostBinding` needs camel case property names
`style.backgroundColor` and a default value.

### Getting Values

It is possible to get values from the outside with the `@Input` decorator:
```typescript
export class BetterHighlightDirective implements OnInit{
  @Input() defaultColor: string = 'transparent';
  @Input() highlightColor: string = 'blue';
  @HostBinding('style.backgroundColor') backgroundColor: string;
  constructor(private elementRef: ElementRef,
              private renderer: Renderer2) { }
  ngOnInit(): void {
    this.backgroundColor = this.defaultColor;
  }
  @HostListener('mouseenter') mouseover(eventData: Event){
    this.backgroundColor = this.highlightColor;
  }
  @HostListener('mouseleave') mouseleave(eventData: Event){
    this.backgroundColor = this.defaultColor;
  }
}
```

```angular2html
<p appBetterHighlight 
   [defaultColor]="'yellow'" 
   [highlightColor]="'red'">
     Style me with a better directive different colors
</p>
```

It is also possible name the Input property with the same name 
of the directive to short the syntax:

```typescript
@Input('appBetterHighlight') highlightColor: string = 'blue';
```

```angular2html
<p [appBetterHighlight]="'red'" [defaultColor]="'yellow'" >Style me with a better directive different colors</p>
<!-- Stop Working -->
<!--<p appBetterHighlight>Style me with a better directive</p>-->
<!--<p appBetterHighlight [defaultColor]="'yellow'" [highlightColor]="'red'">Style me with a better directive different colors</p>-->
```

It is possible with property binding of strings to use this syntax:

```angular2html
<p [appBetterHighlight]="'red'" defaultColor="yellow" >Style me with a better directive different colors</p>
```

## Custom Structural Directives

### ng-template

The `*` before ngIf and ngFor tells Angular that they are structural directives
and to transform them in `ng-template` form:

```angular2html
<ng-template [ngIf]="!onlyOdd">
  <div>
    <li
      class="list-group-item"
      [ngClass]="{odd: even % 2 !== 0}"
      [ngStyle]="{backgroundColor: even % 2 !== 0 ? 'yellow' : 'transparent'}"
      *ngFor="let even of evenNumbers">
        {{even}}
    </li>
  </div>
</ng-template>
```

### Custom Structural Directives

A structural directive receives the template where is declared
as reference to a view:

```typescript
import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
@Directive({
  selector: '[appUnless]'
})
export class UnlessDirective {
  @Input('appUnless') set unless(condition: boolean){
    if (!condition){
      this.cvRef.createEmbeddedView(this.templateRef);
    } else {
      this.cvRef.clear();
    }
  }
  constructor(private templateRef: TemplateRef<any>,
              private cvRef: ViewContainerRef) {
  }
}
```
The reference to the view is used to to create or remove the content in the template.

In this case the `@Input` associates a method 
that is executed every time the value of the condition value changes.
```angular2html
<div *appUnless="onlyOdd">
  <li
    class="list-group-item"
    [ngClass]="{odd: even % 2 !== 0}"
    [ngStyle]="{backgroundColor: even % 2 !== 0 ? 'yellow' : 'transparent'}"
    *ngFor="let even of evenNumbers">
      {{even}}
  </li>
</div>
```
It is important that the name of the directive `*appUnless`
is the same of `@Input('appUnless')`.

### ngSwitch

The `ngSwitch` directive can be used to avoid multiple `ngIf`:

```angular2html
<div [ngSwitch]="value">
  <p *ngSwitchCase="5">Value is 5</p>
  <p *ngSwitchCase="10">Value is 10</p>
  <p *ngSwitchCase="100">Value is 100</p>
  <p *ngSwitchDefault>Value is Default</p>
</div>
```
```typescript
export class AppComponent {
  ...
  value = 5;
}
```

