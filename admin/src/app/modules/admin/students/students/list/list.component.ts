import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil, Subscription } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { IStudent, ISubscription } from '../students.types';
import { StudentService } from '../students.service';
import { MatDialog } from '@angular/material/dialog';
import { FilterComponent } from '../filter/filter.component';

@Component({
    selector: 'students-list',
    templateUrl: './list.component.html',
    styles: [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: auto auto 40px;

                @screen sm {
                    grid-template-columns: auto auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: auto auto 112px 112px 72px 72px 72px;
                }

                @screen lg {
                    grid-template-columns: auto auto 112px 112px 96px 96px 96px 72px 72px 72px;
                }
            }
        `
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
    students: IStudent[] = [];
    subscriptions: ISubscription[] = [];
    isLoading: boolean = false;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    searchSelectControl: UntypedFormControl = new UntypedFormControl('nationalID');
    selectedStudent: any;
    selectedStudentForm: UntypedFormGroup;
    pageIndex = 0;
    pageSize = 10;
    totalStudents: number;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    filter: any = {};
    setScore: Boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _fuseConfirmationService: FuseConfirmationService,
        private _studentService: StudentService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _matDialog: MatDialog,
    ) { }

    /* ----------------------------------------------------------------------------------------------------- */
    /* @ Lifecycle hooks */
    /* ----------------------------------------------------------------------------------------------------- */

    /**
     * On init
     */
    ngOnInit(): void {
        /* Get the Students */
        this.getStudents(this.filter)

        this.searchInputControl.valueChanges.subscribe((search) => {
            this.getStudents(this.filter, search)
        })
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        /* if (this._paginator) {
            this.pageIndex = this._paginator.pageIndex
            this.pageSize = this._paginator.pageSize
            this.getStudents()
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
     * Get All Students
     */
    getStudents(filters: any = {}, search?: string) {
        let searchBy = this.searchSelectControl.value;
        let params = {
            page: this.pageIndex + 1,
            limit: this.pageSize,
            search: search ? search : '',
            searchBy: search ? searchBy : '',
            ...filters
        }
        this.isLoading = true;
        this._studentService.getAllStudents({ params }).subscribe((response) => {
            this.students = response.data;
            this.totalStudents = response.results;
            this.isLoading = false;
            this._changeDetectorRef.markForCheck();
        })
    }

    public getPaginatorData(event: PageEvent) {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getStudents(this.filter)
        return event;
    }

    /**
     * Open compose dialog
     */
    openComposeDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(FilterComponent);

        dialogRef.afterClosed()
            .subscribe((result) => {
                this.filter = result;
                this.getStudents(this.filter)
            });
    }


    addScore(id: string, score: any) {
        let subs = [];
        this._studentService.getStudentById(id, {}).subscribe((result: any) => {
            subs = result?.data?.subscriptions
            subs[subs?.length - 1].score = +score
            this._studentService.updateStudent(id, { subscriptions: subs }).subscribe((res: any) => {
                console.log(res)
            })
        })
    }


    /**
     * Show the Student
     */
    showStudent(studentId: string): void {
        this._router.navigate(['students', studentId])
    }


    /**
     * Create Student
     */
    createStudent(): void {
        this._router.navigate(['students', 'add'])
    }

    /**
     * Update the Student
     */
    updateStudent(studentId: string): void {
        this._router.navigate(['students', 'edit', studentId])
    }

    /**
     * Delete the Student
     */
    deleteStudent(studentId: string): void {
        /* Open the confirmation dialog */
        const confirmation = this._fuseConfirmationService.open({
            title: 'حذف الطالب',
            message: 'هل أنت متأكد من حذف الطالب؟ هذا الإجراء لا عودة فيه!',
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
                /* Delete the Student on the server */
                this._studentService.deleteStudent(studentId).subscribe(() => {
                    this.getStudents(this.filter)
                    this._changeDetectorRef.markForCheck();
                });

            }
        });
    }

    generateXLSX() {
        let params = {
            ...this._studentService.modelFilter
        }
        this._studentService.generateXLSX({ params, responseType: 'blob' }).subscribe((res: any) => {
            saveAs(res, 'file.xlsx')
        })
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
