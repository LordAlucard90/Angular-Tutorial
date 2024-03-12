import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data, Params, Router} from '@angular/router';
import {Server} from '../server';

import {ServersService} from '../servers.service';

@Component({
    selector: 'app-server',
    templateUrl: './server.component.html',
    styleUrls: ['./server.component.css'],
})
export class ServerComponent implements OnInit {
    server: Server = {} as Server;

    constructor(
        // private serversService: ServersService,
        private activateRoute: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit() {
        // this.server = this.serversService.getServer(1);
        // this.server = this.serversService.getServer(Number(this.activateRoute.snapshot.params['id']));
        // this.activateRoute.params.subscribe(
        //   (params: Params) => {
        //     this.server = this.serversService.getServer(Number(params['id']));
        //   }
        // );
        this.server = this.activateRoute.snapshot.data['server'];
        this.activateRoute.data.subscribe((data: Data) => {
            this.server = data['server'];
        });
    }

    onEdit() {
        this.router.navigate(['edit'], {
            relativeTo: this.activateRoute,
            queryParamsHandling: 'preserve',
        });
    }
}
