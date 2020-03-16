<template>
<div>
    <b-row class="postition-relative side">
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
                    link: '/order/information'
                },
                {
                    text: 'Selecionar produto',
                    link: '/order/products'
                },
                {
                    text: 'Selecionar lentes',
                    link: '/order/lens'
                },
                {
                    text: 'Capturar face',
                    link: '/order/face'
                },
                {
                    text: 'Capturar receita',
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

@media (max-width: 480px){
    .side::after {
        content: '→';
        position: absolute;
        top: -15px;
        right: 30px;
        color: rgba(0, 0, 0, .3);
        animation: arrow .5s ease-in 0s infinite alternate;
    }
}

@keyframes arrow {
  from {
    right: 30px;
  }

  to {
    right: 20px;
  }
}
</style>
