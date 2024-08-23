import { Route } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { ListComponent } from './users/list/list.component';
import { FormComponent } from './users/form/form.component';
import { DetailsComponent } from './users/details/details.component';
import { FormPasswordComponent } from './users/form-password/form-password.component';


export const usersRoutes: Route[] = [
    {
        path: '',
        component: UsersComponent,
        children: [
            { path: '', component: ListComponent, },
            { path: 'add', component: FormComponent, },
            { path: 'edit/:id', component: FormComponent, },
            { path: ':id', component: DetailsComponent, },
            { path: 'update-password/:id', component: FormPasswordComponent },
        ]
    }
];
