# Step 01 - Splitting Apps into Components

Split an App into different components helps the debugging process and the  code reuse.

```bash
$ ng g c cockpit --spec false
$ ng g c server-elemnt --spec false
```

`--spec false` do not create the test files.

#### Elements moved to cockpit

Html
```angular2html
<div class="row">
  <div class="col-xs-12">
    <p>Add new Servers or blueprints!</p>
    <label>Server Name</label>
    <input type="text" class="form-control" [(ngModel)]="newServerName">
    <label>Server Content</label>
    <input type="text" class="form-control" [(ngModel)]="newServerContent">
    <br>
    <button
      class="btn btn-primary"
      (click)="onAddServer()">Add Server</button>
    <button
      class="btn btn-primary"
      (click)="onAddBlueprint()">Add Server Blueprint</button>
  </div>
</div>
```

Typescript
```typescript
export class CockpitComponent implements OnInit {
  newServerName = '';
  newServerContent = '';

  constructor() { }

  ngOnInit() {
  }


  onAddServer() {
    this.serverElements.push({
      type: 'server',
      name: this.newServerName,
      content: this.newServerContent
    });
  }

  onAddBlueprint() {
    this.serverElements.push({
      type: 'blueprint',
      name: this.newServerName,
      content: this.newServerContent
    });
  }
}
```

`this.serverElements`

#### Elements moved to cockpit

Html
```angular2html
<div
  class="panel panel-default"
  *ngFor="let element of serverElements">
  <div class="panel-heading">{{ element.name }}</div>
  <div class="panel-body">
    <p>
      <strong *ngIf="element.type === 'server'" style="color: red">{{ element.content }}</strong>
      <em *ngIf="element.type === 'blueprint'">{{ element.content }}</em>
    </p>
  </div>
</div>
```

The `*ngFor="let element of serverElements"` will be moved to the **app.component**:
```angular2html
<app-server-element *ngFor="let server of serverElements"></app-server-element>
```

---

## Custom Property Binding

It is possible to bind properties across different components.

**server-element.component.ts**
```typescript
import { ..., Input } from '@angular/core';
...
export class ServerElementComponent implements OnInit {
  @Input() element: {type: string, name: string, content: string};
  ...
}
```

`@Input()` decorator is necessary to make the property visible from the parent component.

**app.component.ts**
```typescript
serverElements = [{type: 'server', name: 'Test Server', content: 'Dummy Content'}];
```

Declaration of a single `server-element`.

**app.component.html**
```angular2html
<app-server-element
   *ngFor="let serverElement of serverElements"
   [element]="serverElement"
></app-server-element>
```

Binding of the property `[element]="serverElement"`.

#### Custom Properties Alias 

It is possible renaming an element with a more explicative signature like 
`[srvElement]="serverElement"` by passing the signature to the `@Input` decorator::
```typescript
@Input('srvElement') element: {type: string, name: string, content: string};
```

---

## Custom Event Binding

It is possible to bind event from a sub-component to a parent one.

```typescript
export class AppComponent {
  serverElements = [{type: 'server', name: 'Test Server', content: 'Dummy Content'}];

  onServerAdded(serverData: {serverName: string, serverContent: string}) {
    this.serverElements.push({
      type: 'server',
      name: serverData.serverName,
      content: serverData.serverContent
    });
  }

  onBlueprintAdded(blueprintData: {serverName: string, serverContent: string}) {
    this.serverElements.push({
      type: 'blueprint',
      name: blueprintData.serverName,
      content: blueprintData.serverContent
    });
  }
}
```

`onServerAdded` and `onBlueprintAdded` are the event listeners.

```angular2html
<app-cockpit
  (serverCreated)="onServerAdded($event)"
  (blueprintCreated)="onBlueprintAdded($event)">
</app-cockpit>
```

The `(serverCreated)="onServerAdded($event)"` syntax associates an event to his listener and passes a object to the listener.

```typescript
import { ..., EventEmitter, Output } from '@angular/core';
...
export class CockpitComponent implements OnInit {
  @Output() serverCreated = new EventEmitter<{serverName: string, serverContent: string}>();
  @Output() blueprintCreated = new EventEmitter<{serverName: string, serverContent: string}>();
  ...
  onAddServer() {
    this.serverCreated.emit({serverName: this.newServerName, serverContent: this.newServerContent});
  }
  onAddBlueprint() {
    this.blueprintCreated.emit({serverName: this.newServerName, serverContent: this.newServerContent});
  }
}
```

`new EventEmitter<...>();` creates a new evet emitter who emits objects with this structure: `{serverName: string, serverContent: string}`

`@Output()` is the decorator that make the event accessible from outside.

#### Custom Events Alias 

It is possible renaming an element with a more explicative signature like 
`(bpCreated)="onBlueprintAdded($event)"` by passing the signature to the `@Output` decorator::

```typescript
  @Output('bpCreated') blueprintCreated = ...;
```

