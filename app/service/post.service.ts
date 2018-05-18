import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, ResponseContentType, Response  } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/Rx';
import * as moment from 'moment/moment';

import { CompleterService, RemoteData } from 'ng2-completer';

@Injectable()
export class PostsService {
    basePath: string = 'http://US1SCPSPT08D:82/api/';                    // DEV
    headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('cccurrentUserToken') });

    options = new RequestOptions({ headers: this.headers });
    private remote: RemoteData;

    constructor(private http: Http, private completerService: CompleterService) {
        this.headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('cccurrentUserToken') });
    }

    get(url: string) {
        return this.http.get(this.basePath + url, this.options).map(res => res.json()).catch(this.handleError);
    }

    get_(url: string) {
        this.headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('cccurrentUserToken') });
        this.options = new RequestOptions({ headers: this.headers });
        return this.http.get(this.basePath + url, this.options).map(res => res.json()).catch(this.handleError_);
    }

    post(url: string, body: Object) {
        return this.http.post(this.basePath + url, JSON.stringify(body), this.options).map(res => res.json()).catch(this.handleError);
    }

    put(url: string, body: Object) {
        Date.prototype.toJSON = function () { return moment(this).format('YYYY-MM-DDTHH:mm:ss'); }
        return this.http.put(this.basePath + url, JSON.stringify(body), this.options).map(res => res.json()).catch(this.handleError);
    }

    delete(url: string) {
        return this.http.delete(this.basePath + url, this.options).map(res => res.json()).catch(this.handleError);
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

    private handleError_(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            if(error.status === 401 || error.status === 403) {
                window.location.href = '/#/noAccess';
            }
            const body = error.json() || '';
            errMsg = `${error.status} - ${error.statusText || ''} ,     Please Contact support.`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }

}