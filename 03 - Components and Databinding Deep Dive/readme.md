# Components and Data Binding Deep Dive

## Content 

- [Splitting Apps Into Components](#splitting-apps-into-components)
- [View Encapsulation](#view-incapsulation)
- [Templates](#templates)
- [Components Lifecycle](#components-lifecycle)

---

## Splitting Apps Into Components

Split an App into different components helps the debugging process 
and the code reuse.

```bash
$ ng g c cockpit --skipTest true
$ ng g c server-element --skipTest true
```

`--skipTest true` do not create the test files.

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

#### Elements moved to app

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

The `*ngFor="let element of serverElements"` will be moved to 
the **app.component**:
```angular2html
<app-server-element *ngFor="let server of serverElements"></app-server-element>
```

### Custom Property Binding

It is possible to bind properties across different components.

**server-element.component.ts**
```typescript
import { ..., Input } from '@angular/core';
// ...
export interface ServerElement {
    type: string;
    name: string;
    content: string;
}
// ...
export class ServerElementComponent implements OnInit {
  @Input() element: ServerElement = {} as ServerElement;
  // ...
}
```

`@Input()` decorator is necessary to make the property visible 
from the child component.

**app.component.ts**
```typescript
serverElements: ServerElement[] = [
    {type: 'server', name: 'Test Server', content: 'Dummy Content'}
];
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

It is possible to rename an element with a more explicative signature like 
`[srvElement]="serverElement"` by passing the signature to the
`@Input` decorator:
```typescript
@Input('srvElement') element: ServerElement = {} as ServerElement;
```

### Custom Event Binding

It is possible to bind event from a sub-component to a parent one.
```typescript
export class AppComponent {
  serverElements: ServerElement[] = [{type: 'server', name: 'Test Server', content: 'Dummy Content'}];

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

The `(serverCreated)="onServerAdded($event)"`
syntax associates an event to his listener and passes an object to the listener.

```typescript
import { ..., EventEmitter, Output } from '@angular/core';
...
export class CockpitComponent implements OnInit {
  @Output() serverCreated = new EventEmitter<{ serverName: string; serverContent: string }>();
  @Output() blueprintCreated = new EventEmitter<{ serverName: string; serverContent: string; }>(); //   ...
  // ...
  onAddServer() {
    this.serverCreated.emit({serverName: this.newServerName, serverContent: this.newServerContent});
  }
  onAddBlueprint() {
    this.blueprintCreated.emit({serverName: this.newServerName, serverContent: this.newServerContent});
  }
}
```

`new EventEmitter<...>();` creates a new event emitter
who emits objects with this structure:
`{serverName: string, serverContent: string}`

`@Output()` is the decorator that make the event accessible from outside.

#### Custom Events Alias 

It is possible renaming an element with a more explicative signature like 
`(bpCreated)="onBlueprintAdded($event)"`,
by passing the signature to the `@Output` decorator:

```typescript
  @Output('bpCreated') blueprintCreated = ...;
```

## View Encapsulation

The style into the component template only work for that component
and is not viewed outside of it.

The style for the **blueprintserver** must be copied into the
**server-element** template:
```css
p { color: blue; }
```
Angular assigns to each element a specific attribute,
the attribute is used to manage the specific style that is not shared to other
components.

### Encapsulation

The **ViewEncapsulation** defines the behaviour for the style visibility
in the application.
- **Native** - uses the ShadowDom technology for the browsers who supports it.
- **Emulated** - the default behaviour, emulate the ShadowDom behaviour.
- **None** - do not create any attribute and uses the style for globally.

```typescript
import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-root',
  // ...
  encapsulation: ViewEncapsulation.Emulated
})
```

## Templates

### Local References

It is possible to create local references inside a template,
this references can be used only in the template.

```angular2html
<input 
  type="text" 
  class="form-control" 
  #serverNameInput>
<!-- ... -->
<button
  class="btn btn-primary"
  (click)="onAddServer(serverNameInput)">Add Server</button>
```

Now the function has a input value that can be used in the component:

```typescript
onAddServer(nameInput: HTMLInputElement) {
  this.serverCreated.emit({
    serverName: nameInput.value,
    serverContent: this.newServerContent
  });
}
```
The value received by the function is the html element.

### @ViewChild

Another method to call a reference from a template to a component is
`@ViewChild`.

```angular2html
<input
  type="text"
  class="form-control"
  #serverContentInput>
```

It is possible select the string that must be referenced:

```typescript
@ViewChild('serverContentInput') serverContentInput: ElementRef = {} as ElementRef;
```

It is also possible select a component to reference.

```typescript
@ViewChild('serverContentInput') serverContentInput: ElementRef = {} as ElementRef;
//...
onAddServer(nameInput: HTMLInputElement) {
  this.serverCreated.emit({
    serverName: nameInput.value,
    serverContent: this.serverContentInput.nativeElement.value
  });
}
```
In this case `serverContentInput` is a type `ElementRef`

If the view or component child is used inside `ngOnInit` then the declaration must be changed to:
```typescript
@ViewChild('heading', { static: true }) header: ElementRef = {} as ElementRef;
@ContentChild('contentParagraph', { static: true }) paragraph: ElementRef = {} as ElementRef;
```

### ng-component

Everything placed between opening and closing tags of a component
is lost by default.

With the `ng-content` directive placed into a child component:
```angular2html
<div class="panel-body">
  <ng-content></ng-content>
</div>
```

It is possible to tell Angular where to insert the content found on the parent
component.

```angular2html
<app-server-element
  *ngFor="let serverElement of serverElements"
  [srvElement]="serverElement">
  <p>
    <strong *ngIf="serverElement.type === 'server'" style="color: red">{{ serverElement.content }}</strong>
    <em *ngIf="serverElement.type === 'blueprint'">{{ serverElement.content }}</em>
  </p>
</app-server-element>
```

## Components Lifecycle

During the creation of a new component Angular goes for some different phases
that can be intercepted to run some code:
- **ngOnChanges**:\
called on creation and after a bound input property changes.
- **ngOnInit**:\
called once the component in initialized, after the constructor.
- **ngDoCheck**:\
called during every change detection run.
- **ngAfterContentInit**:\
called after content (ng-content) has been projected into view.
- **ngAfterContentCheck**:\
called every time the projected content has been checked.
- **ngAfterViewInit**:\
called after the component's view (and child views) has been initialized.
- **ngAfterViewCheck**:\
called every time the view (and child views) have been checked.
- **ngOnDestroy**:\
called once the component is about to be destroyed.

All the method needs to implement the correspondent interface to work correctly.

### ngOnChanges

To use `ngOnChanges` the class must implement `OnChanges` interface:

```typescript
import {..., OnChanges, SimpleChanges} from '@angular/core';
...
export class ServerElementComponent implements OnInit, OnChanges {
  @Input('srvElement') element: ServerElement = {} as ServerElement;
  // ...
  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges!');
    console.log(changes);
  }
  // ...
}
```
`ngOnChanges` receives a input value with this information:
- **element** - the element of the component:
  - **currentValue** - the current value.
  - **firstChange** - is it has been changed before.
  - **previousValue** - the previous value of the element.
  
### ngAfterViewInit

After `ngAfterViewInit` the access to the template elements starts.

```angular2html
<div class="panel-heading" #heading>{{ name }}</div>
```

```typescript
@ViewChild('heading', { static: true }) header: ElementRef = {} as ElementRef;
...
ngAfterViewInit() {
  console.log('ngAfterViewInit!');
  console.log('header: ' + this.header.nativeElement.textContent);
}
```

### ngAfterContentInit

After `ngAfterContentInit` the access to the parent template content starts.

```typescript
@ContentChild('contentParagraph', { static: true }) paragraph: ElementRef = {} as ElementRef;
...
ngAfterContentInit() {
  console.log('ngAfterContentInit!');
  console.log('paragraph: ' + this.paragraph.nativeElement.textContent);
}
```

```angular2html
<p #contentParagraph>
  <strong *ngIf="serverElement.type === 'server'" style="color: red">{{ serverElement.content }}</strong>
  <em *ngIf="serverElement.type === 'blueprint'">{{ serverElement.content }}</em>
</p>
```

