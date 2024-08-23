import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { IUser } from '../users.types';
import { UserService } from '../users.service';
import { Router } from '@angular/router';

@Component({
    selector: 'users-list',
    templateUrl: './list.component.html',
    styles: [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: 48px auto auto 48px;

                @screen sm {
                    grid-template-columns: 48px auto auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 48px auto auto 112px 112px 72px;
                }

                @screen lg {
                    grid-template-columns: 48px auto auto 112px 96px 96px 72px;
                }
            }
        `
    ],
    /* encapsulation: ViewEncapsulation.None, */
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
    users: IUser[] = [];
    isLoading: boolean = false;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedUser: any;
    selectedUserForm: UntypedFormGroup;
    pageIndex = 0;
    pageSize = 10;
    totalUsers: number;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _fuseConfirmationService: FuseConfirmationService,
        private _userService: UserService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router
    ) {
    }

    /* ----------------------------------------------------------------------------------------------------- */
    /* @ Lifecycle hooks */
    /* ----------------------------------------------------------------------------------------------------- */

    /**
     * On init
     */
    ngOnInit(): void {
        /* Get the blogs */
        this.getUsers()

        this.searchInputControl.valueChanges.subscribe((search) => {
            this.getUsers(search)
        })
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        /* if (this._paginator) {
            this.pageIndex = this._paginator.pageIndex
            this.pageSize = this._paginator.pageSize
            this.getBlogs()
        } */
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        /* Unsubscribe from all subscriptions */
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    /* ----------------------------------------------------------------------------------------------------- */
    /* @ Public methods */
    /* ----------------------------------------------------------------------------------------------------- */

    /**
     * Get All Blogs
     */
    getUsers(search?: string) {
        let params = {
            page: this.pageIndex + 1,
            limit: this.pageSize,
            search: search ? search : '',
            searchBy: search ? 'name' : '',
        }
        this.isLoading = true;
        this._userService.getAllUsers({ params }).subscribe((response) => {
            this.users = response.data;
            this.totalUsers = response.results;
            this.isLoading = false;
            this._changeDetectorRef.markForCheck();
        })
    }

    public getPaginatorData(event: PageEvent) {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getUsers()
        return event;
    }



    /**
     * Update the user
     */
    showUser(userId: string): void {
        this._router.navigate(['settings', 'users', userId])
    }


    /**
     * Create user
     */
    createUser(): void {
        this._router.navigate(['settings', 'users', 'add'])
    }

    /**
     * Update the user
     */
    updateUser(userId: string): void {
        this._router.navigate(['settings', 'users', 'edit', userId])
    }

    updateUserPassword(userId: string): void {
        this._router.navigate(['settings', 'users', 'update-password', userId]);
    }

    /**
     * Delete the user
     */
    deleteUser(userId: string): void {
        /* Open the confirmation dialog */
        const confirmation = this._fuseConfirmationService.open({
            title: 'حذف المستخدم',
            message: 'هل أنت متأكد من حذف المستخدم؟ هذا الإجراء لا عودة فيه!',
            actions: {
                confirm: {
                    label: 'حذف'
                },
                cancel: {
                    label: 'إلغاء'
                }
            }
        });

        /* Subscribe to the confirmation dialog closed action */
        confirmation.afterClosed().subscribe((result) => {

            /* If the confirm button pressed... */
            if (result === 'confirmed') {
                /* Delete the user on the server */
                this._userService.deleteUser(userId).subscribe(() => {
                    this.getUsers()
                    this._changeDetectorRef.markForCheck();
                });

            }
        });
    }


    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
