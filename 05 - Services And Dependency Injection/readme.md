# Services And Dependency Injection

## Content

- [Intro](#intro)
- [Creating A Logging Service](#creating-a-logging-service)
- [Creating A Data Service](#creating-a-data-service)
- [Advanced Services](#advanced-services)

---

## Intro

A service is used to centralize behaviours,
is used to avoid code duplication or to manage the data storing.


### Version Notes

**HttpModule** is deprecated and no longer required

## Creating A Logging Service

### Create Services

Create a folder with the `service-name` in the app folder 
and create and a new file named  `service-name.service.ts`:

```
app
└── service-name
    └── service-name.directive.ts
```

Unlike the **Components** and **Directives**, **Services** do not need a decorator:

```typescript
export class LoggingService {
  logStatusChange(status: string){
    console.log('A server status changed, new status: ' + status);
  }
}
```

Even if it is possible import the service and use it, this is the **wrong** way:

```typescript
...
import {LoggingService} from '../logging/logging.service';

// ...
export class NewAccountComponent {
  // ...

  onCreateAccount(accountName: string, accountStatus: string) {
    // ...
    // WRONG WAY
    const service = new LoggingService();
    service.logStatusChange(accountStatus);
    // console.log('A server status changed, new status: ' + accountStatus);
  }
}
```

### Hierarchical Injector

The dependencies injector is a tool that inject the dependencies of a class into a component.

The **correct** way to inject a service is:

```typescript
...
import {LoggingService} from '../logging/logging.service';

@Component({
  ...,
  providers: [LoggingService]
})
export class NewAccountComponent {
  // ...
  
  constructor(private loggingService: LoggingService){}

  onCreateAccount(accountName: string, accountStatus: string) {
    // ...
    this.loggingService.logStatusChange(accountStatus);
  }
}
```

`providers: [LoggingService]` tells Angular how to create LoggingService.

## Creating A Data Service

### AccountsService

All the accounts info can be placed into the account service:

```typescript
export interface Account {
    name: string;
    status: string;
}

export class AccountsService {
  accounts: Account[] = [
    {
      name: 'Master Account',
      status: 'active'
    },
    {
      name: 'Test Account',
      status: 'inactive'
    },
    {
      name: 'Hidden Account',
      status: 'unknown'
    }
  ];

  addAccount(name: string, status: string){
    this.accounts.push({name: name, status: status});
  }

  updateStatus(id: number, status: string){
    this.accounts[id].status = status;
  }
}
```

The **AppComponent** needs to get the accounts from the **AccountsService**:

```typescript
@Component({
  // ...,
  providers: [LoggingService, AccountsService]
})
export class AppComponent implements OnInit{
  accounts: Account[] = [];

  constructor(private accountsService: AccountsService){}

  ngOnInit(): void {
    this.accounts = this.accountsService.accounts;
  }
}
```

The **AccountComponent** and **NewAccountComponent** do not emit anymore values,
instead they call the new **AccountsService** methods:

```typescript
@Component({
  // ...,
  providers: [LoggingService, AccountsService]
})
export class AccountComponent {
  // ...
  // @Output() statusChanged = new EventEmitter<{id: number, newStatus: string}>();

  constructor(private loggingService: LoggingService,
              private accountsService: AccountsService) {}

  onSetTo(status: string) {
    // this.statusChanged.emit({id: this.id, newStatus: status});
    this.accountsService.updateStatus(this.id, status);
    // ...
  }
}
```


```typescript
@Component({
  ...,
  providers: [LoggingService, AccountsService]
})
export class NewAccountComponent {
  // @Output() accountAdded = new EventEmitter<{name: string, status: string}>();

  constructor(private loggingService: LoggingService,
              private accountsService: AccountsService){}

  onCreateAccount(accountName: string, accountStatus: string) {
    // this.accountAdded.emit({
    //   name: accountName,
    //   status: accountStatus
    // });
    this.accountsService.addAccount(accountName, accountStatus);
    ...
  }
}
```

### Understanding Hierarchical Injector

The Angular dependencies injectors is a Hierarchical Injector,
it knows how to create a instance of a service for a component
and all its child components.\
More specifically they all will receive the same instance of the service.\
Injection Levels:
- **AppModule Level**\
in this case the service is available to all components and services.
- **AppComponent Level**\
in this case the service is available to all components only.
- **Any Other Component Level**\
in this case the service is available to the component and all its child components.

When a service is declared on a bottom level, it override the any upper declarations.

### Fixing AccountsService Override

Because a service declared in **AppComponent** is overridden by the same service
declared in any other component and the **AccountsService** must be shared among
all components of the app, the service must be removed
from components' providers declaration except **AppComponent**:

```typescript
@Component({
  // ...,
  providers: [LoggingService, AccountsService]
})
export class AppComponent implements OnInit{
  // ...
  accounts: {name: string, status: string}[] = [];
}
```

```typescript
@Component({
  // ...,
  providers: [LoggingService]
})
export class AccountComponent {
  ...
}
```


```typescript
@Component({
  // ...,
  providers: [LoggingService]
})
export class NewAccountComponent {
  // ...
}
```

## Advanced Services

### Injecting Services into Services

The service declaration at **AppModule** level is:

```typescript
import {AccountsService} from './accounts/accounts.service';
import {LoggingService} from './logging/logging.service';

@NgModule({
  // ...,
  providers: [AccountsService, LoggingService],
  // ...
})
export class AppModule { }
```

The components can be rewritten in this way:

```typescript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  accounts: Account[] = [];

  constructor(private accountsService: AccountsService){}

  ngOnInit(): void {
    this.accounts = this.accountsService.accounts;
  }
}
```

```typescript
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent {
  @Input() account: Account = {} as Account;
  @Input() id: number = 0;

  constructor(private accountsService: AccountsService) {}

  onSetTo(status: string) {
    this.accountsService.updateStatus(this.id, status);
  }
}
```
```typescript
@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css'],
})
export class NewAccountComponent {

  constructor(private accountsService: AccountsService){}

  onCreateAccount(accountName: string, accountStatus: string) {
    this.accountsService.addAccount(accountName, accountStatus);
  }
}
```

The **LoggingService** can be injected into the **AccountsService**:

```typescript
import {LoggingService} from '../logging/logging.service';
import {Injectable} from '@angular/core';

// ...

@Injectable()
export class AccountsService {
  accounts: Account[] = [/* ... */];

  constructor(private loggingService: LoggingService) {}

  addAccount(name: string, status: string) {
    this.accounts.push({name: name, status: status});
    this.loggingService.logStatusChange(status);
  }

  updateStatus(id: number, status: string) {
    this.accounts[id].status = status;
    this.loggingService.logStatusChange(status);
  }
}
```

`@Injectable` tell Angular that the service is injectable 
or that something can be injected in there.


These events are not longer required:

```angular2html
<app-new-account (accountAdded)="onAccountAdded($event)"></app-new-account>
<app-account
    // ...
    (statusChanged)="onStatusChanged($event)">
</app-account>

```

### Injectable Update

In the latest angular version it is possible to use:
```typescript
@Injectable({providedIn: 'root'})
export class AccountsService {
    // ...
}
```
instead of defining in the the app module:
```typescript
@NgModule({
  // ...,
  providers: [AccountsService, LoggingService],
  // ...
})
export class AppModule { }
```

### Cross-Component Communication

Is possible create an event emitter in the service 
and manage the data emitting and event subscribing in the other component:

```typescript

export class AccountsService {
  // ...

  statusUpdate = new EventEmitter<string>();
  
  // ...
}
```

```typescript
export class AccountComponent {
  // ...
  onSetTo(status: string) {
    // ...
    this.accountsService.statusUpdate.emit(status);
  }
}
```

```typescript
export class NewAccountComponent {
  constructor(private accountsService: AccountsService){
    this.accountsService.statusUpdate.subscribe(
      (status: string) => alert('New Status: ' + status)
    );
  }
  // ...
}
```

