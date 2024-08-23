import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { IStudent, ISubscription } from '../students.types';
import { StudentService } from '../students.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { fuseAnimations } from '@fuse/animations';
import { valid } from 'chroma-js';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class FormComponent implements OnInit {
    studentForm!: UntypedFormGroup;
    studentId: string = '';
    student?: IStudent;
    model: any = {};
    isLoading: boolean = false;
    user: any;
    years: any[] = ['2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'];
    levels: any[] = [
        { id: 1, name: 'الأول', min: 6, max: 7 },
        { id: 2, name: 'الثاني', min: 8, max: 9 },
        { id: 3, name: 'الثالث', min: 10, max: 11 },
        { id: 4, name: 'الرابع', min: 12, max: 13 },
        { id: 5, name: 'الخامس', min: 14, max: 15 },
        { id: 6, name: 'السادس', min: 16, max: 111 },
    ]
    filteredLevels: any[] = [];

    constructor(
        private fb: UntypedFormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private studentService: StudentService,
        private _changeDetectorRef: ChangeDetectorRef,
        private userService: UserService,
    ) {
        this.initForm();
        this.studentId = this.activatedRoute.snapshot.params['id'];
    }

    ngOnInit() {
        this.userService.user$.subscribe((res) => this.user = res);
        if (this.studentId) {
            this.getStudent();
        }
        this.studentForm.get('nationalID').valueChanges.subscribe((res) => {
            res.length === 14 ? this.detectNationalID(res) : null;
        })

    }

    detectNationalID(nationalID: number) {
        let centurySymbol: number = nationalID[0];
        let genderSymbol: number = nationalID[12];
        let yearSymbol: string = String(nationalID[1]) + String(nationalID[2]);
        let month: string = String(nationalID[3]) + String(nationalID[4]);
        let day: string = String(nationalID[5]) + String(nationalID[6]);

        let year = centurySymbol == 2 ? `19${yearSymbol}` : `20${yearSymbol}`;
        let dateOfBirth: string = `${year}/${month}/${day}`
        let gender: string = (genderSymbol & 1) ? 'male' : 'female';
        this.studentForm.patchValue({
            gender: gender,
            dateOfBirth: new Date(dateOfBirth),
        });
    }

    calculateAge(birthDate: any, otherDate: any) {
        birthDate = new Date(birthDate);
        otherDate = new Date(otherDate);

        var years = (otherDate.getFullYear() - birthDate.getFullYear());

        if (otherDate.getMonth() < birthDate.getMonth() ||
            otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
            years--;
        }

        return years;
    }

    initForm() {
        this.studentForm = new UntypedFormGroup({
            name: new UntypedFormControl(null, Validators.required),
            nationalID: new UntypedFormControl(null, [Validators.required, Validators.minLength(14), Validators.maxLength(14)]),
            gender: new UntypedFormControl(null, Validators.required),
            address: new UntypedFormControl(null, Validators.required),
            dateOfBirth: new UntypedFormControl(null, Validators.required),
            phoneNumber: new UntypedFormControl(null, Validators.required),
            isReceived: new UntypedFormControl(false, Validators.required),
            note: new UntypedFormControl(null),
            status: new UntypedFormControl(false, Validators.required),
            subscriptions: new UntypedFormArray([this.createSubscription()], Validators.required)
        });
    }

    getStudent() {
        this.isLoading = true;
        this.studentService.getStudentById(this.studentId, {}).subscribe(
            (results: any) => {
                this.student = results.data;
                this.fillForm();
                this._changeDetectorRef.markForCheck();
                this.isLoading = false;
            }, (err) => {
                console.log(err)
                this.isLoading = false;
            }, () => { });
    }

    fillForm() {
        this.studentForm.patchValue({
            name: this.student?.name,
            nationalID: this.student?.nationalID,
            gender: this.student?.gender,
            address: this.student?.address,
            dateOfBirth: this.student?.dateOfBirth,
            phoneNumber: this.student?.phoneNumber,
            isReceived: this.student?.isReceived,
            note: this.student?.note,
            status: this.student?.status
        });
        this.onAddSubscription(this.student?.subscriptions);
        this.student?.subscriptions?.map((el: any, idx: number) => {
            this.subscriptions.at(idx)?.patchValue(el);
            // console.log(el)
            this.filteredLevels[idx] = this.levels.filter((level) => level.id == el.level);
        });
    }

    get subscriptions(): UntypedFormArray {
        return this.studentForm.get('subscriptions') as UntypedFormArray;
    }

    set subscriptions(value: any) {
        this.studentForm.get('subscriptions')?.setValue(value);
    }

    createSubscription() {
        return new UntypedFormGroup({
            year: new UntypedFormControl(null, Validators.required),
            level: new UntypedFormControl(null, Validators.required),
            score: new UntypedFormControl(null),
        });
    }

    onAddSubscription(arr?: ISubscription[]): void {
        const subscriptions = this.studentForm.get('subscriptions') as UntypedFormArray;
        if (arr) {
            arr.map(() => subscriptions.push(this.createSubscription()));
            subscriptions.removeAt(arr.length);
        } else subscriptions.push(this.createSubscription());
    }

    onDeleteSubscription(view: any, index: number) {
        this.subscriptions.removeAt(index);
        // view.remove()
    }

    subscriptionOrder(currentIndex: number, targetIndex: number) {
        let currentPage = this.subscriptions.at(currentIndex);
        this.subscriptions.removeAt(currentIndex);
        this.subscriptions.insert(targetIndex, currentPage);
    }

    onYearChange(value: any, index: number) {
        this.subscriptions.controls.map((control: any, idx: any, arr: any) => {
            let year = control.get('year').value == value && idx == index ? value : null;
            let isLastWinner = arr[idx - 1]?.get('score')?.value >= 50;
            let lastLevel = arr[idx - 1]?.get('level')?.value;
            let bDate = this.studentForm.get('dateOfBirth')?.value;
            let cDate = `${year}/10/01`;
            let age = this.calculateAge(bDate, cDate)
            this.filteredLevels[index] = this.levels.filter((el) => (el.min <= age && el.max >= age) && !(el.id == lastLevel && isLastWinner));
        })
    }

    submitForm(): void {
        this.isLoading = true;
        this.setModelValues();
        if (this.studentForm.controls['nationalID'].valid) {
            if (!this.studentId)
                this.studentService.createStudent(this.model).subscribe(
                    (res) => {
                        this.router.navigate(['students']);
                        this._changeDetectorRef.markForCheck();
                        this.isLoading = false;
                    },
                    (err) => {
                        if (err?.error?.message?.includes('duplicate key error') || err?.error?.message?.includes('dup key')) {
                            this.studentForm.controls['nationalID'].setErrors({ duplicate: true });
                        }
                    },
                    () => { }
                );
            else
                this.studentService.updateStudent(this.studentId, this.model).subscribe(
                    () => {
                        this.router.navigate(['students']);
                        this._changeDetectorRef.markForCheck();
                        this.isLoading = false;
                    },
                    (err) => {
                        if (err?.error?.message?.includes('duplicate key error') || err?.error?.message?.includes('dup key')) {
                            this.studentForm.controls['nationalID'].setErrors({ duplicate: true });
                        }
                    },
                    () => { }
                );
        } else {
            Object.values(this.studentForm.controls).forEach((control) => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
                this.isLoading = false;
            });
        }
    }

    setModelValues() {
        const formModel = this.studentForm.value;
        this.model.name = formModel.name;
        this.model.nationalID = formModel.nationalID;
        this.model.gender = formModel.gender;
        this.model.address = formModel.address;
        this.model.dateOfBirth = formModel.dateOfBirth;
        this.model.phoneNumber = formModel.phoneNumber;
        this.model.isReceived = formModel.isReceived;
        this.model.note = formModel.note;
        this.model.status = formModel.status;
        this.model.subscriptions = formModel.subscriptions;
        if (!this.studentId) {
            this.model.createdBy = this.user._id;
        }
        this.model.updatedBy = this.user._id;
    }

    onBack() {
        this.router.navigate(['students']);
    }

}
