import Vue from 'vue';
import Router from 'vue-router';
// import store from '@/store.js';
import Profile from './views/Profile'
import History from './views/History'
import Login from './views/Login'
import Register from './views/Register'
import Information from './views/Information'
import Mapcontainer from './components/Map'
import Navigation from './components/Navigation/Navigation'
// import ShowMapPickup from './components/ShowMapPickup'
Vue.use(Router);

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'mapcontainer',
            component: Mapcontainer
        },
        {
            path: '/navigation',
            name: 'navigation',
            component: Navigation
        },
        {
            path: '/profile',
            name: 'profile',
            component: Profile,
            meta: {
                authRequired: true
            }
        },
        {
            path: '/history',
            name: 'history',
            component: History
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/information',
            name: 'information',
            component: Information
        }
    ]
});

// router.beforeEach((to, from, next) => {
//     if (to.matched.some(record => record.meta.authRequired)) {
//         if (!store.state.isAuthenticated) {
//             next({
//                 path: '/sign-in'
//             });
//         } else {
//             next();
//         }
//     } else {
//         next();
//     }
// });

export default router;
