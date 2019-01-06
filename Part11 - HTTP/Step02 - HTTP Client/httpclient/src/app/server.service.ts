import { Injectable } from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

interface Server {
  name: string;
  capacity: number;
  id: number;
}

@Injectable()
export class ServerService {
  // basePath = 'https://project_name.firebaseio.com';
  basePath = 'https://angular-tutorial-17ca4.firebaseio.com/';

  constructor(private httpClient: HttpClient) {}

  storeServers(servers: any[]) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    // return this.httpClient.post(this.basePath + '/data.json',
    //   servers,
    //   {headers: headers});
    return this.httpClient.put(this.basePath + '/data.json',
      servers,
      {headers: headers});
  }

  getServers() {
    return this.httpClient.get<Server[]>(this.basePath + '/data.json')
    // return this.httpClient.get(this.basePath + '/data')
      .pipe(map(
        // (response: Response) => {
          // const data = servers.json();
          // for (const server of data) {
        (servers) => {
          for (const server of servers) {
            server.name = 'FETCHED_' + server.name;
          }
          return servers;
        }
      )).pipe(catchError(
        (error) => {
          console.log(error);
          return throwError('Something went wrong');
        }
      ));
    // return this.httpClient.get(
    //     this.basePath + '/data.json',
    //     {
    //       // observe: 'response',
    //       observe: 'body',
    //       responseType: 'json',
    //       // responseType: 'text',
    //       // responseType: 'arrayBuffer',
    //     }
    //   ).pipe(map(
    //     (response) => {
    //       console.log(response);
    //       return [];
    //     }));

  }

  getAppName() {
    return this.httpClient.get<string>(this.basePath + '/appName.json')
      .pipe(map(
        (appName) => {
          return appName;
        }
      ));
  }
}
