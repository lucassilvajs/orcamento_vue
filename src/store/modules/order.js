import { api, currentUser } from '../../constants/config'
export default {
  state: {
    currentOrder: localStorage.getItem('order') != null ? JSON.parse(localStorage.getItem('order')) : null,
    requestError: null,
    processing: false,
  },
  getters: {
    currentOrder: state => state.currentOrder,
    processing: state => state.processing,
    requestError: state => state.requestError,
    forgotMailSuccess: state => state.forgotMailSuccess,
    resetPasswordSuccess:state => state.resetPasswordSuccess,
  },
  mutations: {
    setUser(state, payload) {
      state.currentOrder = payload
      state.processing = false
      state.requestError = null
    },
    setSuccess(state, payload) {
      state.currentOrder = payload
      state.processing = false
      state.requestError = null
    },
    setLogout(state) {
      state.currentOrder = null
      state.processing = false
      state.requestError = null
    },
    setProcessing(state, payload) {
      state.processing = payload
      state.requestError = null
    },
    setError(state, payload) {
      state.requestError = payload
      state.currentOrder = null
      state.processing = false
    },
    setForgotMailSuccess(state) {
      state.requestError = null
      state.currentOrder = null
      state.processing = false
      state.forgotMailSuccess=true
    },
    setResetPasswordSuccess(state) {
      state.requestError = null
      state.currentOrder = null
      state.processing = false
      state.resetPasswordSuccess=true
    },
    clearError(state) {
      state.requestError = null
    }
  },
  actions: {
    setInfoOrder({ commit }, payload) {
      commit('setSuccess', payload);
      // window.localStorage.setItem('info', JSON.stringify(info))
    },
  }
}
