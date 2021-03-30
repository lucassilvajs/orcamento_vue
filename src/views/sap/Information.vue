<template>
<div>
    <b-row class="justify-content-center">

      <b-colxx class="mt-4" v-if="company && !isSetted">
        <list-sap :company="company" @setOrder="setOrder" />
      </b-colxx>

      <b-colxx v-if="isSetted" class="mt-4">
          <b-card class="mb-4" title="Dados do pedido">
              <b-row>
                  <b-colxx>
                      <form @submit.prevent="formStepOne" class="form" v-if="company && company.fields">
                          <b-row>
                              <b-colxx lg="4">
                                  <b-form-group label="Nome do colaborador" class="has-float-label mb-4">
                                      <b-form-input type="text" v-model="values[0]" />
                                  </b-form-group>
                              </b-colxx>
                              <b-colxx lg="4" v-for="(field, index) in company.fields" :key="index">
                                  <b-form-group :label="field" class="has-float-label mb-4">
                                      <b-form-input type="text" v-model="values[index+1]" />
                                  </b-form-group>
                              </b-colxx>
                          </b-row>
                          <b-row>
                              <b-colxx lg="12">
                                  <button type="submit" class="btn btn-outline-success float-right">Próximo</button>
                              </b-colxx>
                          </b-row>
                      </form>
                  </b-colxx>
              </b-row>
          </b-card>
      </b-colxx>

    </b-row>
</div>
</template>

<script>

import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import myBreadCrumb from '@/components/breadcrumb';
import listSap from '@/components/ListSap';
import {api, baseURL} from '@/constants/config';
export default {
    components: {
        'list-sap': listSap,
        'my-breadcrumb': myBreadCrumb,
        'v-select': vSelect,
    },
    data() {
        return {
          isSetted: false,
          baseURL,
            form: {
                name: '',
                requester: '',
                company: '',
                optical: '',
                observation: '',
            },
            companies: false,
            company: false,
            setCompany: false,
            fields: null,
            values: [],
            companiesValue: [],
        }
    },
    computed: {

    },
    methods: {
        getItemsAdd: async function() {
          const itemsFields = await api.get(`ariba/information/${this.$route.params.hash}`);
          if(itemsFields.data.status == 'error') {
            this.$notify("error", 'Opsss',itemsFields.data.message, {
              duration: 5000,
              permanent: false
            });
            this.$router.push(`/login`);
          }

          this.company = itemsFields.data.data;

          if(this.company.fields.length == 0){
              this.values = ['','',''].map(r=>r);
              this.company.fields = ["Chapa", "Setor", "Turno"];
            }else{
              this.values.push('');
              this.company.fields.forEach((el) => {
                  this.values.push('');
              });
            }

          window.localStorage.setItem('information', JSON.stringify(itemsFields.data.data));
        },

        formStepOne: function(){
            let form = {};
            form['name'] = this.values[0];
            this.company.fields.forEach((el, index) => {
                form[el.replace(':', '')] = this.values[index+1]
            });

            let order = window.localStorage.getItem('order');
            if(order){
                order = JSON.parse(order);
            }else{
                order = {}
            }

            order.info = form;
            if(this.company) order.company = this.company;
            window.localStorage.setItem('order', JSON.stringify(order));
            this.$router.push("/sap/products");
        },

        setOrder: function(order){
          this.isSetted = true;
          let information = JSON.parse(window.localStorage.getItem('information'));
          information.orders = information.orders.map((r, i) => {
            r.used = i == order ? true : false;
            return r
          });

          window.localStorage.setItem('information', JSON.stringify(information))
        }
    },

    watch: {
    },

    created() {
        this.getItemsAdd();
    }
}
</script>

<style>
a{
    color: #00b3b7
}
</style>
