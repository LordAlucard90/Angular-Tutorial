import {
    HttpEvent,
    HttpEventType,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // console.log('request is going to be sent');
        const newRequest = req.clone({
            headers: req.headers.append('Auth', 'big-secret'),
        });
        return next.handle(newRequest);
        // .pipe(
        //     tap(event => {
        //         console.log(event);
        //         if (event.type === HttpEventType.Response) {
        //             console.log('Response arrived with body: ', event.body);
        //         }
        //     }),
        // );
    }
}
