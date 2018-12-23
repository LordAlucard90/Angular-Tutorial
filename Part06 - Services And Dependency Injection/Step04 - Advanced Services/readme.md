# Step 04 - Advanced Services

## Injecting Services into Services

The service declaration at **AppMolule** level is:

```typescript
import {AccountsService} from './accounts/accounts.service';
import {LoggingService} from './logging/logging.service';

@NgModule({
  ...,
  providers: [AccountsService, LoggingService],
  ...
})
export class AppModule { }
```

The components can be rewrite:



```typescript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  accounts: {name: string, status: string}[] = [];

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
  @Input() account: {name: string, status: string};
  @Input() id: number;

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

The **LoggingService** can be injected into the **AccountsService** in thi ìs way:

```typescript
import {LoggingService} from '../logging/logging.service';
import {Injectable} from '@angular/core';

@Injectable()
export class AccountsService {
  accounts = [...];

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

`@Injectable` tell Angular that the service is injectable / something can be injected in there.



