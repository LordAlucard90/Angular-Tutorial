import { LoggingService } from '../logging/logging.service';
import { EventEmitter, Injectable } from '@angular/core';

export interface Account {
    name: string;
    status: string;
}

@Injectable()
export class AccountsService {
    accounts: Account[] = [
        {
            name: 'Master Account',
            status: 'active',
        },
        {
            name: 'Test Account',
            status: 'inactive',
        },
        {
            name: 'Hidden Account',
            status: 'unknown',
        },
    ];

    statusUpdate = new EventEmitter<string>();

    constructor(private loggingService: LoggingService) { }

    addAccount(name: string, status: string) {
        this.accounts.push({ name: name, status: status });
        this.loggingService.logStatusChange(status);
    }

    updateStatus(id: number, status: string) {
        this.accounts[id].status = status;
        this.loggingService.logStatusChange(status);
    }
}
