<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <h1>Produtos</h1>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row class="mb-5" v-if="product">
    <b-colxx xxs="12">
      <b-card class="mb-4" title="Produtos">
        <table class="table table-hover" v-if="product.length">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>SKU</th>
              <th>Criação</th>
              <th>Preço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(pro, index) in product" :key="index">
              <td>{{index+1}}</td>
              <td>{{pro.name}}</td>
              <td>{{pro.sku}}</td>
              <td>{{pro.date | date}}</td>
              <td>{{pro.value | numeroPreco}}</td>
              <td>
                <router-link class="btn btn-outline-info mr-1" :to="`/admin/product/edit/${pro.id}`"><div class="glyph-icon simple-icon-pencil"></div></router-link>
                <button class="btn btn-outline-danger" @click="hideButton(index)" v-if="!pro.inDelete">
                  <div class="glyph-icon simple-icon-trash"></div>
                </button>
                <button class="btn btn-danger" @click="deleteItem(index)" v-else>
                  <div class="glyph-icon simple-icon-exclamation flash"></div>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="alert alert-info" v-else>Você não possuí nenhum item cadastrado</div>
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
      product: null
    }
  },
  methods: {
    async getProducts() {
      const response = await api.get('admin/product');
      this.product = response.data.data.map(p => {p.inDelete = false; return p});
    },
    deleteItem(item){
      this.product = this.product.filter((r,i) => {if(i != item) return r; else api.put(`admin/product/delete/${r.id}`) })
      this.$notify('success', "Sucesso", "Produto deletado com sucesso", {
        duration: 3000,
        permanent: false
      })
    },
    hideButton(index) {
      this.product[index].inDelete = true;
      this.$notify('warning', "Certeza?", "Você deseja realmente deletar esse produto", {
        duration: 3000,
        permanent: false
      })
      setTimeout(() => {
        this.product[index].inDelete = false;
      }, 3500);
    }
  },
  created() {
    this.getProducts();
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