import { Route } from '@angular/router';
import { StudentsComponent } from './students/students.component';
import { ListComponent } from './students/list/list.component';
import { FormComponent } from './students/form/form.component';
import { DetailsComponent } from './students/details/details.component';

export const StudentsRoutes: Route[] = [
    {
        path: '',
        component: StudentsComponent,
        children: [
            { path: '', component: ListComponent, },
            { path: 'add', component: FormComponent, },
            { path: 'edit/:id', component: FormComponent, },
            { path: ':id', component: DetailsComponent, },
        ]
    }
];
