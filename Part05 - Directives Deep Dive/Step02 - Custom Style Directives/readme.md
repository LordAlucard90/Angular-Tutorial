# Step 02 - Custom Style Directives

## Create Custom Directives

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

---

## Binding DOM Properties

Another method to change a DOM element is the `@HostBinding` decorator:

```typescript
import {..., HostBinding} from '@angular/core';
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

`@HostBinding` needs camel case property names `style.backgroundColor` and a default value.

---

## Getting Values

It is possible to get values from the outside with the `@Input` decorator :

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

It is also possible name the Input property wit the same name of the directive to short the syntax:

```typescript
@Input('appBetterHighlight') highlightColor: string = 'blue';
```

```angular2html
<p [appBetterHighlight]="'red'" [defaultColor]="'yellow'" >Style me with a better directive different colors</p>
<!-- Stop Working -->
<!--<p appBetterHighlight>Style me with a better directive</p>-->
<!--<p appBetterHighlight [defaultColor]="'yellow'" [highlightColor]="'red'">Style me with a better directive different colors</p>-->
```

If is possible with property binding of strings to use this syntax:

```angular2html
<p [appBetterHighlight]="'red'" defaultColor="yellow" >Style me with a better directive different colors</p>
```

