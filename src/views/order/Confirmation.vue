<template>
<div>
    <my-breadcrumb />
    <b-row>
        <b-colxx xxs="12">
            <b-card class="mb-4" title="Confirmação da solicitação">
                <b-row>
                    <b-colxx md="3" lg="3" class="">
                        <h5 class="mb-2 mt-4 card-title">Dados do colaborador</h5>
                        <div v-if="order">
                            <p v-for="(field, index) in order.info" :key="index"><b>{{index == 'name' ? 'Nome': index}}: </b>{{field}}</p>
                        </div>
                    </b-colxx>
                    <b-colxx md="3" lg="3" class="">
                        <h5 class="mb-2 mt-4 card-title">Produto Selecionado</h5>
                        <div v-if="order.product">
                            <p><b>Nome: </b>{{order.product.name}}</p>
                            <p><b>Tamanho: </b>{{order.product.size}}</p>
                            <p><b>Cor: </b>{{order.product.color}}</p>
                            <img class="w-100" :src="`https://dp.idsafety.com.br/upload/product/${order.product.image}`" alt="">
                        </div>
                        <div v-else>
                            <div class="alert alert-warning">Você ainda não selecionou o óculos</div>
                        </div>
                    </b-colxx>
                    <b-colxx md="3" lg="3" class="">
                        <h5 class="mb-2 mt-4 card-title">Captura da face</h5>
                        <div>
                            <img class="w-100" :src="`http://localhost/orcamento_api/${order.face}`" alt="">
                        </div>
                    </b-colxx>
                    <b-colxx md="3" lg="3" class="">
                        <h5 class="mb-2 mt-4 card-title">Captura da receita</h5>
                        <div>
                            <img class="w-100" :src="`http://localhost/orcamento_api/${order.recipe}`" alt="">
                        </div>
                    </b-colxx>
                </b-row>
            </b-card>
        </b-colxx>
    </b-row>
    <b-row>
        <b-colxx>
            <button @click="sendInfo" class="btn btn-success float-right mb-3">Enviar Solicitação</button>
        </b-colxx>
    </b-row>
</div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from "vuex";

import myBreadCrumb from '@/components/breadcrumb';
export default {
    components: {
        'my-breadcrumb': myBreadCrumb
    },
    data() {
        return {
            order: null,
        }
    },

    computed: {
        ...mapGetters(["currentOrder", "processing", "loginError"]),
        valido: function(){
            return false;
        },
    },
    methods: {
        sendInfo: function(){
            if(!this.valido) {
                this.$notify("error", "Faltam algumas coisas", "- Nome do solicitante<br />- Imagem do atestado", {
                    duration: 3000,
                    permanent: false
                });
            }
        },
        infoOrder: function() {
            this.order = JSON.parse(window.localStorage.getItem('order'));

        }
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
</style>