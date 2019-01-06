# Step 01 - HTTP Module

In the first step will be used the deprecated `HTTPModule`, the the current `HTTPClient` will be used.

Installing `HTTP Module`:

```bash
$ npm install --save @angular/http
```

Import:
```typescript
import { HttpModule } from '@angular/http';

@NgModule({
  ...,
  imports: [
    ...,
    HttpModule
  ],
  ...
})
export class AppModule { }
```

---

## Firebase

Google `Firebase` database creation:

- Go to https://console.firebase.google.com/ and log in with google account
- `Create New Project` 
- select `procject_name` 
- `Create Project`
- `Develop` > `Database`
- `Or Choose Realtime Database` > `Create Database`
- Set `Rules`:
  ```json
  {
    "rules": {
      ".read": true,
      ".write": true
    }
  }
  ```

The project will be available at https://`project_name`.firebaseio.com

---

## Creating Data

It is possible store data into `Firebase` in this way:

```typescript
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ServerService {
  constructor(private http: Http) {}

  storeServers(servers: any[]) {
    return this.http.post(
      'https://project_name.firebaseio.com/data.json',
      servers
    );
  }
}
```
`data.json` tell `Firebase` how and where store the data.

`this.http.post` returns an observable, it is necessary yo subscribe to it to send the request:

```typescript
export class AppComponent {
  ...
  
  constructor(private serverService: ServerService) {}
    
  ...
  
  onSave() {
    this.serverService.storeServers(this.servers)
      .subscribe(
        (response) => console.log(response),
        (error) => console.log(error)
      );
  }
}
```

It is not necessary unsubscribe to the observable because the it becomes `completed` after the server response.

---

## Adding Headers

it is possible add header information in this way:

```typescript
import { ..., Headers } from '@angular/http';

@Injectable()
export class ServerService {
  constructor(private http: Http) {}

  storeServers(servers: any[]) {
    return this.http.post(
      'https://project_name.firebaseio.com/data.json',  // url
      servers,                                          // data
      {headers: headers}                                // options
    );
  }
}
```

---

## Retrieving Data

It is possible retrieve data from the server in this way:

```typescript
import { ..., Response } from '@angular/http';

@Injectable()
export class ServerService {
  constructor(private http: Http) {}

  getServers() {
    return this.http.get('https://project_name.firebaseio.com/data.json')
      .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      ));
  }
}
```

`response.json` helps to parse the response body and transform it in a json object:

```typescript
@Component({...})
export class AppComponent {
  ...
  
  onGet() {
    this.serverService.getServers()
      .subscribe(
        (servers: any[]) => this.servers = servers,
        (error) => console.log(error)
      );
  }
}
```

---

## Overriding Data

It is possible override the data in `Firebase` with put:

```typescript
export class ServerService {
  constructor(private http: Http) {}

  storeServers(servers: any[]) {
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.put('https://project_name.firebaseio.com/data.json',
      servers,
      {headers: headers});
  }

  ...
}
```

---

## Catching Errors

It is possible generate an error in `Firebase` omitting the **.json**:

```typescript
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable()
export class ServerService {
  constructor(private http: Http) {}

  ...

  getServers() {
    // return this.http.get('https://project_name.firebaseio.com/data.json')
    return this.http.get('https://project_name.firebaseio.com/data')
      .pipe(map(
        ...
      )).pipe(catchError(
        (error: Response) => {
          console.log(error);
          return throwError('Something went wrong');
        }
      ));
  }
}
```


---

## Using Async Pipe

It is possible omit the subscription using the `async` pipe:

```typescript
export class ServerService {
  ...

  getAppName() {
    return this.http.get('https://project_name.firebaseio.com/appName.json')
      .pipe(map(
        (response: Response) => {
          return response.json();
        }
      ));
  }
}
```

```typescript
export class AppComponent {
  appName = this.serverService.getAppName();
    
  ...
}
```

```angular2html
<h1>App Name: {{ appName | async }}</h1>
```
