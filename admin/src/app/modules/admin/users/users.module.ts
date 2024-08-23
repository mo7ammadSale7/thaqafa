import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { usersRoutes } from './users.routing';
import { UsersComponent } from './users/users.component';
import { QuillModule } from 'ngx-quill';
import { ListComponent } from './users/list/list.component';
import { FormComponent } from '../users/users/form/form.component';
import { DetailsComponent } from './users/details/details.component';
import { FormPasswordComponent } from './users/form-password/form-password.component';


@NgModule({
    declarations: [
        UsersComponent,
        ListComponent,
        FormComponent,
        DetailsComponent,
        FormPasswordComponent
    ],
    imports: [
        RouterModule.forChild(usersRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSortModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTooltipModule,
        SharedModule,
        QuillModule.forRoot(),
    ]
})
export class UsersModule {
}
