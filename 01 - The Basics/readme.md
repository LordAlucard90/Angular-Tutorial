# The Basics

## Content

- [How An Angular App Gets Loaded And Started](#how-an-angular-app-gets-loaded-and-started)
- [Components](#components)
- [Data Binding](#data-binding)
- [Directives](#directives)

---

## How An Angular App Gets Loaded And Started

### index.html

The default html file served by angular is `src/`**index.html**.

In the body of the **index.html** there is the tag **<app-root></app-root>**,
this tag will be dynamically managed by the root component of the application.

The root component is stored in `src/app/` and is made up the ``app.component.*`` files.

### app.component.ts

The typescript part of the component contains the decorator **@Component**.

The property **selector** contains the name of the tag
that the component will replace.

### main.ts

`src/`**main.ts** is the first typescript file elaborate by the framework.

The first import checks the production or development state.
```typescript
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

if (environment.production) {
  enableProdMode();
}

```

In the second part the angular application is started by passing
a app module which refers to `./app/`**app.module**(.ts).

```typescript
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

### app.module.ts

The **bootstrap** field lists all the component needed by angular
for the correct analysis of the html file.

```typescript
bootstrap: [AppComponent]
```
Where **AppComponent** is the component **app.component.ts**  introduced above.

---

### Loading Process

1. Angular gets started **main.ts**.
2. In **main.ts** is bootstrap an Angular application, more specific **AppComponent**.
3. Angular analyzes **AppComponent** and reads the set up of **@Component** where is define **\<app-root\>** selector.
4. Angular can now handle **index.html** and the selector **\<app-root\>** and replace it with the html code of the **AppComponent**.


## Components

Components are a key feature in Angular,
the whole application is build up by the composition of different components.

Each part of the main html page belong to a specific component,
each component has his own business logic.

This partition makes possible reuse,
change and extend the different components.

### Creation

The components are placed in a folder inserted in the application
folder to which it belongs.

```
app
└── server
    ├── server.component.html
    └── server.component.ts
```

A component is basically a TypeScript class with the decorator `@Component`.

```typescript
import {Component} from "@angular/core";

@Component({
  selector: "app-server",
  templateUrl: "./server.component.html"
})

export class ServerComponent {

}
```

Because of Angular doesn't scan all files,
the new component must be registered in the **app.module.ts**.

```typescript
import {ServerComponent} from "./server/server.component";

@NgModule({
  declarations: [
    AppComponent,
    ServerComponent
  ],
  ...
```

### Call Component Selector

Since the component is not the bootstrap component the selector
**<app-server></app-server>** could only be called from the **app.component.html** file.

### Alternative Creation Method

While `ng serve` is running in another terminal could be userd the command:

```bash
$ ng generate component servers
// or 
$ ng g c servers
```

In this case the `CLI` should automatically add the file import **app.modules.ts**.

File created:
- **servers.component.css** - style file.
- **servers.component.html** - html file.
- **servers.component.spec.ts** - testing file.
- **servers.component.ts** - typescript file.

```
app
└── servers
    ├── servers.component.css
    ├── servers.component.html
    ├── servers.component.spec.ts
    └── servers.component.ts

```

From the **servers.component.html** can be called any other component
in the app folder like **ServerComponent**:
```html
<app-server></app-server>
<app-server></app-server>
```

### Templates

Instead of refer to a template file is possible to write the `html`
content in the `TypeScript` file:

```typescript
//  templateUrl: './servers.component.html',
    template: '<app-server></app-server><app-server></app-server>',
```

With `"` or `'` is important to write the string inline because
multi-line content is not supported,
instead with ` \' ` could be used multi-line content.

This strategy could be used if the html size is very short.

### Style

In **app.component.css** the style for the app could be defined. 

Unlike the template file for the css could be linked multiple style files sheets,
as for the template, a file o inline/multi-line text could be used.
By the way in this case could be defined an array of styles.

```typescript
  // styleUrls: ['./app.component.css'],
  styles: [`
    h3 {
      color: dodgerblue;
    }
  `]})
```

### Selector

The selector must be unique and works in a similar way to that of the css:

#### By Selector
```typescript
  selector: 'app-servers',
```
the selector can be called with:
```html
<app-servers></app-servers>
```

#### By Attribute
```typescript
  selector: '[app-servers]',
```
must be called with:
```html
<div app-servers></div>
```

#### By Class
```typescript
  selector: '.app-servers',
```
must be called with:
```html
<div class="app-servers"></div>
```

## Data Binding

It is a method to allow the TypeScript Code (Business Logic)
to communicate with the Template (HTML).

There are some types of data binding:

- **Output Data**:
  - **String Interpolation** - `{{ data }}`
  - **Property Binding** - `[property]="data"`
- **React To (User) Events**:
  - **Event Binding** - `(event)="expression"`
- **Combination I/O**:
  - **Two-Way-Binding** - `[(ngModel)]="data`

### String Interpolation

For string interpolation is used the `{{ data }}` syntax.

Where data must be a string or everything could be converted to a string, like:

```typescript
serverID: number = 10;
serverStatus: string = 'offline';

getServerState(){
    return this.serverStatus;
}
```

Template code:

```html
<p> {{'Server'}} with ID {{serverID}} is {{getServerState()}}. </p>
```

### Property Binding

For property binding is used the `[property]="data"` syntax.

Property binding allows Angular to update the template
when a value from TypeScript change.

In this case after two seconds the **Add Server** button become enabled:
```typescript
export class ServersComponent implements OnInit {
  allowNewServers: boolean = false;

  constructor() {
    setTimeout(() => {
      this.allowNewServers = true;
    }, 2000);
  }
}
```

Template code:
```angular2html
<button 
    class="btn badge-primary"
    [disabled]="!allowNewServers"
    >
    Add Server
</button>
```

### String Interpolation vs Property Binding

**String Interpolation**: to print some text into a template.

**Property Binding**: to change some property into a template,
a directive or a component.

It is not possible to mix them.

### Event Binding

Event binding allows to call a method on a specific property or event of a element.

```angular2html
<button
  class="btn badge-primary"
  [disabled]="!allowNewServers"
  (click)="onCreateServer()">
  Add Server
</button>
<p>{{serverCreationStatus}}</p>
```

```typescript
export class ServersComponent implements OnInit {
  ...
  serverCreationStatus: string = 'No server was created!';
  onCreateServer(){
    this.serverCreationStatus = 'Server was created!';
  }
}
```

Is possible catch the event variable connected to a specific event
by passing it to the method with `$event`.
```angular2html
<input
  type="text"
  class="form-control"
  (input)="onUpdateServerName($event)">
<p>{{serverName}}</p>
```

In TypeScript is possible to log it in the console to see the content and take data from it.
```typescript
private serverName: string = '';

onUpdateServerName(event: Event) {
console.log(event);
this.serverName = (<HTMLInputElement>event.target).value;
}
```

### Two-Way-Binding

Two-Way-Binding need the `ngModel` directive in the **app.module**:
```typescript
import {FormsModule} from "@angular/forms";

@NgModule({
  ...
  imports: [
    BrowserModule,
    FormsModule
  ],
  ...
})
```

The `ngModule` works bidirectionally so, if **serverName** has a default value,
that text will become the `<input>` default value. 
This do not append with Event Binding.

```angular2html
<input
  type="text"
  class="form-control"
  [(ngModel)]="serverName">
```

### Events and Properties

It is possible have a list of properties and events of a element
with a `console.log` or searching it on google. 

## Directives

Directives are instructions in the DOM, there are two type of directives:
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
  // ...
}
```

### ngIF

The ng structural directives need the `*` to be recognised.

The `*ngIf="serverCreated"` inserts or removes the element depending
if the value or the function into the `"..."` is true or false.

It is possible to display an else condition in this way:
```angular2html
<p *ngIf="serverCreated; else noServer">
    Server was created, server name is {{serverName}}
</p>
<ng-template #noServer>
  <p>No server was created!</p>
</ng-template>
```

### ngStyle

Since `ngStyle` modifies a property of an html tag like`Property Binding`,
it is used the same syntax: `[ngStyle]="new_style"`. 

```angular2html
<p [ngStyle]="{backgroundColor: getColor()}">
  {{'Server'}} with ID {{serverID}} is {{getServerState()}}.
</p>
```
In this case `ngStyle` change dynamically the attribute of the css property
according to the return value of the function.
```typescript
getColor() {
  return this.serverStatus === 'online' ? 'green' : 'red';
}
```

### ngClass Directive

Like `ngStyle`, `ngClass` uses the `Property Binding` syntax.

```angular2html
<p
  [ngStyle]="{backgroundColor: getColor()}"
  [ngClass]="{online: serverStatus === 'online'}">
  {{'Server'}} with ID {{serverID}} is {{getServerState()}}.
</p>

```
In this case `ngClass` add the specific class if the statement is true,
and it removes it when it becomes false.
```typescript
@Component({
  // ...
  styles: ['.online {color: white}',],
})
```

### ngFor Directive

The `ngFor` directive is a structural directive that add all the elements of a list.

```angular2html
<app-server *ngFor="let server of servers"></app-server>
```

```typescript
export class ServersComponent implements OnInit {
  servers = ['TestServer', 'TestServer 2'];
  // ...
  onCreateServer(){
    this.serverCreated = true;
    this.servers.push(this.serverName);
    this.serverCreationStatus = 'Server was created! Name is ' + this.serverName;
  }
  ...
}
```

