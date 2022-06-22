import { Injectable } from '@angular/core';
import { EMPTY, filter, from, map, Observable, tap } from 'rxjs';
import {
    Auth,
    authState,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    User,
} from '@angular/fire/auth';
import { traceUntilFirst } from '@angular/fire/performance';
import { UserCredential } from '@firebase/auth';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    user: Observable<User | null> = EMPTY;

    showLoginButton$: Observable<boolean> | null = null;
    showLogoutButton$: Observable<boolean> | null = null;

    constructor(private auth: Auth) {
        if (this.auth) {
            this.user = authState(this.auth);

            const isLoggedIn$ = authState(this.auth).pipe(
                traceUntilFirst('auth'),
                map((u) => !!u),
            );

            this.showLoginButton$ = isLoggedIn$.pipe(map((isLoggedIn) => !isLoggedIn));
            this.showLogoutButton$ = isLoggedIn$.pipe(map((isLoggedIn) => isLoggedIn));
        }
    }

    signInWithGoogle(): Observable<UserCredential> {
        return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
    }

    signInWithEmailAndPassword(email: string, password: string): Observable<UserCredential> {
        return from(signInWithEmailAndPassword(this.auth, email, password));
    }

    signOut() {
        return from(signOut(this.auth));
    }

    signUp(email: string, password: string) {
        return from(createUserWithEmailAndPassword(this.auth, email, password));
    }
}
