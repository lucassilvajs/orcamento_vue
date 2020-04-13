<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <h1>Pedidos</h1>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row class="mb-5">
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
    <b-colxx xxs="12">
      <b-card class="mb-4" title="Pedidos">
        <div v-if="items && items.length > 0">
          <table class="table table-striped" v-if="items && items.length > 0">
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Nota</th>
                <th>Aprovado</th>
                <th>Valor</th>
                <th>Produto</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index">
                <td>{{index+1}}</td>
                <td>{{item.name}}</td>
                <td>{{item.nota}}</td>
                <td>{{item.date}}</td>
                <td>{{item.value}}</td>
                <td>{{item.product}}</td>
                <td>{{item.status}}</td>
                <td>
                  <button @click="getInfoOrder(index)" v-b-modal.modalright class="btn btn-outline-success">
                    <div class="simple-icon-doc"/>
                  </button>
                  <router-link :to="`/admin/order/measure/${item.id}`" v-b-modal.modalright class="btn btn-outline-info" :id="`measure${item.id}`">
                    <div class="glyph-icon simple-icon-eye"/>
                  </router-link>
                  <b-tooltip :target="`measure${item.id}`"
                          :placement="`measure${item.id}`"
                          title="Eye Measure">
                  </b-tooltip>
                </td>
              </tr>
            </tbody>
          </table>
          <b-pagination v-if="500 > 50"
            size="sm"
            align="center"
            :total-rows="500"
            :per-page="50"
            @change="pageCompany"
          />
        </div>
        <div v-else class="alert">Nenhuma informação foi encontrada</div>
      </b-card>
    </b-colxx>
  </b-row>

  <b-modal v-if="order" id="modalright" ref="modalright" :title="`Pedido #${order.id}`" modal-class="modal-right">
      <b>Data: </b>{{order.date}}<br />
      <b>Empresa: </b>{{order.empresa.split('-')[0]}}<br />
      <b>Colaborador: </b>{{order.object.info.name}}<br />
      <b>Valor: </b>{{order.value}}<br />
      <hr>
      <div v-for="item in order.object.lens" :key="item.code">
        <b>{{item.type}}</b> {{item.name}}
      </div>
      <div v-if="order.object.measure">
        <b>DP:</b> {{order.object.measure.pupillary_distance}}<br />
        <b>ALT:</b> {{order.object.measure.pupillary_height}}<br />
      </div>
      <hr>
      <b>Face: </b><br />
      <img class="w-100" :src="baseURL + order.object.face" alt="">
      <b>Receita: </b><br />
      <img class="w-100" :src="baseURL + order.object.recipe" alt="">
      <template slot="modal-footer">
          <b-button variant="info" @click="hideModal('modalright')">Fechar</b-button>
      </template>
  </b-modal>

</div>
</template>
<script>
import { api, baseURL } from '@/constants/config'

export default {
  components: {
  },
  data () {
    return {
      baseURL,
      filter: {},
      items: null,
      data: null,
      order: null
    }
  },
  methods: {
    async getOrder() {
      const items = await api.get('/admin/order');
      this.items = items.data.data
    },
    getInfoOrder(index) {
      this.order = this.items[index]
    },
    hideModal (refname) {
      this.$refs[refname].hide()
      console.log('hide modal:: ' + refname)

      if (refname === 'modalnestedinline') {
        this.$refs['modalnested'].show()
      }
    },
    somethingModal (refname) {
      this.$refs[refname].hide()
      console.log('something modal:: ' + refname)

      if (refname === 'modalnestedinline') {
        this.$refs['modalnested'].show()
      }
    }
  },
  created(){
    this.getOrder();
  }
}
</script>
