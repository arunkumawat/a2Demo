"use strict";
var moment = require('moment/moment');
var Util = (function () {
    function Util() {
        this.formatter_ = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        });
        this.formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        });
    }
    Util.prototype.getDatePart = function (date) {
        date = new Date(date);
        return moment(date).format("DD-MMM-YYYY");
    };
    return Util;
}());
exports.Util = Util;
//# sourceMappingURL=util.js.map