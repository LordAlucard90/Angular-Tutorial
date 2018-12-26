import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import { ServersService } from '../servers.service';
import {toNumbers} from "@angular/compiler-cli/src/diagnostics/typescript_version";

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css']
})
export class ServerComponent implements OnInit {
  server: {id: number, name: string, status: string};

  constructor(private serversService: ServersService,
              private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    // this.server = this.serversService.getServer(1);
    this.server = this.serversService.getServer(Number(this.activateRoute.snapshot.params['id']));
    this.activateRoute.params.subscribe(
      (params: Params) => {
        this.server = this.serversService.getServer(Number(params['id']));
      }
    );
  }

}
