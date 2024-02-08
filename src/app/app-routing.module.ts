import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: '/welcome'},
    {path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule)},
    {path: 'test', loadChildren: () => import('./pages/test/test.routes').then(m => m.TEST_ROUTES)},
    {path: 'work-item', loadChildren: () => import('./pages/work-item/work-item.routes').then(m => m.WORK_ITEM_ROUTES)},
    {
        path: 'work-template',
        loadChildren: () => import('./pages/work-template/work-template.routes').then(m => m.WORK_TEMPLATE_ROUTES)
    },
    {path: 'workflow', loadChildren: () => import('./pages/workflow/workflow.routes').then(m => m.WORKFLOW_ROUTES)},
    {path: 'nomad', loadChildren: () => import('./pages/nomad/nomad.routes').then(m => m.NOMAD_ROUTES)},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
