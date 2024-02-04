import {Routes} from '@angular/router';
import {WorkItemListComponent} from "./work-item-list/work-item-list.component";

export const WORK_ITEM_ROUTES: Routes = [
    {path: 'list', component: WorkItemListComponent},
];
