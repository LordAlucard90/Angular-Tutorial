import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthService } from './auth-service';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';
import * as fromAuth from './store/auth.reducer';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
    isLoginMode = true;
    // isLoading = false;
    isLoading$ = this.store.select(fromAuth.selectAuthLoading);
    error$: Subscription | undefined;
    error: string | undefined;
    @ViewChild(PlaceholderDirective) alertPlaceholder: PlaceholderDirective | undefined;
    private closeSubscription: Subscription | undefined;

    constructor(
        // private authService: AuthService,
        // private router: Router,
        private componentFactoryResolver: ComponentFactoryResolver,
        private store: Store<fromApp.AppState>,
    ) {}

    ngOnInit(): void {
        this.error$ = this.store.select(fromAuth.selectAuthError).subscribe(error => {
            this.error = error;
            if (error) {
                this.showErrorMessage(error);
            }
        });
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        // this.isLoading = true;
        const { email, password } = form.value;

        // let authObservable: Observable<AuthResponseData>;
        if (this.isLoginMode) {
            // authObservable = this.authService.login(email, password);
            this.store.dispatch(AuthActions.loginStart({ email, password }));
        } else {
            // authObservable = this.authService.signUp(email, password);
            this.store.dispatch(AuthActions.singUpStart({ email, password }));
        }

        // authObservable.subscribe(
        //     response => {
        //         // console.log(response);
        //         this.isLoading = false;
        //         this.router.navigate(['/recipes']);
        //     },
        //     errorMessage => {
        //         // console.error(error);
        //         this.error = errorMessage;
        //         this.showErrorMessage(errorMessage);
        //         this.isLoading = false;
        //     },
        // );
        form.reset();
    }

    onHandleError() {
        // todo form reset
        // this.error = undefined;
            
        this.store.dispatch(AuthActions.clearError());
    }

    private showErrorMessage(error: string) {
        if (this.alertPlaceholder) {
            const alertComponentFactory =
                this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

            const alertViewContainerRef = this.alertPlaceholder.viewContainerRef;
            // clear previous data
            alertViewContainerRef.clear();

            // componenet creation
            const componentRef = alertViewContainerRef.createComponent(alertComponentFactory);

            // data and event binding
            componentRef.instance.message = error;
            this.closeSubscription = componentRef.instance.close.subscribe(() => {
                if (this.closeSubscription) {
                    this.closeSubscription.unsubscribe();
                }
                alertViewContainerRef.clear();
            });
        }
    }

    ngOnDestroy(): void {
        if (this.closeSubscription) {
            this.closeSubscription.unsubscribe();
        }
        if (this.error$) {
            this.error$.unsubscribe();
        }
    }
}
