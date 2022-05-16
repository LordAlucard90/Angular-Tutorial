import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Account, AccountsService } from '../accounts/accounts.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css'],
})
export class AccountComponent {
    @Input() account: Account = {} as Account;
    @Input() id: number = 0;

    constructor(private accountsService: AccountsService) { }

    onSetTo(status: string) {
        this.accountsService.updateStatus(this.id, status);
        this.accountsService.statusUpdate.emit(status);
    }
}
