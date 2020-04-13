<template>
  <div>
    <b-row>
      <b-colxx>
        <b-card class="mb-4">
          <b-row>
            <b-colxx lg="3">
                <b-form-group label="Pedido / Nota / Colaborador:" class="has-float-label mb-4">
                    <b-form-input type="text" v-model="filter.name" />
                </b-form-group>
            </b-colxx>
            <b-colxx lg="3">
                <b-form-group label="A partir de:" class="has-float-label mb-4">
                  <v-date-picker mode="single" v-model="filter.start" :input-props="{ class:'form-control', placeholder: $t('form-components.date') }"></v-date-picker>
                </b-form-group>
            </b-colxx>
            <b-colxx lg="3">
                <b-form-group label="Até:" class="has-float-label mb-4">
                  <v-date-picker mode="single" v-model="filter.end" :input-props="{ class:'form-control', placeholder: $t('form-components.date') }"></v-date-picker>
                </b-form-group>
            </b-colxx>
            <b-colxx lg="3">
              <b-form-group>
                  <v-select v-model="filter.status" :options="[
                    {label: 'Pendente', code: 'pending'},
                    {label: 'Aprovado', code: 'approved'},
                    {label: 'Recusado', code: 'reproved'},
                  ]" dir="ltr" />
              </b-form-group>
                <!-- <b-form-group label="Até:" class="has-float-label mb-4">
                </b-form-group> -->
            </b-colxx>
            <b-colxx lg="12">
                <button class="btn btn-outline-success float-right" @click="getOrderFilter()">Buscar</button>
            </b-colxx>
          </b-row>
        </b-card>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" title="Confira seu pedidos">
          <!-- <b-table v-if="items && items.length" striped :items="items" /> -->
          <table v-if="items && items.length" class="table b-table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Empresa</th>
                <th>Valor</th>
                <th>Produto</th>
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(it, index) in items" :key="index">
                <td>{{it.id}}</td>
                <td>{{it.name}}</td>
                <td>{{it.value}}</td>
                <td>{{it.product}}</td>
                <td>{{it.date}}</td>
                <td>{{it.status}}</td>
                <td>
                  <button @click="getInfoOrder(index)" v-b-modal.modalright class="btn btn-outline-info">
                    <div class="simple-icon-eye"/>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="alert alert-info" v-else>Nenhuma informação foi encontrada</div>
        </b-card>
      </b-colxx>
    </b-row>

    <b-modal v-if="order" id="modalright" ref="modalright" :title="`Pedido #${order.id}`" modal-class="modal-right">
      <b>Data: </b>{{order.date}}<br />
      <b>Empresa: </b>{{order.name}}<br />
      <b>Colaborador: </b>{{order.attr.info.name}}<br />
      <b>Valor: </b>{{order.value}}<br />
      <hr>
      <div v-for="item in order.attr.lens" :key="item.code">
        <b>{{item.type}}</b> {{item.name}}
      </div>
      <div v-if="order.attr.measure">
        <b>DP:</b> {{order.attr.measure.pupillary_distance}}<br />
        <b>ALT:</b> {{order.attr.measure.pupillary_height}}<br />
      </div>
      <hr>
      <b>Face: </b><br />
      <img class="w-100" :src="baseURL + order.attr.face" alt="">
      <b>Receita: </b><br />
      <img class="w-100" :src="baseURL + order.attr.recipe" alt="">
      <template slot="modal-footer">
          <b-button variant="info" @click="hideModal('modalright')">Fechar</b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import {api} from '@/constants/config';
export default {
  components: {
    'v-select': vSelect,
  },
  data () {
    return {
      order: null,
      items: null,
      filter: {}
    }
  },
  methods: {
    async getOrder() {
      console.log(this.$route)
      const orderType = this.$route.path.split('/')[2];
      const items = await api.get('/order', {
        params: {
          status: orderType ? orderType : ''
        }
      });
      this.items = items.data.data
    },
    getInfoOrder(index) {
      this.order = this.items[index]
    },
    async getOrderFilter() {
      const orderType = this.$route.path.split('/')[2];
      let params = this.filter;
      params.status = orderType ? orderType : ''
      const items = await api.get('/order', {
        params
      });
      this.items = items.data.data
    }
  },
  created(){
    this.getOrder();
  },
  watch: {
    $route() {
      this.getOrder();
    }
  }
}
</script>
