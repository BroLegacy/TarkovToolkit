import { createRouter, createWebHistory } from '@ionic/vue-router';
import Home from "@/views/Home.vue";
import Item from "@/views/Item.vue";
import ItemList from "@/views/ItemList.vue";

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/search',
    component: ItemList,
  },
  {
    path: '/item/:id',
    name: 'Item',
    component: Item
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
