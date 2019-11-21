<template>
  <div class="text-center">
    <v-card class="location-card">
      <v-form class="container">
       <SearchPickup/>
       <SearchDestination />
        <v-btn
          raised
          small
          color="info"
          block
        >Search for courier</v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import SearchPickup from './SearchPickup.vue';
import SearchDestination from './SearchDestination.vue';

export default {
  name: 'LocationCard',
  props: ['pickupLocation', 'destinationLocation'],
  components: {
    SearchDestination,
    SearchPickup
  },
  data () {
    return {
     
    }
  },
  mounted() {
    console.log('mounted locationcard')

  },
  updated() {
    console.log('show locationCard')
  },
  beforeDestroy(){
    console.log('beforeDestroyed')
  },
  destroyed(){
    console.log('destroyed')
  },
  methods: {
       
    }
  }
</script>



<style lang="scss">
.location-card {
  position: absolute;
  bottom: 1px;
  margin-left: 20px;
  z-index: 99;
  width: 330px;

  .v-form {
    padding-top: 5px;

    .v-btn {
      margin-top: 15px;
    }
  }
}

</style>
