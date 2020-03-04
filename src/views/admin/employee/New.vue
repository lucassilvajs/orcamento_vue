<template>
<div>
    <b-row>
        <b-colxx xxs="12">
            <h1>Novo Colaborador</h1>
            <div class="separator mb-5"></div>
        </b-colxx>
    </b-row>
    <b-alert variant="info" show  dismissible>Metas e métricas você pode ver na tela de exibição do colaborador</b-alert>
    <b-row>
        <b-colxx xxs="12">
            <b-card class="mb-4" title="Informações Pessoais">
                <b-row>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="Nome do Colaborador" class="has-float-label mb-4">
                            <b-form-input type="text" placeholder="Nome do Colaborador" />
                        </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="E-mail do colaborador" class="has-float-label mb-4">
                            <b-form-input type="text" placeholder="E-mail do colaborador" />
                        </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="Senha de acesso" class="has-float-label mb-4">
                            <b-form-input type="text" placeholder="Senha de acesso" />
                        </b-form-group>
                    </b-colxx>
                </b-row>
            </b-card>
            
            <b-card class="mb-4" title="Empresas consultadas">
                <b-row>
                    <b-colxx lg="3">
                        <b-form-select :options="['Option1', 'Option2','Option3','Option4']"  plain class="mb-3"  />
                        <button class="btn btn-success w-100" @click="loading(true)">Vincular empresa</button>
                    </b-colxx>
                    <b-colxx lg="9">
                        <b-row>
                            <b-colxx v-for="(product,productIndex) in products" xxs="6" lg="3" xl="3" class="mb-4" :key="`product_${productIndex}`">
                                <b-card no-body>
                                    <div class="position-relative">
                                        <b-card-img top :alt="product.title" :src="product.img" />
                                    </div>
                                    <b-card-body>
                                        <b-card-sub-title>{{product.title}}</b-card-sub-title>
                                    </b-card-body>
                                </b-card>
                            </b-colxx>
                        </b-row>
                    </b-colxx>
                </b-row>
            </b-card>
        </b-colxx>
        <b-colxx>
            <button class="btn btn-success float-right">Adicionar Produto</button>
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
export default {
    data() {
        return {
            baseURL,
            color: {
                name: '',
                image: ''
            },
            colors: [],
            sizes: [],
            products: []
        }
    },
    methods: {
        ...mapActions(["loading"]),

    }
}
</script>