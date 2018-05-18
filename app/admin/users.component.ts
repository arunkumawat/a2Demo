import { Component, ViewChild } from '@angular/core';
import * as moment from 'moment/moment';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Observable } from 'rxjs/Rx';

import { PostsService } from '../../services/post.service';
import { Roles } from '../../services/Roles';
import { Util } from '../util';
import { User } from '../../Types/user';

@Component({
    moduleId: module.id,
    selector: 'users',
    templateUrl: 'users.component.html',
    providers: [PostsService, Roles]
})

export class UsersComponent extends Util {
    @ViewChild('modal') modal: ModalComponent;
    userList: User[];
    _uList: boolean = true;
    _uView: boolean = false;
    _uEdit: boolean = false;
    _uAdd: boolean = false;
    viewUser: User;
    editUser: User;
    addUser: User;
    d_UID: number;
    d_Uname: string;
    isDesc: boolean = false;
    column: string;

    constructor(private ps: PostsService, public toastr: ToastsManager, private roleS: Roles) {
        super();
        this.userList = [];
        this.rolesArr = this.roleS.getUserRoles();
        this.loggedInUserName = roleS.getUserFullName();
        this.viewUser = <User>{ roleType: { name: '' } };
        this.addUser = <User>{ roleType: { name: '' } };
        this.editUser = <User>{ roleType: { name: '' } };
        this.showList();
    }

    showList() {
        this.busyB = this.ps.get('Users?filter.roleName=users').subscribe(posts => {
            this.userList = posts.data;
            this._uList = true;
            this._uView = false;
            this._uEdit = false;
            this._uAdd = false;
        });
    }

    view(userId: number) {
        this.busyA = this.ps.get('Users?filter.id=' + userId).subscribe(posts => {
            this.viewUser = posts.data[0];
            this._uList = false
            this._uView = true;
            this._uEdit = false;
        });
    }

    edit(userId: number) {
        this.busyA = this.ps.get('Users?filter.id=' + userId).subscribe(posts => {
            this.editUser = posts.data[0];
            this._uList = false;
            this._uView = false;
            this._uEdit = true;
        });
    }

    save() {
        this.busyA = this.ps.put('Users/EditUser/', this.editUser).subscribe(posts => {
            if (!posts.isSuccess) {
                this.toastr.error(posts.message, 'Important');
                return;
            } else {
                this.toastr.success("User updated successfully ", 'Success');
                this.showList();
            }
        });
    }

    addNewUser() {
        this._uList = false;
        this._uView = false;
        this._uEdit = false;
        this._uAdd = true;
        this.addUser = <User>{ roleType: { name: '' } };
    }

    createUser() {
        this.busyA = this.ps.post('Users/RegisterUser/', this.addUser).subscribe(posts => {
            if (!posts.isSuccess) {
                this.toastr.error(posts.message, 'Important');
                return;
            } else {
                this.toastr.success("User created successfully ", 'Success');
                this.showList();
            }
        });
    }

    delete(userId: number, fn: string, ln: string) {
        this.d_UID = userId;
        this.d_Uname = fn + " " + ln;
        this.modal.open();
    }

    deleteIt() {
        this.busyA = this.ps.delete('Users/' + this.d_UID).subscribe(posts => {
            this.modal.close();
            // console.log(posts);
            if (!posts.isSuccess) {
                this.toastr.error(posts.message, 'Important');
                return;
            } else {
                this.toastr.success("User deleted successfully ", 'Success');
                this.showList();
            }
        });
    }

    cancel() {
        this._uList = true;
        this._uView = false;
        this._uEdit = false;
        this._uAdd = false;
    }

    onCBChange(flag: boolean) {
        this.editUser.status = flag ? "Active" : "Inactive";
    }

    sort(property: string) {
        this.isDesc = !this.isDesc; //change the direction    
        this.column = property;
        let direction = this.isDesc ? 1 : -1;

        this.userList.sort(function (a, b) {
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
