import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/linhas',
    name: 'Linhas',
    component: () => import(/* webpackChunkName: "linhas" */ '../views/Linhas.vue')
  },
  {
    path: '/mapa',
    name: 'Mapa',
    component: () => import(/* webpackChunkName: "mapa" */ '../views/Mapa.vue')
  },
  {
    path: '/mapa-itinerario/:codItinerario',
    name: 'MapaItinerario',
    component: () => import(/* webpackChunkName: "MapaItinerario" */ '../views/MapaItinerario.vue')
  }
]

const router = new VueRouter({
  mode: 'hash', //  "hash" | "history" | "abstract".
  base: process.env.BASE_URL,
  routes
})

export default router
