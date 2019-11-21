
<template>
 <div class="mapcontainer">
    <LocationCard
      :pickupLocation="pickup"
    />
    <v-container fluid fill-height class="mapcontainer" style="max-height: 100vh;">
        <v-layout justify-center align-center column pa-5>
            <div id="map"></div>
        </v-layout>
    </v-container>
 </div>
</template>

<script>
/* eslint-disable */
import LocationCard from '@/components/LocationCard';
import Courier from '@/components/Courier/Courier'
import gMap from '2gis-maps'
import { mapGetters, mapMutations } from 'vuex';

export default {
    /* eslint-disable */
    name: 'mapcontainer',
    components: {
        LocationCard,
        Courier
    },
    data() {
        return {
        center: [43.238475, 76.911361],
        location: null,
        markerLocation: null,
        errorStr:null,
        map: null,
    
    }},
    computed: {
        ...mapGetters(['pickup', 'latlng'])
    },
    watch: {
        pickup: function(){
            this.markerLocation.setLatLng(this.latlng)
            this.map.setView(this.latlng, 17, {'animate': true, 'noMoveStart': true})
        }
    },
    created() {
    },
    mounted() {
        console.log('pickup', this.pickup)
        const DG = require('2gis-maps');
        const map = DG.map('map', {
                'center': this.center,
                'zoom': 12,
                'zoomControl': false,
                'fullscreenControl': false,
        })
        map.locate({setView: true, watch: true})
            .on('locationfound', DG.bind(onLocate, this))
            .on('locationerror', function(e) {
                console.log(e)
                DG.popup()
                    .setLatLng(map.getCenter())
                    .setContent('location not found')
                    .openOn(map);
                map.locate({setView: true, watch: true})
            });
        function onLocate(e){ 
            const radius = e.accuracy / 5;
            const radiusPoint = radius / 10;
            const circleLocation = DG.circle(e.latlng, {radius, stroke: false, fillOpacity: 0.3}).addTo(map);
            const circlePoint = DG.circle(e.latlng, {radius: radiusPoint, color: 'white', fill: true, fillColor: 'green', fillOpacity: 0.7}).addTo(map);
            const zoomLocation = {
                start:  map.getZoom(),
                end: map.getZoom()
            };
            map.on('zoomstart', function(e) { zoomLocation.start = map.getZoom() })
            map.on('zoomend', function(e) {
                zoomLocation.end = map.getZoom()
                const diff = zoomLocation.start - zoomLocation.end
                if (diff > 0) {
                    circlePoint.setRadius(circlePoint.getRadius() * 1.8);
                } else if (diff < 0) {
                    circlePoint.setRadius(circlePoint.getRadius() / 1.8);
                }
            })
            const lat = map.getCenter().lat
            const lng = map.getCenter().lng
            this.findNameDestination(lat, lng)
        }
        const lat = map.getCenter().lat
        const lng = map.getCenter().lng

        DG.control.location({position: 'topright'}).addTo(map);
        const iconLocation = DG.icon({
            iconUrl: require('../assets/location.png'),
            iconSize: [30, 30],
        });
       

        //sets pickup marker 
        const markerLocation = DG.marker([lat, lng], { icon: iconLocation})
            .addTo(map)
        this.map = map
        this.markerLocation = markerLocation
        let markerLocationCoord = this.markerLocation.getLatLng()

        this.location = {
            lat: this.markerLocation.getLatLng().lat,
            lng: this.markerLocation.getLatLng().lng
        }
        
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
  
    },
    updated() {
        navigator.geolocation.getCurrentPosition(
            function(response){ console.log(response)},
            function(error)   { console.error(error)},
            {timeout: 1000*60, enableHighAccuracy: true, maximumAge: 1000*60*60} 
        )
        if (this.pickup) {
            this.markerLocation.bindLabel(this.pickup, 
            { 
                static: true, 
                offset: [-90, -60],
                textDirection: 'auto'
            });
        }
    },
    methods: {
        ...mapMutations(['setPickup', 'setDestination']),
        findName: function() {
            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${this.markerLocation.getLatLng().lat}&lon=${this.markerLocation.getLatLng().lng}`
            const proxyurl = "https://cors-anywhere.herokuapp.com/";
            fetch(url)
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
                });
        },
        findNameDestination(lat, lng){
            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
            const proxyurl = "https://cors-anywhere.herokuapp.com/";
            fetch(url)
                .then(data => data.json())
                .then(location => {
                    const splittedAddress = location.display_name.split(',');
                    const address =
                        splittedAddress[1].trim() +
                        ' ' +
                        splittedAddress[0].trim() +
                        ', ' +
                        splittedAddress[2].trim();
                    this.setDestination({address, lat, lng})
                });
        },
    }
}
</script>

<style scoped>
.mapcontainer {
    background-size: cover;
    width: 100%;
    height: 100%;
}
#map {
    width: 100%;
    height: 100%;
    position: absolute !important; 
    z-index: 9; 
}
.leaflet-marker-icon {
    position: absolute;
}
</style>
