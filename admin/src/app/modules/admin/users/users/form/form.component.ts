import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { IUser } from '../users.types';
import { UserService } from '../users.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class FormComponent implements OnInit {
    userForm!: UntypedFormGroup;
    userId: string = '';
    image: any = '';
    isImageLoading: boolean = false;
    user?: IUser;
    model: any = {};
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
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
        if (this.userId) {
            this.getUser();
        }
    }

    initForm() {
        this.userForm = this.fb.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            role: ['', [Validators.required]],
            photo: [''],
            password: [''],
            status: [''],
            courses: [['']],
            favoriteCourses: [['']],
        });
    }


    getUser() {
        this.isLoading = true;
        this.userService.getUserById(this.userId, {}).subscribe(
            (results: any) => {
                this.user = results.data;
                this.fillForm();
                this._changeDetectorRef.markForCheck();
                this.isLoading = false;
            }, (err) => {
                console.log(err)
                this.isLoading = false;
            }, () => { });
    }

    fillForm() {
        this.userForm.patchValue({
            name: this.user?.name,
            email: this.user?.email,
            role: this.user?.role,
            photo: this.user?.photo,
            status: this.user?.status,
        });
        this.image = this.user?.photo;
    }

    /**
     * Upload avatar
     *
     * @param fileList
     */
    uploadAvatar(fileList: FileList): void {
        // Return if canceled
        if (!fileList.length) {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        const file = fileList[0];

        // Return if the file is not allowed
        if (!allowedTypes.includes(file.type)) {
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.image = reader.result?.toString() || '';
            this.userForm.patchValue({ photo: this.image });
            this._changeDetectorRef.markForCheck();
        };
    }

    /**
     * Remove the avatar
     */
    removeAvatar(): void {
        // Get the form control for 'avatar'
        const photoFormControl = this.userForm.get('photo');

        // Set the avatar as null
        photoFormControl.setValue(null);

        // Set the file input value as null
        this._avatarFileInput.nativeElement.value = null;

        this.image = null;
    }

    submitForm(): void {
        this.isLoading = true;
        this.setModelValues();
        if (this.userForm.controls['email'].valid) {
            if (!this.userId)
                this.userService.createUser(this.model).subscribe(
                    (res) => {
                        this.router.navigate(['settings', 'users']);
                        this._changeDetectorRef.markForCheck();
                        this.isLoading = false;
                    },
                    (err) => {
                        if (err?.error?.message?.includes('duplicate key error') || err?.error?.message?.includes('dup key')) {
                            this.userForm.controls['email'].setErrors({ duplicate: true });
                        }
                    },
                    () => { }
                );
            else
                this.userService.updateUser(this.userId, this.model).subscribe(
                    () => {
                        this.router.navigate(['settings', 'users']);
                        this._changeDetectorRef.markForCheck();
                        this.isLoading = false;
                    },
                    (err) => {
                        if (err?.error?.message?.includes('duplicate key error') || err?.error?.message?.includes('dup key')) {
                            this.userForm.controls['email'].setErrors({ duplicate: true });
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
        this.model.name = formModel.name;
        this.model.email = formModel.email;
        this.model.role = formModel.role;
        this.model.photo = formModel.photo;
        this.model.status = formModel.status;
        if (formModel.password) {
            this.model.password = formModel.password;
            this.model.passwordConfirm = formModel.password;
        }
    }

    onBack() {
        this.router.navigate(['settings', 'users']);
    }
}
