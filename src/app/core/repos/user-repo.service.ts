import { Injectable } from '@angular/core';
import { addDoc, Firestore, getDoc, getDocs, query, where } from '@angular/fire/firestore';
import { filter, from, map, merge, Observable, share, switchMap } from 'rxjs';
import { User } from '../interfaces/user';
import { createCollection } from '../helpers/helper.utils';
import { LoginService } from '../services/login.service';

@Injectable({
    providedIn: 'root'
})
export class UserRepoService {

    userCol = createCollection<User>(this.firestore, 'users')

    activeUser$: Observable<User | undefined>;

    constructor(private firestore: Firestore, private loginService: LoginService) {
        const activeUser$ = this.loginService.user$.pipe(
            switchMap((authedUser) => {
                const activeUserQuery = query(this.userCol, where('uuid', '==', authedUser?.uid));
                return from(getDocs(activeUserQuery)).pipe(
                    map(users => ({authedUser, users}))
                );
            }),
            share(),
        )

        const exists = activeUser$.pipe(
            filter(({authedUser, users}) => !users.empty),
            map(({authedUser, users}) => users.docs[0].data())
        );

        const notExists = activeUser$.pipe(
            filter(({authedUser, users}) => users.empty),
            switchMap(({authedUser, users}) => addDoc(this.userCol, {
                uuid: authedUser?.uid ?? '',
                fines: [],
                email: authedUser?.email ?? '',
                username: authedUser?.displayName ?? ''
            })),
            switchMap(userDocReference => from(getDoc(userDocReference))),
            map(user => user.data())
        );

        this.activeUser$ = merge(exists, notExists);
    }

    getAllUsers$(): Observable<User[]> {
        return this.activeUser$?.pipe(
            switchMap(activeUser => {
                const otherUsersQuery = query(this.userCol, where('uuid', '!=', activeUser?.uuid))
                return from(getDocs(otherUsersQuery)).pipe(
                    map((entries => entries.docs.map(doc => doc.data()))),
                )
            })
        );
    }
}
