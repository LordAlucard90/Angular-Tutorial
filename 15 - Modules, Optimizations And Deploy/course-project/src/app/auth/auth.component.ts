import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthResponseData, AuthService } from './auth-service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
    isLoginMode = true;
    isLoading = false;
    error: string | undefined;
    @ViewChild(PlaceholderDirective) alertPlaceholder: PlaceholderDirective | undefined;
    private closeSubscription: Subscription | undefined;

    constructor(
        private authService: AuthService,
        private router: Router,
        private componentFactoryResolver: ComponentFactoryResolver,
    ) { }

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
                // console.log(response);
                this.isLoading = false;
                this.router.navigate(['/recipes']);
            },
            errorMessage => {
                // console.error(error);
                this.error = errorMessage;
                this.showErrorMessage(errorMessage);
                this.isLoading = false;
            },
        );
        form.reset();
    }

    onHandleError() {
        this.error = undefined;
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
    }
}
