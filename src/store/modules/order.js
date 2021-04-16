import {api, baseURL} from '@/constants/config';
export default {
  state: {
    awaitingOrders: null,
    currentOrder: localStorage.getItem('order') != null ? JSON.parse(localStorage.getItem('order')) : {},
  },
  getters: {
    awaitingOrders: state => state.awaitingOrders,
    currentOrder: state => state.currentOrder
  },
  mutations: {
    SET_AWAITING_ORDERS(state, payload) {
      state.awaitingOrders = payload
    },
    SET_ITEM_ORDER(state, payload) {
      let type = payload.type;
      if(type) {
        delete payload.type;
        console.log("Type: ", type);
        state.currentOrder[type] = payload
        console.log("State: ", state.currentOrder);
      }
    },
    DELETE_ITEM_ORDER(state){
      state.currentOrder = {};
    }
  },
  actions: {
    async getAwaitingOrders({commit}, payload){
      const response = await api.get('/order', {
        params: {
          status: 'awaiting',
        }
      });
      commit('SET_AWAITING_ORDERS', response.data.data.orders.map(r => {r.item = false; return r;}));
    },

    async sendAwaitingOrders({commit}, payload) {
      let items = [];
      payload.items.forEach(e => {
        items.push(e.id);
      });

      const response = await api.put('/order/awaiting', {items});
      return true;
    },

    setItemOrder({commit, state}, payload) {
      commit('SET_ITEM_ORDER', payload);
      localStorage.setItem('order', JSON.stringify(state.currentOrder));
    },

    clearCart({commit, state}) {
      commit('DELETE_ITEM_ORDER')
      localStorage.setItem('order', JSON.stringify(state.currentOrder));
    }
  }
}
