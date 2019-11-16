<template>
    <v-container grid-list-lg>
       
    </v-container>
</template>

<script>
export default {
    name: 'ActiveRides',
    methods: {
        showActiveRides(activeRides) {
            this.$store.dispatch('getActiveRides', activeRides);
        }
    }
};
</script>

<style scoped></style>
