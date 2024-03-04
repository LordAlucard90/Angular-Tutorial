# Debugging

## Content

- [Error Messages](#error-messages)
- [Partial Working Error](#partial-working-error)
- [Augury](#augury)

---

## Error Messages

Console displays error messages like this:

```
ERROR TypeError: Cannot read property 'push' of undefined
    at AppComponent.push../src/app/app.component.ts.AppComponent.onAddServer (app.component.ts:12)
```

- **Error type** - Cannot read property 'push' of undefined.
- **Component and Line** - (app.component.ts:12)

The error referees to:

```typescript
servers;

onAddServer() {
    this.servers.push('Another Server');
}
```

Cannot read property 'push' of undefined* means that **servers** is undefined. 

The value is initialized but not declared, ``servers = [];`` solves the problem.

## Partial Working Error

In the example after adding some servers it is possible deleted them by clicking 
on them, this does not work for the last item.

On the html the current item is passed.
```angular2html
<li
  class="list-group-item"
  *ngFor="let server of servers; let i = index"
  (click)="onRemoveServer(i)">{{ server }}</li>
```

And this is the function:
```typescript
onRemoveServer(id: number) {
    const position = id + 1;
    this.servers.splice(position, 1);
}
```

With Chrome it is possible go to `Sources`>`localhost:4200`>`main.js` and
search for the correspondent line:
```javascript
AppComponent.prototype.onRemoveServer = function (id) {
    var position = id + 1;
    this.servers.splice(position, 1);
```

Clicking on a line of `main.js` it is created a breakpoint in the correspondent
TypeScript file thanks to source maps.

With the breakpoint is possible check the variables value in the position 
assignment and the evolution step by step and, clicking on the current step 
variable, see that the delete position in wrong.

It is possible access directly to the TypeScript files from 
`Sources`>`webpack://`>`.`>`src`>`app`>`app.component.ts`.

---

## Augury

[Augury](https://augury.rangle.io/) is a browser extension that helps to 
analyze Angular applications.

Augury displays components, their properties and their injections, 
dependencies, routing and so on.

