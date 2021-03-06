import Vue from 'vue'
import Vuex from 'vuex'

import app from '../main'
import menu from './modules/menu'
import user from './modules/user'
import cart from './modules/cart'
import chat from './modules/chat'
import todo from './modules/todo'
import survey from './modules/survey'
import order from './modules/order'
import company from './modules/company'
import apps from './modules/apps'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
    changeLang (state, payload) {
      app.$i18n.locale = payload
      localStorage.setItem('currentLanguage', payload)
    }
  },
  actions: {
    setLang ({ commit }, payload) {
      commit('changeLang', payload)
    }
  },
  modules: {
    menu,
    user,
    cart,
    chat,
    todo,
    survey,
    order,
    company,
    apps
  }
})
