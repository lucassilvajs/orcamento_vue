<template>
<div>
    <b-card class="mb-4" title="Items da proposta" v-if="company && company.orders.length > 0">
        <h6 class="text-center my-2">Selecione abaixo qual linha você gostaria concluir sua solicitação</h6>
        <div class="border" v-for="(order, indexOrder) in company.orders" :key="indexOrder">
            <b-button class="w-100" variant="link" @click="order.visible = !order.visible">Linha #{{order.linha}}
              <span v-if="order.status == 'incomplete' && indexOrder == used" class="float-right badge badge-info">Solicitando</span>
              <span v-else-if="order.status == 'incomplete'" class="float-right badge badge-warning">Pendente</span>
              <span v-else class="float-right badge badge-success">Concluida</span>
            </b-button>
            <b-collapse :id="`collapseAccordion${indexOrder}`" v-model="order.visible" accordion="my-accordion">
                <div class="p-4" >
                    <p class="mb-1"><b>Descrição:</b>{{order.description}}</p>
                    <p class="mb-1"><b>Requisitantante:</b>{{order.requisitante}}</p>
                    <button v-if="order.status == 'incomplete' && used == indexOrder" class="btn btn-block btn-info btn-xs">Solicitando</button>
                    <button @click="setOrder(indexOrder)" v-else-if="order.status == 'incomplete'" class="btn btn-block btn-success btn-xs">Iniciar solicitação</button>
                </div>
            </b-collapse>
        </div>
    </b-card>
</div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from "vuex";

export default {
    props: ["company"],
    data() {
      return {
        used: null
      }
    },
    methods: {
      setOrder(index) {
        this.used = index;
        this.$emit('setOrder', index)
      },
      setUsed() {
        this.company.orders.forEach((element, index) => {
          if(element.used) {
            this.used = index
          }
        });

        if(this.company.orders.length == 1) {
          this.setOrder(0)
        }
      }
    },
    created(){
      this.setUsed();
    }
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
