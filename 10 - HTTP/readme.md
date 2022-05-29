# Http

## Content

- [REST API](#rest-api)
- [Post Request](#post-request)
- [Get Request](#get-request)
- [Data Typification](#data-typification)
- [Loading Indicator](#loading-indicator)
- [Delete Request](#delete-request)
- [Request Header](#request-header)
- [Query Parameter](#query-parameter)
- [Dynamic Response](#dynamic-response)
- [Response Type](#response-type)
- [Interceptors](#interceptors)

---

## REST API

### Server

In the course is used [firebase](https://firebase.google.com/),
but I prefer something local like
[json-server](https://github.com/typicode/json-server):
```bash
npm install -g json-server

json-server --watch db.json
# server listening at http://localhost:3000
```
the content of `db.json` must be:
```json
{
  "posts": []
}
```

### Http Client

This is the [official documentation](https://angular.io/guide/http).

The angular dependency to enable http is `HttpClientModule`:
```typescript
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  // ...
  imports: [
    // ...
    HttpClientModule
  ],
  // ...
})
export class AppModule {}
```
To use it, it must be imported in the service where it is used:
```typescript
@Component({
    // ...
})
export class AppComponent implements OnInit {
    // ...

    constructor(private http: HttpClient) { }

    // ...
}
```

## Post Request

A post call can be done in this way:
```typescript
this.http
    .post( // method
        'http://localhost:3000/posts', // url
        postData // body autonatically concerted to json
    ).subscribe( // response
    responseData => {
        console.log(responseData);
    });
```
If the method is not subscribed, the http request will not be sent.

## Get Request

As for the post the response must be subscribed,
otherwise the request will not be set:
```typescript
this.http
    .get(this.postUrl)
    .subscribe(responseData =>{
        console.log(responseData);
    });
```

### Transform Input


If some transformations are requiered it is a good practice do it with 
intermetiare observable operations:
```typescript
this.http
    .get(this.postUrl)
    .pipe(map(data => {
        console.log(data)
        // do some operations here..
        return data;
    }))
    .subscribe(responseData =>{
        console.log(responseData);
    });
```

## Data Typification

It is possible to set the response type using the generic type feature:
```typescript
export interface Post {
    id?: number;
    title: string;
    content: string;
}

this.http
    .post<Post>(this.postUrl, postData)
    // ...
this.http
    .get<Post[]>(this.postUrl)
    // ...
```

## Loading Indicator

It is possible to setup a simple Loading feedback using:
```typescript
@Component({
    // ...
})
export class AppComponent implements OnInit {
    // ...
    isFetching = false;

    // ...

    fetchAllPosts() {
        this.isFetching = true;
        this.http
            .get<Post[]>(this.postUrl)
            // ...
            .subscribe((responseData: Post[]) => {
                this.isFetching = false;
                this.loadedPosts = responseData;
            });
    }
}
```
and:
```angular2html
<p *ngIf="loadedPosts.length === 0 && !isFetching">No posts available!</p>
<ul class="list-group" *ngIf="loadedPosts.length > 0 && !isFetching" >
  <li class="list-group-item" *ngFor="let post of loadedPosts;">
      <h3>{{post.title}}</h3>
      <p>{{post.content}}</p>
  </li>
</ul>
<p *ngIf="isFetching">Loading..</p>
```

## Adding A Service

It is possible to move the request logic to a sevice in this way:
```typescript
@Injectable({ providedIn: 'root' })
export class PostService {
    private postUrl = 'http://localhost:3000/posts';
    constructor(private http: HttpClient) { }

    // since the component is not interested in this data,
    // the subscribe is done inside the service
    createAndStorePost(title: string, content: string) {
        const postData = { title, content };
        this.http.post<Post>(this.postUrl, postData).subscribe(responseData => {
            console.log(responseData);
        });
    }

    // since the component is interested in this data,
    // an observable is returned
    fetchPosts() {
        return this.http.get<Post[]>(this.postUrl).pipe(
            map((data: Post[]): Post[] => {
                console.log(data);
                return data;
            }),
        );
    }
}
```
```typescript
@Component({
    // ...
})
export class AppComponent implements OnInit {
    loadedPosts: Post[] = [];
    isFetching = false;

    constructor(private postService: PostService) { }

    ngOnInit() {
        this.fetchAllPosts();
    }

    onCreatePost(postData: { title: string; content: string }) {
        this.postService.createAndStorePost(postData.title, postData.content);
    }

    onFetchPosts() {
        this.fetchAllPosts();
    }

    // ...

    fetchAllPosts() {
        this.isFetching = true;
        this.postService.fetchPosts()
            .subscribe((responseData: Post[]) => {
                // updating component's login here
                this.isFetching = false;
                this.loadedPosts = responseData;
            });
    }
}
```

## Delete Request

A simple delete request can be implemented in this way:
```typescript
@Injectable({ providedIn: 'root' })
export class PostService {
    // ...
    deletePost(id: number) {
        return this.http.delete(`${this.postUrl}/${id}`);
    }
}
```
and in the service:
```typescript
@Component({
    // ...
})
export class AppComponent implements OnInit {
    // ...

    onClearPosts() {
        // json-server can only delete one post at a time
        while (this.loadedPosts.length) {
            let cur = this.loadedPosts.pop();
            if (cur && cur.id) {
                this.postService.deletePost(cur.id).subscribe(() => {
                    console.log('Deleted post: ' + cur?.id);
                });
            }
        }
    }

    // ...
}
```

## Handling Errors

An easy way to hangle errors is:
```typescript
this.postService.fetchPosts().subscribe(
    (responseData: Post[]) => {
        // console.log(responseData);
        this.isFetching = false;
        this.loadedPosts = responseData;
    },
    error => {
        this.error = error.message;
    },
);
```
another way is to use a subject:
```typescript
@Injectable({ providedIn: 'root' })
export class PostService {
    // ..
    error = new Subject<string>();

    createAndStorePost(title: string, content: string) {
        const postData = { title, content };
        this.http.post<Post>(this.postUrl, postData).subscribe(
            responseData => {
                console.log(responseData);
            },
            error => {
                this.isFetching = false;
                this.error.next(error.message);
            },
        );
    }

    // ..
}
```
and in the component:
```typescript
@Component({
    // ...
})
export class AppComponent implements OnInit, OnDestroy {
    // ...
    error: string | undefined;
    errorSubscription: Subscription;

    constructor(private postService: PostService) {
        this.errorSubscription = this.postService.error.subscribe(error => (this.error = error));
    }

    // ...

    ngOnDestroy(): void {
        this.errorSubscription.unsubscribe();
    }
}
```
It is also possible to add a pipe that can transform the error:
```typescript
fetchPosts() {
    return this.http.get<Post[]>(this.postUrl).pipe(
        map((data: Post[]): Post[] => {
            console.log(data);
            // do some operations here..
            return data;
        }),
        catchError(error => {
            console.error(error);
            return [];
            // return throwError(error);
        }),
    );
}
```

## Request Header

Header can be simply attached to any request adding an object as last argument:
```typescript
return this.http
    .get<Post[]>(this.postUrl, {
        headers: new HttpHeaders({
            'Custom-header': 'hello',
        }),
    })
    // ...
``` 

## Query Parameter

As for header, query parameters can be simply attached
to any request adding an object as last argument:
```typescript
return this.http
    .get<Post[]>(this.postUrl, {
        // ...
        params: new HttpParams().set('custom-parameter', true),
    })
```
it is also possible to use this syntax to set more than one:
```typescript
let params = new HttpParams();
params = params.append("custom-parameter", true)
params = params.append("limit", 5)
return this.http
    .get<Post[]>(this.postUrl, {
        // ...
        params: params
    })
```

## Dynamic Response

By default angular return only the body:
```typescript
this.http
    .post<Post>(this.postUrl, postData, {
        observe: 'body', // default
    })
```
In order to receive the full http response it is possible to use:
```typescript
this.http
    .post<Post>(this.postUrl, postData, {
        observe: 'response',
    })
    .subscribe(
        responseData => {
            console.log(responseData);
            console.log(responseData.body);
            console.log(responseData.headers);
            console.log(responseData.status);
        },
        error => {
            this.error.next(error.message);
        },
    );
```

It is also possible to listen at the event:
```typescript
return this.http
    .delete(`${this.postUrl}/${id}`, {
        observe: 'events',
    })
    .pipe(
        tap(event => {
            console.log(event);
            if (event.type === HttpEventType.Response) {
                console.log(event.body);
            }
        }),
    );
```
the available HttpEventType are:
- Sent
- UploadProgress
- ResponseHeader
- DownloadProgress
- Response
- User
This events can be used to update the ui.

## Response Type

It is possible to set the response type of 
any request by adding an object as last argument:
```typescript
return this.http
    .delete(`${this.postUrl}/${id}`, {
        observe: 'events',
        responseType: 'json' // default
    })
```
some available response types are:
- json
- test
- blob

## Interceptors

An interceptor run some code before the request is sent, a basic implementation is:
```typescript
export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('request is going to be sent');
        return next.handle(req);
    }
}
```
In oder to use it in the application, must be added in the app module in the
following way:
```typescript
@NgModule({
    // ...
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }],
    // ...
})
export class AppModule {}
```
The prodive tell where the interceptor must be used,
the class is the actual interceptor, and multi tell angular to do not replace
the default interceptor with this one.

### Modify The Request

All the requests are immutable, therefore the only way to modify them is to 
create a new reqeust and retyrn the newly created in the next hangle:
```typescript
export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('request is going to be sent');
        const newRequest = req.clone({
            headers: req.headers.append('Auth', 'big-secret'),
        });
        return next.handle(newRequest);
    }
}
```

### Modify The Response

It is possible to intercept responses and in case mofify them, using pipe:
```typescript
export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('request is going to be sent');
        const newRequest = req.clone({
            headers: req.headers.append('Auth', 'big-secret'),
        });
        return next.handle(newRequest).pipe(
            tap(event => {
                console.log(event);
                if (event.type === HttpEventType.Response) {
                    console.log('Response arrived with body: ', event.body);
                }
            }),
        );
    }
}
```

### Multiple Interceptors

It is possible to add another interceptor just for logging request:
```typescript
export class LoggingInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(`${req.method}: ${req.url}`);
        return next.handle(req).pipe(
            tap(event => {
                if (event.type === HttpEventType.Response) {
                    console.log('Response arrived with body: ', event.body);
                }
            }),
        );
    }
}
```
The order of execution is then defined by the order of definition:
```typescript
@NgModule({
    // ...
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptorService, multi: true },
    ],
    // ...
})
export class AppModule {}
```

