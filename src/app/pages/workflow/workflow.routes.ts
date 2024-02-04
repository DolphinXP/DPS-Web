import {Routes} from '@angular/router';
import {WorkflowListComponent1} from "./list/workflow-list-component1.component";
import {WorkflowCreateComponent} from "./create/workflow-create.component";

export const WORKFLOW_ROUTES: Routes = [
    {path: 'list', component: WorkflowListComponent1},
    {path: 'create', component: WorkflowCreateComponent},
];
