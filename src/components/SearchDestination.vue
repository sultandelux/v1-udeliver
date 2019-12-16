<template>
<div class="text-center">
    <template>
    <v-text-field
        label="Your destination"
        required
        @focus="dialogDestination = true"
        :value="destination"
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
          :value="destinationAddress"
          v-model="destinationAddress"
        >
        </v-text-field>
          <v-btn text color='green' small @click="openMapDestination = true">Show on map</v-btn>
                <v-list shaped class="list">
                  <v-list-item-group v-model="destinationAddress">
                    <v-list-item
                      v-for="(item, i) in items"
                      :key="i"
                    >
                      <v-list-item-content>
                        <v-list-item-title v-text="item"></v-list-item-title>
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
import { mapGetters, mapMutations, mapActions } from 'vuex';

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
      destinationAddress: '',
      items: [
      ],
    }
  },
  computed: {
    ...mapGetters(['destination', 'destinationSuggests']),
    ...mapGetters(['initialLocation']),
  },
  created(){
    console.log('SearchDestination created')
  },
  watch: {
    destinationAddress: function() {
        console.log('this.destinationSuggests', this.destinationSuggests)
        console.log('changed', this.destinationAddress)
        this.items = []
        const query = this.destinationAddress
        if(query.length >=  3){
          this.getDestinationSuggests({query})
          // if(this.pickupSuggests.length > 0){
            console.log('this.pickupSuggests', this.destinationSuggests)
            this.destinationSuggests.forEach(p => {
              this.items.push(p)
              console.log('this.items', this.items)
            })
        // }
        console.log('p line list', this.items)
        } else {
          this.emptyDestinationSuggest()
        }    
        this.items = this.items.splice(0, 7)   
    },
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
     ...mapMutations([ 'emptyDestinationSuggest' ]),
      ...mapActions(['getDestinationSuggests']),
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
