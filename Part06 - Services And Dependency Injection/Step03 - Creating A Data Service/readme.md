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

