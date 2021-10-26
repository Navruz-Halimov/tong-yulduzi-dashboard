import 'core-js/stable';
import Vue from 'vue';
import App from './App';
import router from './router/index';
import CoreuiVue from '@coreui/vue';
import { iconsSet as icons } from './assets/icons/icons.js';
import { OrbitSpinner } from 'epic-spinners';
import store from './store';
import axios from 'axios';
import Toast from 'vue-toastification';
import "vue-toastification/dist/index.css";
import DatePick from 'vue-date-pick';
import 'vue-date-pick/dist/vueDatePick.css';

const options = {
  position: "top-right",
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: "button",
  icon: true,
  rtl: false
};

Vue.config.performance = true;
Vue.use(CoreuiVue)
// Vue.prototype.$log = console.log.bind(console)

Vue.prototype.$http = axios;
const token = localStorage.getItem('token')
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token
}
axios.defaults.baseURL = `http://89.223.122.156/api/`;
Vue.component("orbit-spinner", OrbitSpinner)
Vue.component("date-pick", DatePick)
Vue.use(DatePick);
Vue.use(Toast,options);

new Vue({
  el: '#app',
  router,
  store,
  icons,
  template: '<App/>',
  components: {
    App
  }
})
