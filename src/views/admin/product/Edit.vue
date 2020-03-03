<template>
<div>
    <b-row>
        <b-colxx xxs="12">
            <h1>Editar produto</h1>
            <div class="separator mb-5"></div>
        </b-colxx>
    </b-row>
    <b-alert variant="info" show  dismissible>Você pode parametrizar o preço e as variações disponíveis na tela de cadastro/edição da empresa que você quiser!.</b-alert>
    <b-row>
        <b-colxx xxs="12">
            <b-card class="mb-4" title="Novo produto">
                <b-row>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="Nome do Produto" class="has-float-label mb-4">
                            <b-form-input type="text" placeholder="Nome do Produto" />
                        </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="SKU" class="has-float-label mb-4">
                            <b-form-input type="text" placeholder="SKU" />
                        </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="Preço" class="has-float-label mb-4">
                            <b-form-input type="text" placeholder="Preço" />
                        </b-form-group>
                    </b-colxx>
                </b-row>
            </b-card>
            
            <b-card class="mb-4" title="Cor">
                <b-row>
                    <b-colxx lg="3">
                        <b-form-group label="Cor" class="has-float-label mb-4">
                            <b-form-input type="text" placeholder="Cor" />
                        </b-form-group>
                        <button class="btn btn-success w-100" @click="loading(true)">Adicionar Imagem</button>
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

            <b-card class="mb-4" title="Tamanho">
                <b-row>
                    <b-colxx lg="3">
                        <b-form-group label="Comercial" class="has-float-label mb-4">
                            <b-form-input type="text" placeholder="Comercial" />
                        </b-form-group>
                        <b-form-group label="Interno" class="has-float-label mb-4">
                            <b-form-input type="text" placeholder="Interno" />
                        </b-form-group>
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
            products: [
                // {
                //     id: 1,
                //     title: 'Marble Cake',
                //     img: '/assets/img/marble-cake-thumb.jpg',
                //     category: 'Cakes',
                //     createDate: '02.04.2018',
                //     status: 'ON HOLD',
                //     statusColor: 'primary',
                //     description: 'Wedding cake with flowers Macarons and blueberries',
                //     sales: 1647,
                //     stock: 62
                // },
            ]
        }
    },
    methods: {
        ...mapActions(["loading"]),

    }
}
</script>