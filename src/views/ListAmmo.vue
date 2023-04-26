<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Ammunition</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content>
            <ion-searchbar v-model="searchQuery" placeholder="Search ammo"></ion-searchbar>
            <ion-item>
                <ion-label>Caliber</ion-label>
                <ion-select v-model="selectedCaliber" placeholder="Select caliber">
                    <ion-select-option value="">All</ion-select-option>
                    <ion-select-option v-for="caliber in calibers" :value="caliber" :key="caliber">
                        {{ caliber }}
                    </ion-select-option>
                </ion-select>
            </ion-item>
            <ion-list v-if="!loading">
                <ion-item v-for="ammo in filteredAmmo" :key="ammo.id" button lines="none">
                    <ion-label>{{ ammo.item.name }}</ion-label>
                </ion-item>
            </ion-list>
            <ion-spinner v-if="loading" class="ion-text-center"></ion-spinner>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSearchbar, IonSelect, IonSelectOption, IonSpinner } from "@ionic/vue";
import axios from "axios";
import infiniteScroll from "vue-infinite-scroll";

export default {
    name: "ListAmmo",
    components: {
        IonPage,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonList,
        IonItem,
        IonLabel,
        IonSearchbar,
        IonSelect,
        IonSelectOption,
        IonSpinner,
    },
    directives: {
        infiniteScroll,
    },
    data() {
        return {
            ammo: [],
            calibers: [],
            searchQuery: "",
            selectedCaliber: "",
            loading: false,
        };
    },
    computed: {
        filteredAmmo() {
            let filtered = this.ammo.filter((ammo) => {
                const matchesCaliber = !this.selectedCaliber || ammo.caliber === this.selectedCaliber;
                const matchesSearch = !this.searchQuery || ammo.item.name.toLowerCase().includes(this.searchQuery.toLowerCase());
                return matchesCaliber && matchesSearch;
            });

            return filtered;
        },
    },
    methods: {
        async fetchAmmo() {
            const cachedAmmo = localStorage.getItem("ammo");
            if (cachedAmmo) {
                this.ammo = JSON.parse(cachedAmmo);
                this.calibers = [...new Set(this.ammo.map((ammo) => ammo.caliber))];
            } else {
                this.loading = true;
                const query = `
        query {
          ammo(lang: fr) {
            item {
              id
              name
            }
            caliber
            tracer
            damage
            armorDamage
            fragmentationChance
            penetrationPower
            lightBleedModifier
            heavyBleedModifier
          }
        }`;
                try {
                    const response = await axios.post("https://api.tarkov.dev/graphql", {
                        query: query,
                    });
                    this.ammo = response.data.data.ammo;
                    this.calibers = [...new Set(this.ammo.map((ammo) => ammo.caliber))];
                    localStorage.setItem("ammo", JSON.stringify(this.ammo));
                } catch (error) {
                    console.error("Error fetching ammo:", error);
                } finally {
                    this.loading = false;
                }
            }
        },
    },
    async created() {
        await this.fetchAmmo();
    },
};
</script>
