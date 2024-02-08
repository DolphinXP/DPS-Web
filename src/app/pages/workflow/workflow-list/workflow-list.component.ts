import {Component} from '@angular/core';

@Component({
    selector: 'app-workflow-list',
    templateUrl: './workflow-list.component.html',
    standalone: true,
    styleUrls: ['./workflow-list.component.css']
})
export class WorkflowListComponent {
    workflows: any;

    constructor() {

    }
}
