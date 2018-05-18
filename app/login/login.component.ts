import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Rx';

import { AuthenticationService } from '../../services/authentication.service';
import { PostsService } from '../../services/post.service';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string = "/calculator";

    constructor(
        private route: ActivatedRoute, private router: Router,
        private authenticationService: AuthenticationService,
        private postsService: PostsService, public toastr: ToastsManager
    ) { }

    ngOnInit() {
        // reset login status
        this.model.username = "";
        this.model.password = "";
        if (localStorage.getItem('cccurrentUserToken')) {
            this.authenticationService.logout().subscribe(
                data => {
                    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/calculator';
                }
            );
        }
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password).subscribe(
            data => {
                if(data) {
                    this.toastr.error(data, 'Important');
                    this.loading = false;
                    return;
                }
                this.router.navigate([this.returnUrl]);
            },
            error => {
                this.toastr.error(error, 'Important');
                this.loading = false;
            }
        );
    }
}
