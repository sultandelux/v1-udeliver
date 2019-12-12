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
            console.log('setInitialLocation', initialLocation)
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
        }
    },
    actions: {
        getPickupSuggests({commit, state}, {query}){
            console.log('query', query)

            const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=AIzaSyD138HiMiI2oVTn5atvDzxSSH10w9ue584&radius=4000&location=43.238949,76.889709&types=address&components=country:kz`
            const proxyurl = "https://cors-anywhere.herokuapp.com/"
            console.log('url', url)
            axios
                .get(proxyurl + url)
                .then(res => {
                    state.pickupSuggests = []
                    console.log('res suggests', res)
                    res.data.predictions.forEach(p => {
                        console.log('p', p)
                        state.pickupSuggests.push(p.structured_formatting.main_text)
                    })
                    console.log('state.pickupSuggests', state.pickupSuggests)
                })
                .catch(({response}) => {
                    console.log('response suggest', response)
                })
        },
        getDestinationSuggests({commit, state}, {query}){
            console.log('query', query)

            const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=AIzaSyD138HiMiI2oVTn5atvDzxSSH10w9ue584&radius=4000&location=43.238949,76.889709&types=address&components=country:kz`
            const proxyurl = "https://cors-anywhere.herokuapp.com/"
            console.log('url', url)
            axios
                .get(proxyurl + url)
                .then(res => {
                    console.log('res suggests', res)

                })
                .catch(({response}) => {
                    console.log('response suggest', response)
                })
        },
		getme({ commit, state }) {
            const url = `http://delprod.herokuapp.com/users/me/`
            const proxyurl = "https://cors-anywhere.herokuapp.com/"
            // let phone = state.phone
            // console.log('phone, code', )
			axios 
				.get(proxyurl + url, {headers: {'Authorization': "Token " + localStorage.getItem("token")}})
				.then(res => {
                    // saveToken(res.data.key, res.data.uid, commit)
                    console.log('getme AUTH', res)
                    const status = res.status
                    if(status == 200){
                        commit('AuthUser')
                        state.userRole = {
                            is_courier: res.data.is_courier,
                            is_customer: res.data.is_customer
                        }
                    }
                    console.log('authenticated', state.authenticated)
                    console.log('userRole', state.userRole)

                })
				.catch(({ response }) => {
					commit('AuthError', response.data)
				})
		},
		code({ commit, state }, { code }) {
            const url = `http://delprod.herokuapp.com/users/register/`
            const proxyurl = "https://cors-anywhere.herokuapp.com/"
            let phone = state.phone
            console.log('phone, code', phone, code, state.phone)
			axios 
				.post(proxyurl + url, {
					phone,
					code
				})
				.then(res => {
                    saveToken(res.data.key, res.data.uid, commit)
                    console.log('rescode', res)
                    router.push('/')
                    console.log('authenticated', state.authenticated)
                })
				.catch(({ response }) => {
					commit('AuthError', response.data)
				})
		},
		signup({ commit, state }, { phone, nickname}) {
            // axios.defaults.headers.post['Content-Type'] = 'application/json'
            const url = `http://delprod.herokuapp.com/users/phone/`
            const proxyurl = "https://cors-anywhere.herokuapp.com/";
            console.log('phone, nickname',)
			axios
				.post( proxyurl + url, {
                    phone,
                    nickname
                },
                )
				.then(res => {
                    if(res){
                        console.log('res', res)
                        // saveToken(res.data.token, commit)
                        // console.log('resstatus', res, res.status, res.statusText)
                        const status = res.status
                        if(status == 200){
                            console.log('status', status, this)
                            router.push('/code')
                        }
                    }
                })
				.catch(({ response }) => {
					commit('AuthError', response.data)
                })
            state.phone = phone
            console.log('phone', state.phone)
		}
	},
    getters: {
        pickup: state => state.pickupLocation.name,
        latlng: state => [state.pickupLocation.lat, state.pickupLocation.lng],
        destination: state => state.destinationLocation.name,
        latlngDestination: state => [state.destinationLocation.lat, state.destinationLocation.lng],
        initialLocation: state => state.initialLocation.name,
        latlngInitial: state => [state.initialLocation.lat, state.initialLocation.lng],
        userRole: state => state.userRole,
        pickupSuggests: state => state.pickupSuggests,
        destinationSuggests: state => state.destinationSuggests
    }
})

function saveToken(token, uid, cb) {
	localStorage.setItem('token', token)
	localStorage.setItem('uid', uid)
	// user is auth 
    cb('AuthUser')
    const tokenS = localStorage.getItem('token')
    const uidS = localStorage.getItem('uid')
    console.log('uid, token', tokenS, uidS, cb)
}
