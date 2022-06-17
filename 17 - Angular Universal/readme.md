# Angular Universal

## Content

- [Installation](#installation)
- [NestJS](#nestjs)

---

## Installation

Angular Universal purpose is to preload the content of the page on the server side,
this helps to improve the loading speed with low connection.

```bash
ng add @nguniversal/express-engine
```

Since now some code is run in the service, the auto login action must not be
dispatch if the code is render in the server:
```typescript
import { /* ... */ , Inject, PLATFORM_ID } from '@angular/core';
// ...
import { isPlatformBrowser } from '@angular/common';

@Component({
    // ...
})
export class AppComponent implements OnInit {
    // ...

    constructor(
        // ...
        @Inject(PLATFORM_ID) private platformId: any,
    ) { }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.store.dispatch(AuthActions.autoLogin());
        }
        // ...
    }
}
```

In the last versions it is all automatically setup and it is not needed anymore the
`ModuleMapLoader` module.

Now it is possible to compile the code on the serve side and run it with
these two commands:
```bash
// build
npm run build:ssr
// run
npm run serve:ssr
```

## NestJS

[NestJS](https://nestjs.com/) is a server side framework for node.

It is possible setup angular Universal but with NestJS application attached:
```bash
ng add @nestjs/ng-universal
```
In this way it is possible to create all the server side using this framework.

The consideration about the server side randaring must be applied also this time.

