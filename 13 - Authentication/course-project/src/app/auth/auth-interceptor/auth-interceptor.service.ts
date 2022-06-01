import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, Observable, retry, take } from 'rxjs';
import { AuthService } from '../auth-service';

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
