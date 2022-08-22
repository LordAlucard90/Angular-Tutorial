# Authentication

## Content

- [Server](#server)
- [Login](#login)
- [User](#user)
- [Auth State](#auth-state)
- [Authorize Requests](#authorize-requests)
- [Interceptor](#interceptor)
- [Logout](#logout)
- [Auto Login And Logout](#auto-login-and-logout)
- [Auth Guard](#auth-guard)

---

## Server

In the course is used [firebase](https://firebase.google.com/),
but I prefer something local like
[json-server](https://github.com/typicode/json-server),
since it is needed the authentication i'll use 
[json-server-auth](https://github.com/jeremyben/json-server-auth),
```bash
npm install -g json-server-auth

json-server-auth --watch db.json -r routes.json 
# server listening at http://localhost:3000

# user creation
curl -X POST http://localhost:3000/register \
    -H 'Content-Type: application/json'\
    -d '{"email":"user@example.com","password":"stron-password"}'
```

the content of `db.json` must be:
```json
{
  "users": [],
  "recipes": []
}
```
while `routes.json` should be:
```json
{
  "users": 600,
  "recipes": 660
}
```
it works like linux, [**owner**/**logged**/**public**], `4` read, `2` write.

## Login

To manage the auth can be created a new component that manages login and sign up:
```angular2html
<!-- auth.component.html -->
<div class="row">
    <div class="col-xs-12 col-md-6 col-md-offset-3">
        <div class="alert alert-danger" *ngIf="!!error">
            <p>{{error}}</p>
        </div>
        <div *ngIf="isLoading" style="text-align: center">
            <!-- spinner created from https://loading.io/css -->
            <app-loading-spinner></app-loading-spinner>
        </div>
        <form #authForm="ngForm" (ngSubmit)="onSubmit(authForm)" *ngIf="!isLoading">
            <div class="form-group">
                <label for="email">Email</label>
                <input
                    type="email"
                    id="email"
                    class="form-control"
                    ngModel
                    name="email"
                    required
                    email />
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input
                    type="password"
                    id="password"
                    class="form-control"
                    ngModel
                    name="password"
                    required
                    minlength="6" />
            </div>
            <div>
                <button class="btn btn-primary" type="submit" [disabled]="!authForm.valid">
                    {{ isLoginMode ? 'Login' : 'Sign Up' }}
                </button>
                |
                <button class="btn btn-primary" type="button" (click)="onSwitchMode()">
                    Switch to {{ isLoginMode ? 'Sign Up' : 'Login' }}
                </button>
            </div>
        </form>
    </div>
</div>
```
```typescript
@Component({
    // ...
})
export class AuthComponent implements OnInit {
    isLoginMode = true;
    isLoading = false;
    error: string | undefined;

    constructor(private authService: AuthService) { }

    ngOnInit(): void { }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        this.isLoading = true;
        const { email, password } = form.value;

        let authObservable: Observable<AuthResponseData>;
        if (this.isLoginMode) {
            authObservable = this.authService.login(email, password);
        } else {
            authObservable = this.authService.signUp(email, password);
        }
        authObservable.subscribe(
            response => {
                this.isLoading = false;
            },
            errorMessage => {
                this.error = errorMessage;
                this.isLoading = false;
            },
        );
        form.reset();
    }
}
```
the auth service is:
```typescript
export interface AuthResponseData {
    accessToken: string;
    user: {
        email: string;
        id: number;
    };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private baseUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) { }

    signUp(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(`${this.baseUrl}/register`, {
                email,
                password,
            })
            .pipe(catchError(this.handleError));
    }

    login(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(`${this.baseUrl}/login`, {
                email,
                password,
            })
            .pipe(catchError(this.handleError));
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let message = 'An error occurred!';
        if (errorResponse.error) {
            message = errorResponse.error;
        }
        return throwError(message);
    }
}
```
the new rout must be registered:
```typescript
const routes: Routes = [
    // ...
    { path: 'auth', component: AuthComponent}
];

@NgModule({
    // ...
})
export class AppRoutingModule { }
```
and added to the header:
```angular2html
<!-- header.component.html -->
<!-- ... -->
    <li routerLinkActive="active"><a routerLink="/auth">Authenticate</a></li>
<!-- ... -->
```

## User

It is possible to introduce an user model that has all the information of 
the current logged user:
```typescript
export class User {
    constructor(
        public id: number,
        public email: string,
        private _token: string,
        private _tokenExpirationDate: Date,
    ) {}

    get token(): string | undefined {
        if (!this._token || !this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return undefined;
        }
        return this._token;
    }
}
```
and publish this data during login or sing up:
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
    // ...
    private oneHour = 60 * 60 * 1000;
    public user = new Subject<User>();

    // ...

    signUp(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(`${this.baseUrl}/register`, { email, password, })
            .pipe(catchError(this.handleError), tap(this.handleAuthentication));
    }

    login(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(`${this.baseUrl}/login`, { email, password, })
            .pipe(catchError(this.handleError), tap(this.handleAuthentication));
    }

    private handleAuthentication(authData: AuthResponseData) {
        const expirationDate = new Date(new Date().getTime() + this.oneHour);
        var user = new User(
            authData.user.id,
            authData.user.email,
            authData.accessToken,
            expirationDate,
        );
        this.user.next(user);
    }

    // ...
}
```

## Auth State

The authentication can be managed in the header in this way:
```
<!-- header.component.html -->
<!-- ... -->
    <ul class="nav navbar-nav">
        <li routerLinkActive="active" *ngIf="isAuthenticated"><a routerLink="/recipes">Recipes</a></li>
        <li routerLinkActive="active" *ngIf="!isAuthenticated"><a routerLink="/auth">Authenticate</a></li>
        <li routerLinkActive="active"><a routerLink="/shopping-list">Shopping List</a></li>
    </ul>
    <ul class="nav navbar-nav navbar-right" *ngIf="isAuthenticated">
        <li><a style="cursor: pointer;" >Logout</a></li>
        <li class="dropdown" appDropdown>
        <!-- ... -->
        </li>
<!-- ... -->
```
```typescript
@Component({
    // ...
})
export class HeaderComponent implements OnInit, OnDestroy {
    // ...
    authSubscription: Subscription;
    isAuthenticated = false;

    constructor(private dataStorageService: DataStorageService, private authService: AuthService) {
        this.authSubscription = authService.user.subscribe(user => {
            this.isAuthenticated = !!user && !!user.token;
        });
    }

    // ...

    ngOnDestroy(): void {
        this.authSubscription.unsubscribe();
    }
}
```

## Authorize Requests

It is necessary now to add the access token to the recipes' requests.

First of all using `BehaviorSubject`, it is possible to get the first value of
a Subject even if it has not published any value:
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
    public user = new BehaviorSubject<User | undefined>(undefined);

    // ...
}
```
after that it is possible to authenticate the fetch call:
```typescript
@Injectable({ providedIn: 'root' })
export class DataStorageService {
    // ...
    constructor(
        // ...
        private authService: AuthService,
    ) {}

    // ...

    fetchRecipes() {
        return this.authService.user.pipe(
            // automatically unsubscribe after 1 use
            take(1),
            // changes the observable in a new type
            exhaustMap(user => {
                return this.http.get<Recipe[]>(`${this.baseUrl}`, {
                    headers: new HttpHeaders().set('Authorization', `Bearer ${user?.token}`),
                });
            }),
            // keep previously behaviour in the pipe
            map(recipes => {
                return recipes.map(recipe => {
                    return {
                        ...recipe,
                        ingredients: recipe.ingredients ? recipe.ingredients : [],
                    };
                });
            }),
            tap(recipes => {
                this.recipeService.setRecipes(recipes);
            }),
        );
    }
}
```
 
## Interceptor

The same behaviour can be achieved using a request interceptor:
```typescript
@Injectable({ providedIn: 'root' })
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.user.pipe(
            take(1),
            exhaustMap(user => {
                // exclude login / sign up
                if (user) {
                    const authorizedRequest = req.clone({
                        headers: req.headers.set('Authorization', `Bearer ${user.token}`),
                    });
                    return next.handle(authorizedRequest);
                }
                return next.handle(req);
            }),
        );
    }
}
```
the interceptor must be registered:
```typescript
@NgModule({
    declarations: [
        // ...
    ],
    // ...
    providers: [
        // ...
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true,
        },
    ],
    // ...
})
export class AppModule {}
```
and the fetch call in the `DataStorageService` can be reset 
as the previous implementation.

## Logout

In order to logout it is enougth to publish an undefined user:
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
    // ...

    constructor(private http: HttpClient, private router: Router) {}

    // ...

    logout() {
        this.user.next(undefined);
    }

    // ...
}
```
the button can be added in the header:
```angular2html
<!-- header.component.html -->
<!-- ... -->
    <li><a style="cursor: pointer;" (click)="onLogout()">Logout</a></li>
<!-- ... -->
```
```typescript
@Component({
    // ...
})
export class HeaderComponent implements OnInit, OnDestroy {
    // ...

    onLogout(){
        this.authService.logout()
        this.router.navigate(['/auth']);
    }

    // ...
}
```

## Auto Login And Logout

It is possible to automatically login using the local store:
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
    // ...
    public tokenExpirationTimer: any;

    // ...

    // retrieve user from store
    autoLogin() {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const { id, email, _token, _tokenExpirationDate } = JSON.parse(userData);
            const curUser = new User(id, email, _token, new Date(_tokenExpirationDate));

            if (!!curUser.token) {
                this.user.next(curUser);
                const expiration = new Date(_tokenExpirationDate).getTime() - new Date().getTime();
                this.autoLogout(expiration);
            }
        }
    }

    logout() {
        this.user.next(undefined);
        this.router.navigate(['/auth']);
        // clear storage
        localStorage.removeItem('userData');
        // delete timer if present
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        // }, 2000);
        }, expirationDuration);
    }

    private handleAuthentication(authData: AuthResponseData) {
        const expirationDate = new Date(new Date().getTime() + 60 * 60 * 1000);
        var curUser = new User( authData.user.id, authData.user.email, authData.accessToken, expirationDate,);
        this.user.next(curUser);
        this.autoLogout(60 * 60 * 1000);
        // saving user
        localStorage.setItem('userData', JSON.stringify(curUser));
    }

    // ...
}
```

The auto login functionality can be added in the init method of the app component:
```typescript
@Component({
    // ...
})
export class AppComponent implements OnInit {
    // ...

    constructor(private authService: AuthService){}

    ngOnInit(): void {
        this.authService.autoLogin()
    }
}
```

## Auth Guard

An auth guard with an automatically redirect to the login page
can be easily implemeted in this way:
```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.authService.user.pipe(
            // unsuscribe to do not have strange behaviours on future emitted values
            take(1),
            map(user => {
                // old way
                // return !!user?.token;
                return !!user?.token ? true : this.router.createUrlTree(['/auth']);
            }),
            // old way
            // tap(isAuth => {
            //     if (!isAuth) {
            //         console.log('redirect');
            //         this.router.navigate(['/auth']);
            //     }
            // }),
        );
    }
}
```
and added in the app router:
```typescript
const routes: Routes = [
    // ...
    {
        path: 'recipes',
        component: RecipesComponent,
        canActivate: [AuthGuard],
        children: [
            // ...
        ],
    },
    // ...
];

@NgModule({
    // ...
})
export class AppRoutingModule { }
```

