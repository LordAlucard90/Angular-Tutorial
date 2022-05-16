import {Component, OnInit} from '@angular/core';
import {Account, AccountsService} from './accounts/accounts.service';

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
