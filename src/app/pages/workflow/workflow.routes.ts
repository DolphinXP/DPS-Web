import {Routes} from '@angular/router';
import {WorkflowListComponent} from "./workflow-list/workflow-list.component";

export const WORKFLOW_ROUTES: Routes = [
    {path: 'list', component: WorkflowListComponent},
];
