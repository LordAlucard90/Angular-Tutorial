import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { expressionType } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Subject, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

export interface AuthResponseData {
    accessToken: string;
    user: {
        email: string;
        id: number;
    };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private baseUrl = environment.serverUrl;
    // public user = new Subject<User>();
    public user = new BehaviorSubject<User | undefined>(undefined);
    public tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router) {}

    signUp(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(`${this.baseUrl}/register`, {
                email,
                password,
            })
            .pipe(catchError(this.handleError), tap(this.handleAuthentication.bind(this)));
    }

    login(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(`${this.baseUrl}/login`, {
                email,
                password,
            })
            .pipe(catchError(this.handleError), tap(this.handleAuthentication.bind(this)));
    }

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
        localStorage.removeItem('userData');
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
        var curUser = new User(
            authData.user.id,
            authData.user.email,
            authData.accessToken,
            expirationDate,
        );
        this.user.next(curUser);
        this.autoLogout(60 * 60 * 1000);
        localStorage.setItem('userData', JSON.stringify(curUser));
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let message = 'An error occurred!';
        if (errorResponse.error) {
            message = errorResponse.error;
        }
        return throwError(message);
    }
}
