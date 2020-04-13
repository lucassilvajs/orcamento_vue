<template>
<div class="mt-5">
  <b-row>
    <b-colxx xxs="12">
      <h1 v-if="order">Pedido {{`#${order.order}`}}</h1>
      <h1 v-else>Nenhum pedido</h1>
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
      <b-card v-if="order.pedido_compra" class="mb-4">
        <b-card-header>
          <h3>Enviar Pedido de Compra</h3>
        </b-card-header>
        <b-card-body v-if="!pcSend">
          <b-form-group label="Número do pedido" class="has-float-label mb-4">
              <b-form-input type="text" v-model="pc.number" />
          </b-form-group>
          <b-input-group class="mb-3">
            <b-form-file v-model="pc.file"  placeholder="Anexar"></b-form-file>
          </b-input-group>
          <div class="text-right">
            <b-button variant="success" :disabled="processing" :class="{'float-right mb-3 btn-multiple-state btn-shadow': true,
                'show-spinner': processing,
                'show-success': !processing && uploadError===false,
                'show-fail': !processing && uploadError }" @click="sendPedidoCompra">
                <span class="spinner d-inline-block">
                    <span class="bounce1"></span>
                    <span class="bounce2"></span>
                    <span class="bounce3"></span>
                </span>
                <span class="icon success">
                    Enviar pedido
                </span>
                <span class="icon fail">
                    <i class="simple-icon-exclamation"></i>
                </span>
                <span class="label">Enviar pedido</span>
            </b-button>
          </div>
        </b-card-body>
        <b-card-body v-else>
          <div class="d-flex justify-content-center align-items-center w-100">
              <div class="svg-box">
                  <svg class="circular green-stroke">
                      <circle class="path" cx="75" cy="75" r="50" fill="none" stroke-width="5" stroke-miterlimit="10"/>
                  </svg>
                  <svg class="checkmark green-stroke">
                      <g transform="matrix(0.79961,8.65821e-32,8.39584e-32,0.79961,-489.57,-205.679)">
                          <path class="checkmark__check" fill="none" d="M616.306,283.025L634.087,300.805L673.361,261.53"/>
                      </g>
                  </svg>
              </div>
          </div>
        </b-card-body>
      </b-card>
        <b-card v-if="!feedbackSend">
            <b-card-header>
                <div v-if="response != 'approved'">
                    <h3>Proposta recusada!</h3>
                    <p>Para nós da ID Safety é muito importante o seu feedback, conte para nós a razão de você recusar nossa proposta</p>
                </div>
                <div v-else>
                    <h3>Proposta aprovada!</h3>
                    <p>Para nós da ID Safety é muito importante o seu feedback</p>
                </div>
            </b-card-header>
            <b-card-body>
                <b-form @submit.prevent="formSubmit" class="av-tooltip tooltip-label-bottom">
                    <b-form-group label="Conte para nós o motivo da sua decisão">
                        <b-textarea v-model="feedback"></b-textarea>
                    </b-form-group>
                    <b-form-group label="Que nota você da para nós?">
                        <stars v-model="rate"></stars>
                    </b-form-group>
                    <b-button variant="success" :disabled="processing" :class="{'float-right mb-3 btn-multiple-state btn-shadow': true,
                        'show-spinner': processing,
                        'show-success': !processing && uploadError===false,
                        'show-fail': !processing && uploadError }" @click="sendFeedback">
                        <span class="spinner d-inline-block">
                            <span class="bounce1"></span>
                            <span class="bounce2"></span>
                            <span class="bounce3"></span>
                        </span>
                        <span class="icon success">
                            Enviar feedback
                        </span>
                        <span class="icon fail">
                            <i class="simple-icon-exclamation"></i>
                        </span>
                        <span class="label">Enviar feedback</span>
                    </b-button>
                </b-form>
            </b-card-body>
        </b-card>
        <b-card v-else>
            <div class="d-flex justify-content-center align-items-center w-100">
                <div class="svg-box">
                    <svg class="circular green-stroke">
                        <circle class="path" cx="75" cy="75" r="50" fill="none" stroke-width="5" stroke-miterlimit="10"/>
                    </svg>
                    <svg class="checkmark green-stroke">
                        <g transform="matrix(0.79961,8.65821e-32,8.39584e-32,0.79961,-489.57,-205.679)">
                            <path class="checkmark__check" fill="none" d="M616.306,283.025L634.087,300.805L673.361,261.53"/>
                        </g>
                    </svg>
                </div>
            </div>
            <h3 class="text-success text-center">Feedback enviado com sucesso, muito obrigado!</h3>
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
          pc: {
            file: null,
            number: null
          },
          rate: 3,
          feedback: '',
          order: null,
          response: this.$route.params.response,
          processing: false,
          uploadError: false,
          feedbackSend: false,
          pcSend: false,
        }
    },
    methods: {
        async getOrder() {
            const response = await api.get(`/proposta/${this.$route.params.hash}/${this.$route.params.response}`);
            if(response.data.status == 'success') {
                this.order = response.data.data;
                if(response.data.data.resp) {
                    this.$notify("error", 'Opsss...!', 'Esse pedido já teve a solicitação respondida.', {
                        duration: 3000,
                        permanent: false
                    });
                }
            }
        },
        async sendFeedback() {
            this.processing = true;
            await api.post('feedback', {rate: this.rate, feedback: this.feedback});
            this.processing = false;
            this.feedbackSend = true;
        },
        async sendPedidoCompra(){
          this.processing = true;
          let fd = new FormData();
          fd.append('file', this.pc.file);
          const file = await api.post('saveFile/pc', fd);
          const fileName = file.data.data;

          const order = await api.put(`order/addPc/${this.order.order}`, {fileName, number: this.pc.number});
          this.processing = false;
          this.pcSend = true;
          this.$notify("success", 'Sucesso', 'Seu pedido de compra foi inserido com sucesso.', {
              duration: 3000,
              permanent: false
          });
        }
    },
    created(){
        this.getOrder();
    }
}
</script>

<style scoped>
.svg-box {
    display:inline-block;
    position: relative;
    width:150px;
}

.green-stroke {
    stroke:#7CB342;
}

.red-stroke {
    stroke: #FF6245;
}

.yellow-stroke {
    stroke: #FFC107;
}


.circular circle.path {
    stroke-dasharray: 330;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    opacity: 0.4;
    animation: 0.7s draw-circle ease-out;
}

/*------- Checkmark ---------*/
.checkmark{
	stroke-width: 6.25;
    stroke-linecap: round;
	position:absolute;
    top: 56px;
    left: 49px;
    width: 52px;
    height: 40px;
}

.checkmark path {
    animation: 1s draw-check ease-out;
}
</style>
