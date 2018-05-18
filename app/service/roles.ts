import { Injectable } from '@angular/core';

@Injectable()
export class Roles {

    constructor() { }

    getUserRoles(): string[] {
        if (localStorage.getItem('cccurrentUserRole')) {
            if (localStorage.getItem('cccurrentUserRole') == 'Client') {
                return ['client'];
            }
            if (localStorage.getItem('cccurrentUserRole') == 'BD') {
                return ['client', 'bd'];
            }
            if (localStorage.getItem('cccurrentUserRole') == 'Admin') {
                return ['client', 'bd', 'admin'];
            }
        }
        return [];
    }

    getUserFullName(): string {
        return localStorage.getItem('cccurrentUserName');
    }

}