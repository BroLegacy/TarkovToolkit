<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button defaultHref="/" />
                </ion-buttons>
                <ion-title>Ammunition Details</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content>
            <ion-list lines="full">
                <ion-item>
                    <ion-label>Nom</ion-label>
                    <ion-note slot="end">{{ ammo.item.name }}</ion-note>
                </ion-item>

                <ion-item>
                    <ion-label>Calibre</ion-label>
                    <ion-note slot="end">{{ ammo.caliber }}</ion-note>
                </ion-item>

                <ion-item>
                    <ion-label>Traçante</ion-label>
                    <ion-note v-if="(ammo.tracer === false)" slot="end">Non</ion-note>
                    <ion-note v-if="(ammo.tracer === true)" slot="end">Oui</ion-note>
                </ion-item>

                <ion-item>
                    <ion-label>Dégât de chair</ion-label>
                    <ion-note slot="end">{{ ammo.damage }}</ion-note>
                </ion-item>

                <ion-item>
                    <ion-label>Dégât sur pare-balles</ion-label>
                    <ion-note slot="end">{{ ammo.armorDamage }}</ion-note>
                </ion-item>

                <ion-item>
                    <ion-label>Taux de pénétration</ion-label>
                    <ion-note slot="end">{{ ammo.penetrationPower }} / 100</ion-note>
                </ion-item>

                <ion-item>
                    <ion-label>Chance de Fragmentation</ion-label>
                    <ion-note slot="end">{{ ammo.fragmentationChance }} / 1</ion-note>
                </ion-item>

                <ion-item>
                    <ion-label>Chance d'hémorragie légère</ion-label>
                    <ion-note slot="end">{{ ammo.lightBleedModifier }} / 1</ion-note>
                </ion-item>

                <ion-item>
                    <ion-label>Chance d'hémorragie importante</ion-label>
                    <ion-note slot="end">{{ ammo.heavyBleedModifier }} / 1</ion-note>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script>
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButtons,
    IonBackButton
} from "@ionic/vue";
import axios from "axios";

export default {
    name: "AmmoDetails",
    components: {
        IonBackButton, IonButtons,
        IonPage,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonList,
        IonItem,
        IonLabel,
    },
    data() {
        return {
            ammo: {},
        };
    },
    methods: {
        async fetchAmmo() {
            const cachedAmmo = localStorage.getItem("ammo");
            if (cachedAmmo) {
                this.ammo = JSON.parse(cachedAmmo).find(
                    (ammo) => ammo.item.id === this.$route.params.id
                );
            } else {
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
                    const ammoData = response.data.data.ammo;
                    localStorage.setItem("ammo", JSON.stringify(ammoData));
                    this.ammo = ammoData.find((ammo) => ammo.item.id === this.$route.params.id);
                } catch (error) {
                    console.error("Error fetching ammo:", error);
                }
            }
        },
    },
    async created() {
        await this.fetchAmmo();
    },
};
</script>