import Vue from 'vue'
import Router from 'vue-router'
import store from '../store';
// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')


// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/Login')
const Register = () => import('@/views/pages/Register')

// Newspaper
const Newspaper = () => import('@/views/newspaper/List');
const Users = () => import('@/views/User/List');
const Payment = () => import('@/views/payment/List');
Vue.use(Router)

const router = new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode history
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})

function configRoutes () {
  return [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: TheContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,
          meta: {requiresAuth: true},
        },
        {
          path: 'newspaper',
          name: 'Newspaper',
          component: Newspaper,
          meta: {requiresAuth: true},
        },
        {
          path: 'payment',
          name: 'Payment',
          component: Payment,
          meta: {requiresAuth: true},
        },
        {
          path: 'users',
          name: 'Users',
          component: Users,
          meta: {requiresAuth: true},
        },
      ]
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render (c) { return c('router-view') }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500
        },
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'register',
          name: 'Register',
          component: Register
        }
      ]
    }
  ]
}



router.beforeEach((to,from,next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if(store.getters.isLoggedIn){
      // console.log(store.getters.isLoggedIn);
      next()
      return 
    }else {
      next({
        name: 'Login'
      });
    }
  }else{
    next();
  }
});

export default router;