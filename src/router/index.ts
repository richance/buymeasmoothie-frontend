import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue';
import Connect from '@/views/Connect.vue';
import SelectAsset from '@/views/SelectAsset.vue';
import Widget from '@/views/createWidget/Widget.vue';
import DonateNotFound from '@/views/DonateNotFound.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/send',
        name: 'Send',
        component: Home
    },
    {
        path: '/connect',
        name: 'Connect',
        component: Connect,
    },
    {
        path: '/select',
        name: 'SelectAsset',
        component: SelectAsset,
    },
    {
        path: '/widget',
        name: 'Widget',
        component: Widget,
    },
    {
        path: '/donatenotfound',
        name: 'DonateNotFound',
        component: DonateNotFound,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router
