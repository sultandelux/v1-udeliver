import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        todo: 'todo',
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
    },
    mutations: {
        setPickup({pickupLocation}, address){
            pickupLocation.name = address
        }
    },
    actions: {
    },
    getters: {
    }
});
