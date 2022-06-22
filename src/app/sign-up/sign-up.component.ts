import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../core/services/login.service';
import { BehaviorSubject, finalize, Subject, takeUntil } from 'rxjs';
import firebase from 'firebase/compat';
import AuthError = firebase.auth.AuthError;

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnDestroy {
    signUpForm = this.fb.group({
        email: this.fb.control<string | null>(null, [Validators.email, Validators.required]),
        password: this.fb.control<string | null>(null, [Validators.required]),
    });
    showPassword = false;

    loading$ = new BehaviorSubject<boolean>(false);

    signUpError: AuthError | undefined;

    private destroy$ = new Subject<void>();

    constructor(private fb: FormBuilder, private loginService: LoginService) {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    get email() {
        return this.signUpForm.get('email');
    }

    get password() {
        return this.signUpForm.get('password');
    }

    signUp() {
        if (this.signUpForm.invalid) {
            return;
        }
        this.signUpError = undefined;

        this.loading$.next(true);

        this.loginService
            .signUp(this.email?.value ?? '', this.password?.value ?? '')
            .pipe(
                finalize(() => this.loading$.next(false)),
                takeUntil(this.destroy$),
            )
            .subscribe({
                error: (error: AuthError) => (this.signUpError = error),
            });
    }
}
