<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button defaultHref="/search"></ion-back-button>
                </ion-buttons>
                <ion-title>{{ item.name }}</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-card>
                <img :src="item.inspectImageLink" :alt="item.name" />
                <ion-card-header>
                    <ion-card-subtitle>{{ item.category.name }}</ion-card-subtitle>
                    <ion-card-title>{{ item.name }}</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <!-- afficher plus d'informations ici si nécessaire -->
                </ion-card-content>
            </ion-card>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent } from "@ionic/vue";
import axios from "axios";

export default {
    name: "Item",
    components: {
        IonPage,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonTitle,
        IonContent,
        IonCard,
        IonCardHeader,
        IonCardSubtitle,
        IonCardTitle,
        IonCardContent
    },
    data() {
        return {
            item: null
        };
    },
    async created() {
        const itemId = this.$route.params.id;
        const cachedItem = localStorage.getItem(`item-${itemId}`);
        if (cachedItem) {
            this.item = JSON.parse(cachedItem);
        } else {
            try {
                const query = `
          query {
            item(id: "${itemId}") {
              id
              name
              inspectImageLink
              category {
                id
                name
              }
            }
          }`;
                const response = await axios.post("https://api.tarkov.dev/graphql", {
                    query: query
                });
                this.item = response.data.data.item;
                localStorage.setItem(`item-${itemId}`, JSON.stringify(this.item));
            } catch (error) {
                console.error(`Error fetching item ${itemId}:`, error);
            }
        }
    }
};
</script>