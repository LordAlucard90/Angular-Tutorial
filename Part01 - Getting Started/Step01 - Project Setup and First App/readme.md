# Step 01 - Project Setup and First App

## node.js And npm Installation
https://github.com/nodesource/distributions/blob/master/README.md

## Angular Installation
```bash
$ sudo npm install -g @angular/cli@latest
```
## Create First App
```bash
$ ng new first-angular-app
```
Responses: no and css (the defaults)

## Start Development Server
```bash
$ cd first-angular-app
$ ng serve
```
The default address is: http://localhost:4200/

## Updating Project

```bash
$ cd angular-app-to-import
$ npm update
```

## Importing Project

```bash
$ cd angular-app-to-import
$ npm install --save-dev @angular-devkit/build-angular
$ ng lint
```

## Finding And Removing Vulnerabilities

```bash
$ cd angular-app
$ npm audit         # search for issues
$ npm audit fix     # remove issues
```
