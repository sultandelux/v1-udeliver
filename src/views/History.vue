<template>
    <div>
        <ActiveRides></ActiveRides>
        <PastRides></PastRides>
    </div>
</template>

<script>
import ActiveRides from '@/components/ActiveRides';
import PastRides from '@/components/PastRides';

export default {
    name: 'History',
    components: {
        ActiveRides,
        PastRides
    }
};
</script>

<style scoped></style>
