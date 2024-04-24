## Content

- [Intro](#intro)
- [Installation](#installation)
- [Configuration](#configuration)
- [Server](#server)
- [Deploy](#deploy)

---

## Intro

By default an app build by Angular does all the rendering working on the client
side. This can give some disadvantages, like:
- no or bad SEO, because web crawlers just see an empty page
- slow page load, especially in case of bad internet connection

Note: the slow network connection can be simulated in the performance tab of the
developers' tool.

Angular Server Side Rendering (before called Angular Universal) will be still
present the client side rendering, when the app is completely downloaded from
the server, but a initial page will be pre-rendered by the server and served
to the user.

## Installation

From Angular 17 it is possible to add server side rendering to the project 
by running

```bash
ng add @angular/ssr
```

It is possible to directly create a project with this functionality using

```bash
ng new >project-name> --ssr
```

### Older Versions

Before Angular 17, it is possible to add the same capability to the project by
running

```bash
ng add @nguniversal/express-engine
```

## Configuration

In order to correctly run the server-side rendering, it must be enabled in 
the `AppRoutingModule` in this way

```typescript
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: "enabledBlocking"
  })],
  // ...
})
export class AppRoutingModule {}
```

Further other automatic configuration are performed, like creating and
exporting in the `main.ts` the `AppServerModule`

```typescript
@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
```

And other configurations files are added like `server.ts`, `tsconfig.server.json`
or changed like `angular.json`.


## Server

The `server.ts` file contains the server side code, based on `express.js`,
that can be run using Node and performs the server side rendering.

The server can be run using the extra scripts created in the `package.json`

```json
{
  "...": "...",
  "scripts": {
    "...": "...",
    "dev:ssr": "ng run ssr:serve-ssr",
    "serve:ssr": "node dist/ssr/server/main.js",
    "build:ssr": "ng build && ng run ssr:server",
    "prerender": "ng run ssr:prerender"
  },
  "...": "...",
}
```

The command for local developing is

```bash
npm run dev:ssr
```

Now the first page downloaded is not anymore empty but has the content of the 
home page. This means that it is needed less time to load the page the first 
time and that a web-crawler will not have an empty page to analyze.

Important to note, is that not only them main page is pre-rendered but also
the other pages of the application.

### Back-end capabilities

Express can not only be used to pre-rendered Angular but also to offer server
functionality and transform the client-side project in a full-stack one.

```typescript
// Example Express Rest API endpoints
server.get('/api/**', (req, res) => { });
```

To use this capabilities it is important to do not make the back-end routes 
to clash with front-end ones.


## Deploy

The deploy changes because the host must also support the server side code
execution and not only anymore just serving static files.


The first step for the deployment is

```bash
npm run build:ssr
```

This will create a `dist` folder that must be uploaded to the hosting service
in conjunction with the `package.json` and `angular.json` files.

After that it is necessary to install of the dependencies

```bash
npm install
```

Finally it is possible to serve the application using

```bash
npm run serve:ssr
```

