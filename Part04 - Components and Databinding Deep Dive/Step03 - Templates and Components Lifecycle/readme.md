# Step 03 - Templates and Components Lifecycle

---

## Template Local References

It is possible to create local references inside a template, this references can used only in the template.

```angular2html
<input 
  type="text" 
  class="form-control" 
  #serverNameInput>
...
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

---

## @ViewChild

Another method to call a reference from a template to a component is `@ViewChild`.

```angular2html
<input
  type="text"
  class="form-control"
  #serverContentInput>
```

It is possible select the string that must be referentiated:

```typescript
@ViewChild('serverContentInput') serverContentInput;
```

It is also possible select a component to referentiate.

```typescript
@ViewChild('serverContentInput') serverContentInput: ElementRef;
...
onAddServer(nameInput: HTMLInputElement) {
  this.serverCreated.emit({
    serverName: nameInput.value,
    serverContent: this.serverContentInput.nativeElement.value
  });
}
```
In this case `serverContentInput` is a type `ElementRef

---

## ng-component

Everything placed between opening and closing tags of a component is lost by default.

With the `ng-content` directive placed into a child component:
```angular2html
<div class="panel-body">
  <ng-content></ng-content>
</div>
```

It is possible tell Angular to insert the content found on the parent component.

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

---

## Lifecycle

During the creation of a new component Angular goes for some different phases that can be intercepted to run some code:

- **ngOnChanges** - called on creation and after a bound input property changes.
- **ngOnInit** - called once the component in initialized, after the constructor.
- **ngDoCheck** - called during every change detection run.
- **ngAfterContentInit** - called after content (ng-content) has been projected into view.
- **ngAfterContentCheck** - called every time the projected content has been checked.
- **ngAfterViewInit** - called after the component's view (and child views) has been initialized.
- **ngAfterViewCheck** - called every time the view (and child views) have been checked.
- **ngOnDestroy** - called once the component is about to be destroyed.

All the method needs to implement the correspondent interface to work correctly.

#### ngOnChanges

To use `ngOnChanges` the class mus implement `OnChanges` interface:

```typescript
import {..., OnChanges, SimpleChanges} from '@angular/core';
...
export class ServerElementComponent implements OnInit, OnChanges {
  @Input('srvElement') element: {type: string, name: string, content: string};
  ...
  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges!');
    console.log(changes);
  }
  ...
}
```
`ngOnChanges` receives a input value with this information:
- **element** - the element of the component:
  - **currentValue** - the current value.
  - **firstChange** - is it has been changed before.
  - **previousValue** - the previous value of the element.
  
#### ngAfterViewInit

After `ngAfterViewInit` the access to the template elements starts.

```angular2html
<div class="panel-heading" #heading>{{ name }}</div>
```

```typescript
@ViewChild('heading') header: ElementRef;
...
ngAfterViewInit() {
  console.log('ngAfterViewInit!');
  console.log('header: ' + this.header.nativeElement.textContent);
}
```

#### ngAfterContentInit

After `ngAfterContentInit` the access to the parent template content starts.

```typescript
@ContentChild('contentParagraph') paragraph: ElementRef;
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
