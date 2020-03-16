import firebase from 'firebase/app'
import 'firebase/auth'
import { currentUser } from '../../constants/config'
import {api} from '@/constants/config';
export default {
  state: {
    currentUser: localStorage.getItem('user') != null ? JSON.parse(localStorage.getItem('user')) : null,
    loginError: null,
    processing: false,
    forgotMailSuccess:null,
    resetPasswordSuccess:null
  },
  getters: {
    currentUser: state => state.currentUser,
    processing: state => state.processing,
    loginError: state => state.loginError,
    forgotMailSuccess: state => state.forgotMailSuccess,
    resetPasswordSuccess:state => state.resetPasswordSuccess,
  },
  mutations: {
    setUser(state, payload) {
      state.currentUser = payload
      state.processing = false
      state.loginError = null
    },
    setLogout(state) {
      state.currentUser = null
      state.processing = false
      state.loginError = null
    },
    setProcessing(state, payload) {
      state.processing = payload
      state.loginError = null
    },
    setError(state, payload) {
      state.loginError = payload
      state.currentUser = null
      state.processing = false
    },
    setForgotMailSuccess(state) {
      state.loginError = null
      state.currentUser = null
      state.processing = false
      state.forgotMailSuccess=true
    },
    setResetPasswordSuccess(state) {
      state.loginError = null
      state.currentUser = null
      state.processing = false
      state.resetPasswordSuccess=true
    },
    clearError(state) {
      state.loginError = null
    }
  },
  actions: {
    async login({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      const dados = await api.post("/login", payload)
      if(dados.data.status == 'success'){
        const item = dados.data.data;
        localStorage.setItem('user', JSON.stringify(item))
        localStorage.setItem('token', dados.data.data.token)
        commit('setUser', {...dados.data.data})
      }else{
        localStorage.removeItem('user')
        commit('setError', dados.data.message)
        setTimeout(() => {
          commit('clearError')
        }, 3000)
      }
    },
    async forgotPassword({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      const response = await api.post('/forgot_password', payload)
      if(response.data.status == 'success') {
        commit('clearError');
        commit('setForgotMailSuccess')
      }else{
        commit('setError', response.data.message);
        setTimeout(() => {
          commit('clearError')
        }, 3000)
      }
    },
    resetPassword({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      firebase
        .auth()
        .confirmPasswordReset(payload.resetPasswordCode,payload.newPassword)
        .then(
          user => {
            commit('clearError')
            commit('setResetPasswordSuccess')
          },
          err => {
            commit('setError', err.message)
            setTimeout(() => {
              commit('clearError')
            }, 3000)
          }
        )
    },



    /*
       return await auth.(resetPasswordCode, newPassword)
        .then(user => user)
        .catch(error => error);
    */
    signOut({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          localStorage.removeItem('user')
          commit('setLogout')
        }, _error => { })
    }
  }
}
