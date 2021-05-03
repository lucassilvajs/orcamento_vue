import firebase from 'firebase/app'
import 'firebase/auth'
import { currentUser } from '../../constants/config'
import {api} from '@/constants/config';
export default {
  state: {
    currentCart: localStorage.getItem('cart') != null ? JSON.parse(localStorage.getItem('cart')) : [],
  },
  getters: {
    currentCart: state => state.currentCart,
  },
  mutations: {
    SET_ITEM_CART(state, payload) {
      state.currentCart.push(payload);
    },
    EDIT_ITEM_CART(state, payload){
      state.currentCart = payload
    },
    DELETE_ITEM_CART(state, payload){
      state.currentCart = payload
    },
    CLEAR_CART(state, payload){
      state.currentCart = null
    },
  },
  actions: {
    setItemCart(context, payload){
      console.log(context.state.currentCart.length)
      if(context.state.currentCart.length > 0) { //Verifica se já exite item no carrinho
        let currentCart = []; // Variavel responsável para armazenar os itens
        let isEdit = false;
        context.state.currentCart.forEach(r => { // passa por todos os itens do carrinho
          if(JSON.stringify(r.attributes) === JSON.stringify(payload.attributes) && r.id == payload.id ) { // Verifica se algum item corresponde ao inserido
            isEdit = true; // Confirma que é uma edição
            r = payload; // Atualiza o item
          }
          currentCart.push(r)
        });
        if (!isEdit) currentCart.push(payload); // Adiciona ao array se for um novo item
        context.commit('EDIT_ITEM_CART', currentCart);
      }else{
        context.commit('SET_ITEM_CART', payload)
      }
      localStorage.setItem('cart', JSON.stringify(context.state.currentCart))
    },
    deleteItemCart({commit, state}, payload) {
      let current = state.currentCart
      current.splice(payload, 1);
      commit('DELETE_ITEM_CART', current);
      localStorage.setItem('cart', JSON.stringify(state.currentCart))
    },
    changeCartQty(context, payload){
      let currentCart = context.state.currentCart;
      currentCart[payload.index].qty = currentCart[payload.index].qty + payload.val;
      context.commit('EDIT_ITEM_CART', currentCart);
      localStorage.setItem('cart', JSON.stringify(context.state.currentCart))
    },
    async finalizarOrder({state, commit}, payload){
      const data = await api.post('/distribuicao', {cart: state.currentCart, idCompany: payload});
      this._vm.$notify(data.data.status, data.data.status == 'success' ? 'Sucesso' : 'Opsss...', data.data.message, {
        duration: 3000,
        permanent: false
      });

      commit('EDIT_ITEM_CART', []);
      localStorage.setItem('cart', JSON.stringify(state.currentCart))

    }
  }
}
