import { createRouter, createWebHistory } from '@ionic/vue-router';
import Home from "@/views/Home.vue";
import Item from "@/views/Item.vue";
import ItemList from "@/views/ItemList.vue";
import Ammo from "@/views/Ammo.vue";
import ListAmmo from "@/views/ListAmmo.vue";

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/item',
    component: ItemList,
  },
  {
    path: '/item/:id',
    name: 'Item',
    component: Item
  },
  {
    path: '/ammo',
    name: 'AmmoList',
    component: ListAmmo
  },
  {
    path: '/ammo/:id',
    name: 'Ammo',
    component: Ammo
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
