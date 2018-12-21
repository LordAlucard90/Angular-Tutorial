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

