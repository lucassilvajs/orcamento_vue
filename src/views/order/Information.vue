<template>
<div>
    <my-breadcrumb />
    <b-row>
        <b-colxx xxs="12">
            <b-card class="mb-3"  v-if="companiesValue.length">
                <b-row>
                    <b-colxx>
                        <b-form-group label="Selecione a empresa">
                            <v-select v-model="setCompany"
                                :options="companiesValue" dir="ltr"></v-select>
                        </b-form-group>
                    </b-colxx>
                </b-row>
            </b-card>

            <b-card v-if="fields" class="mb-4" title="Adquira seus óculos de grau completo">
                <b-row>
                    <b-colxx>
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
            <distribuidor v-if="fields" :idCompany="company" />
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
import myBreadCrumb from '@/components/breadcrumb';
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
          let base = this.$route.path.indexOf('admin') >= 0 ? '/admin/make/' : '/app/order/';
          this.$router.push(`${base}products`);
        },
        getItemsAdd: async function() {
          const itemsFields = await api.get('company/fields');
          if(itemsFields.data.data.colaborador) {
            // Significa que será necessário selecionar uma empresa antes de apresentar os campos
            this.companies = itemsFields.data.data.companies;

            // Salva globalmente para se buscar os campos no evento de Watch
            this.companiesValue = [];
            this.companies.forEach((el, index) => {
              this.companiesValue.push({code: index, label: el.company});
            });
          }else{
            // Cliente normal, não precisa selecionar a empresa
            this.fields = itemsFields.data.data
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
