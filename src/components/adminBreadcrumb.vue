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
    props: ["distribuidor"],
    computed: {
      itemsOrder(){
        if(this.distribuidor) {
          return [
                {
                    text: 'Selecionar empresa',
                    link: '/admin/make/information'
                },
                {
                    text: 'Selecionar produto',
                    link: '/admin/make/products'
                },
                {
                    text: 'Confirmação dos dados',
                    link: '/admin/make/confirmation'
                },
            ]
        }
        return this.itemsOrderObj;
      }
    },
    data() {
        return {
            itemsOrderObj: [
                {
                    text: 'Selecionar empresa',
                    link: '/admin/make/information'
                },
                {
                    text: 'Selecionar produto',
                    link: '/admin/make/products'
                },
                {
                    text: 'Selecionar lentes',
                    link: '/admin/make/lens'
                },
                {
                    text: 'Capturar face',
                    link: '/admin/make/face'
                },
                {
                    text: 'Capturar receita',
                    link: '/admin/make/recipe'
                },
                {
                    text: 'Confirmação dos dados',
                    link: '/admin/make/confirmation'
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
