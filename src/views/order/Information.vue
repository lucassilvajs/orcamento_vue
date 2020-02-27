<template>
<div>
    <my-breadcrumb />
    <b-row>
        <b-colxx xxs="12">
            <b-card class="mb-4" title="Dados do colaborador">
                <form @submit.prevent="formStepOne" class="form">
                    <b-row v-if="fields">
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
                        <b-colxx lg="4">
                            <button type="submit" class="btn btn-outline-success float-right">Próximo</button>
                        </b-colxx>
                    </b-row>
                </form>
            </b-card>
        </b-colxx>
    </b-row>
</div>
</template>

<script>

import myBreadCrumb from '@/components/breadcrumb';
import {api} from '@/constants/config'; 
export default {
    components: {
        'my-breadcrumb': myBreadCrumb
    },
    data() {
        return {
            form: {
                name: '',
                requester: '',
                company: '',
                optical: '',
                observation: ''
            },
            fields: null,
            values: []
        }
    },

    computed: {
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
            window.localStorage.setItem('order', JSON.stringify(order));
            this.$router.push("/order/products");    
        },
        getItemsAdd: async function() {
            const itemsFields = await api.get('company/fields');
            this.fields = itemsFields.data.data
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

    watch: {
    },

    created() {
        this.getItemsAdd();
    }
}
</script>
