# Step 02 - Editing the First App

## Components

In `scr/app` are situated the component used by the application, **app.component.** is one of this component.

Each component has :
- **always**:
    - **html** - which contains the html code.
    - **ts** - a typescript file who defines the component who will be converted to standard JavaScript.
- **sometimes**
    - **css** - which contains the style part.

The `.ts` part of the component contains some information like the component definition and variables  like **title** which is use in the `.html` part  through `{{title}}`.

The `@Component` annotation contains some important information:
- **templateUrl** - the name of the file that stores the html part.
- **styleUrls** - the name of the file that stores the style part.
- **selector** - the html tag which will be dynamically replaced by the component.

---

## The server

While the development server, started with the `ng serve` command, is running, changes in files are immediately reflected in the web page.

---

## Directives

The first directive is **ngModel**, the directive is case sensitive and must be sounded by `[(<directive>)]`.

```angular2html
<h1>Welcome {{ name }} to {{ title }}</h1>
<input type="text" [(ngModel)]="name">
```
The directive is associated to a value of the model, every value of the input will be stored into the value associated.

```typescript
export class AppComponent {
  title = 'My First Angular App';
  name = 'LordAlucard90';
}
```

---

## Modules
**app.module.ts** contains the modules who belongs to the app, to use **ngModel** is needed add it to the app.

```typescript
@NgModule({
  ...
  imports: [
    BrowserModule,
    FormsModule
  ],
  ...
})
```
**FormModule** contains the features needed to store the input to the model value.

---

## Issues

I noticed that in the input I did not have the value of **name** in the input, instead in the video there was.

Looking at the code I had `:` (written with autocompletion..) instead of `=` so the variables was created and the live update worked but the default value was not assigned.
```typescript
name: 'LordAlucard90'; // Wrong
name = 'LordAlucard90'; // correct
```
