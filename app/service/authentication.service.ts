import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
    basePath: string = 'http://US1SCPSPT08D:82/api/';
    
    headers = new Headers({ 'Content-Type': 'application/json'});

    options = new RequestOptions({ headers: this.headers });
    constructor(private http: Http) { }

    login(username: string, password: string) {
        return this.http.post(this.basePath + 'Users/login', JSON.stringify({ username: username, password: password }), this.options)
            .map((response: Response) => {
                if(response && !response.json().isSuccess) {
                    return response.json().message; 
                }
                let user = response.json().data;
                if (user && user.token) {
                    localStorage.setItem('cccurrentUserToken', user.token);
                    localStorage.setItem('cccurrentUserRole', user.roleType.name);
                    localStorage.setItem('cccurrentUserName', user.firstName + " " + user.lastName);
                }
            });
    }

    logout() {
        if(localStorage.getItem('cccurrentUserToken')) {
            let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('cccurrentUserToken')});
            return this.http.post(this.basePath + 'Users/logout', {}, new RequestOptions({ headers: headers })).map(res => {
                res.json();
                localStorage.removeItem('cccurrentUserToken');
                localStorage.removeItem('cccurrentUserRole');
                localStorage.removeItem('cccurrentUserName');
            });
        }
    }
}