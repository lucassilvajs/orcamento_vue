<template>
<div>
    <my-breadcrumb />
    <b-row>
        <b-colxx xxs="12">
            <b-card class="mb-3" v-if="companies">
                <b-row v-if="companiesValue">
                    <b-colxx>
                        <b-form-group label="Selecione a empresa">
                            <v-select v-model="setCompany"
                                :options="companiesValue" dir="ltr"></v-select>
                        </b-form-group>
                    </b-colxx>
                </b-row>
            </b-card>

            <b-card v-if="company" class="mb-4" title="Dados do colaborador">
                <b-row>
                    <b-colxx v-if="fields">
                        <form @submit.prevent="formStepOne" class="form" v-if="false && setCompany || !this.fields.colaborador ">
                            <b-row>
                                <b-colxx lg="4">
                                    <b-form-group label="Nome do colaborador" class="has-float-label mb-4">
                                        <b-form-input type="text" v-model="values[0]" />
                                    </b-form-group>
                                </b-colxx>
                                <b-colxx lg="4" v-for="(field, index) in fields" :key="index">
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

            <distribuidor v-if="company" :idCompany="company" />
        </b-colxx>
    </b-row>
</div>
</template>

<script>
import {
    mapGetters,
    mapMutations,
    mapActions
} from 'vuex'

import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import myBreadCrumb from '@/components/adminBreadcrumb';
import distribuidor from '@/views/order/Distribuidor';
import {api} from '@/constants/config';

export default {
    components: {
        'my-breadcrumb': myBreadCrumb,
        'v-select': vSelect,
        distribuidor
    },
    data() {
        return {
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
      ...mapGetters(["currentOrder"])
    },
    methods: {
        ...mapActions(["setItemOrder"]),
        formStepOne: function(){
          let form = {};
          form['name'] = this.values[0];

          this.fields.forEach((el, index) => {
              form[el.replace(':', '')] = this.values[index+1]
          });

          if(this.company) this.setItemOrder({company: this.company, type: 'company'});

          form.type = 'info'
          this.setItemOrder(form)
          this.$router.push("/app/order/products");
        },
        getItemsAdd: async function() {
          const itemsFields = await api.get('company/fields');
          this.fields = itemsFields.data.data
          if(this.fields.colaborador){
            this.companies = this.fields.companies
            this.companiesValue = [];
            this.fields.companies.forEach((el, index) => {
              this.companiesValue.push({code: index, label: el.company});
            });
          }else{
            if(this.fields.length == 0){
              this.values = ['','',''].map(r=>r);
              this.fields = ["Chapa", "Setor", "Turno"];
            }else{
              this.values.push('');
              this.fields.forEach((el) => {
                  this.values.push('');
              });
            }

            let info = this.currentOrder.info;
            if(info) {
              let ind = 0;
              for(let i in info) {
                this.values[ind] = info[i]
                ind++;
              }
            }
          }
        },
    },

    watch: {
      setCompany(novo, old) {
          this.values = [];
          this.values.push('');
          this.fields = JSON.parse(this.companies[novo.code].field)
          if(this.fields) {
            this.fields.forEach((el) => {
              this.values.push('');
            });
          }else{
            this.values = ['','',''].map(r=>r);
            this.fields = ["Chapa", "Setor", "Turno"];
          }
          this.company = this.companies[novo.code].idCompany
          let info = this.currentOrder.info;
          if(info) {
              let ind = 0;
              for(let i in info) {
                  this.values[ind] = info[i]
                  ind++;
              }
          }
      },
    },

    created() {
        this.getItemsAdd();
    }
}
</script>
