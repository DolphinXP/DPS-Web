import {Routes} from '@angular/router';
import {WorkTemplateListComponent} from "./work-template-list/work-template-list.component";

export const WORK_TEMPLATE_ROUTES: Routes = [
    {path: 'list', component: WorkTemplateListComponent},
];
