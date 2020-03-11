<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <h1>Empresas</h1>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row class="mb-5" v-if="company">
    <b-colxx xxs="12">
      <b-card class="mb-4" title="Empresas">
        <table class="table table-hover" v-if="company.length">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Tem contrato</th>
              <th>Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(com, index) in company" :key="index">
              <td>{{index+1}}</td>
              <td>{{com.name}}</td>
              <td>{{com.email}}</td>
              <td v-if="com.has_contract == 1"><span class="badge badge-success">Possui contrato</span></td>
              <td v-else><span class="badge badge-info">Não possui contrato</span></td>
              <td>{{com.date | date}}</td>
              <td>
                <router-link class="btn btn-outline-info mr-1" :to="`/admin/company/edit/${com.id}`"><div class="glyph-icon simple-icon-pencil"></div></router-link>
                <button class="btn btn-outline-danger" @click="hideButton(index)" v-if="!com.inDelete">
                  <div class="glyph-icon simple-icon-trash"></div>
                </button>
                <button class="btn btn-danger" @click="deleteItem(index)" v-else>
                  <div class="glyph-icon simple-icon-exclamation flash"></div>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="alert alert-info" v-else>Você não possui nenhum item cadastrado</div>
      </b-card>
    </b-colxx>
  </b-row>
  </div>
</template>
<script>
import { api, apiUrl } from '@/constants/config'
import axios from 'axios'
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '@/components/Common/VuetablePaginationBootstrap'

export default {
  components: {
    'vuetable' : Vuetable,
    'vuetable-pagination-bootstrap' : VuetablePaginationBootstrap
  },
  data () {
    return {
      company: null
    }
  },
  methods: {
    async getCompanies() {
      const response = await api.get('admin/company');
      this.company = response.data.data.map(p => {p.inDelete = false; return p});
    },
    deleteItem(item){
      this.company = this.company.filter((r,i) => {if(i != item) return r; else api.put(`admin/company/delete/${r.id}`) })
      this.$notify('success', "Sucesso", "Produto deletado com sucesso", {
        duration: 3000,
        permanent: false
      })
    },
    hideButton(index) {
      this.company[index].inDelete = true;
      this.$notify('warning', "Certeza?", "Você deseja realmente deletar essa empresa", {
        duration: 3000,
        permanent: false
      })
      setTimeout(() => {
        this.company[index].inDelete = false;
      }, 3500);
    }
  },
  created() {
    this.getCompanies();
  }
}
</script>

<style>
  .flash {
    animation-name: flash;
    animation-duration: .5s;
    animation-iteration-count: infinite;
  }

  @keyframes flash {
    0% {
      opacity: 1;
    }
    50% {
      opacity: .4;
    }
    100% {
      opacity: 1;
    }
  }
</style>