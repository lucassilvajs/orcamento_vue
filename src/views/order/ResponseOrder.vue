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
      <b-card v-if="order.pedido_compra == '1' && response == 'approved'" class="mb-4">
        <b-card-header>
          <h3>Enviar Pedido de Compra</h3>
        </b-card-header>
        <b-card-body v-if="!pcSend && !hasPC ">
          <b-form-group label="Número do pedido" class="has-float-label mb-4">
              <b-form-input type="text" v-model="pc.number" />
          </b-form-group>
          <b-input-group class="mb-3">
            <b-form-file v-model="pc.file"  placeholder="Anexar"></b-form-file>
          </b-input-group>
          <div class="text-right">
            <b-button variant="success" :disabled="processingPc" :class="{'float-right mb-3 btn-multiple-state btn-shadow': true,
                'show-spinner': processingPc,
                'show-success': !processingPc && uploadError===false,
                'show-fail': !processingPc && uploadError }" @click="sendPedidoCompra">
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

      <b-card v-if="order.orders.length">
        <b-alert show variant="success">Gostaria de fazer uma aprovação parcial?<br /> Selecione as solicitações que você gostaria de aprovar</b-alert>

        <div class="row mb-3 list-head">
          <div class="col d-flex align-items-center">
            <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
              <div class="itemCheck mb-0 custom-control custom-checkbox">
                <input type="checkbox" autocomplete="off" class="custom-control-input" v-model="statusCheck" :id="`check_all`" @change="selectAll">
                <label class="custom-control-label" :for="`check_all`">Selecionar todos</label>
              </div>
            </div>
          </div>
        </div>
        <div class="row justify-content-between mb-1 list-body" v-for="(myorder, index) in order.orders" :key="index">
          <div style="max-width:10%;">
            <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
              <div class="itemCheck mb-0 custom-control custom-checkbox">
                <input type="checkbox" autocomplete="off" class="custom-control-input" v-model="myorder.checked"  :id="`mycheck_${index}`">
                <label class="custom-control-label" :for="`mycheck_${index}`"></label>
              </div>
            </div>
          </div>
          <div style="max-width:35%;">
            <span>{{myorder.attributes.info.name}} <br /> </span>
            <span v-for="(item, itemIndex) in myorder.items" :key="itemIndex">{{item.name}} - <span class="small-price">{{item.price | numeroPreco}}</span><br /></span>
          </div>
          <div style="max-width:35%;">
            <div v-for="(inf, id) in myorder.attributes.info" :key="id">
              <span v-if="inf && id != 'name'"> {{id}}:{{inf | capitalize}} <br /></span>
            </div>
          </div>
          <div style="max-width:20%;">
            <div class="small-price text-right pr-1">
              {{myorder.attributes.price | numeroPreco}}
            </div>
          </div>
        </div>

        <div class="row mt-3">
          <div class="col">
            Total:
          </div>
          <div class="col text-right">{{ sum_array(order.orders.filter(r => r.checked).map(r => r.attributes.price)) | numeroPreco }}</div>
        </div>

          <button class="btn btn-block btn-success mt-3" @click="approveSelected">Aprovar selecionados <span class="badge badge-light">{{order.orders.filter(r => r.checked).length}}</span></button>

      </b-card>
    </b-colxx>

    <b-colxx xxs="12" lg="6" class="mb-5">
      <b-card class="mb-5 invoice-contents" no-body>
        <b-card-body class="d-flex flex-column justify-content-between">
          <div class="d-flex flex-column">
            <div class="d-flex flex-row justify-content-between mb-5">
              <div class="d-flex flex-column w-70 mr-2 p-4 text-semi-muted bg-semi-muted">
                <p class="mb-0">{{order.company}}</p>
              </div>
              <div class="d-flex w-30 flex-column text-right p-4 text-semi-muted bg-semi-muted">
                <p class="mb-0">Pedido #{{order.order}}</p>
                <p class="mb-0">{{order.date | date}}</p>
              </div>
            </div>
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
          approvedPart: {},
          statusCheck: false,
          pc: {
            file: null,
            number: null
          },
          rate: 3,
          feedback: '',
          order: null,
          response: this.$route.params.response,
          processing: false,
          processingPc: false,
          uploadError: false,
          feedbackSend: false,
          pcSend: false,
          hasPC: false,
        }
    },
    methods: {
      sum_array(arr) {
        let total = 0;
        arr.forEach(e => {
          total += Number(e)
        });

        return total;
      },
      async getOrder() {
            const response = await api.get(`/proposta/${this.$route.params.hash}/${this.$route.params.response}`);
            if(response.data.status == 'success') {
                this.order = response.data.data;
                if(JSON.parse(this.order.attr).pc && JSON.parse(this.order.attr).pc.number){
                  this.hasPC = true
                }

                this.order.orders = this.order.orders.map(r => {
                  r.checked = true;
                  return r;
                });

                console.log('-=-=-=-=-=-=-')
                console.log(this.order.orders)
                console.log('-=-=-=-=-=-=-')

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
            await api.post('feedback', {rate: this.rate, feedback: this.feedback, order: this.order});
            this.processing = false;
            this.feedbackSend = true;
        },
        async sendPedidoCompra(){
          if(!this.pc.number) {
            this.$notify("error", 'Ops...!', 'Por favor insira o número pedido de compra.', {
              duration: 3000,
              permanent: false
            });
          }else{
            this.processingPc = true;
            let fileName = '';
            if(this.pc.file) {
              let fd = new FormData();
              fd.append('file', this.pc.file);
              const file = await api.post('saveFile/pc', fd);
              fileName = file.data.data;
            }else{
              fileName = '';
            }
            const order = await api.put(`order/addPc/${this.order.order}`, {fileName, number: this.pc.number});
            this.processingPc = false;
            this.pcSend = true;
            this.$notify("success", 'Sucesso', 'Seu pedido de compra foi inserido com sucesso.', {
                duration: 3000,
                permanent: false
            });
          }
        },
        selectAll(){
          this.order.orders = this.order.orders.map(r => {
            r.checked = this.statusCheck;
            return r
          });
        },
        approveSelected(){
          let checked = this.order.orders.filter(r => r.checked);
          console.log(checked)
        },
        changed(ind){
          this.order.orders = this.order.orders.map((r,i) => {
            if(ind == i) {
              r.checked = !r.checked;
            }
            return r
          });
        },
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

.item-cart {
  border-radius: 5px;
  border: 1px solid rgba(100,100,100,.3);
}

.item-cart h4 {
  font-size: 1rem;
  font-weight: bold;
}

.item-cart h5 {
  font-size: .9rem;
}

.list-head {
  font-weight: bold;
}

.list-body {
  padding: 5px 0;
  font-size: .75rem;
}

.list-body:nth-child(odd){
  background: #f5f5f5;
}
.list-body{
  background: #dfdfdf;
}

</style>
