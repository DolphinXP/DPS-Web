import {Routes} from '@angular/router';
import {NomadJobListComponent} from "./job-list/nomad-job-list.component";

export const NOMAD_ROUTES: Routes = [
    {path: 'list', component: NomadJobListComponent},
];
