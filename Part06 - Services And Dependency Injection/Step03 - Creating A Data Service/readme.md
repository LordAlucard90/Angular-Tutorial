# Step 03 - Creating A Data Service

## AccountsService

All the accounts info can be placed into the account service:

```typescript
export class AccountsService {
  accounts = [
    {
      name: 'Master Account',
      status: 'active'
    },
    {
      name: 'Testaccount',
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
  ...,
  providers: [LoggingService, AccountsService]
})
export class AppComponent implements OnInit{
  accounts: {name: string, status: string}[] = [];

  constructor(private accountsService: AccountsService){}

  ngOnInit(): void {
    this.accounts = this.accountsService.accounts;
  }
}
```

The **AccountComponent** and **NewAccountComponent** do not emit anymore values, instead they call the new **AccountsService** methods:

```typescript
@Component({
  ...,
  providers: [LoggingService, AccountsService]
})
export class AccountComponent {
  ...
  // @Output() statusChanged = new EventEmitter<{id: number, newStatus: string}>();

  constructor(private loggingService: LoggingService,
              private accountsService: AccountsService) {}

  onSetTo(status: string) {
    // this.statusChanged.emit({id: this.id, newStatus: status});
    this.accountsService.updateStatus(this.id, status);
    ...
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
---

## Understanding Hierarchical Injector

The Angular dependencies injectors is a Hierarchical Injector so it knows hot to create a instance of a service for a component and all its child components.

More specifically they all will receive the same instance of the service.

Injection Levels:

- **AppModule Level** - in this case the service is available to all components and services.
- **AppComponent Level** - in this case the service is available to all components only.
- **Any Other Component Level** - in this case the service is available to the component and all its child components.

When a service is declared on a bottom level it override the any upper declarations.

---

## Fixing AccountsService Override

Because a service declared in **AppComponent** is overridden by the same service declared in any other component and the **AccountsService** must be shared among all components of the app, the service must be removed from components' providers declaration except **AppComponent**:

```typescript
@Component({
  ...,
  providers: [LoggingService, AccountsService]
})
export class AppComponent implements OnInit{
  ...
  accounts: {name: string, status: string}[] = [];
}
```

```typescript
@Component({
  ...,
  providers: [LoggingService]
})
export class AccountComponent {
  ...
}
```


```typescript
@Component({
  ...,
  providers: [LoggingService]
})
export class NewAccountComponent {
  ...
}
```

