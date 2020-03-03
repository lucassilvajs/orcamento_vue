export default {
  state: {
    loading: false
  },
  getters: {
    loading: state => state.loading
  },
  mutations: {
    loading(state, payload) {
        state.loading = payload;
    }
  },
  actions: {
    loading({commit}, payload) {
        commit('loading', payload);
    }
  }
}
