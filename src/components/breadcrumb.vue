<template>
<div>
    <b-row class="">
        <b-colxx xxs="12">
            <div class="d-flex text-center mb-3" style="padding:5px 0;border-bottom:1px solid #ccc; border-top:1px solid #ccc; overflow:auto">
                <div v-for="(item, index) in itemsOrder" :key="index" class="col">
                    <router-link :to="item.link">{{item.text}}</router-link>
                </div>
            </div>
        </b-colxx>
    </b-row>
</div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from "vuex";

export default {
    data() {
        return {
            itemsOrder: [
                {
                    text: 'Dados do Colaborador',
                    link: '/order'
                },
                {
                    text: 'Seleção do produto',
                    link: '/order/products'
                },
                {
                    text: 'Captura da face',
                    link: '/order/face'
                },
                {
                    text: 'Captura da receita',
                    link: '/order/recipe'
                },
                {
                    text: 'Confirmação dos dados',
                    link: '/order/confirmation'
                },
            ],
        }
    },
}
</script>

<style scoped>
a.router-link-exact-active{
    color: #00b3b7
}
</style>
