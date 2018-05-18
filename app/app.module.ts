import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';

import { routing } from './app.routing';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './components/admin/not-found.component';

import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { Roles } from './services/roles';

import { CalculatorComponent } from './components/home/calculator.component';
import { NoAccessComponent } from './components/home/noAccess.component';

import { RegisterClientComponent } from './components/admin/registerClient.component';
import { RegistrationReportComponent } from './components/admin/registrationReport.component';
import { UsersComponent } from './components/admin/users.component';
import { SystemConfigComponent } from './components/admin/systemConfig.component';

import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2CompleterModule } from "ng2-completer";
import { BusyModule } from 'angular2-busy';
import { NvD3Component } from 'ng2-nvd3';

let options: ToastOptions = new ToastOptions({
    animate: 'fade',
    showCloseButton: true,
    newestOnTop: true,
    dismiss: 'auto',
    toastLife: 5000,
    positionClass: 'toast-bottom-right'
});

@NgModule({
    imports: [BrowserModule, HttpModule, routing, FormsModule, Ng2CompleterModule, Ng2Bs3ModalModule, ToastModule.forRoot(options), NgbModule.forRoot(), BusyModule],
    declarations: [AppComponent, PageNotFoundComponent, LoginComponent, CalculatorComponent, NoAccessComponent,
        RegisterClientComponent, RegistrationReportComponent, UsersComponent, SystemConfigComponent,NvD3Component],
    providers: [AuthGuard, Roles, { provide: LocationStrategy, useClass: HashLocationStrategy }],
    bootstrap: [AppComponent]
})

export class AppModule { }
