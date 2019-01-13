import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from "rxjs/operators";

export class ContentInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Intercepted: ', req);
    const copiedReq = req.clone({
      headers: req.headers.append('Content-Type', 'application/json')
    });
    console.log('Modified: ', copiedReq);
    return next.handle(copiedReq)
      .pipe(tap(
        event => {
          console.log('Tap: ', event);
        }
      )); // this let the request continue its journey
  }
}
