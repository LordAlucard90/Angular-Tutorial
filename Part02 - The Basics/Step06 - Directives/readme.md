## Step 06 - Directives

Directives are Instructions in the DOM, there are two type of directives:
- **Structural directives** - add or remove elements.
- **Attribute directives** - change the element they were placed on.

```angular2html
<p appTurnGreen>Receives a green background!</p>
```
This is a example directive that colors the text in green.

```typescript
@Directive({
    selector: '[appTurnGreen]'
})
export class TurnGreenDirective{
  ...
}
```

---

## *ngIF Directive

The ng structural directives need the `*` to be recognised.

The `*ngIf="serverCreated"` insert or remove the element if the value or the function into the `"..."` is true or false.

It is possible to display an else condition in this way:
```angular2html
<p *ngIf="serverCreated; else noServer">
    Server was created, server name is {{serverName}}
</p>
<ng-template #noServer>
  <p>No server was created!</p>
</ng-template>
```

---

## ngStyle Directive

Since `ngStyle` modifies a property of an html tag like `Property Binding`, it is used the same `[ngStyle]="new_stlye"` syntax.

```angular2html
<p [ngStyle]="{backgroundColor: getColor()}">
  {{'Server'}} with ID {{serverID}} is {{getServerState()}}.
</p>
```
In this case `ngStyle` change dynamically the attribute of the css property according to return value of the function.
```typescript
getColor() {
  return this.serverStatus === 'online' ? 'green' : 'red';
}
```
## ngClass Directive

Like `ngStyle`, `ngClass` uses the `Property Binding` syntax.

```angular2html
<p
  [ngStyle]="{backgroundColor: getColor()}"
  [ngClass]="{online: serverStatus === 'online'}">
  {{'Server'}} with ID {{serverID}} is {{getServerState()}}.
</p>

```
In this case `ngClass` add the specific class if the statement is true and it removes it when it becomes false.
```typescript
@Component({
  ...
  styles: ['.online {color: white}',],
})
```

## *ngFor Directive

The `ngFor` directive is a structural directive that add all the elements of a list.

```angular2html
<app-server *ngFor="let server of servers"></app-server>
```

```typescript
export class ServersComponent implements OnInit {
  servers = ['TestServer', 'TestServer 2'];
  ...
  onCreateServer(){
    this.serverCreated = true;
    this.servers.push(this.serverName);
    this.serverCreationStatus = 'Server was created! Name is ' + this.serverName;
  }
  ...
}
```


