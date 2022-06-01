import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth-service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
    isLoginMode = true;
    isLoading = false;
    error: string | undefined;

    constructor(private authService: AuthService, private router: Router) {}

    ngOnInit(): void {}

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
                this.isLoading = false;
            },
        );
        form.reset();
    }
}
