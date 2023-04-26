<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button defaultHref="/" />
                </ion-buttons>
                <ion-title>Details de l'item</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <ion-card>
                <img :src="items.inspectImageLink" alt="Item image" />

                <ion-card-header>
                    <ion-card-title>{{  }}</ion-card-title>
                </ion-card-header>

                <ion-card-content>
                    <p>Category: {{ items.category.name }}</p>
                    <p>Trader price: {{  }}</p>
                    <p>Flea market price: {{}}</p>
                </ion-card-content>
            </ion-card>
        </ion-content>
    </ion-page>
</template>


<script>
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonSpinner } from "@ionic/vue";
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
        IonCardContent,
        IonSpinner
    },
    data() {
        return {
            items: {},
        };
    },
    methods: {
        async fetchItems() {
            const cachedItems = localStorage.getItem('items');
            if (cachedItems) {
                this.items = JSON.parse(cachedItems).find(
                    (items) => items.id === this.$route.params.id
                );
            } else {
                const query = `
        query {
          items(lang : fr) {
          id
              name
              wikiLink
              avg24hPrice
              inspectImageLink
              category {
              id
                name
              }
        }
        }`;
                try {
                    const response = await axios.post("https://api.tarkov.dev/graphql", {
                        query: query,
                    });
                    const itemsData = response.data.data.items;
                    localStorage.setItem("items", JSON.stringify(itemsData));
                    this.items = itemsData.find((items) => items.item.id === this.$route.params.id);
                } catch (error) {
                    console.error("Error fetching items:", error);
                }
            }
        },
    },
    async created() {
        await this.fetchItems();
    },
};
</script>