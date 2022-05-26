import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit, OnDestroy {
    id: number = 0;
    userSubscription: Subscription | undefined;

    constructor(private route: ActivatedRoute, private userService: UserService) { }

    ngOnInit() {
        this.userSubscription = this.route.params.subscribe((params: Params) => {
            this.id = +params['id'];
        });
    }

    onActivate() {
        this.userService.userActivated.next(this.id);
    }

    ngOnDestroy() {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe()
        }
    }
}
