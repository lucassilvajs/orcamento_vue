<template>
<div>
    <my-breadcrumb />
    <b-row>
        <b-colxx xxs="12">
            <b-card class="mb-4" title="Confirmação da solicitação">
                <b-row>
                    <b-colxx md="3" lg="3" class="">
                        <h5 class="mb-2 mt-4 card-title">Dados do colaborador</h5>
                        <div v-if="order && order.info">
                            <p v-for="(field, index) in order.info" :key="index"><b>{{index == 'name' ? 'Nome': index}}: </b>{{field}}</p>
                        </div>
                        <div v-else>
                            <p class="text-center">Você não inseriu dados do coladorador <router-link to="/order/information">Clique aqui</router-link> para adicionar</p>
                        </div>
                    </b-colxx>
                    <b-colxx md="3" lg="3" class="">
                        <h5 class="mb-2 mt-4 card-title">Produto Selecionado</h5>
                        <div v-if="order && order.product">
                            <p><b>Nome: </b>{{order.product.name}}</p>
                            <p><b>Tamanho: </b>{{order.product.size}}</p>
                            <p><b>Cor: </b>{{order.product.color}}</p>
                            <hr />
                            <div v-if="order.lens">
                                <div v-for="(lens, index) in order.lens" :key="index">
                                    <p v-for="(l, i) in lens" :key="i"><b>{{ index == 0 ? 'Lentes' : (index == 1 ? 'Dioptria' : 'Tratamento') }}: </b>{{l.name}}</p>
                                </div>

                            </div>
                            <img class="w-100" :src="`https://dp.idsafety.com.br/upload/product/${order.product.image}`" alt="">
                        </div>
                        <div v-else>
                            <p class="text-center">Você ainda não selecionou o óculos <router-link to="/order/products">Clique aqui</router-link> para adicionar</p>
                        </div>
                    </b-colxx>
                    <b-colxx md="3" lg="3" class="">
                        <h5 class="mb-2 mt-4 card-title">Captura da face</h5>
                        <div v-if="order && order.face">
                            <img class="w-100" :src="`${baseURL}${order.face}`" alt="">
                        </div>
                        <div v-else>
                            <p class="text-center">Você ainda não anexou a face <router-link to="/order/face">Clique aqui</router-link> para anexar</p>
                        </div>
                    </b-colxx>
                    <b-colxx md="3" lg="3" class="">
                        <h5 class="mb-2 mt-4 card-title">Captura da receita</h5>
                        <div v-if="order && order.recipe">
                            <img class="w-100" :src="`${baseURL}${order.recipe}`" alt="">
                        </div>
                        <div v-else>
                            <p class="text-center">Você ainda não anexou a receita <router-link to="/order/recipe">Clique aqui</router-link> para anexar</p>
                        </div>
                    </b-colxx>
                </b-row>
            </b-card>
        </b-colxx>
    </b-row>
    <b-row>
        <b-colxx>
            <b-button variant="success" :disabled="processing" :class="{'float-right mb-3 btn-multiple-state btn-shadow': true,
                'show-spinner': processing,
                'show-success': !processing && uploadError===false,
                'show-fail': !processing && uploadError }" @click="sendInfo">
                <span class="spinner d-inline-block">
                    <span class="bounce1"></span>
                    <span class="bounce2"></span>
                    <span class="bounce3"></span>
                </span>
                <span class="icon success">
                    Enviar Solicitação
                </span>
                <span class="icon fail">
                    <i class="simple-icon-exclamation"></i>
                </span>
                <span class="label">Enviar Solicitação</span>
            </b-button>
        </b-colxx>
    </b-row>
</div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from "vuex";

import {api, baseURL} from '@/constants/config';
import myBreadCrumb from '@/components/breadcrumb';
export default {
    components: {
        'my-breadcrumb': myBreadCrumb
    },
    data() {
        return {
            order: null,
            baseURL,
            processing: false,
            uploadError: false
        }
    },

    computed: {
        ...mapGetters(["currentOrder", "processing", "loginError"]),
        valido: function(){
            let message = '';
            let status = true;

            let order = window.localStorage.getItem('order');
            order = JSON.parse(order)
            console.log(order)
            if(!order.info) {
                status = false;
                message += '- Nome do solicitante<br />';
            }else{
                if(!order.info.name) {
                    status = false;
                    message += '- Nome do solicitante<br />';
                }
            }

            if(!order.product) {
                status = false;
                message += '- Produto<br />';
            }

            if(!order.face) {
                status = false;
                message += '- Imagem da face<br />';
            }

            if(!order.recipe) {
                status = false;
                message += '- Imagem da receita<br />';
            }

            return {
                status,
                message
            }
        },
    },
    methods: {
        sendInfo: async function(){
            if(!this.valido.status) {
                this.$notify("error", "Faltam algumas coisas", this.valido.message, {
                    duration: 3000,
                    permanent: false
                });
            }else{
                this.processing = true;
                let order = JSON.parse(window.localStorage.getItem('order'));
                const response = await api.post('/order', order);
                let data = response.data;
                if(data.status == 'success') {
                    this.$notify("success", `Pedido #${data.data.order.id}`, data.message, {
                        duration: 3000,
                        permanent: false
                    });

                    window.localStorage.removeItem('order');
                    this.$router.push('/order/orders');
                }else{
                    this.uploadError = false;
                    this.$notify("error", 'Opsss...!', data.message, {
                        duration: 3000,
                        permanent: false
                    });
                }
            }
        },
        infoOrder: function() {
            this.order = JSON.parse(window.localStorage.getItem('order'));
        },

    },
    created() {
        this.infoOrder();
    },
    watch: {
        currentOrder: function(val){
            console.log(val)
            if(val) {
                this.$router.push("/order/products");
            }
        }
    }
}
</script>

<style scoped>
    p{
        margin-bottom: 5px!important;
    }

    .text-center a{
        color: #00b3b7
    }
</style>