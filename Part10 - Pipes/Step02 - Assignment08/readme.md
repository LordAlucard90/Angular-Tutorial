# Step 02 - Assignment 08

## Exercise

Create two pipes:

- **reverse** - reverse the characters of a string.
- **sort** - sort list elements.

---

## Solution

#### app.component.html

```angular2html
<li
  class="list-group-item"
  *ngFor="let server of servers | filter:filteredStatus:'status' | sort "
  [ngClass]="getStatusClasses(server)">

  <strong>{{ server.name | shorten:15 }}</strong> |
  {{ server.instanceType | uppercase | reverse }} |

  {{ server.started | date:'fullDate' | uppercase }}

  <span
    class="badge badge-dark badge-pill float-right">
    {{ server.status }}
  </span>
</li>
```

#### reverse.pipe.ts
```typescript
@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return value.split('').reverse().join('');
  }
}
```

#### sort.pipe.ts

```typescript
@Pipe({
  name: 'sort',
  pure: false
})
export class SortPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return value.sort((a, b) => {
      return a.name > b.name ? 1 : -1;
    });
  }
}
```