# Offline Capabilities

## Content

- [Intro](#intro)
- [Service Workers](#service-workers)
- [Assets Cache](#assets-cache)
- [Data Cache](#data-cache)

---

## Intro

It is possible to simulate an Offline behaviour in the browser (Chrome)
opening the devtoos > Application > Service Workers and checking the 
offline checkbox.


## Service Workers

By default JavaScript is single thread, but it is possible to add an additional
service worker that runs also in a single thread but in another one in parallel.

A service worker can do asynchronous operations like receiving push notifications,
manage all the pages or listen to network requests and cache the responses
and return them in case there is no internet connection (if there is a cache available).

It is possible to add these functionalities by adding the `pwa` package:
```bash
ng add @angular/pwa@13 # needed because it was using the 14 by default
```

After the installation `manifest.webmanifest` is awailable in the project,
and also in the `AppModule` has been added a `ServiceWorker`:
```typescript
@NgModule({
    // ...
    imports: [
        // ...
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000',
        }),
    ],
    // ...
})
export class AppModule {}
```
the `ngsw-worker.js` file will be automatically generated during the build process.

Also other files has been changed a little bit to allow the new functionalities,
but now very important at the moment.

Now it is necessary to build the project:
```typescript
ng build --prod
```

To correctly serve it, it is necessary to install a JavaScript server 
and serve the `dist/` folder content:
```bash
npm i -g http-server
cd dist/offline/
http-server -p 8081
```
the application is now available at http://localhost:8081/.

This time it is possible to see a worker running in the dev tools console.
This time after set it as offline (i needed also `Update on reload`),
the reloading will make the page work as before because the network call are
managed by the worker.

## Assets Cache

In the `ngsw-config.json` is defined which static files should be cached and how:
```json
{
  "$schema": "./node_modules/@angular/service-worker/config/schema.json",
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": [
          "/favicon.ico",
          "/index.html",
          "/manifest.webmanifest",
          "/*.css",
          "/*.js"
        ]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": [
          "/assets/**",
          "/*.(svg|cur|jpg|jpeg|png|apng|webp|avif|gif|otf|ttf|woff|woff2)"
        ]
      }
    }
  ]
}
```
Install modes:
- **prefetch**: all the assets will be cached, even if now needed yet
- **lazy**: only the used assets will be fetched

Update modes:
- **prefetch**: update all the changed assets and cache the new version
- **lazy**: only update the assets when needed and cache the new version

### Cache URLs

It is possible to cache external data, like the fonts in this way:
```json
{
  // ...
  "assetGroups": [
    {
      // ...
      "resources": {
        "files": [
          // ...
        ],
        "urls": [
            "https://fonts.googleapis.com/css?family=Oswald:300,700"
        ]
      }
    },
    // ...
  ]
}
```

## Data Cache

In is not only possible to cache the assets but also the data.

It is possible to cache the data in this way:
```json
{
    // ...
    "assetGroups": [
        // ...
    ],
    "dataGroups": [
        {
            "name": "posts",
            "urls": ["https://jsonplaceholder.typicode.com/posts"],
            "cacheConfig": {
                "maxSize": 5,
                "maxAge": "6h",
                "timeout": "10s",
                "strategy": "freshness"
            }
        }
    ]
}
```
strategies: 
- **freshness**: try to get new data, if the timeout expired use the cached
- **performance**: use the cached until now too old

