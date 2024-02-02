import {Routes} from '@angular/router';
import {WorkflowListComponent} from "./list/workflow-list.component";
import {WorkflowCreateComponent} from "./create/workflow-create.component";

export const WORKFLOW_ROUTES: Routes = [
  {path: 'list', component: WorkflowListComponent},
  {path: 'create', component: WorkflowCreateComponent},
];
