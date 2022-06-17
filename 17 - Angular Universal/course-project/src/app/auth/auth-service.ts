import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { expressionType } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, catchError, Subject, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

// export interface AuthResponseData {
//     accessToken: string;
//     user: {
//         email: string;
//         id: number;
//     };
// }

@Injectable({ providedIn: 'root' })
export class AuthService {
    // private baseUrl = environment.serverUrl;
    // public user = new Subject<User>();
    // public user = new BehaviorSubject<User | undefined>(undefined);
    public tokenExpirationTimer: any;

    constructor(
        // private http: HttpClient,
        // private router: Router,
        private store: Store<fromApp.AppState>,
    ) {}

    // signUp(email: string, password: string) {
    //     return this.http
    //         .post<AuthResponseData>(`${this.baseUrl}/register`, {
    //             email,
    //             password,
    //         })
    //         .pipe(catchError(this.handleError), tap(this.handleAuthentication.bind(this)));
    // }
    //
    // login(email: string, password: string) {
    //     return this.http
    //         .post<AuthResponseData>(`${this.baseUrl}/login`, {
    //             email,
    //             password,
    //         })
    //         .pipe(catchError(this.handleError), tap(this.handleAuthentication.bind(this)));
    // }
    //
    // autoLogin() {
    //     const userData = localStorage.getItem('userData');
    //     if (userData) {
    //         const { id, email, _token, _tokenExpirationDate } = JSON.parse(userData);
    //         // const curUser = new User(id, email, _token, new Date(_tokenExpirationDate));
    //
    //         // if (!!curUser.token) {
    //         if (!!_token) {
    //             // this.user.next(curUser);
    //             this.store.dispatch(
    //                 AuthActions.authenticateSuccess({
    //                     id: id,
    //                     email: email,
    //                     token: _token,
    //                     expirationDate: _tokenExpirationDate,
    //                 }),
    //             );
    //             const expiration = new Date(_tokenExpirationDate).getTime() - new Date().getTime();
    //             this.autoLogout(expiration);
    //         }
    //     }
    // }

    // logout() {
    //     // this.user.next(undefined);
    //     this.store.dispatch(AuthActions.logout());
    //     // managed in effect
    //     // this.router.navigate(['/auth']);
    //     localStorage.removeItem('userData');
    //     if (this.tokenExpirationTimer) {
    //         clearTimeout(this.tokenExpirationTimer);
    //     }
    // }

    // autoLogout(expirationDuration: number) {
    setLogoutTimer(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            // this.logout();
            // console.log('auto logout.');
            this.store.dispatch(AuthActions.logout());
        // }, 5000);
        }, expirationDuration);
    }

    clearLogoutTimer() {
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = undefined;
        }
    }

    // private handleAuthentication(authData: AuthResponseData) {
    //     const expirationDate = new Date(new Date().getTime() + 60 * 60 * 1000);
    //     // this.user.next(curUser);
    //     this.store.dispatch(
    //         AuthActions.authenticateSuccess({
    //             id: authData.user.id,
    //             email: authData.user.email,
    //             token: authData.accessToken,
    //             expirationDate: expirationDate,
    //         }),
    //     );
    //     var curUser = new User(
    //         authData.user.id,
    //         authData.user.email,
    //         authData.accessToken,
    //         expirationDate,
    //     );
    //     localStorage.setItem('userData', JSON.stringify(curUser));
    //     this.autoLogout(60 * 60 * 1000);
    // }
    //
    // private handleError(errorResponse: HttpErrorResponse) {
    //     let message = 'An error occurred!';
    //     if (errorResponse.error) {
    //         message = errorResponse.error;
    //     }
    //     return throwError(message);
    // }
}
