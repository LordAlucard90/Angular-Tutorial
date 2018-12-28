import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ServersService} from './servers.service';

interface Server {
  id: number;
  name: string;
  status: string;
}

@Injectable()
export class ServerResolverService implements Resolve<Server> {
  constructor(private serverService: ServersService) {}

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<Server> | Promise<Server> | Server {
    return this.serverService.getServer(Number(route.params['id']));
  }

}
