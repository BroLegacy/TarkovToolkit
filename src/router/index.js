import { createRouter, createWebHistory } from '@ionic/vue-router';
import Home from "@/views/Home.vue";
import Items from "@/views/Items.vue";
import Item from "@/views/Item.vue";

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/items',
    component: Items,
  },
  {
    path: '/item',
    component: Item,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
