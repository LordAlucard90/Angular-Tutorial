# Step 02 - HTTP Client

Since the start project is the final course project and there are many setting that I have not done jet, I will try to upgrade the previous step code.

It is possible find the documentation of the `HTTPClient` at https://angular.io/api?query=httpclient

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



