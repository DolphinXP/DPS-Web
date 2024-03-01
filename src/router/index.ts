import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WorkTemplate from '@/views/workflow/WorkTemplate.vue'
import WorkItems from "@/views/workflow/WorkItems.vue";
import Workflow from "@/views/workflow/Workflow.vue";
import TestView1 from "@/views/test/TestView1.vue";
import NomadJobs from "@/views/test/NomadJobs.vue";
import WorkTemplateDesign from "@/views/workflow/WorkTemplateDesign.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/test1',
            name: 'test1',
            component: TestView1
        },
        {
            path: '/test2',
            name: 'test2',
            component: NomadJobs
        },
        {
            path: '/WorkTemplate',
            name: 'WorkTemplate',
            component: WorkTemplate
        },
        {
            // create
            path: '/WorkTemplateDesign',
            name: 'WorkTemplateDesign',
            component: WorkTemplateDesign,
        },
        {
            // update
            path: '/WorkTemplateDesign',
            name: 'WorkTemplateDesign',
            component: WorkTemplateDesign,
            props: true
        },
        {
            path: '/WorkItems',
            name: 'WorkItems',
            component: WorkItems
        }, {
            path: '/Workflow',
            name: 'Workflow',
            component: Workflow
        },
    ]
})

export default router
