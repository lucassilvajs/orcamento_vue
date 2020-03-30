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
