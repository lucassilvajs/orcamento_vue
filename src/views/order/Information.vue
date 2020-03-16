<template>
<div>
    <my-breadcrumb />
    <b-row>
        <b-colxx xxs="12">

            <b-card class="mb-3" v-if="companies">
                <!-- <b-row v-if="companiesValue">
                    <b-colxx>
                        <b-form-group label="Selecione a empresa">
                            <v-select @change="changeFields" v-model="setCompany" :options='companiesValue' dir="rtl" />
                        </b-form-group>
                    </b-colxx>
                </b-row> -->
                <select class="form-control" @change="changeFields" v-model="setCompany">
                    <option v-for="(company, index) in companies" :value="index" :key="index">{{company.company.split('-')[0]}}</option>
                </select>
            </b-card>

            <b-card class="mb-4" title="Dados do colaborador">
                <b-row>
                    <b-colxx v-if="fields">
                        <form @submit.prevent="formStepOne" class="form" v-if="setCompany || !this.fields.colaborador ">
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
                    <b-colxx class="d-flex align-items-center justify-content-center text-center" v-else>
                        <h2>Buscando dados do formulário...</h2>
                    </b-colxx>
                </b-row>
            </b-card>
        </b-colxx>
    </b-row>
</div>
</template>

<script>

import vSelect from 'vue-select'
import myBreadCrumb from '@/components/breadcrumb';
import {api} from '@/constants/config'; 
export default {
    components: {
        'my-breadcrumb': myBreadCrumb,
        'v-select': vSelect,
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
            selectData: [
                'Chocolate',
                'Vanilla',
                'Strawberry',
                'Caramel',
                'Cookies and Cream',
                'Peppermint'
            ],
        }
    },
    computed: {
        companiesValue: function(){
            return ["Lucas", "Aline", "Cecilia"]
        }
    },
    methods: {
        formStepOne: function(){
            let form = {};
            form['name'] = this.values[0];
            this.fields.forEach((el, index) => {
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
            this.$router.push("/order/products");    
        },
        getItemsAdd: async function() {
                const itemsFields = await api.get('company/fields');
                this.fields = itemsFields.data.data
                if(this.fields.colaborador){
                    this.companies = this.fields.companies
                }else{
                    this.values.push('');
                    this.fields.forEach((el) => {
                        this.values.push('');
                    });
        
                    let info = window.localStorage.getItem('order');
                    if(info) {
                        info = JSON.parse(info).info;
                        let ind = 0;
                        for(let i in info) {
                            this.values[ind] = info[i]
                            ind++;
                        }
                    }
                }
        },
        changeFields: function () {
            console.log(JSON.parse(this.companies[this.setCompany].field))
            this.values = [];
            this.values.push('');
            this.fields = JSON.parse(this.companies[this.setCompany].field)
            this.fields.forEach((el) => {
                this.values.push('');
            });
            this.company = this.companies[this.setCompany].idCompany
            let info = window.localStorage.getItem('order');
            if(info) {
                info = JSON.parse(info).info;
                let ind = 0;
                for(let i in info) {
                    this.values[ind] = info[i]
                    ind++;
                }
            }
        },
    },

    watch: {
    },

    created() {
        this.getItemsAdd();
    }
}
</script>
