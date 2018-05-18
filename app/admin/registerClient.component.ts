import { Component } from '@angular/core';
import * as moment from 'moment/moment';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { PostsService } from '../../services/post.service';
import { Roles } from '../../services/Roles';
import { Util } from '../util';
import { User } from '../../Types/user';

@Component({
    moduleId: module.id,
    selector: 'registerClient',
    templateUrl: 'registerClient.component.html',
    providers: [PostsService, Roles]
})

export class RegisterClientComponent extends Util {
    user: { name: string, email: string };
    constructor(private ps: PostsService, public toastr: ToastsManager, private roleS: Roles) {
        super();

        this.rolesArr = this.roleS.getUserRoles();
        this.loggedInUserName = roleS.getUserFullName();
        this.user = { name: "", email: "" };
    }

    registerClient() {
        let firstName = "";
        if (this.user.name && this.user.name.split(' ')[0] && this.user.email) {
            firstName = this.user.name.split(' ')[0]
        } else {
            this.toastr.error("Name and email are required", 'Important');
            return;
        }
        let lastName = this.user.name.trim().indexOf(' ') != -1 ? this.user.name.substring(this.user.name.indexOf(' ')+1, this.user.name.length) : "";
        
        this.busyA = this.ps.post('Users/RegisterClient', { firstName: firstName, lastName: lastName, email: this.user.email }).subscribe(posts => {
            if (!posts.isSuccess) {
                this.toastr.error(posts.message, 'Important');
                return;
            } else {
                this.toastr.success("Client successfully registered and email sent.", 'Success');
                this.user = { name: "", email: "" };
            }
        });

    }
}
