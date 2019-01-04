# Step 01 - Intro


The pipes transform output in the template.

## Syntax

Pipes are placed in the template with string interpolation:

```angular2html
{{ variable_name | pipe_name }}
```

Some pipes are:
- **uppercase** - put text on uppercase
- **lowercase** - put text on lowercase
- **date** - transforms a date

Other pipes can be found at https://angular.io/api?query=pipe

---

## Parametrizing Pipes

Some pipes can take parameters:

```angular2html
{{ server.started | date:'fullDate' }}
```
Each parameter must be separated by a `:`.


---

## Chaining Pipes

Pipes can be chained adding a pipe after the last pipe:

```angular2html
{{ server.started | date:'fullDate' | uppercase }}
```
Pipes are executed from left to right so the order is important.

---

## Creating Pipes

It is possible to create a custom pipe by creating a file

`pipe_name.pipe.ts`

or with the command

```bash
$ ng generate pipe pipe_name
# or
$ ng g p pipe_name
```

Pipes need their own decorator where is possible to declare the pipe's name used in the template.

```typescript
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform {
  transform(value: any): any {
    if (value.length > 10){
      return value.substr(0, 10) + '...';
    } else {
      return value;
    }
  }
}
```

`PipeTransform` is an interface the exposes the **transform** method used by angular to transform the pipe input.

The pipe must be imported in the **app.module.ts** file:

```typescript
import {ShortenPipe} from './shorten.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ShortenPipe
  ],
  ...
})
export class AppModule { }
```

#### Receiving Values

It is possible receive user parameter:

```angular2html
<strong>{{ server.name | shorten:15 }}</strong>
```

And use them in this way:

```typescript
export class ShortenPipe implements PipeTransform {
  transform(value: any, limit: number): any {
    if (value.length > limit){
      return value.substr(0, limit) + '...';
    } else {
      return value;
    }
  }
}
```

---

## Filtering Pipe

It is possible in other context like `ngFor`;

```angular2html
<input type="text" [(ngModel)]="filteredStatus">
<hr>
<li
  ...
  *ngFor="let server of servers | filter:filteredStatus:'status'">
    ...
</li>
```

Where `filteredStatus` is declared as a property of **app.component** as string.

And the filter is:

```typescript
export class FilterPipe implements PipeTransform {
  transform(value: any, filterString: string, propName: string): any {
    if (value.length === 0 || filterString === '') {
      return value;
    }
    const resultArray = [];
    for (const item of value) {
      if (item[propName] === filterString) {
        resultArray.push(item);
      }
    }
    return resultArray;
  }

}
```
---

## Forcing Pipe Reload

By default Angular does not recalculate the pipe result on each data change.

It is possible force the recalculation in this way:

```typescript
@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {...}
```

**The recalculation can lead to performance issues**

---

## Asynchronous Pipes

When there is asynchronous data like promises or observables_

```typescript
export class AppComponent {
  appStatus = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('stable');
    }, 2000);
  });
  ...
}
```
It is possible to use `async` to manage the data correctly:

```angular2html
<h4>App Status: {{appStatus | async }}</h4>
```


