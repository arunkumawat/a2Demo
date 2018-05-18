import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './components/admin/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth.guard';

import { CalculatorComponent } from './components/home/calculator.component';
import { NoAccessComponent } from './components/home/noAccess.component';

import { RegisterClientComponent } from './components/admin/registerClient.component';
import { RegistrationReportComponent } from './components/admin/registrationReport.component';
import { UsersComponent } from './components/admin/users.component';
import { SystemConfigComponent } from './components/admin/systemConfig.component';


const appRouter: Routes =
    [
        { path: '', redirectTo: 'login', pathMatch: 'full' },
        { path: 'login', component: LoginComponent },

        { path: 'admin/registerClient', component: RegisterClientComponent, canActivate: [AuthGuard] },
        { path: 'admin/registrationReport', component: RegistrationReportComponent, canActivate: [AuthGuard] },
        { path: 'admin/users', component: UsersComponent, canActivate: [AuthGuard] },
        { path: 'admin/systemConfig', component: SystemConfigComponent, canActivate: [AuthGuard] },
        { path: 'calculator', component: CalculatorComponent },
        { path: 'noAccess', component: NoAccessComponent },
        { path: '**', component: PageNotFoundComponent }
    ];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRouter);