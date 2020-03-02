<template>
<div class="mt-5">
  <b-row>
    <b-colxx xxs="12">
      <h1>Pedido {{`#${order.order}`}}</h1>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row>
    <b-colxx xxs="12" class="mb-3">
        <h3>Informações do pedido</h3>
    </b-colxx>
  </b-row>
  
  <b-row class="invoice-vue" v-if="order">
    <b-colxx xxs="12" lg="6" class="mb-5">
        <b-card v-if="response != 'approved'">
            <b-card-header>
                <h3>Proposta recusada!</h3>
                <p>Para nós da ID Safety é muito importante o seu feedback, conte para nós a razão de você recusar nossa proposta</p>
            </b-card-header>
            <b-card-body>
                <b-form @submit.prevent="formSubmit" class="av-tooltip tooltip-label-bottom">
                    <b-form-group label="Conte para nós o motivo da sua decisão">
                        <b-textarea></b-textarea>
                    </b-form-group>
                    <b-form-group label="Que nota você da para nós?">
                        <stars v-model="rate"></stars>
                    </b-form-group>
                    <button class="btn btn-outline-success">Enviar feedback</button>
                </b-form>
            </b-card-body>
        </b-card>
        <b-card v-else>
            <b-card-header>
                <h3>Proposta aprovada!</h3>
                <p>Sua proposta foi aprovada e foi enviada para a confecção!</p>
                <p>Você gostaria de nos dar um feedback?</p>
            </b-card-header>
            <b-card-body>
                <b-form @submit.prevent="formSubmit" class="av-tooltip tooltip-label-bottom">
                    <b-form-group label="Conte para nós o motivo da sua decisão">
                        <b-textarea></b-textarea>
                    </b-form-group>
                    <b-form-group label="Que nota você da para nós?">
                        <stars v-model="rate"></stars>
                    </b-form-group>
                    <button class="btn btn-outline-success">Enviar feedback</button>
                </b-form>
            </b-card-body>
        </b-card>
    </b-colxx>

    <b-colxx xxs="12" lg="6" class="mb-5">
        <b-card class="mb-5 invoice-contents" no-body>
           <b-card-body class="d-flex flex-column justify-content-between">
            <div class="d-flex flex-column">
            <div class="d-flex flex-row justify-content-between pt-2 pb-2">
                <div class="d-flex align-self-center">
                    <img src="https://dp.idsafety.com.br/assets/img/logo.png" />
                </div>
            </div>
            <div class="border-bottom pt-4 mb-5"></div>

            <div class="d-flex flex-row justify-content-between mb-5">
                <div class="d-flex flex-column w-70 mr-2 p-4 text-semi-muted bg-semi-muted">
                    <p class="mb-0">{{order.company}}</p>
                </div>
                <div class="d-flex w-30 flex-column text-right p-4 text-semi-muted bg-semi-muted">
                    <p class="mb-0">Pedido #{{order.order}}</p>
                    <p class="mb-0">{{order.date | date}}</p>
                </div>
            </div>

              <table class="table table-borderless">
                <thead>
                    <tr>
                        <th class="text-muted text-extra-small mb-2">ITEM</th>
                        <th class="text-muted text-extra-small mb-2">QUANTIDADE</th>
                        <th class="text-right text-muted text-extra-small mb-2">PREÇO</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(it, index) in order.items" :key="index">
                        <td>{{it.name}}</td>
                        <td>1</td>
                        <td class="text-right">{{it.price | numeroPreco}}</td>
                    </tr>
                </tbody>
              </table>
            </div>

            <div class="d-flex flex-column">
              <div class="border-bottom pt-3 mb-5"></div>
              <table class="table table-borderless d-flex justify-content-end">
                  <tbody>
                      <tr class="font-weight-bold">
                          <td class="text-semi-muted">Total :</td>
                          <td class="text-right">{{order.total | numeroPreco}}</td>
                      </tr>
                  </tbody>
              </table>
          </div>

           </b-card-body>
        </b-card>
    </b-colxx>
  </b-row>

  <b-row v-else>
      <b-colxx>
          <b-card>
              <div class="d-flex flex-column text-center">
                  <h1>Opsss...!!!</h1>
                  <p>Sua solicitação não pode ser realizada, certifique-se de que o link enviado por e-mail é o mesmo que o acessado!</p>
                  <p>Se o erro persistir por favor entre em contato conosco.</p>
              </div>
          </b-card>
      </b-colxx>
  </b-row>
  </div>
</template>
<script>
import {api} from '@/constants/config';
import Stars from '@/components/Common/Stars';
export default {
    components: {
        'stars': Stars
    },
    data(){
        return {
            rate: 3,
            order: null,
            response: this.$route.params.response
        }
    },
    methods: {
        async getOrder() {
            const response = await api.get(`/proposta/${this.$route.params.hash}/${this.$route.params.response}`);
            console.log(response)
            if(response.data.status == 'success') {
                this.order = response.data.data;
            }else{
                this.order = 0
            }
        }
    },
    created(){
        this.getOrder();
    }
}
</script>
