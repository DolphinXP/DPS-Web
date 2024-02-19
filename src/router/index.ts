import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WorkTemplate from '@/views/workflow/WorkTemplate.vue'
import WorkItems from "@/views/workflow/WorkItems.vue";
import Workflow from "@/views/workflow/Workflow.vue";
import TestView1 from "@/views/test/TestView1.vue";
import CreateWorkflowTemplate from "@/views/workflow/CreateWorkflowTemplate.vue";

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
            path: '/work-template',
            name: 'work-template',
            component: WorkTemplate
        },
        {
            path: '/create-workflow-template',
            name: 'create-workflow-template',
            component: CreateWorkflowTemplate,
        },
        {
            path: '/work-items',
            name: 'work-items',
            component: WorkItems
        }, {
            path: '/workflow',
            name: 'workflow',
            component: Workflow
        },
    ]
})

export default router
