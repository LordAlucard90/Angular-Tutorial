# Step 02 - HTTP Client

Since the start project is the final course project and there are many setting that I have not done jet, I will try to upgrade the previous step code.

It is possible find the documentation of the `HTTPClient` at https://angular.io/api?query=httpclient or https://angular.io/guide/http

---

## Importing HTTPClient

The `HTTPClient` must be imported into **app.module.ts**

```typescript
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  ...,
  imports: [
    ...,
    HttpClientModule
  ],
  ...
})
export class AppModule { }
```

The service can be imported in this way:

```typescript
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ServerService {
  constructor(private httpClient: HttpClient) {}
  ...
}
```

#### Headers

The `Headers` class is replaced by `HttpHeaders`:

```typescript
import {HttpHeaders} from '@angular/common/http';
...
const headers = new HttpHeaders({'Content-Type': 'application/json'});
```

#### Requests

`HttpClient` exposes the same request of `HttpModule` for **post** and **put**

```typescript
this.httpClient.post(url, data, options);
this.httpClient.put(url, data, options);
```
For **get** it automatically assumes to receive json data, it is also possible to specify the object type:

```typescript
interface Server {
  name: string;
  capacity: number;
  id: number;
}
return this.httpClient.get<Server[]>('https://project_name.firebaseio.com//data.json')
  .pipe(map((servers) => {
      return servers;
  }));

// or 

return this.httpClient.get<string>(this.basePath + '/appName.json')
  .pipe(map(
    (appName) => {
      return appName;
    }
  ));
```

---

## Changing Response Type

It is possible to change the part of the response received and how it is parse:

```typescript
return this.httpClient.get(
    'https://project_name.firebaseio.com//data.json',
    {
      observe: 'response',
      responseType: 'text'
    }
    )
  .pipe(map((servers) => {
      return servers;
  }));

```
`observe` change the part of the response retrieved.

`responseType` the way the body is parsed.

#### Options List

- **observe**
  - **body**: returns only the body, is the default option.
  - **response**: returns the full response.
- **responseType** sets the response type
  - **json**: is the default option, on `get<..>` is needed to define the kind of data.
  - **text**
  - **arrayBuffer**

---

## Response Events

It is possible to return a event from the request:

```typescript
export class ServerService {
  ...  
  storeServers(servers: any[]) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.put(this.basePath + '/data.json',
      servers,
      { observe: 'events'}
    );
  }
  ...
}
```

During the request there are different events that can be used to give feedback to the user:

```typescript
import {HttpEvent, HttpEventType} from '@angular/common/http';

@Component({...})
export class AppComponent {
  onSave() {
    this.serverService.storeServers(this.servers)
      .subscribe(
        (response: HttpEvent<Object>) => {
          console.log(response.type === HttpEventType.Sent);
          console.log(response.type === HttpEventType.Response);
          console.log(response);
        },
        (error) => console.log(error)
      );
  }
}
```

Some `HttpEventType` are: Sent, Response, DownloadProgress, UploadProgress, User.

---

## Headers

The new `HttpHeaders` introduces methods to modify the header more simply:

```typescript
import {HttpHeaders} from '@angular/common/http';
...
new HttpHeaders().set('Content-Type', 'application/json');
```
Some methods are: set, append, delete, get, getAll, has, keys.

---

## Query Params

Is is possible to set query parameters in the url with the `params` option:

```typescript
import {..., HttpParams} from '@angular/common/http';

...
export class ServerService {
  ...

  storeServers(servers: any[]) {
    return this.httpClient.put(this.basePath + '/data.json',
      servers,
      {
        ...,
        params: new HttpParams().set('q', 'something')
      });
  }
  ...
}
```

The http request uri will be: `this.basePath + '/data?q=something`.

As `HttpHeaders`, `HttpParams` has a list of methods that can be user to set the value.

Some methods are: set, append, delete, get, getAll, has, keys, toString.

---

## Showing Progress

It is possible receive progress information about upload or download creating a request object:

```typescript
import {..., HttpRequest} from '@angular/common/http';

...
export class ServerService {
  ...

  storeServers(servers: any[]) {
    const req = new HttpRequest(
      'PUT',                         // method
      this.basePath + '/data.json',  // url
      servers,                       // data
      {reportProgress: true}         // options
    );
    return this.httpClient.request(req);
  }
    ...
}
```

`reportProgress: true` specifies that the progress information are needed.

During the process `DownloadProgress` and `UploadProgress` http events are generated.

These events have `loaded` and `total` values that can be used to calculate the completion percentage.

---

## Interceptors

It is possible to create `Interceptors` that can interrupt or modify a request at runtime avoiding, for example, code duplication.

#### Creation

`Interceptors` are stored in a **`interceptors_name`.interceptor.ts**:

```typescript
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

export class ContentInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Intercepted: ', req);
    return next.handle(req); // this let the request continue its journey
  }
}
```

`req` is the current request.

`next` provides the method to let the request continue its journey.

`Observable<HttpEvent<any>>` the observable are used by Angular to wrap HttpRequest that can be of any type.


The `Interceptors` have to be provided in **app.module.ts**:

```typescript
import {..., HTTP_INTERCEPTORS} from '@angular/common/http';

import {ContentInterceptor} from './content.interceptor';

@NgModule({
  ...,
  providers: [
      ..., 
      {
          provide: HTTP_INTERCEPTORS, 
          useClass: ContentInterceptor, 
          multi: true
      }
  ],
  ...
})
export class AppModule { }
```
`provide: HTTP_INTERCEPTORS, ` specifies the provider type.

`useClass` specify the classes associated.

`multi: true` specifies that cam be multiple interceptors.

If there are multiple interceptors, they are executed on a request in the order in which they are declared.

#### Modifying Requests

By default the requests are immutable for security reasons.

To modify a request it is necessary pass the new option data into the clone object:

```typescript
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

export class ContentInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Intercepted: ', req);
    const copiedReq = req.clone({
      headers: req.headers.append('Content-Type', 'application/json')
    });
    console.log('Modified: ', copiedReq);
    return next.handle(copiedReq); // this let the request continue its journey
  }
}
```

It is also possible to inject services in order to retrieve connection data used in the request.

#### Modifying Responses

The `tap` operation allows to intercept the observable and modify it without consuming it:

```typescript
import {Observable} from 'rxjs';
import {tap} from "rxjs/operators";

export class ContentInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    ...
    return next.handle(copiedReq)
      .pipe(tap(
        event => {
          console.log('Tap: ', event);
        }
      )); // this let the request continue its journey
  }
}
```

