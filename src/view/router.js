import VueRouter from 'vue-router'
import store from "../store/index"

const routes = [
  {
    path: '/login',
    name: 'login',
    component: (resolve) =>require(['./login/index'],resolve),
  },
  {
    path: '/preview',
    name: 'preview',
    component: (resolve) =>require(['./preview/index'],resolve),
    children:[
      {
        path: '/article',
        name: 'article',
        component: function (resolve) {
          require(['./systemMgt/article'], resolve)
        }
      },
      {
        path: '/paryMgt',
        name: 'paryMgt',
        component: function (resolve) {
          require(['./systemMgt/paryMgt'], resolve)
        }
      },
      {
        path: '/tagMgt',
        name: 'tagMgt',
        component: function (resolve) {
          require(['./systemMgt/tagMgt'], resolve)
        }
      },
      {
        path: '/zoneMgt',
        name: 'zoneMgt',
        component: function (resolve) {
          require(['./systemMgt/zoneMgt'], resolve)
        }
      },
      {
        path: '/imageMgt',
        name: 'imageMgt',
        component: function (resolve) {
          require(['./systemMgt/imageMgt'], resolve)
        }
      },
      {
        path: '/userMgt',
        name: 'userMgt',
        component: function (resolve) {
          require(['./systemMgt/userMgt'], resolve)
        }
      },
    ]
  },
]

const router = new VueRouter({
  routes: routes,
  store
})

// router.beforeEach(((to,from,next ) =>{
//   let token = window.localStorage.getItem('token');
//   if(!token && to.path !== '/login'){
//     next('/login');
//   }else{
//     next();
//   }
// } ))

export default router
