<template>
    <v-container grid-list-lg>
        
    </v-container>
</template>

<script>
export default {
    name: 'PastRides',
    computed: {
        pastRides() {
            return this.$store.state.pastRides;
        },
        isAuthenticated() {
            return this.$store.getters.isAuthenticated;
        }
    },
    methods: {
    }
};
</script>

<style scoped></style>
