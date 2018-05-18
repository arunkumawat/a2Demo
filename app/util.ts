import * as moment from 'moment/moment';

import { Subscription } from 'rxjs';

export class Util {
    busyA: Subscription;
    busyB: Subscription;
    busyC: Subscription;

    rolesArr: string[];
    loggedInUserName: string;

    formatter_ = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });

    formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    });

    getDatePart(date: Date): string {
        date = new Date(date);
        return moment(date).format("DD-MMM-YYYY");
    }
}