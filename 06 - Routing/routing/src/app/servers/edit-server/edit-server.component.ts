import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {ServersService} from '../servers.service';
import {CanComponentDeactivate} from '../../can.deactivate-guard.service';
import {Observable} from 'rxjs';
import {Server} from '../server';

@Component({
    selector: 'app-edit-server',
    templateUrl: './edit-server.component.html',
    styleUrls: ['./edit-server.component.css'],
})
export class EditServerComponent implements OnInit, CanComponentDeactivate {
    server: Server | undefined;
    serverName = '';
    serverStatus = '';
    allowEdit = false;
    changesSaved = false;

    constructor(
        private serversService: ServersService,
        private activeRoute: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit() {
        console.log(this.activeRoute.snapshot.queryParams);
        console.log(this.activeRoute.snapshot.fragment);
        this.activeRoute.queryParams.subscribe((params: Params) => {
            this.allowEdit = params['allowEdit'] === '1';
        });
        this.activeRoute.fragment.subscribe();
        this.server = this.serversService.getServer(Number(this.activeRoute.snapshot.params['id']));
        if (this.server) {
            this.serverStatus = this.server.status;
            this.serverName = this.server.name;
        }
    }

    onUpdateServer() {
        if (this.server) {
            this.serversService.updateServer(this.server.id, {
                name: this.serverName,
                status: this.serverStatus,
            });
            this.changesSaved = true;
            this.router.navigate(['../'], {relativeTo: this.activeRoute});
        }
    }

    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.allowEdit) {
            return true;
        }
        if (
            this.server &&
            (this.serverName !== this.server.name ||
                (this.serverStatus !== this.server.status && !this.changesSaved))
        ) {
            return confirm('Do you want to discard the changes?');
        } else {
            return true;
        }
    }
}
