<template>
  <div class="courier-sidebar">
    <transition name="fade">
      <v-navigation-drawer
        floating
        permanent
        stateless
        value="true"
      >
        <p>Name: {{ this.courier.fullName }}</p>
        <p>Current Location: {{ this.courier.courierAddress }}</p>
        <p>Price: {{ this.courier.pricePerKm }}€/km</p>

        <courierReliabilityChart />
      </v-navigation-drawer>
    </transition>
  </div>
</template>

<script>
import courierReliabilityChart from '@/components/courier/courierReliabilityChart';

export default {
  name: 'CourierSidebar',
  props: ['courier'],
  components: {
    courierReliabilityChart
  },
  methods: {
    updateCurrentcourierLocation() {
      fetch(
        'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' +
          this.courier.location.lat +
          '&lon=' +
          this.courier.location.lng
      )
        .then(data => data.json())
        .then(location => {
          const splittedAddress = location.display_name.split(',');
          const address =
            splittedAddress[1].trim() +
            ' ' +
            splittedAddress[0].trim() +
            ', ' +
            splittedAddress[2].trim();
          this.courier.courierAddress = address;
        });
    }
  },
  mounted() {
    this.updateCurrentcourierLocation();
    setInterval(() => {
      this.updateCurrentcourierLocation();
    }, 10000);
  }
};
</script>

<style lang="scss">
.courier-sidebar {
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.35s;
  }

  p {
    font-size: 18px;
  }
}
</style>
