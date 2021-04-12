import firebase from 'firebase/app'
import 'firebase/auth'
import { currentUser } from '../../constants/config'
import {api} from '@/constants/config';
export default {
  state: {
    currentCart: localStorage.getItem('cart') != null ? JSON.parse(localStorage.getItem('cart')) : null,
  },
  getters: {
    currentCart: state => state.currentCart,
  },
  mutations: {
    SET_ITEM_CART(state, payload) {
      state.currentCart = payload
    },
    EDIT_ITEM_CART(state, payload){
      state.currentCart = payload
    },
    DELETE_ITEM_CART(state, payload){
      state.currentCart = payload
    },
    CLEAR_CART(state, payload){
      state.currentCart = payload
    },
  },
  actions: {
    setItemCart({commit}, payload){
      console.log('Ois')
    },
  }
}
