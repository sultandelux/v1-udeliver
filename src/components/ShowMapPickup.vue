<template>
<div class="text-center">
        <v-text-field
          label="Your pickup location"
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
      <v-card>
        <v-toolbar>
          <v-btn icon dark @click="openMapPickup = false">
            <v-icon color="black">mdi-close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-title color="black">Show on map</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark color="black" text @click="openMapPickup = false">Done</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div id="showMap"></div>
      </v-card>
    </v-dialog>
    
  </div>
</template>

<script>
export default {
  name: 'ShowMapPickup',
  // props: ['pickupLocation', 'destinationLocation'],
  components: {
    // ShowMapDestination
  },
  data () {
    return {
      dialogPickup: false,
      openMapPickup: false,
      item: 1,
      items: [
        { text: 'Masanchi 104,', },
        { text: 'Masanchi 93B',  },
        { text: 'Masanchi 103A',  },
      ],
      center: [43.238475, 76.911361],
      // location: null,
      // markerLocation: null,
      // map: null,
      // pickupLocation1: {
      //     lat: 0,
      //     lng: 0,
      //     // name: ''
      // },
    }
  },
  mounted() {
        
        console.log('mounted Showmappickups')

    },
    updated() {
        const DG = require('2gis-maps');
        const map = DG.map('showMap', {
                'center': this.center,
                'zoom': 12,
                'zoomControl': false,
                'fullscreenControl': false,
        })
        map.locate({setView: true, watch: true})
            .on('locationfound', function(e){ 
                const radius = e.accuracy / 5;
                const radiusPoint = radius / 10;
                // const circleLocation = DG.circle(e.latlng, {radius, stroke: false, fillOpacity: 0.3}).addTo(map);
                const circlePoint = DG.circle(e.latlng, {radius: radiusPoint, color: 'white', fill: true, fillColor: 'green', fillOpacity: 0.7}).addTo(map);
                const zoomLocation = {
                    start:  map.getZoom(),
                    end: map.getZoom()
                };
                map.on('zoomstart', function() { zoomLocation.start = map.getZoom() })
                map.on('zoomend', function() {
                    zoomLocation.end = map.getZoom()
                    const diff = zoomLocation.start - zoomLocation.end
                    if (diff > 0) {
                        circlePoint.setRadius(circlePoint.getRadius() * 1.8);
                    } else if (diff < 0) {
                        circlePoint.setRadius(circlePoint.getRadius() / 1.8);
                    }
                })
            })
            .on('locationerror', function() {
                DG.popup()
                    .setLatLng(map.getCenter())
                    .setContent('location not found')
                    .openOn(map);
                map.locate({setView: true, watch: true})
            });

        DG.control.location({position: 'topright'}).addTo(map);
        const iconLocation = DG.icon({
            iconUrl: require('../assets/location.png'),
            iconSize: [30, 30],
        });
        // const lat = map.getCenter().lat
        // const lng = map.getCenter().lng

        //sets pickup marker 
        const markerLocation = DG.marker([43.238475, 76.931361], { icon: iconLocation})
            .addTo(map)
        this.map = map
        this.markerLocation = markerLocation

        this.location = {
            lat: this.markerLocation.getLatLng().lat,
            lng: this.markerLocation.getLatLng().lng
        }
        
        this.map.on('move', function () {
            const newLatLng = this.getCenter()
            markerLocation.setLatLng(newLatLng);
            markerLocation.unbindLabel()
        });
        this.map.on('moveend', DG.bind(onMoveend, this, true))

        // finds a new address when moveend
        function onMoveend() {
            markerLocation.bindLabel("loading...", 
            { 
                static: true, 
                offset: [-90, -60],
                textDirection: 'auto'
            })
            this.findName()
        }        
        console.log('updated Showmappickups')
    },
    beforeDestroy(){
        console.log('beforeDestroyed Showmappickups')
    },
    destroyed(){
      console.log('destroyed Showmappickups')
    },
    methods: {
        // findName: function() {
        //     if (this.pickupLocation1.name === '') {
        //         this.pickupLocation1.lat = this.location.lat;
        //         this.pickupLocation1.lng = this.location.lng;
        //     }
        //     const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${this.markerLocation.getLatLng().lat}&lon=${this.markerLocation.getLatLng().lng}`
        //     // const proxyurl = "https://cors-anywhere.herokuapp.com/";
        //     fetch(url)
        //         .then(data => data.json())
        //         .then(location => {
        //             const splittedAddress = location.display_name.split(',');
        //             const address =
        //                 splittedAddress[1].trim() +
        //                 ' ' +
        //                 splittedAddress[0].trim() +
        //                 ', ' +
        //                 splittedAddress[2].trim();
        //             this.pickupLocation1 = {
        //                 lat: this.markerLocation.getLatLng().lat,
        //                 lng: this.markerLocation.getLatLng().lng,
        //                 name: address
        //             };
        //         });
        // },
        // buildNavigation() {
        // },
        // makeSuggests() {
        // },
        // showCouriers() {
        // },
      }
  }
</script>



<style lang="scss">

.list {
  height: 370px;
}

#showMap {
    width: 100%;
    height: 100%;
    position: absolute !important; 
    z-index: 9; 
}
/* .button {
    z-index: 99;
} */
.leaflet-marker-icon {
    position: absolute;
}
</style>
