<template>
    <span>
        <v-navigation-drawer
            app
            v-model="drawer"
            disable-resize-watcher
            class="drawerSide"
        >
            <v-list>
                <template v-for="(item, index) in items">
                    <v-list-item :key="index" :to="item.url">
                        <v-list-item-content>
                            {{ item.title }}
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider :key="`divider-${index}`"></v-divider>
                </template>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar>
            <v-app-bar-nav-icon
                class="hidden-md-and-up"
                @click="drawer = !drawer"
            ></v-app-bar-nav-icon>
            <router-link to="/">
                <v-toolbar-title data-cy="titleBtn">{{
                    appTitle
                }}</v-toolbar-title>
            </router-link>
                      <v-spacer></v-spacer>
            <v-btn
                text
                class="hidden-sm-and-down nav-menu"
                to="/menu"
                data-cy="menuBtn"
                >Menu</v-btn
            >
            <v-spacer class="hidden-sm-and-down"></v-spacer>
            <!-- <div v-if="!isAuthenticated" class="hidden-sm-and-down"> -->
                <v-btn text to="/login" data-cy="loginBtn">Login</v-btn>
                <v-btn
                    color="white"
                    to="/register"
                    class="nav-join"
                    data-cy="registerBtn">Register</v-btn>
        </v-toolbar>
    </span>
</template>

<script>
export default {
    name: 'AppNavigation',
    data() {
        return {
            appTitle: 'uDeliver',
            drawer: false,
            items: [
                { title: 'Map', url: '/' },
                { title: 'Profile', url: '/profile' },
                { title: 'History', url: '/history' },
                { title: 'Login', url: '/login' },
                { title: 'Register', url: '/register' }
            ]
        };
    },
    computed: {
        isAuthenticated() {
            return this.$store.getters.isAuthenticated;
        }
    },
    methods: {
        logout() {
            this.$store.dispatch('userSignOut');
        }
    }
};
</script>

<style scoped>
a {
    color: white;
    text-decoration: none;
}
.drawerSide {
    z-index: 99;
}
</style>
