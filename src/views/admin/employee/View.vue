<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <h1>Colaboradores</h1>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row class="mb-5">
    <b-colxx xxs="12">
      <b-card class="mb-4" title="Colaboradores">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Criação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Lucas Silva</td>
                <td>lucas@idsafety.com.br</td>
                <td>01/03/2020 12:59</td>
                <td>
                  <router-link class="btn btn-outline-info mr-1" to="/app/products/edit/1"><div class="glyph-icon simple-icon-pencil"></div></router-link>
                  <button class="btn btn-outline-danger"><div class="glyph-icon simple-icon-trash"></div></button>
                  <button class="btn btn-outline-dark"><div class="glyph-icon simple-icon-chart"></div></button>
                  <b-tooltip :target="'tool-'+item.placement"
                        :placement="item.placement"
                        :title="item.body">
                  </b-tooltip>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
  </div>
</template>
<script>
import { apiUrl } from '@/constants/config'
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
      items: [
        { id: 1, Nome: 'ID 103 A', SKU: 'Otto', username: '<button></button>' },
        { id: 2, Nome: 'ID 103 A', SKU: 'Thornton', username: '@fat' },
        { id: 3, Nome: 'ID 103 A', SKU: 'the Bird', username: '@twitter' }
      ],
      vuetableItems: {
        apiUrl: apiUrl + '/cakes/fordatatable',
        fields: [
          {
            name: 'title',
            sortField: 'title',
            title: 'Name',
            titleClass: '',
            dataClass: 'list-item-heading'
          },
          {
            name: 'sales',
            sortField: 'sales',
            title: 'Sales',
            titleClass: '',
            dataClass: 'text-muted'
          },
          {
            name: 'stock',
            sortField: 'stock',
            title: 'Stock',
            titleClass: '',
            dataClass: 'text-muted'
          },
          {
            name: 'category',
            sortField: 'category',
            title: 'Category',
            titleClass: '',
            dataClass: 'text-muted'
          }
        ]
      },
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      bootstrapTable: {
        selected: [],
        selectMode: 'multi',
        fields: [
          { key: 'title', label: 'Title', sortable: true, sortDirection: 'desc', tdClass: 'list-item-heading' },
          { key: 'sales', label: 'Sales', sortable: true, tdClass: 'text-muted' },
          { key: 'stock', label: 'Stock', sortable: true, tdClass: 'text-muted' },
          { key: 'category', label: 'Category', sortable: true, tdClass: 'text-muted' },
          { key: 'status', label: 'Status', sortable: true, tdClass: 'text-muted' }
        ]
      }
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
    }
  },
  mounted () {
    /* popover manuel close */
    this.$root.$on('bv::popover::show', () => {
      this.$root.$emit('bv::hide::popover')
    })
    document.addEventListener('click', e => {
      if (e.target.id.indexOf('pop') === -1) {
        this.$root.$emit('bv::hide::popover')
      }
    })
  }
}
</script>
