import { Component } from '@angular/core';
import * as moment from 'moment/moment';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { PostsService } from '../../services/post.service';
import { Roles } from '../../services/Roles';
import { Util } from '../util';
import { User } from '../../Types/user';

@Component({
    moduleId: module.id,
    selector: 'registrationReport',
    templateUrl: 'registrationReport.component.html',
    providers: [PostsService, Roles]
})

export class RegistrationReportComponent extends Util {
    clientList: User[];
    isDesc: boolean = false;
    column: string;

    constructor(private ps: PostsService, public toastr: ToastsManager, private roleS: Roles) {
        super();

        this.rolesArr = this.roleS.getUserRoles();
        this.loggedInUserName = roleS.getUserFullName();

    }


    sortByBy() {
        this.clientList.sort(function (a, b) {
            if (a.registeredBy.firstName.toLowerCase() < b.registeredBy.firstName.toLowerCase()) {
                return -1 * direction;
            }
            else if (a.registeredBy.firstName.toLowerCase() > b.registeredBy.firstName.toLowerCase()) {
                return 1 * direction;
            }
            else {
                return 0;
            }
        });
    }

    sort(property) {
        this.isDesc = !this.isDesc; //change the direction    
        this.column = property;
        let direction = this.isDesc ? 1 : -1;

        this.clientList.sort(function (a, b) {
            if (a[property].toLowerCase() < b[property].toLowerCase()) {
                return -1 * direction;
            }
            else if (a[property].toLowerCase() > b[property].toLowerCase()) {
                return 1 * direction;
            }
            else {
                return 0;
            }
        });
    }
}
