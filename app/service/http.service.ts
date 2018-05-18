import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType, Response  } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/Rx';

@Injectable()
export class PostsService {
    basePath: string = 'https://jsonplaceholder.typicode.com/users/'; 
    headers = new Headers({ 'Content-Type': 'application/json' });
    constructor(private http: Http) {
    }
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
    get(url: string) {
        return this.http.get(this.basePath + url).map(res => res.json()).catch(this.handleError);
    }

    post(url: string, body: Object) {
        return this.http.post(this.basePath + url, JSON.stringify(body)).map(res => res.json()).catch(this.handleError);
    }

    put(url: string, body: Object) {
        return this.http.put(this.basePath + url, JSON.stringify(body)).map(res => res.json()).catch(this.handleError);
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            if(error.status === 401 || error.status === 403) {
                window.location.href = '/#/login';
            }
            const body = error.json() || '';
            errMsg = `${error.status} - ${error.statusText || ''} ,     Please Contact support.`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }
}
