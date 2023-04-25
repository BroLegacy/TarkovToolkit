import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
    state: {
        items: [],
        categories: [],
    },
    mutations: {
        setItems(state, items) {
            state.items = items;
        },
        setCategories(state, categories) {
            state.categories = categories;
        },
    },
    actions: {
        async fetchItems({ commit }) {
            const response = await axios.get('https://api.tarkov.dev/items');
            commit('setItems', response.data);
        },
        async fetchCategories({ commit }) {
            const response = await axios.get('https://api.tarkov.dev/categories');
            commit('setCategories', response.data);
        },
    },
});
