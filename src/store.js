import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import router from './router/index';
import { TYPE } from 'vue-toastification';
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sidebarShow: 'responsive',
    sidebarMinimize: false,
    status: '',
    token: localStorage.getItem('token') || '',
  },
  mutations: {
    toggleSidebarDesktop (state) {
      const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
      state.sidebarShow = sidebarOpened ? false : 'responsive'
    },
    toggleSidebarMobile (state) {
      const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
      state.sidebarShow = sidebarClosed ? true : 'responsive'
    },
    set (state, [variable, value]) {
      state[variable] = value
    },
    auth_request(state){
      state.status = 'loading'
    },
    auth_success(state, token){
      state.status = 'success'
      state.token = token
    },
    auth_error(state){
      state.status = 'error'
    },
    logout(state){
      state.status = ''
      state.token = ''
    },
  },
  actions: {
    login({commit},payload){
      axios.post('token/', payload)
      .then(res => {
        const token = res.data.access;
        localStorage.setItem('token','Bearer ' + token);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        commit('auth_success', token, payload);
        router.push('/');
      })
      .catch(() => {
        Vue.$toast('Login yoki parol xato kiritilgan.',{
          type: TYPE.ERROR
        })
        commit('auth_error');
      })
    },
    logout({commit}){
      return new Promise((resolve, reject) => {
        commit('logout')
        axios.post('/token/drop/');
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        router.push('/pages/login');
        resolve()
      })
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
  }
})