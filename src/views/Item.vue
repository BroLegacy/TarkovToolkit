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
                    <p>Nom: {{ items.shortName }}</p>
                    <p>Category: {{ items.category.name }}</p>
                    <a :href="items.wikiLink" target="_blank">WIKI</a>
                    <ion-list>
                        <ion-list-header>Vente:</ion-list-header>
                        <ion-item v-for="price in items.sellFor">
                            <ion-label>
                                {{ price.vendor.name + ": " + price.price + " " + price.currency }}
                            </ion-label>
                        </ion-item>
                    </ion-list>
                </ion-card-content>
            </ion-card>
        </ion-content>
    </ion-page>
</template>


<script>
import {
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
    IonSpinner,
    IonLabel, IonItem
} from "@ionic/vue";
import axios from "axios";

export default {
    name: "Item",
    components: {
        IonItem, IonLabel,
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
          shortName
          wikiLink
          inspectImageLink
          sellFor {
              price
              currency
              vendor {
                name
              }
            }
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