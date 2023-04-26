<template>
    <div class="nav-container">
        <ul>
            <li>
                <router-link to="/search">
                    <img
                        v-if="route.path === '/search'"
                        src="../assets/img/search-active.svg"
                        alt="icon search active"
                    />
                    <img
                        v-else
                        src="../assets/img/search.svg"
                        alt="icon search"
                    />
                </router-link>
            </li>
            <li>
                <router-link to="/">
                    <img
                        v-if="route.path === '/'"
                        src="../assets/img/home-active.svg"
                        alt="icon home active"
                    />
                    <img
                        v-else
                        src="../assets/img/home.svg"
                        alt="icon home"
                    />
                </router-link>
            </li>
            <li>
                <router-link to="/ammo">
                    <img
                        v-if="route.path === '/ammo'"
                        src="../assets/img/bullet-active.svg"
                        alt="icon ammo active"
                    />
                    <img
                        v-else
                        src="../assets/img/bullet.svg"
                        alt="icon ammo"
                    />
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
import { useRoute } from 'vue-router';

export default {
    name: 'Nav',
    setup() {
        const route = useRoute();
        return { route };
    },
};
</script>

<style lang="scss">
.active{
    img{
        color: blue;
    }
}
</style>