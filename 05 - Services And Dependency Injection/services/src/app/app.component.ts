import {Component, OnInit, inject} from '@angular/core';
import {Account, AccountsService} from './accounts/accounts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  private accountsService: AccountsService;
  accounts: Account[] = [];

  // old syntax
  // constructor(private accountsService: AccountsService){}
  constructor(){
    this.accountsService = inject(AccountsService);
  }

  ngOnInit(): void {
    this.accounts = this.accountsService.accounts;
  }
}
