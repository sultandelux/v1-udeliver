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
          :value="pickupAddress"
          v-model="pickupAddress"
        >
        </v-text-field>
          <v-btn text color='green' small @click="openMapPickup = true">Show on map</v-btn>
            <v-list shaped class="list">
            <v-list-item-group v-model="item">
              <v-list-item
                v-for="(item, i) in items"
                v-bind:key="i + item"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="item"></v-list-item-title>
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
import { mapGetters, mapMutations, mapActions } from 'vuex';
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
      pickupAddress: '',
      items: [
        { text: 'Masanchi 104,', },
        { text: 'Masanchi 93B',  },
        { text: 'Masanchi 103A',  },
      ],
    }
  },
  computed: {
    ...mapGetters(['pickup', 'pickupSuggests']),
    // pickupAddress: function(){
    //   return this.pickup
    // }
  },
  created(){
    console.log('searchpickup created')
  },
  watch: {
    pickupAddress: function() {
        console.log('this.pickupSuggests1', this.pickupSuggests)

        console.log('changed', this.pickupAddress)
        this.items = []
        const query = this.pickupAddress
        if(query.length >=  3){
          this.getPickupSuggests({query})
          // if(this.pickupSuggests.length > 0){
            console.log('this.pickupSuggests', this.pickupSuggests)
            this.pickupSuggests.forEach(p => {
              this.item += 1
              console.log('counter', this.item)
              const item = {text: p}
              console.log('item', p)
              this.items.push(p)
              console.log('this.items', this.items)
            })
        // }
        console.log('p line list', this.items)
        } else {
          this.emptyPickupSuggest()
        }    
        this.items = this.items.splice(0, 7)   
    },
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
      ...mapMutations([ 'emptyPickupSuggest' ]),
      ...mapActions(['getPickupSuggests']),
      onClose(){
        this.openMapPickup = false
      },
      onChange(){
        console.log('event target')
      }
    }
}
</script>

<style lang="scss">
.list {
  height: 370px;
}
</style>
