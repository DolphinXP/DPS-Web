import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WorkTemplate from '@/views/workflow/WorkTemplate.vue'
import WorkItems from "@/views/workflow/WorkItems.vue";
import TestView1 from "@/views/test/TestView1.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/test/TestView1.vue')
        },
        {
            path: '/work-template',
            name: 'work-template',
            component: WorkTemplate
        }, {
            path: '/work-items',
            name: 'work-items',
            component: WorkItems
        }, {
            path: '/workflow',
            name: 'workflow',
            component: TestView1
        },
    ]
})

export default router
