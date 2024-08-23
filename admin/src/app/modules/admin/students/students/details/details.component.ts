import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IStudent, ISubscription } from '../students.types';
import { StudentService } from '../students.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class DetailsComponent implements OnInit {

    studentId: string = '';
    student?: IStudent;
    isLoading: boolean = false;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private studentService: StudentService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
        this.studentId = this.activatedRoute.snapshot.params['id'];
    }

    ngOnInit() {
        this.getStudent();
    }

    getStudent() {
        this.isLoading = true;
        this.studentService.getStudentById(this.studentId, {}).subscribe(
            (results: any) => {
                this.student = results.data;
                this._changeDetectorRef.markForCheck();
                this.isLoading = false;
            }, (err) => {
                console.log(err)
            }, () => { });
    }

    onBack() {
        this.router.navigate(['students']);
    }

}
