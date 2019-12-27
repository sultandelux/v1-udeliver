import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'
import router from '@/router'

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
        authenticated: false,
        authError: null,
        phone: '',
        userRole: {
            is_courier: false,
            is_customer: true
        },
        pickupSuggests: [],
        destinationSuggests: [],
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
        },
        setDestination({destinationLocation}, {address, lat, lng}){
            destinationLocation.name = address
            destinationLocation.lat = lat
            destinationLocation.lng = lng
        },
        AuthUser(state) {
			state.authenticated = true
			state.authError = null
		},
		AuthError(state, e) {
			state.authError = e
        },
        emptyPickupSuggest(state){
            state.pickupSuggests = []
        },
        emptyDestinationSuggest(state){
            state.destinationSuggests = []
        },
        setPickupSuggest(state, suggest){
            state.pickupLocation.name = suggest
        },
        setDestinationSuggest(state, suggest){
            state.destinationLocation.name = suggest
        }
    },
    actions: {
        getPickupSuggests({commit, state}, {query}){
            const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=AIzaSyD138HiMiI2oVTn5atvDzxSSH10w9ue584&radius=1000&location=43.238949,76.889709&types=address&components=country:kz&city=Almaty`
            const proxyurl = "https://cors-anywhere.herokuapp.com/"
            axios
                .get(proxyurl + url)
                .then(res => {
                    state.pickupSuggests = []
                    res.data.predictions.forEach(p => {
                        state.pickupSuggests.push(p.structured_formatting.main_text)
                    })
                })
                .catch(({response}) => {
                })
        },
        getDestinationSuggests({commit, state}, {query}){
            const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=AIzaSyD138HiMiI2oVTn5atvDzxSSH10w9ue584&radius=4000&location=43.238949,76.889709&types=address&components=country:kz&city=Almaty`
            const proxyurl = "https://cors-anywhere.herokuapp.com/"
            axios
                .get(proxyurl + url)
                .then(res => {
                    res.data.predictions.forEach(p => {
                        state.destinationSuggests.push(p.structured_formatting.main_text)
                    })
                })
                .catch(({response}) => {
                })
        },
		getme({ commit, state }) {
            const url = `http://delprod.herokuapp.com/users/me/`
            const proxyurl = "https://cors-anywhere.herokuapp.com/"
			axios 
				.get(proxyurl + url, {headers: {'Authorization': "Token " + localStorage.getItem("token")}})
				.then(res => {
                    // saveToken(res.data.key, res.data.uid, commit)
                    const status = res.status
                    if(status == 200){
                        commit('AuthUser')
                        state.userRole = {
                            is_courier: res.data.is_courier,
                            is_customer: res.data.is_customer
                        }
                    }

                })
				.catch(({ response }) => {
					commit('AuthError', response.data)
				})
		},
		code({ commit, state }, { code }) {
            const url = `http://delprod.herokuapp.com/users/register/`
            const proxyurl = "https://cors-anywhere.herokuapp.com/"
            let phone = state.phone
			axios 
				.post(proxyurl + url, {
					phone,
					code
				})
				.then(res => {
                    saveToken(res.data.key, res.data.uid, commit)
                    router.push('/')
                })
				.catch(({ response }) => {
					commit('AuthError', response.data)
				})
		},
		signup({ commit, state }, { phone, nickname}) {
            // axios.defaults.headers.post['Content-Type'] = 'application/json'
            const url = `http://delprod.herokuapp.com/users/phone/`
            const proxyurl = "https://cors-anywhere.herokuapp.com/";
			axios
				.post( proxyurl + url, {
                    phone,
                    nickname
                },
                )
				.then(res => {
                    if(res){
                        // saveToken(res.data.token, commit)
                        const status = res.status
                        if(status == 200){
                            router.push('/code')
                        }
                    }
                })
				.catch(({ response }) => {
					commit('AuthError', response.data)
                })
            state.phone = phone
		}
	},
    getters: {
        pickup: state => state.pickupLocation.name,
        pickupLocation: state => state.pickupLocation,
        latlng: state => [state.pickupLocation.lat, state.pickupLocation.lng],
        destination: state => state.destinationLocation.name,
        destinationLocation: state => state.destinationLocation,
        latlngDestination: state => [state.destinationLocation.lat, state.destinationLocation.lng],
        initialLocation: state => state.initialLocation.name,
        latlngInitial: state => [state.initialLocation.lat, state.initialLocation.lng],
        userRole: state => state.userRole,
        pickupSuggests: state => {
            function onlyUnique(value, index, self) { 
                return self.indexOf(value) === index;
            }
            return state.pickupSuggests.filter(onlyUnique)
        },
        destinationSuggests: state => {
            function onlyUnique(value, index, self) { 
                return self.indexOf(value) === index;
            }
            return state.destinationSuggests.filter(onlyUnique)
        }
    }
})

function saveToken(token, uid, cb) {
	localStorage.setItem('token', token)
	localStorage.setItem('uid', uid)
	// user is auth 
    cb('AuthUser')
    const tokenS = localStorage.getItem('token')
    const uidS = localStorage.getItem('uid')
}
