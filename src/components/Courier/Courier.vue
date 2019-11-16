<template>
  <div class="courier">
    <div
      v-for="courier in getValidcouriers"
      :key="courier.id"
    >
      <!-- <l-moving-marker
        :lat-lng="courier.location"
        :icon="courier.icon"
        :duration="5000"
        @click="showcourierInformation(courier)"
      >
        <l-popup>
          <CourierSidebar :courier="courier" />
        </l-popup>
      </l-moving-marker> -->
    </div>
  </div>
</template>

<script>
import L from 'leaflet';
// import CourierSidebar from '@/components/courier/CourierSidebar';

import { config } from '@/config.js';
import carMarkerUrl from '@/assets/car-marker.png';
import selectedCarMarkerUrl from '@/assets/selected-car-marker.png';

const carMarkerIcon = L.icon({
  iconUrl: carMarkerUrl,
  iconSize: [38, 38]
});
const selectedCarMarkerIcon = L.icon({
  iconUrl: selectedCarMarkerUrl,
  iconSize: [38, 38]
});

export default {
  props: ['startLocation'],
  components: {
    // CourierSidebar
  },
  data() {
    return {
      couriers: [
        {
          id: 0,
          selected: false,
          location: {
            lat: 0,
            lng: 0
          },
          icon: carMarkerIcon,
          fullName: 'Peter Gregon',
          courierAddress: '',
          pricePerKm: 1.68
        }
      ],
      couriersLatLngs: []
    };
  },
  methods: {
    showcourierInformation(courier) {
      courier.selected = !courier.selected;
      courier.icon = courier.selected ? selectedCarMarkerIcon : carMarkerIcon;
    },
    setcouriersLocation(index) {
      this.couriers.forEach(courier => {
        courier.location = {
          lat: this.couriersLatLngs[index][0],
          lng: this.couriersLatLngs[index][1]
        };
      });
    },
    getRandomRoute(latitude, longitude) {
      const startCoordinates = this.getRandomLocation(latitude, longitude);
      const endCoordinates = this.getRandomLocation(latitude, longitude);

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
            const latLng = L.latLng(geo[0], geo[1]);
            this.couriersLatLngs.push([latLng.lng, latLng.lat]);
          });

          this.setcouriersLocation(0);
        });
    },
    getRandomLocation(startLat, startLng) {
      const maxLat = startLat + 0.01;
      const minLat = startLat - 0.01;
      const maxLng = startLng + 0.01;
      const minLng = startLng - 0.01;
      return {
        lat: Math.random() * (maxLat - minLat) + minLat,
        lng: Math.random() * (maxLng - minLng) + minLng
      };
    }
  },
  mounted() {
    this.getRandomRoute(this.startLocation.lat, this.startLocation.lng);

    let index = 0;
    setInterval(() => {
      index++;
      if (index == this.couriersLatLngs.length) {
        index = 0;
      }
      this.setcouriersLocation(index);
    }, 5000);
  },
  computed: {
    getValidcouriers() {
      return this.couriers.filter(courier => courier.location.lat != 0);
    }
  }
};
</script>
