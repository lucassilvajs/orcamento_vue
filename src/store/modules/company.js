import {api ,getCep} from '@/constants/config';
import axios from "axios";
export default {
  state: {
    currentCompany: null,
  },
  getters: {
    currentCompany: state => state.currentCompany,
  },
  mutations: {
    SET_COMPANY(state, payload) {
      state.currentCompany = payload
    },

  },
  actions: {
    async getCompany({commit}, payload){
      const response = await api.get(`admin/company/${payload.id}`);
      let currentCompany = response.data.data;

      commit('SET_COMPANY', currentCompany);
    },

    async buscarCep(context){
      const address = context.state.currentCompany
      if(address.cep.length === 8) {
        context.commit('loading', true)

        const endereco = await getCep(address.cep);
        const {logradouro, bairro, localidade, uf} = endereco.data
        address.endereco = logradouro;
        address.bairro = bairro;
        address.cidade = localidade;
        address.uf = uf;

        context.commit('SET_COMPANY', address);
        context.commit('loading', false)
      }
    },

    async editCompany(context) {
      context.commit('processing', true)
      const data = await api.put(`admin/company/${context.state.currentCompany.id}`, context.state.currentCompany);
      this._vm.$notify(data.data.status, data.data.status == 'success' ? 'Sucesso' : 'Opsss...', data.data.message, {
        duration: 3000,
        permanent: false
      });
      context.commit('processing', false)
    }
  }
}


