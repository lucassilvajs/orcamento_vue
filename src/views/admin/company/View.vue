<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <h1>Empresas</h1>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row class="mb-4">
    <b-colxx>
      <b-card>
        <b-row>
          <b-colxx lg="3">
              <b-form-group label="Nome da empresa" class="has-float-label mb-4">
                  <b-form-input type="text" v-model="filter.name" />
              </b-form-group>
          </b-colxx>
          <b-colxx lg="3">
              <b-form-group label="Cadastro partir de:" class="has-float-label mb-4">
                <v-date-picker mode="single" v-model="filter.start" :input-props="{ class:'form-control', placeholder: $t('form-components.date') }"></v-date-picker>
              </b-form-group>
          </b-colxx>
          <b-colxx lg="3">
              <b-form-group label="Cadastro até:" class="has-float-label mb-4">
                <v-date-picker mode="single" v-model="filter.end" :input-props="{ class:'form-control', placeholder: $t('form-components.date') }"></v-date-picker>
              </b-form-group>
          </b-colxx>
          <b-colxx lg="3">
            <b-form-group>
                <v-select v-model="filter.status" :options="[
                  {label: 'Com Contrato', code: '1'},
                  {label: 'Sem Contrato', code: '0'},
                ]" dir="ltr" />
            </b-form-group>
              <!-- <b-form-group label="Até:" class="has-float-label mb-4">
              </b-form-group> -->
          </b-colxx>
          <b-colxx lg="12">
              <button class="btn btn-outline-success float-right" @click="getCompanyFilter()">Buscar</button>
          </b-colxx>
        </b-row>
      </b-card>

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
              <th>Flag</th>
              <th>Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(com, index) in company" :key="index">
              <td>{{com.id}}</td>
              <td>{{com.name}}</td>
              <td>{{com.email.split(',').join(';').split(';').join(', ').toLowerCase()}}</td>
              <td>
                <span class="badge mb-1" :class="[{'badge-primary': com.has_contract == 0}, {'badge-success': 1 == com.has_contract}]">{{ com.has_contract == 1 ? 'Tem Contrato' : 'Sem Contrato' }}</span>
                <span class="badge mb-1" :class="[{'badge-primary': com.pedido_compra == 0}, {'badge-success': 1 == com.pedido_compra}]">{{ com.pedido_compra == 1 ? 'PC Obrigatório' : 'PC não obrigatório' }}</span>
                <span class="badge mb-1" :class="[{'badge-primary': com.multiple_order == 0}, {'badge-success': 1 == com.multiple_order}]">{{ com.multiple_order == 1 ? 'Carrinho' : 'Compra direta' }}</span>
              </td>
              <td>{{com.date | date}}</td>
              <td>
                <router-link class="btn btn-outline-info mr-1" :to="`/admin/company/edit/${com.id}`"><div class="glyph-icon simple-icon-pencil"></div></router-link>
                <!-- <button class="btn btn-outline-danger" @click="hideButton(index)" v-if="!com.inDelete">
                  <div class="glyph-icon simple-icon-trash"></div>
                </button> -->
                <!-- <button class="btn btn-danger" @click="deleteItem(index)" v-else>
                  <div class="glyph-icon simple-icon-exclamation flash"></div>
                </button> -->
              </td>
            </tr>
          </tbody>
        </table>
        <div class="alert alert-info" v-else>Você não possui nenhum item cadastrado</div>
        <b-pagination v-if="total > 50"
          size="sm"
          align="center"
          :total-rows="total"
          :per-page="50"
          @change="pageCompany"
        />
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
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
export default {
  components: {
    'vuetable' : Vuetable,
    'vuetable-pagination-bootstrap' : VuetablePaginationBootstrap,
    'v-select': vSelect
  },
  data () {
    return {
      company: null,
      total:0,
      filter: {}
    }
  },
  methods: {
    async getCompanies() {
      const response = await api.get('admin/company');
      this.company = response.data.data.company;
      this.total = response.data.data.total;
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
    },
    async pageCompany(page){
      this.company = [];
      const params = {
        page
      }
      const response = await api.get(`admin/company`, {
        params
      });
      this.company = response.data.data.company;
    },
    async getCompanyFilter() {
      let params = this.filter;
      if(params.status) {
        params.status = params.status.code;
      }
      const response = await api.get('/admin/company', {
        params
      });
      this.company = response.data.data.company;
      this.total = response.data.data.total;
    },
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
