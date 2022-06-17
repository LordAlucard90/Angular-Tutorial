import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, map, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth-service';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface AuthResponseData {
    accessToken: string;
    user: {
        email: string;
        id: number;
    };
}

@Injectable()
export class AuthEffects {
    private baseUrl = environment.serverUrl;
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService,
    ) {}

    authLogin$ = createEffect(() =>
        this.actions$.pipe(
            // filters the types for the actions
            ofType(AuthActions.loginStart),
            // transform the action
            switchMap(action => {
                return this.http
                    .post<AuthResponseData>(`${this.baseUrl}/login`, {
                        email: action.email,
                        password: action.password,
                    })
                    .pipe(map(this.handleAuthentication), catchError(this.handleError));
            }),
        ),
    );

    authRedirect = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.authenticateSuccess),
                tap(action => {
                    if (action.redirect) {
                        this.router.navigate(['/']);
                    }
                }),
            ),
        { dispatch: false },
    );

    authSighUp = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.singUpStart),
            switchMap(action => {
                return this.http
                    .post<AuthResponseData>(`${this.baseUrl}/register`, {
                        email: action.email,
                        password: action.password,
                    })
                    .pipe(map(this.handleAuthentication), catchError(this.handleError));
            }),
        ),
    );

    authLogout = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.logout),
                tap(() => {
                    localStorage.removeItem('userData');
                    this.authService.clearLogoutTimer();
                    this.router.navigate(['/auth']);
                }),
            ),
        { dispatch: false },
    );

    autoLogin = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.autoLogin),
            map(() => {
                const userData = localStorage.getItem('userData');
                if (userData) {
                    const { id, email, _token, _tokenExpirationDate } = JSON.parse(userData);
                    if (!!_token) {
                        const expiration =
                            new Date(_tokenExpirationDate).getTime() - new Date().getTime();
                        this.authService.setLogoutTimer(expiration);
                        return AuthActions.authenticateSuccess({
                            id: id,
                            email: email,
                            token: _token,
                            expirationDate: _tokenExpirationDate,
                            redirect: false,
                        });
                    }
                }
                return { type: 'EMPTY' };
            }),
        ),
    );

    private handleAuthentication = (authData: AuthResponseData) => {
        const expirationDate = new Date(new Date().getTime() + 60 * 60 * 1000);
        const user = new User(
            authData.user.id,
            authData.user.email,
            authData.accessToken,
            expirationDate,
        );
        localStorage.setItem('userData', JSON.stringify(user));
        // this requires an arrow function to work correctly
        this.authService.setLogoutTimer(60 * 60 * 1000);
        return AuthActions.authenticateSuccess({
            id: authData.user.id,
            email: authData.user.email,
            token: authData.accessToken,
            expirationDate: expirationDate,
            redirect: true,
        });
    };

    private handleError(errorResponse: HttpErrorResponse) {
        console.error(errorResponse);
        let message = 'An error occurred!';
        if (errorResponse.error) {
            message = errorResponse.error;
        }
        return of(AuthActions.authenticateFail({ error: message }));
    }
}
