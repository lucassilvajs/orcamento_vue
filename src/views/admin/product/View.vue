<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <h1>Produtos</h1>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row class="mb-5">
    <b-colxx xxs="12">
      <b-card class="mb-4" title="Produtos">
        <table class="table table-hover">
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
              <td>{{index}}</td>
              <td>{{pro.name}}</td>
              <td>{{pro.sku}}</td>
              <td>{{pro.date | date}}</td>
              <td>{{pro.value | numeroPreco}}</td>
              <td>
                <router-link class="btn btn-outline-info mr-1" :to="`/admin/product/edit/${pro.id}`"><div class="glyph-icon simple-icon-pencil"></div></router-link>
                <button class="btn btn-outline-danger"><div class="glyph-icon simple-icon-trash"></div></button>
              </td>
            </tr>
          </tbody>
        </table>
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
    onPaginationData (paginationData) {
      this.$refs.pagination.setPaginationData(paginationData)
    },
    onChangePage (page) {
      this.$refs.vuetable.changePage(page)
    },
    rowSelected (items) {
      this.bootstrapTable.selected = items
    },
    dataProvider (ctx) {
      const params = this.apiParamsConverter(ctx)
      let promise = axios.get(apiUrl + '/cakes/fordatatable', { params: params })

      return promise
        .then(result => result.data)
        .then((data) => {
          this.currentPage = data.current_page
          this.perPage = data.per_page
          this.totalRows = data.total
          const items = data.data
          return items;
        }).catch(_error => {
          return []
        })
    },
    apiParamsConverter (params) {
      let apiParams = {}
      if (params.perPage !== 0) {
        apiParams.per_page = params.perPage
      }
      if (params.currentPage >= 1) {
        apiParams.page = params.currentPage
      }
      if (params.sortBy && params.sortBy.length > 0) {
        apiParams.sort = `${params.sortBy}|${params.sortDesc ? 'desc' : 'asc'}`
      }
      if (params.filter && params.filter.length > 0) {
        // Optional
      }
      return apiParams
    },
    async getProducts() {
      const response = await api.get('admin/product');
      this.product = response.data.data;
    }
  },
  created() {
    this.getProducts();
  }
}
</script>
