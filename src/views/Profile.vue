<template>
    <v-container>
        <v-layout column>
            <h1 class="title my-3">My profile</h1>
            
            <v-flex mt-4>
                <v-btn color="primary" to="/menu">Go To Menu</v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'Profile',
    computed: {
        // userRecipes() {
        //     // return this.$store.state.userRecipes;
        // }
    },
    mounted() {
    },
    methods: {
        // getRecipes() {
        //     this.$store.dispatch('getUserRecipes');
        // }
    }
};
</script>

<style scoped></style>
