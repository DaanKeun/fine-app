import { Component, OnInit } from '@angular/core';
import { UserRepoService } from '../core/repos/user-repo.service';
import { Observable } from 'rxjs';
import { User } from '../core/interfaces/user';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

    activeUser$!: Observable<User | undefined>;
    allUsers$!: Observable<User[]>;

    constructor(private userRepo: UserRepoService) {
    }

    ngOnInit(): void {
        this.activeUser$ = this.userRepo.activeUser$;
        this.allUsers$ = this.userRepo.getAllUsers$();
    }

}
