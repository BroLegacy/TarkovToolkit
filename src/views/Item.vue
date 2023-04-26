<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button defaultHref="/" />
                </ion-buttons>
                <ion-title>{{ item.name }}</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <ion-spinner v-if="loading"></ion-spinner>

            <ion-card v-if="!loading && item">
                <img :src="item.inspectImageLink" alt="Item image" />

                <ion-card-header>
                    <ion-card-title>{{ item.name }}</ion-card-title>
                </ion-card-header>

                <ion-card-content>
                    <p>{{ item.description }}</p>
                    <p>Category: {{ item.category.name }}</p>
                    <p>Trader price: {{ item.traderPrice }}</p>
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
            item: null,
            loading: true,
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
            item(id: "${itemId}" lang : fr) {
            id
            name
            wikiLink
            avg24hPrice
            inspectImageLink
            category {
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
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>