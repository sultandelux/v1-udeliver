<template>
    <div id="navigation"></div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { config } from '../../config';

const DG = require('2gis-maps');

export default {
  props: ['loaded'],
  name: 'navigation',
  test: null,
  
  components: {
  },
  data () {
    return {
        center: [43.238475, 76.911361],
        polyline: {
            latLngs: [],
            color: 'green'
        },
    }
  },
  computed: {
    ...mapGetters(['pickup', 'latlng']),
    ...mapGetters(['destination', 'latlngDestination'])

  },

  watch: {
      polyline: function(){
        // const polyline = DG.polyline(this.polyline.latLngs).addTo(this.map)
      },
  },
  mounted() {
    if(document.getElementById("navigation")){
        const map = DG.map('navigation', {
            'center': this.center,
            'zoom': 12,
            'zoomControl': false,
            'fullscreenControl': false,
        })

        DG.control.location({position: 'topright'}).addTo(map);
        
        this.map = map
        this.setNavigation()
        console.log('polyline mounted', this.polyline.latLngs)
        if(this.polyline.latLngs){
            const polyline = DG.polyline(this.polyline.latLngs).addTo(map)
        }

    }
  },
  updated() {
        const polyline = DG.polyline(this.polyline.latLngs).addTo(this.map)
  },
  methods: {
      ...mapMutations(['setDestination']),  
      setNavigation(){
        const DG = require('2gis-maps');

          if (this.latlng[0] != 0 && this.latlngDestination[0] != 0) {
        fetch(
          'https://api.openrouteservice.org/directions?api_key=' +
            config.API_KEY +
            '&coordinates=' +
            this.latlng[1] +
            ',' +
            this.latlng[0] +
            '|' +
            this.latlngDestination[1] +
            ',' +
            this.latlngDestination[0] +
            '&profile=driving-car&geometry=true&geometry_format=polyline'
        )
          .then(data => data.json())
          .then(jsonData => {
            this.polyline.latLngs = [];
            jsonData.routes[0].geometry.forEach(geo => {
              const latLng = DG.latLng(geo[0], geo[1]);
              this.polyline.latLngs.push([latLng.lng, latLng.lat]);
            });
            const polyline = DG.polyline(this.polyline.latLngs).addTo(this.map)
            const iconPickup = DG.icon({
                iconUrl: require('../../assets/location.png'),
                iconSize: [30, 30],
            });
            const iconDestination = DG.icon({
                iconUrl: require('../../assets/destination.png'),
                iconSize: [30, 30],
            });
            const pickupMarker = DG.marker(this.latlng,  { icon: iconPickup}).addTo(this.map)
            const destinationMarker = DG.marker(this.latlngDestination,  { icon: iconDestination}).addTo(this.map)
            this.map.fitBounds(this.polyline.latLngs)
            // this.map.setZoom(this.map.getZoom() - 0.2)
          });
        }
      }
    }
}
</script>

<style lang="scss">
.list {
  height: 370px;
}
.loadDiv{
    width: 100%;
    height: 100%;
}
#navigation {
    width: 100%;
    height: 100%;
    position: absolute !important; 
    z-index: 9; 
}
.leaflet-marker-icon {
    position: absolute;
}
</style>
