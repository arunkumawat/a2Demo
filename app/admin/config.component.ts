import { Component } from '@angular/core';
import * as moment from 'moment/moment';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { PostsService } from '../../services/post.service';
import { Roles } from '../../services/Roles';
import { Util } from '../util';
import { Config } from '../../Types/Config';

@Component({
    moduleId: module.id,
    selector: 'systemConfig',
    templateUrl: 'systemConfig.component.html',
    providers: [PostsService, Roles]
})

export class SystemConfigComponent extends Util {
    config: Config;

    constructor(private ps: PostsService, public toastr: ToastsManager, private roleS: Roles) {
        super();

        this.rolesArr = this.roleS.getUserRoles();
        this.loggedInUserName = roleS.getUserFullName();
        this.config = <Config>{};

        this.busyB = this.ps.get('Calculator/ConfigDetails').subscribe(posts => {
            this.config = posts.data;
        });
    }

    save() {
        this.busyA = this.ps.put('config', this.config).subscribe(posts => {
            if (!posts.isSuccess) {
                this.toastr.error(posts.message, 'Important');
                return;
            }
        });
    }
}
