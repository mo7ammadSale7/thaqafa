import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../users.service';
import { IUser } from '../users.types';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class DetailsComponent implements OnInit {

    userId: string = '';
    user?: IUser;
    isLoading: boolean = false;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
        this.userId = this.activatedRoute.snapshot.params['id'];
    }

    ngOnInit() {
        this.getUser();
    }

    getUser() {
        this.isLoading = true;
        this.userService.getUserById(this.userId, {}).subscribe(
            (results: any) => {
                this.user = results.data;
                this._changeDetectorRef.markForCheck();
                this.isLoading = false;
            }, (err) => {
                console.log(err)
            }, () => { });
    }

    update(userId: string) {
        this.router.navigate(['settings', 'users', 'edit', userId])
    }

}
