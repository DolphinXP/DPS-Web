import { Routes } from '@angular/router';
import {ListComponent} from "./list/list.component";
import {CreateComponent} from "./create/create.component";

export const WORKFLOW_ROUTES: Routes = [
  { path: 'list', component: ListComponent },
  { path: 'create', component: CreateComponent },
];
