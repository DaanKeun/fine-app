import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../core/services/login.service';
import { BehaviorSubject, finalize, Observable, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
    @ViewChild('menuTrigger', { static: false }) menuTrigger: MatMenuTrigger | undefined;

    emailPasswordLoginForm = this.fb.group({
        email: this.fb.control<string | null>(null, [Validators.email, Validators.required]),
        password: this.fb.control<string | null>(null, [Validators.required]),
    });
    showPassword = false;

    showLoginButton$: Observable<boolean> | null = null;
    showLogoutButton$: Observable<boolean> | null = null;

    loading$ = new BehaviorSubject<boolean>(false);

    private destroy$ = new Subject<void>();

    constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router) {}

    ngOnInit(): void {
        this.showLoginButton$ = this.loginService.showLoginButton$;
        this.showLogoutButton$ = this.loginService.showLogoutButton$;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    get email() {
        return this.emailPasswordLoginForm.get('email');
    }

    get password() {
        return this.emailPasswordLoginForm.get('password');
    }

    signInWithGoogle() {
        this.loading$.next(true);

        this.loginService
            .signInWithGoogle()
            .pipe(
                finalize(() => this.loading$.next(false)),
                takeUntil(this.destroy$),
            )
            .subscribe(() => {
                this.menuTrigger?.closeMenu();
                this.router.navigate(['dashboard']);
            });
    }

    signInWithEmailPassword() {
        this.loading$.next(true);

        this.loginService
            .signInWithEmailAndPassword(this.email?.value ?? '', this.password?.value ?? '')
            .pipe(
                finalize(() => this.loading$.next(false)),
                takeUntil(this.destroy$),
            )
            .subscribe(() => {
                this.menuTrigger?.closeMenu();
                this.router.navigate(['dashboard']);
            });
    }

    signOut() {
        this.loginService
            .signOut()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.menuTrigger?.closeMenu();
                this.router.navigate(['login']);
            });
    }
}
