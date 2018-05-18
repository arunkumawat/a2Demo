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
