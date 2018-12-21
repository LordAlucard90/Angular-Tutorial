# Step 03 - Custom Structural Directives

## ng-template

The `*` before ngIf and ngFor tells Angular that they are structural directives and to transform them in `ng-template` form:

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
---

## Custom Structural Directives

A structural directive receives the template where is declared a reference to a view:

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
The reference to the view is user to to create or remove the content in the template.

In this case the `@Input` associates a method that is executed every time the value of the condition value changes.

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

It is important that the name of the directive `*appUnless` is the same of `@Input('appUnless')`.



