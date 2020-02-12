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
      commit('clearError')
      commit('setProcessing', true)
      setTimeout(() => {
          commit('setSuccess', payload);
          let order = window.localStorage.getItem('order');
          if(order) {
            order = JSON.parse(order);
          }else{
            order = {}
          }
          order.info = payload;
          window.localStorage.setItem('order', JSON.stringify(order))
      }, 1000);
    //   firebase
    //     .auth()
    //     .signInWithEmailAndPassword(payload.email, payload.password)
    //     .then(
    //       user => {
    //         const item = { uid: user.user.uid, ...currentOrder }
    //         localStorage.setItem('user', JSON.stringify(item))
    //         commit('setUser', { uid: user.user.uid, ...currentOrder })
    //       },
    //       err => {
    //         localStorage.removeItem('user')
    //         commit('setError', err.message)
    //         setTimeout(() => {
    //           commit('clearError')
    //         }, 3000)
    //       }
    //     )
    },
    // forgotPassword({ commit }, payload) {
    //   commit('clearError')
    //   commit('setProcessing', true)
    //   firebase
    //     .auth()
    //     .sendPasswordResetEmail(payload.email)
    //     .then(
    //       user => {
    //         commit('clearError')
    //         commit('setForgotMailSuccess')
    //       },
    //       err => {
    //         commit('setError', err.message)
    //         setTimeout(() => {
    //           commit('clearError')
    //         }, 3000)
    //       }
    //     )
    // },
    // resetPassword({ commit }, payload) {
    //   commit('clearError')
    //   commit('setProcessing', true)
    //   firebase
    //     .auth()
    //     .confirmPasswordReset(payload.resetPasswordCode,payload.newPassword)
    //     .then(
    //       user => {
    //         commit('clearError')
    //         commit('setResetPasswordSuccess')
    //       },
    //       err => {
    //         commit('setError', err.message)
    //         setTimeout(() => {
    //           commit('clearError')
    //         }, 3000)
    //       }
    //     )
    // },



    /*
       return await auth.(resetPasswordCode, newPassword)
        .then(user => user)
        .catch(error => error);
    */
    // signOut({ commit }) {
    //   firebase
    //     .auth()
    //     .signOut()
    //     .then(() => {
    //       localStorage.removeItem('user')
    //       commit('setLogout')
    //     }, _error => { })
    // }
  }
}
