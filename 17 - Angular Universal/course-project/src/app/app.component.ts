import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
// import { AuthService } from './auth/auth-service';
import { LoggingService } from './logging.service';
import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    // loadedFeature = 'recipe';
    title = 'course-project';

    constructor(
        // private authService: AuthService,
        private loggingService: LoggingService,
        private store: Store<fromApp.AppState>,
        @Inject(PLATFORM_ID) private platformId: any,
    ) { }

    ngOnInit(): void {
        // this.authService.autoLogin();
        if (isPlatformBrowser(this.platformId)) {
            this.store.dispatch(AuthActions.autoLogin());
        }
        this.loggingService.printLog('Hello from AppComponent.');
    }

    // onNavigate(feature: string) {
    //     this.loadedFeature = feature;
    // }
}
