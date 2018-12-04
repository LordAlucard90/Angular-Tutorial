# Step 02 - Components

Components are a key feature in Angular, the all application is composed by the composition of different components.

Each part of the main html page belong to a specific component, each component has his own business logic.

This partition makes possible reuse, change and extend the different components.

---

## Creation

The components are placed in a folder inserted in the application  folder to which it belongs.

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

Because of Angular doesn't scan all files the new component must be registered in the **app.module.ts**.

```typescript
import {ServerComponent} from "./server/server.component";

@NgModule({
  declarations: [
    AppComponent,
    ServerComponent
  ],
  ...
```
---

## Call component selector

Since the component is not the bootstrap component the selector **<app-server></app-server>** could only be called from the **app.component.html** file.

---

## Alternative creation method

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

From the **servers.component.html** can be called any other component in the app folder like **ServerComponent**:
```html
<app-server></app-server>
<app-server></app-server>
```
