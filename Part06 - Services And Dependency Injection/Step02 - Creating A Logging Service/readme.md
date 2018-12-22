# Step 02 - Creating A Logging Service

## Create Services

Create a folder with the `service-name` in the app folder and create and a new file named  `directive-name.service.ts`:

```
app
└── service-name
    └── service-name.directive.ts
```

Unlike the **Components** and **Directives**, **Services** do not need a decorator.

```typescript
export class LoggingService {
  logStatusChange(status: string){
    console.log('A server status changed, new status: ' + status);
  }
}
```

Even if it is possible import the service and use it, it is the wrong way:

```typescript
...
import {LoggingService} from '../logging/logging.service';

...
export class NewAccountComponent {
  ...

  onCreateAccount(accountName: string, accountStatus: string) {
    ...
    // WRONG WAY
    const service = new LoggingService();
    service.logStatusChange(accountStatus);
    // console.log('A server status changed, new status: ' + accountStatus);
  }
}
```

---

## Hierarchical Injector

The dependencies injector is a tool that inject the dependencies of a class into a component.

The correct way to inject a service is:

```typescript
...
import {LoggingService} from '../logging/logging.service';

@Component({
  ...,
  providers: [LoggingService]
})
export class NewAccountComponent {
  ...
  
  constructor(private loggingService: LoggingService){}

  onCreateAccount(accountName: string, accountStatus: string) {
    ...
    this.loggingService.logStatusChange(accountStatus);
  }
}
```

`providers: [LoggingService]` tells Angular how to create LoggingService.

