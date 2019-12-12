import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router';
import axios from 'axios'
import store from './store/index'
import VueCookie from 'vue-cookie'

Vue.config.productionTip = false
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
Vue.use(VueCookie)

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
