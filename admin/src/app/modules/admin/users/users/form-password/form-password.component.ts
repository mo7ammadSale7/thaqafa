import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { IUser } from '../users.types';
import { UserService } from '../users.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-form-password',
    templateUrl: './form-password.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class FormPasswordComponent implements OnInit {
    userForm!: UntypedFormGroup;
    userId: string = '';
    user?: IUser;
    model: any = {};
    isLoading: boolean = false;

    constructor(
        private fb: UntypedFormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
        this.initForm();
        this.userId = this.activatedRoute.snapshot.params['id'];
    }

    ngOnInit() {
    }

    initForm() {
        this.userForm = this.fb.group({
            password: ['', [Validators.required]],
        });
    }

    submitForm(): void {
        this.isLoading = true;
        this.setModelValues();
        if (this.userForm.controls['password'].valid) {
            this.userService.updateUserPassword(this.model).subscribe(
                (res) => {
                    this.router.navigate(['settings', 'users']);
                    this._changeDetectorRef.markForCheck();
                    this.isLoading = false;
                },
                (err) => {
                    if (err?.error?.message?.includes('duplicate key error') || err?.error?.message?.includes('dup key')) {
                        this.userForm.controls['password'].setErrors({ duplicate: true });
                    }
                },
                () => { }
            );

        } else {
            Object.values(this.userForm.controls).forEach((control) => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
                this.isLoading = false;
            });
        }
    }

    setModelValues() {
        const formModel = this.userForm.value;
        this.model.password = formModel.password;
        this.model.passwordConfirm = formModel.password;
        this.model.id = this.userId
    }

    onBack() {
        this.router.navigate(['settings', 'users']);
    }
}
