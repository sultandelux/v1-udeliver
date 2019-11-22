import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        pickupLocation: {
            lat: 0,
            lng: 0,
            name: ''
        },
        destinationLocation: {
            lat: 0,
            lng: 0,
            name: ''
        },
        initialLocation: {
            lat: 0,
            lng: 0,
            name: ''
        },
    },
    mutations: {
        setPickup({pickupLocation}, {address, lat, lng}){
            pickupLocation.name = address
            pickupLocation.lat = lat
            pickupLocation.lng = lng
        },
        setInitialLocation({initialLocation}, {address, lat, lng}){
            initialLocation.name = address
            initialLocation.lat = lat
            initialLocation.lng = lng
            console.log('setInitialLocation', initialLocation)
        },
        setDestination({destinationLocation}, {address, lat, lng}){
            destinationLocation.name = address
            destinationLocation.lat = lat
            destinationLocation.lng = lng
        }
    },
    actions: {
    },
    getters: {
        pickup: state => state.pickupLocation.name,
        latlng: state => [state.pickupLocation.lat, state.pickupLocation.lng],
        destination: state => state.destinationLocation.name,
        latlngDestination: state => [state.destinationLocation.lat, state.destinationLocation.lng],
        initialLocation: state => state.initialLocation.name,
        latlngInitial: state => [state.initialLocation.lat, state.initialLocation.lng],
    }
});
