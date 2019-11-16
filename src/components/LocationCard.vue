<template>
  <div class="text-center">
    <v-card class="location-card">
      <v-form class="container">
       <ShowMapPickup/>
       <ShowMapDestination />
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
import ShowMapDestination from './ShowMapDestination.vue';
import ShowMapPickup from './ShowMapPickup.vue';

export default {
  name: 'LocationCard',
  props: ['pickupLocation', 'destinationLocation'],
  components: {
    ShowMapDestination,
    ShowMapPickup
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
  width: 370px;

  .v-form {
    padding-top: 5px;

    .v-btn {
      margin-top: 15px;
    }
  }
}

</style>
