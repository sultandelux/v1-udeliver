<template>
    <div class="mapcontainer">
        <LocationCard
        :pickupLocation="pickup"
        />
        <v-container fluid fill-height class="mapcontainer" style="max-height: 100vh">
            <v-layout justify-center align-center column pa-5>
                <div id="map"></div>
            </v-layout>
        </v-container>
    </div>
</template>
<script>
/* eslint-disable */
import LocationCard from '@/components/LocationCard'
import Courier from '@/components/Courier/Courier'
import gMap from '2gis-maps'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import carMarkerUrl from '@/assets/car-marker.png'
import selectedCarMarkerUrl from '@/assets/selected-car-marker.png'
import { config } from '@/config'
import io from 'socket.io-client'

const carMarkerIcon = L.icon({
  iconUrl: carMarkerUrl,
  iconSize: [38, 38]
})
const selectedCarMarkerIcon = L.icon({
  iconUrl: selectedCarMarkerUrl,
  iconSize: [38, 38]
})

export default {
    /* eslint-disable */
    name: 'mapcontainer',
    components: {
        LocationCard,
        Courier
    },
    data() {
        return {
            room:'none',
            // socket: io('localhost:8080'),
            coord:['5.3559', '100.3025'],

            haveUserLocation: false,
            center: [43.238475, 76.911361],
            location: {
                lat: null,
                lng: null
            },
            markerLocation: null,
            circleLocation: null,
            circlePoint: null,
            errorStr:null,
            map: null,
            couriers: [
                {
                    id: 0,
                    selected: false,
                    marker: null,
                    location: {
                        lat: 43.2385,
                        lng: 76.91133
                    },
                    icon: carMarkerIcon,
                    fullName: 'Tima Deliver',
                    courierAddress: '',
                    pricePerKm: 1.68
                }
            ],
            counter: 0,
            couriersLatLngs: []
    }},
    computed: {
        ...mapGetters(['pickup', 'latlng', 'userRole', 'pickupLocation', 'destinationLocation']),
         getValidcouriers() {
            return this.couriers.filter(courier => courier.location.lat != 0)
        }
    },
    watch: {
        pickup: function(){
            this.markerLocation.setLatLng(this.latlng)
            this.map.setView(this.latlng)
        },
        counter: function(){
            this.couriers.forEach(courier => {
                if(courier.marker){
                    courier.marker.setLatLng(courier.location)
                }
            })
        },
    },
    created() {
            console.log('Map created')
            this.startLocation()
            this.setUserLocation()
            

    },
    mounted() {
                this.startLocation()

        console.log('pickup', this.pickup)
        console.log('Map mounted')
         //create socket 
      
        const DG = require('2gis-maps')
        if (this.map == null){
            var map = DG.map('map', {
                'center': this.center,
                'zoom': 12,
                'zoomControl': false,
                'fullscreenControl': false,
            })
        }
        map.locate({setView: true, watch: true})
            .on('locationfound', DG.bind(onLocate, this))
            .on('locationerror', function(e) {
                console.log(e)
                // DG.popup()
                //     .setLatLng(map.getCenter())
                //     .setContent('location not found')
                //     .openOn(map)
            })
        function onLocate(e){ 
            const radius = e.accuracy / 5
            const radiusPoint = radius / 10
            if(!this.circleLocation){
                const circleLocation = DG.circle(e.latlng, {radius, stroke: false, fillOpacity: 0.3}).addTo(map)
                this.circleLocation = circleLocation
                const circlePoint = DG.circle(e.latlng, {radius: radiusPoint, color: 'white', fill: true, fillColor: 'green', fillOpacity: 0.7}).addTo(map)
                this.circlePoint = circlePoint
            }
            else {
                this.circlePoint.setLatLng(e.latlng)
                this.circleLocation.setLatLng(e.latlng)
            }
            const zoomLocation = {
                start:  map.getZoom(),
                end: map.getZoom()
            }
            map.on('zoomstart', function(e) { zoomLocation.start = map.getZoom() })
            map.on('zoomend', function(e) {
                zoomLocation.end = map.getZoom()
                const diff = zoomLocation.start - zoomLocation.end
                if (diff > 0 && this.circlePoint) {
                    this.circlePoint.setRadius(this.circlePoint.getRadius() * 1.8)
                } else if (diff < 0 && this.circlePoint) {
                    this.circlePoint.setRadius(this.circlePoint.getRadius() / 1.8)
                }
            })
            const lat = map.getCenter().lat
            const lng = map.getCenter().lng
            this.setInitial(lat, lng)
            map.locate({setView: false})
        }
        const lat = map.getCenter().lat
        const lng = map.getCenter().lng

        DG.control.location({position: 'topright'}).addTo(map)
        const iconLocation = DG.icon({
            iconUrl: require('../assets/location.png'),
            iconSize: [30, 30],
        })
       

        //sets pickup marker 
        // if(!this.markerLocation){
        //     const markerLocation = DG.marker([this.location.lat, this.location.lng], { icon: iconLocation})
        //         .addTo(map)
        // }
        const markerLocation = DG.marker([lat, lng], { icon: iconLocation})
                .addTo(map)
        this.map = map
        this.markerLocation = markerLocation
        let markerLocationCoord = this.markerLocation.getLatLng()

        // this.location = {
        //     lat: this.markerLocation.getLatLng().lat,
        //     lng: this.markerLocation.getLatLng().lng
        // }
        
        this.map.on('move', function (e) {
            const newLatLng = this.getCenter()
            markerLocation.setLatLng(newLatLng)
            markerLocationCoord =  markerLocation.getLatLng()
            markerLocation.unbindLabel()
        })
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
            this.markerLocation.setLatLng(this.latlng)
            this.map.setView(this.latlng, 17)
        }    
        if(this.location.lat && this.location.lng){
            this.setCourier()
        }
    },
    updated() {
        console.log('Map updated')

        this.startLocation()
        if (this.pickup) {
            this.markerLocation.bindLabel(this.pickup, 
            { 
                static: true, 
                offset: [-90, -60],
                textDirection: 'auto'
            })
        }
        this.getme()
    },
    methods: {
        ...mapMutations(['setPickup', 'setDestination', 'setInitialLocation']),
        ...mapActions(['getme']),

        setUserLocation(){
            navigator.geolocation.getCurrentPosition(
            position => {
                this.location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
                this.haveUserLocation = true
            },
            () => {
                // Didn't give the location
                fetch('https://ipapi.co/json')
                .then(res => res.json())
                .then(location => {
                    this.location = {
                        lat: location.latitude,
                        lng: location.longitude
                    }
                    this.haveUserLocation = true
                })
            },
                { timeout: 10000 }
            )
        },
        findName: function() {
            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${this.markerLocation.getLatLng().lat}&lon=${this.markerLocation.getLatLng().lng}`
            const proxyurl = "https://cors-anywhere.herokuapp.com/"
            fetch( proxyurl + url)
                .then(data => data.json())
                .then(location => {
                    const splittedAddress = location.display_name.split(',')
                    const address =
                        splittedAddress[1].trim() +
                        ' ' +
                        splittedAddress[0].trim() +
                        ', ' +
                        splittedAddress[2].trim()

                    const lat = this.markerLocation.getLatLng().lat
                    const lng = this.markerLocation.getLatLng().lng
                    if(this.pickupLocation.lat !== lat && this.pickupLocation.lng !== lng){
                        console.log('this.pickupLocation', this.pickupLocation)
                        console.log('latlng', lat, lng)
                        this.setPickup({address, lat, lng})
                    }
                })
        },
        setInitial(lat, lng){
            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
            const proxyurl = "https://cors-anywhere.herokuapp.com/"
            fetch( proxyurl+url)
                .then(data => data.json())
                .then(location => {
                    const splittedAddress = location.display_name.split(',')
                    const address =
                        splittedAddress[1].trim() +
                        ' ' +
                        splittedAddress[0].trim() +
                        ', ' +
                        splittedAddress[2].trim()
                    console.log('setInitial', address, lat, lng)
                     if(this.destinationLocation.lat !== lat && this.destinationLocation.lng !== lng){
                        console.log('this.destinationLocation', this.destinationLocation)
                        console.log('latlng', lat, lng)
                        this.setInitialLocation({address, lat, lng})
                    }
                })
        },

        showcourierInformation(courier) {
            courier.selected = !courier.selected
            courier.icon = courier.selected ? selectedCarMarkerIcon : carMarkerIcon
        },
        setcouriersLocation(index) {
            this.couriers.forEach(courier => {
                courier.location = {
                    lat: this.couriersLatLngs[index][0],
                    lng: this.couriersLatLngs[index][1]
                }
            })
            this.counter = index
        },

        getRandomRoute(latitude, longitude) {
            const startCoordinates = this.getRandomLocation(latitude, longitude)
            const endCoordinates = this.getRandomLocation(latitude, longitude)
            fetch(
                'https://api.openrouteservice.org/directions?api_key=' +
                config.API_KEY +
                '&coordinates=' +
                startCoordinates.lng +
                ',' +
                startCoordinates.lat +
                '|' +
                endCoordinates.lng +
                ',' +
                endCoordinates.lat +
                '&profile=driving-car&geometry=true&geometry_format=polyline'
                )
                .then(data => data.json())
                .then(jsonData => {
                    jsonData.routes[0].geometry.forEach(geo => {
                        const latLng = L.latLng(geo[0], geo[1])
                        this.couriersLatLngs.push([latLng.lng, latLng.lat])
                    })
                    this.setcouriersLocation(0)
                })
        },
        getRandomLocation(startLat, startLng) {
            const maxLat = startLat + 0.01
            const minLat = startLat - 0.01
            const maxLng = startLng + 0.01
            const minLng = startLng - 0.01
            return {
                lat: Math.random() * (maxLat - minLat) + minLat,
                lng: Math.random() * (maxLng - minLng) + minLng
            }
        },
        setCourier(){ 
            console.log('this.location', this.location)       
            this.getRandomRoute(this.location.lat, this.location.lng)
            let index = 0
            setInterval(() => {
                index++
                if (index == this.couriersLatLngs.length) {
                    index = 0
                }
                this.setcouriersLocation(index)
                this.counter = index
            }, 7000)
            this.couriers.forEach(courier => {
                var courierMarker = DG.marker(courier.location, {icon: carMarkerIcon}).addTo(this.map)
                courier.marker = courierMarker
            }) 
        },
        async startLocation() { 
            await navigator.geolocation.getCurrentPosition(
                function(response){ console.log(response)},
                function(error)   { console.error(error)},
                {timeout: 1000*60, enableHighAccuracy: true, maximumAge: 1000*60*60} 
            )
        }
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
