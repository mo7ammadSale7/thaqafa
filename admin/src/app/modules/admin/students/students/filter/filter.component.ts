import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { StudentService } from '../students.service';

@Component({
    selector: 'filter',
    templateUrl: './filter.component.html',
    encapsulation: ViewEncapsulation.None
})
export class FilterComponent implements OnInit {
    filterForm: UntypedFormGroup;
    model: any = {};
    genderList: any[] = [
        { value: '', label: 'الكل', },
        { value: 'male', label: 'ذكر', },
        { value: 'female', label: 'أنثى', },
    ];
    years: any[] = ['', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'];
    levels: any[] = [
        { id: '', name: 'الكل' },
        { id: 1, name: 'الأول', min: 6, max: 7 },
        { id: 2, name: 'الثاني', min: 8, max: 9 },
        { id: 3, name: 'الثالث', min: 10, max: 11 },
        { id: 4, name: 'الرابع', min: 12, max: 13 },
        { id: 5, name: 'الخامس', min: 14, max: 15 },
        { id: 6, name: 'السادس', min: 16, max: 111 },
    ]


    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<FilterComponent>,
        private _formBuilder: UntypedFormBuilder,
        private studentService: StudentService,
    ) {
        this.initForm()
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.fillForm()
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    initForm() {
        // Create the form
        this.filterForm = this._formBuilder.group({
            gender: [""],
            year: [''],
            level: [''],
            isReceived: [''],
            status: [''],
            createdBy: [null],
            updatedBy: [null],
        });
    }

    fillForm() {
        console.log(this.studentService.filter)
        this.filterForm.patchValue(this.studentService.filter)
    }

    setModelValues() {
        const formModel = this.filterForm.value;
        if (formModel.gender)
            this.model.gender = formModel.gender;
        if (formModel.year)
            this.model['subscriptions.year'] = formModel.year;
        if (formModel.level)
            this.model['subscriptions.level'] = formModel.level;
        if (typeof formModel.isReceived == 'boolean')
            this.model.isReceived = formModel.isReceived;
        if (typeof formModel.status == 'boolean')
            this.model.status = formModel.status;
    }

    setGender(value: any) {
        this.filterForm.patchValue({
            gender: value,
        })
    }

    /**
     * Save and close
     */
    saveAndClose(): void {

        // Close the dialog
        this.matDialogRef.close();
    }

    /**
     * Discard the message
     */
    discard(): void {
        // Close the dialog
        this.matDialogRef.close();
    }

    /**
     * Reset
     */
    reset(): void {
        this.studentService.filter = {};
        this.studentService.modelFilter = {};
        // Close the dialog
        this.matDialogRef.close();
    }



    /**
     * Send the message
     */
    send(): void {
        this.studentService.filter = this.filterForm.value
        this.setModelValues()
        this.studentService.modelFilter = this.model
        this.matDialogRef.close(this.model);
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
