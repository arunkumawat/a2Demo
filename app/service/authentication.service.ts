import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
    basePath: string = 'https://jsonplaceholder.typicode.com/';
    constructor(private http: Http) { }
    login(username: string, password: string) {
        return this.http.post('https://jsonplaceholder.typicode.com/users/2', JSON.stringify({ username: username, password: password }), this.options)
            .map((response: Response) => {
                if(response && !response.json().isSuccess) {
                    return response.json().message; 
                }
                let user = response.json().data;
                if (user) {
                    localStorage.setItem('cccurrentUserRole', user.name);
                }
            });
    }

    logout() {
        if(localStorage.getItem('cccurrentUserToken')) {
            return this.http.post('---/logout/api---', {}, new RequestOptions({ headers: headers })).map(res => {
                res.json();
                localStorage.removeItem('cccurrentUserRole');
            });
        }
    }
}
