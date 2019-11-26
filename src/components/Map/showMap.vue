<template>
<div v-if="loaded" class="loadDiv">
    <div id="showMap"></div>
</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  props: ['loaded'],
  name: 'showMap',
  test: null,
  components: {
  },
  data () {
    return {
      center: [43.238475, 76.911361],
    }
  },
  computed: {
    ...mapGetters(['pickup', 'latlng'])

  },
  created(){
    console.log('showmap created')
  },
  watch: {
      pickup: function() {
        this.markerLocation.bindLabel(this.pickup, 
        { 
            static: true, 
            offset: [-90, -60],
            textDirection: 'auto'
        })
        this.markerLocation.setLatLng(this.latlng)
        this.map.setView(this.latlng)
      }
  },
  mounted() {
    console.log('showmap mounted')

    if(document.getElementById("showMap")){
        // document.getElementById('showMap').innerHTML = "<div id='map' style='width: 100%; height: 100%;'></div>";
        console.log('pickup', this.pickup)
        const DG = require('2gis-maps');
        
        const map = DG.map('showMap', {
            'center': this.center,
            'zoom': 12,
            'zoomControl': false,
            'fullscreenControl': false,
        })

        DG.control.location({position: 'topright'}).addTo(map);
        
        const lat = map.getCenter().lat
        const lng = map.getCenter().lng
        this.map = map
        const iconLocation = DG.icon({
            iconUrl: require('../../assets/location.png'),
            iconSize: [30, 30],
        });
        //sets pickup marker 
        const markerLocation = DG.marker(this.latlng, { icon: iconLocation})
            .addTo(this.map)
        this.markerLocation = markerLocation
        let markerLocationCoord = this.markerLocation.getLatLng()

        this.map.on('move', function (e) {
            const newLatLng = this.getCenter()
            markerLocation.setLatLng(newLatLng);
            markerLocationCoord =  markerLocation.getLatLng()
            markerLocation.unbindLabel()
        });

        this.map.on('moveend', DG.bind(onMoveend, this, true))

        // finds a new address when moveend
        function onMoveend(e) {
            markerLocation.bindLabel(this.pickup, 
            { 
                static: true, 
                offset: [-90, -60],
                textDirection: 'auto'
            })
            this.findName()
        } 
        if (this.pickup) {
        this.markerLocation.bindLabel(this.pickup, 
        { 
            static: true, 
            offset: [-90, -60],
            textDirection: 'auto'
        })
        this.map.setView(this.latlng, 17, {'animate': true, 'noMoveStart': true})
     }
    }
  },
  updated() {
    console.log('showmap updated')
    console.log('loaded', this.pickup)
    if (this.pickup) {
        this.markerLocation.bindLabel(this.pickup, 
        { 
            static: true, 
            offset: [-90, -60],
            textDirection: 'auto'
        });
    }
    
  },
  beforeDestroy(){
    console.log('showmappicker before destroy')
  },
  destroyed(){
    console.log('showmappicker destroyed')
  },
  methods: {
      ...mapMutations(['setPickup']),
      findName: function() {
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${this.markerLocation.getLatLng().lat}&lon=${this.markerLocation.getLatLng().lng}`
          const proxyurl = "https://cors-anywhere.herokuapp.com/";
          fetch(proxyurl + url)
              .then(data => data.json())
              .then(location => {
                  const splittedAddress = location.display_name.split(',');
                  const address =
                      splittedAddress[1].trim() +
                      ' ' +
                      splittedAddress[0].trim() +
                      ', ' +
                      splittedAddress[2].trim();

                  const lat = this.markerLocation.getLatLng().lat
                  const lng = this.markerLocation.getLatLng().lng
                  this.setPickup({address, lat, lng})
              })
       },   
       
    }
}
</script>

<style lang="scss">
.list {
  height: 370px;
}
.loadDiv{
    width: 80%;
    height: 90%;
}
#showMap {
    width: 100%;
    height: 95%;
    position: absolute !important; 
    z-index: 9; 
}
.leaflet-marker-icon {
    position: absolute;
}
</style>
