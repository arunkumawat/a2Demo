import { Component, ViewContainerRef } from '@angular/core';
import { PostsService } from './services/post.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
    selector: 'my-app',
    templateUrl: `./app/components/app.component.html`,
    providers: [PostsService]
})

export class AppComponent {
    constructor(private ps: PostsService, public toastr: ToastsManager, public vcr: ViewContainerRef){
        this.toastr.setRootViewContainerRef(vcr);
    }
}
