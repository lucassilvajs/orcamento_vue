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
                    {label: 'Aprovado', code: 'aproved'},
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
          <b-table v-if="items && items.length" striped :items="items" />
          <div class="alert alert-info" v-else>Nenhuma informação foi encontrada</div>
        </b-card>
      </b-colxx>
    </b-row>
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
      items: null,
      filter: {}
    }
  },
  methods: {
    async getOrder() {
      const items = await api.get('/order');
      this.items = items.data.data
    },
    async getOrderFilter() {
      let params = this.filter;
      if(params.status) {
        params.status = params.status.code;
      }
      const items = await api.get('/order', {
        params
      });
      this.items = items.data.data
    }
  },
  created(){
    this.getOrder();
  }
}
</script>
