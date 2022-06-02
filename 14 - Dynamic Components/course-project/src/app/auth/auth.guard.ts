import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { map, Observable, take, tap } from 'rxjs';
import { AuthService } from './auth-service';

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
