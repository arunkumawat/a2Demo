import { Injectable } from '@angular/core';

@Injectable()
export class Roles {

    constructor() { }

    getUserRoles(): string[] {
        if (localStorage.getItem('cccurrentUserRole')) {
            if (localStorage.getItem('cccurrentUserRole') == 'user') {
                return ['user'];
            }
            if (localStorage.getItem('cccurrentUserRole') == 'Admin') {
                return ['user', 'admin'];
            }
        }
        return [];
    }

    getUserFullName(): string {
        return localStorage.getItem('cccurrentUserName');
    }

}
