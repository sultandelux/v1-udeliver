<template>
<div class="text-center">
        <v-text-field
          label="Your pickup location"
          :value="pickup"
          required
          @focus="dialogPickup = true"
        >
        </v-text-field>
    <v-dialog v-model="dialogPickup" scrollable max-width="370px" class="listCard">
      <v-card>
        <v-form class="container">
         <v-text-field
          label="Your pickup location"
          editable
          :value="pickup"
        >
        </v-text-field>
                <v-btn text color='green' small @click="openMapPickup = true">Show on map</v-btn>
                 <v-list shaped class="list">
                  <v-list-item-group v-model="item">
                    <v-list-item
                      v-for="(item, i) in items"
                      :key="i"
                    >
                      <v-list-item-content>
                        <v-list-item-title v-text="item.text"></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
        <v-card-actions>
          <v-btn text @click="dialogPickup = false">Close</v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="dialogPickup = false">Done</v-btn>
        </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="openMapPickup" fullscreen hide-overlay transition="dialog-bottom-transition" max-width="370px" class="mapLocation">
      <v-card class="cardShow">
        <v-toolbar class="toolbarShow">
          <v-btn icon dark @click="onClose()">
            <v-icon color="black">mdi-close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-title color="black">Show on map</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark color="black" text @click="onClose()">Done</v-btn>
          </v-toolbar-items>
        </v-toolbar>
          <showMap :loaded='loaded' />
      </v-card>
    </v-dialog>
    
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import showMap from './Map/showMap'
export default {
  name: 'SearchPickup',
  // props: ['pickupLocation', 'destinationLocation'],
  components: {
    showMap
  },
  data () {
    return {
      loaded: true,
      dialogPickup: false,
      openMapPickup: false,
      item: 1,
      items: [
        { text: 'Masanchi 104,', },
        { text: 'Masanchi 93B',  },
        { text: 'Masanchi 103A',  },
      ],
    }
  },
  computed: {
    ...mapGetters(['pickup'])

  },
  created(){
    console.log('searchpickup created')
  },
  watch: {
  },
  
  mounted() {
    console.log('searchpickup mounted')


  },
  updated() {
    // console.log('searchpickup updated')
    // console.log('pickup', this.pickup)
  },
  beforeDestroy(){
    console.log('searchpickup before destroy')
  },
  destroyed(){
    console.log('searchpickup destroyed')
  },
  methods: {
      onClose(){
        this.openMapPickup = false
      }
    }
}
</script>

<style lang="scss">
.list {
  height: 370px;
}
</style>
