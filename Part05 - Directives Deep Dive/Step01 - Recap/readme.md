# Part 01 - Recap

## ngFor and ngIf

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
