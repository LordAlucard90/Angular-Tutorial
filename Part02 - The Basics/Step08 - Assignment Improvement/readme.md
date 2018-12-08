# Step 08 - Assignment Improvement

It is possible extract the index of the current element and use it with this syntax:

```angular2html
<p *ngFor="let click of clickLogs; let i = index"
  [ngClass]="{'high-log': i > 4}"
  [ngStyle]="{color: i > 4 ? 'white' : ''}"
>{{click}}</p>
```

