import { Component, EventEmitter, Output } from '@angular/core';
import {LoggingService} from '../logging/logging.service';
import {AccountsService} from "../accounts/accounts.service";

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css'],
})
export class NewAccountComponent {

  constructor(private accountsService: AccountsService){
    this.accountsService.statusUpdate.subscribe(
      (status: string) => alert('New Status: ' + status)
    );
  }

  onCreateAccount(accountName: string, accountStatus: string) {
    this.accountsService.addAccount(accountName, accountStatus);
  }
}
