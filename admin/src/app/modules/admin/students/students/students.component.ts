import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'students',
    templateUrl: './students.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentsComponent {
    /**
     * Constructor
     */
    constructor() {
    }
}
