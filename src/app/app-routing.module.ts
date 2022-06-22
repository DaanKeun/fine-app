import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { SignUpComponent } from './sign-up/sign-up.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['dashboard']);

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        ...canActivate(redirectLoggedInToDashboard),
    },
    {
        path: 'sign-up',
        component: SignUpComponent,
        ...canActivate(redirectLoggedInToDashboard),
    },
    {
        path: '',
        children: [
            {
                component: DashboardComponent,
                path: 'dashboard',
            },
        ],
        ...canActivate(redirectUnauthorizedToLogin),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
