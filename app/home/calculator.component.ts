import { OnInit, Component } from '@angular/core';
import * as moment from 'moment/moment';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { PostsService } from '../../services/post.service';
import { Roles } from '../../services/Roles';
import { Util } from '../util';
import { Config } from '../../Types/Config';
import { Calculator } from '../../Types/Calculator';

@Component({
    moduleId: module.id,
    selector: 'calculator',
    templateUrl: 'calculator.component.html',
    providers: [PostsService, Roles]
})

export class CalculatorComponent extends Util {
    config: Config;
    calc: Calculator;
    ulxEstimatedData: string[][];
    cpEstimatedData: string[][];
    ulxTotal: string;
    cpTotal: string;
    showEstimate: boolean = false;
    token: string; params: any;
    videoOverlay: boolean = true;
    tooltips: {
        eis: string, qc: string, di: string, cr: string
    }
    _hostingMultiplier: number = 0;
    inputValues: string[][];
    options: any = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: 200,
            x: function (d: any) { return d.label; },
            y: function (d: any) { return d.value; },
            stacked: true, showControls: false,
            legendPosition: 'bottom',
            margin: { left: 100, right: 50, top: 0 },
            yAxis: {
                tickFormat: (d: any) => {
                    return "$" + d3.format(',')(d);
                },
                ticks: 10
            }
        }
    };
    chartP: boolean = true;
    options2: any = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: 200,
            width: 800,
            x: function (d: any) { return d.label; },
            y: function (d: any) { return d.value; },
            stacked: true, showControls: false,
            legendPosition: 'bottom',
            margin: { left: 110, right: 50, top: 0 },
            yAxis: {
                tickFormat: (d: any) => {
                    return "$" + d3.format(',')(d);
                },
                ticks: 10
            }
        }
    };
    data: any[];
    colors: string[] = ['#0069a5', '#0098ee', '#7bd2f6', '#ffb800', '#ff8517', '#e34a00'];
    constructor(private router: Router, private activatedRoute: ActivatedRoute, private ps: PostsService, public toastr: ToastsManager, private roleS: Roles) {
        super();
        this.rolesArr = this.roleS.getUserRoles();
        this.loggedInUserName = roleS.getUserFullName();
        this.data = [];
        this.calc = <Calculator>{};
        this.token = this.activatedRoute.snapshot.queryParams["token"];
        this.ulxEstimatedData = [];
        this.cpEstimatedData = [];
        this.tooltips = { eis: "", qc: "", di: "", cr: "" };

        if (this.token) {
            this.busyA = this.ps.get_('Calculator/ClientAccess?filter.token=' + this.token).subscribe(posts => {
                if (!posts.isSuccess) {
                    this.router.navigate(['/noAccess']);
                    return;
                } else {
                    let user = posts.data;
                    if (user && user.token) {
                        localStorage.setItem('cccurrentUserToken', user.token);
                        localStorage.setItem('cccurrentUserRole', user.roleType.name);
                        localStorage.setItem('cccurrentUserName', user.firstName + " " + user.lastName);
                        this.getConfig();
                        this.rolesArr = this.roleS.getUserRoles();
                        this.loggedInUserName = roleS.getUserFullName();
                    }
                }
            });
        } else if (localStorage.getItem('cccurrentUserToken')) {
            this.getConfig();
        } else {
            this.router.navigate(['/noAccess']);
            return;
        }
    }

    getConfig() {
        this.busyA = this.ps.get_('Calculator/ConfigDetails').subscribe(posts => {
            this.config = posts.data;
            this.calc.ocQCRate = this.config.outsideCounselQcrate;
            this.calc.cullRate = this.config.cullRate;
            this.tooltips.eis = "Data Collected - " + this.config.initialFiltering + "% (for intake filtering) * " + this.config.expansionSizeIngested + "% for Ingestion Expansion";
            this.tooltips.qc = "This assumes QC of " + this.config.outsideCounselQc + "% of docs";
            this.tooltips.di = "Expansion x " + this.config.documentsPerGb + " avg. Docs per GB";
            this.tooltips.cr = "Difference between # Documents Ingested vs. Promoted to Review. Industry avg = " + this.config.cullRate + "%";
        });
    }

    showComparison() {
        this._hostingMultiplier = Math.round(this.config.hostingMultiplier * 100);
        if (this.calc.dataCollected && this.calc.projectLength && this.calc.ingestionRate && this.calc.promotionRate &&
            this.calc.hostingRate && this.calc.fpReviewRate && this.calc.ocQCRate && this.calc.cullRate) {
        } else {
            this.toastr.error("Please enter all the values above to compare", 'Important');
            return;
        }
        let c34 = this.calc.expandedIngestedSize - (this.calc.expandedIngestedSize * (this.config.ulxCullRate / 100));
        let c44 = (c34 * this.config.documentsPerGb) / this.config.ulxDph;
        let c54 = c44 * (this.config.outsideCounselQc / 100);
        let t4u = (this.config.ulxIngestionRate * this.calc.expandedIngestedSize) + (this.config.ulxPromotionRate * c34) + ((this.config.ulxHostingRate * c34 * this.config.ulxHostingMultiplier) * this.calc.projectLength) + (c44 * this.config.ulxFprRate);
        let miscU = Math.round(t4u * (this.config.misc / 100));
        let ulxTotal = t4u + miscU + (c54 * this.calc.ocQCRate);
        this.ulxTotal = this.gF(Math.round(ulxTotal), 1);
        this.ulxEstimatedData = [
            ["Ingestion (GB In)", this.gF(this.config.ulxIngestionRate, 1), "GBs", this.gF(this.calc.expandedIngestedSize, 0), this.gF(Math.round(this.config.ulxIngestionRate * this.calc.expandedIngestedSize), 1)],
            ["Promotion (GB Out)", this.gF(this.config.ulxPromotionRate, 1), "GBs", this.gF(c34, 0), this.gF(Math.round(this.config.ulxPromotionRate * c34), 1)],
            ["Hosting", this.gF(this.config.ulxHostingRate, 1), "GBs", this.gF((c34 * this.config.ulxHostingMultiplier), 0), this.gF(Math.round((this.config.ulxHostingRate * c34 * this.config.ulxHostingMultiplier) * this.calc.projectLength), 1)],
            ["First Pass Review", this.gF(this.config.ulxFprRate, 1), "Hours", new Intl.NumberFormat().format(Math.round(c44)), this.gF(Math.round(c44 * this.config.ulxFprRate), 1)],
            ["Misc Services as % of Total", "-", "Percentage", "" + this.config.misc + "%", this.gF(miscU, 1)],
            ["Outside Counsel QC", this.gF(this.calc.ocQCRate, 1), "Hours", new Intl.NumberFormat().format(Math.round(c54)), this.gF(Math.round(c54 * this.calc.ocQCRate), 1)],
        ];

        let cp34 = this.calc.expandedIngestedSize - (this.calc.expandedIngestedSize * (this.calc.cullRate / 100));
        let cp54 = (cp34 * this.config.documentsPerGb) / this.config.dph;
        let cp64 = cp54 * (this.config.outsideCounselQc / 100);
        let t4cp = (this.calc.ingestionRate * this.calc.expandedIngestedSize) + (this.calc.promotionRate * cp34) + (this.calc.hostingRate * cp34 * this.config.hostingMultiplier * this.calc.projectLength) + (cp54 * this.calc.fpReviewRate);
        let miscCP = Math.round(t4cp * (this.config.misc / 100));
        let cpTotal = t4cp + miscCP + (cp64 * this.calc.ocQCRate);
        this.cpTotal = this.gF(Math.round(cpTotal), 1);
        this.cpEstimatedData = [
            ["Ingestion (GB In)", this.gF(this.calc.ingestionRate, 1), "GBs", this.gF(this.calc.expandedIngestedSize, 0), this.gF(Math.round(this.calc.ingestionRate * this.calc.expandedIngestedSize), 1)],
            ["Promotion (GB Out)", this.gF(this.calc.promotionRate, 1), "GBs", this.gF(cp34, 0), this.gF(Math.round(this.calc.promotionRate * cp34), 1)],
            ["Hosting", this.gF(this.calc.hostingRate, 1), "GBs", this.gF(cp34 * this.config.hostingMultiplier, 0), this.gF(Math.round(this.calc.hostingRate * cp34 * this.config.hostingMultiplier * this.calc.projectLength), 1)],
            ["First Pass Review", this.gF(this.calc.fpReviewRate, 1), "Hours", new Intl.NumberFormat().format(Math.round(cp54)), this.gF(Math.round(cp54 * this.calc.fpReviewRate), 1)],
            ["Misc Services as % of Total", "-", "Percentage", this.config.misc + "%", this.gF(miscCP, 1)],
            ["Outside Counsel QC", this.gF(this.calc.ocQCRate, 1), "Hours", new Intl.NumberFormat().format(Math.round(cp64)), this.gF(Math.round(cp64 * this.calc.ocQCRate), 1)]
        ];
        this.inputValues = [
            ["Data Collected", "" + this.calc.dataCollected],
            ["Length of Project", "" + this.calc.projectLength],
            ["Documents Per GB", "" + this.config.documentsPerGb],
            ["Expanded / Ingested Size", "" + this.calc.expandedIngestedSize],
            ["Total # Docs Ingested", "" + this.calc.totalDocs],
            ["Ingestion Rate", "" + this.calc.ingestionRate],
            ["Promotion Rate", "" + this.calc.promotionRate],
            ["Hosting Rate", "" + this.calc.hostingRate],
            ["First Pass Review Rate", "" + this.calc.fpReviewRate],
            ["Outside Counsel QC Rate", "" + this.calc.ocQCRate],
            ["Cull Rate", "" + this.calc.cullRate],
        ];

        this.showEstimate = true;
        this.data = [];
        for (let i = 0; i < this.cpEstimatedData.length; i++) {
            this.data.push({
                "key": this.cpEstimatedData[i][0], "color": this.colors[i],
                "values": [
                    { "label": "label", "value": +this.ulxEstimatedData[i][4].replace(/[^0-9.]/g, "") },
                    { "label": "Current Provider", "value": +this.cpEstimatedData[i][4].replace(/[^0-9.]/g, "") }
                ]
            });
        }
    }

    gF(n: number, iC: number) {
        return iC ? this.formatter.format(n) : this.formatter_.format(n);
    }

    dcChanged() {
        this.calc.expandedIngestedSize = parseFloat(((this.calc.dataCollected - (this.calc.dataCollected * (this.config.initialFiltering / 100))) * (this.config.expansionSizeIngested / 100)).toFixed(1));
        this.calc.totalDocs = new Intl.NumberFormat().format(Math.round(this.config.documentsPerGb * ((this.calc.dataCollected - (this.calc.dataCollected * (this.config.initialFiltering / 100))) * (this.config.expansionSizeIngested / 100))));
        this.tooltips.di = "Expansion x " + this.config.documentsPerGb + " avg. Docs per GB";
    }

    emailEst() {
        this.ulxEstimatedData.push(['Total Project Cost', this.ulxTotal]);
        this.cpEstimatedData.push(['Total Project Cost', this.cpTotal]);
        this.busyA = this.ps.post('Report/EmailReport', { ulxModel: this.ulxEstimatedData, cpModel: this.cpEstimatedData, inputValues: this.inputValues }).subscribe(posts => {
            if (!posts.isSuccess) {
                this.toastr.error(posts.message, 'Important');
                return;
            } else {
                this.toastr.success("Email successfully sent to email : " + localStorage.getItem('cccurrentUserName'), 'Success');
            }
            this.ulxEstimatedData.pop(); this.cpEstimatedData.pop();
        });
    }

    printEst(d1: string, d2: string, d33: string) {
        var mywindow = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
        mywindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="./app/style/css/customBootstrap.css" /><link rel="stylesheet" type="text/css" href="./app/style/css/site.css" /></head><body >');
        mywindow.document.write('<img src="./app/style/img/UlxLoginLogo.png" />&nbsp;<br><h2> Questio Cost Comparison Estimates</h2>&nbsp;<br><h4><u>User Inputs:</u></h4>&nbsp;<br>');
        var u_i = "<table class='table table-bordered table-fixed table-condensed'>";
        for (var i = 0; i < this.inputValues.length; i++) {
            u_i += "<tr>";
            for (var j = 0; j < this.inputValues[i].length; j++) {
                u_i += "<td>" + this.inputValues[i][j] + "</td>";
            }
            u_i += "</tr>";
        }
        u_i += "</table>";

        mywindow.document.write(u_i + '&nbsp;<br><h4><u>Current Provider Estimate</u></h4>&nbsp;<br>' + document.getElementById(d1).innerHTML);
        mywindow.document.write('&nbsp;<br>');
        mywindow.document.write("<h4><u>label " + this.config.ulxCullRate + "% Guaranteed Cull Rate</u></h4>&nbsp;<br>" + document.getElementById(d2).innerHTML);

        mywindow.document.write('&nbsp;<br>');
        this.chartP = false;
        mywindow.document.write("&nbsp;<br>" + document.getElementById(d33).innerHTML + "&nbsp;<br>");
        this.chartP = true;

        mywindow.document.write("&nbsp;<br><b>Terms of use : </b>" + document.getElementById("TnC").innerHTML + '&nbsp;<br>&nbsp;<br><script>window.print();</script></body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/
        return true;
    }
}
