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
        let base = this.$route.path.indexOf('admin') >= 0 ? '/admin/make/' : '/app/order/';
        return this.itemsOrderObj.map(r => {
          r.link = base+r.link;
          return r;
        });
      }
    },
    data() {
        return {
            itemsOrderObj: [
                {
                    text: 'Dados do Colaborador',
                    link: 'information'
                },
                {
                    text: 'Selecionar produto',
                    link: 'products'
                },
                {
                    text: 'Selecionar lentes',
                    link: 'lens'
                },
                {
                    text: 'Capturar face',
                    link: 'face'
                },
                {
                    text: 'Capturar receita',
                    link: 'recipe'
                },
                {
                    text: 'Confirmação dos dados',
                    link: 'confirmation'
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
