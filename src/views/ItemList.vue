<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Items</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="itemliste-container">
            <ion-searchbar v-model="searchQuery" @ionChange="updateDisplayedItems()" placeholder="Search items"></ion-searchbar>
            <ion-item>
                <ion-label>Category</ion-label>
                <ion-select v-model="selectedCategory" placeholder="Select category" @ionChange="updateDisplayedItems()">
                    <ion-select-option value="">All</ion-select-option>
                    <ion-select-option
                        v-for="category in getCategoriesWithItems()"
                        :value="category.id"
                        :key="category.id"
                    >
                        {{ category.name }}
                    </ion-select-option>
                </ion-select>
            </ion-item>
            <ion-list v-if="!loading">
                <ion-item
                    v-for="item in displayedItems"
                    :key="item.id"
                    button
                    lines="none"
                    @click="navigateToItem(item.id)"
                >
                    <ion-label>{{ item.name }}</ion-label>
                </ion-item>
            </ion-list>
            <ion-spinner v-if="loading" class="ion-text-center"></ion-spinner>
            <ion-buttons class="ion-padding">
                <ion-button @click="previousPage" :disabled="currentPage === 1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="black" class="bi bi-arrow-left-short" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
                    </svg>
                </ion-button>
                <ion-label>{{ currentPage }}</ion-label>
                <ion-button @click="nextPage" :disabled="currentPage === totalPages">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="black" class="bi bi-arrow-right-short" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                    </svg>
                </ion-button>
            </ion-buttons>
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
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonButtons,
    IonButton
} from "@ionic/vue";
import axios from "axios";

export default {
    name: "ItemList",
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
        IonButtons,
        IonButton
    },
    data() {
        return {
            items: [],
            categories: [],
            searchQuery: "",
            selectedCategory: "",
            loading: false,
            displayedItems: [],
            itemsPerPage: 20,
            currentPage: 1,
        };
    },
    computed: {
        filteredItems() {
            return this.items.filter((item) => {
                const matchesCategory = !this.selectedCategory || item.category.id === this.selectedCategory;
                const matchesSearch = !this.searchQuery || item.name.toLowerCase().includes(this.searchQuery.toLowerCase());
                return matchesCategory && matchesSearch;
            });
        },
        totalPages() {
            return Math.ceil(this.filteredItems.length / this.itemsPerPage);
        }
    },
    methods: {
        async fetchItems() {
            const cachedItems = localStorage.getItem('items');
            if (cachedItems) {
                this.items = JSON.parse(cachedItems);
            } else {
                this.loading = true;
                const query = `
      query {
        items(lang : fr) {
          id
          name
          inspectImageLink
          category {
            id
          }
        }
      }`;
                try {
                    const response = await axios.post("https://api.tarkov.dev/graphql", {
                        query: query
                    });
                    this.items = response.data.data.items;
                    localStorage.setItem('items', JSON.stringify(this.items));
                } catch (error) {
                    console.error('Error fetching items:', error);
                } finally {
                    this.loading = false;
                }
            }
        },
        async fetchCategories() {
            const query = `
    query {
      itemCategories (lang : fr) {
        id
        name
      }
    }`;
            try {
                const response = await axios.post("https://api.tarkov.dev/graphql", {
                    query: query
                });
                this.categories = response.data.data.itemCategories;
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        getCategoriesWithItems() {
            return this.categories.filter(category => {
                return this.items.some(item => item.category.id === category.id);
            });
        },
        updateDisplayedItems() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            this.displayedItems = this.filteredItems.slice(startIndex, endIndex);
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.updateDisplayedItems();
            }
        },
        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.updateDisplayedItems();
            }
        },
        navigateToItem(itemId) {
            this.$router.push({ name: "Item", params: { id: itemId } });
        }
    },
    watch: {
        filteredItems() {
            this.updateDisplayedItems();
        }
    },
    async created() {
        await this.fetchCategories();
        await this.fetchItems();
        this.updateDisplayedItems();
    }
};
</script>

<style scoped>
h2 {
    margin-left: 1rem;
    font-weight: bold;
}
</style>
