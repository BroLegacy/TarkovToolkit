<template>
  <ion-app>
    <ion-router-outlet/>
      <Nav/>
  </ion-app>
</template>

<script setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import Nav from "@/components/Nav.vue";
</script>
