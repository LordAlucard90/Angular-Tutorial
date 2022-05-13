# Getting Started

## Content

- [Project Setup and First App](#project-setup-and-first-app)
- [Editing The First App](#editing-the-first-app)
- [A Basic Project Setup Using Bootstrap For Styling](#a-basic-project-setup-using-bootstrap-for-styling)

---

## Project Setup and First App

[node.js And npm Installation](https://github.com/nodesource/distributions/blob/master/README.md)

### Angular Installation
```bash
sudo npm install -g @angular/cli@latest
```
### Create First App
```bash
ng new first-angular-app
```
Responses: no and css (the defaults)

### Start Development Server
```bash
cd first-angular-app
ng serve
```
The default address is: http://localhost:4200/

### Updating Project

```bash
cd angular-app-to-import
ng update
npm update
```

### Importing Project

```bash
cd angular-app-to-import
npm install --save-dev @angular-devkit/build-angular
ng lint
```

### Finding And Removing Vulnerabilities

```bash
cd angular-app
npm audit         # search for issues
npm audit fix     # remove issues
```

## Editing the First App

### Components

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

### The Server

While the development server, started with the `ng serve` command, is running, changes in files are immediately reflected in the web page.

### Directives

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

### Modules
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

### Issues

I noticed that in the input I did not have the value of **name** in the input, instead in the video there was.

Looking at the code I had `:` (written with autocompletion..) instead of `=` so the variables was created and the live update worked but the default value was not assigned.
```typescript
name: 'LordAlucard90'; // Wrong
name = 'LordAlucard90'; // correct
```

Explanation: after the value name it wants the type and then the default value:
```typescript
name: string = 'LordAlucard90';
```

## A Basic Project Setup using Bootstrap for Styling

### Getting Bootstrap
```bash
npm i bootstrap@5
```
This is a local installation of bootstrap in `node_modules` folder, is useful for offline work.

### Load Bootstrap
In `src/`**angular.json** are stored configurations, **styles** store the base css styles shared by all the components of the application. The bottom rules override the upper ones.

```json
"projects": {
  "my-first-app": {
    ...
    "architect": {
      "build": {
        ...
        "options": {
          ...
          "styles": [
            "node_modules/bootstrap/dist/css/bootstrap.min.css",
            "src/styles.css"
          ],
```

