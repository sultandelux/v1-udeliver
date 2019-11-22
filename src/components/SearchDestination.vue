<template>
<div class="text-center">
    <template>
    <v-text-field
          label="Your destination"
          required
          @focus="dialogDestination = true"
          :value="destionationAddress"
    >
        </v-text-field>
    </template>
    <v-dialog v-model="dialogDestination" scrollable max-width="370px" class="listCard">
      <v-card>
        <v-form class="container">
        <v-text-field
          label="Your destination"
          required
          editable
          :value="destionationAddress"
        >
        </v-text-field>
          <v-btn text color='green' small @click="openMapDestination = true">Show on map</v-btn>
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
          <v-btn text @click="dialogDestination = false">Close</v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="dialogDestination = false">Done</v-btn>
        </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="openMapDestination" fullscreen hide-overlay transition="dialog-bottom-transition" max-width="370px" class="mapLocation">
      <v-card>
        <v-toolbar>
          <v-btn icon dark @click="openMapDestination = false">
            <v-icon color="black">mdi-close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-title color="black">Show on map</v-toolbar-title>
          <v-spacer></v-spacer>
          
          <v-toolbar-items>
            <v-btn dark color="black" text @click="openMapDestination = false">Done</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <showMapDestination :loaded='loaded' />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import showMapDestination from './Map/showMapDestination'
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'SearchDestination',
  // props: ['pickupLocation', 'destinationLocation'],
  components: {
    showMapDestination
  },
  data () {
    return {
      loaded: true,
      dialogDestination: false,
      openMapDestination: false,
      item: 1,
      items: [
        { text: 'Masanchi 104,', },
        { text: 'Masanchi 93B',  },
        { text: 'Masanchi 103A',  },
      ],
    }
  },
  computed: {
    ...mapGetters(['destination']),
    ...mapGetters(['initialLocation']),
    destionationAddress: function(){
      return this.destination == this.initialLocation ? '' : this.destination
    }
  },
  created(){
    console.log('SearchDestination created')
  },
  watch: {
  },
  
  mounted() {
    console.log('SearchDestination mounted')

  },
  updated() {
    // console.log('SearchDestination updated')
    console.log('destination', this.destination)
  },
  beforeDestroy(){
    console.log('SearchDestination before destroy')
  },
  destroyed(){
    console.log('SearchDestination destroyed')
  },
  methods: {
      onClose(){
        this.openMapDestination = false
      }
    }
}
</script>


<style lang="scss">
.list {
  height: 370px;
}
</style>
