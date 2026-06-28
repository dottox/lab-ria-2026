import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
  },
  {
    path: '/tourism',
    name: 'Tourism',
    component: () => import('@/pages/Tourism.vue'),
  },
  {
    path: '/tourism/:slug',
    name: 'tourism-detail',
    component: () => import('@/pages/TourismDetail.vue'),
  },
  {
    path: '/climate',
    name: 'Climate',
    component: () => import('@/pages/Climate.vue'),
  },
  {
    path: '/events',
    name: 'Events',
    component: () => import('@/pages/Events.vue'),
  },
  {
    path: '/events/:id',
    name: 'EventView',
    component: () => import('@/pages/EventView.vue'),
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('@/pages/Statistics.vue'),
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('@/pages/Favorites.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, left: 0 }
  },
});

export default router;
