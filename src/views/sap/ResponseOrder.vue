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
  <b-row v-if="order" class="mb-4">
    <b-colxx v-if="order.status == 'pending'">
      <b-card v-if="$route.params.response == 'approved'" class="text-center">
        <h3>Confirme a sua aprovação!</h3>
        <p>Agradecemos a sua confiança! Por gentileza confirme a sua aprovação abaixo e imediatamente iniciaremos o processo de confecção do seu equipamento!</p>
      </b-card>
      <b-card v-else class="text-center">
        <h3>Confirme a sua reprovação!</h3>
        <p>Por favor confirme a sua reprovação. se você clicou aqui acidentamente, você pode fechar a janela e recomeçar o processo de aprovação! </p>
        <div>
          <button @click="reproved" class="btn btn-danger">Reprovar solicitação!</button>
        </div>

      </b-card>
    </b-colxx>
    <b-colxx v-else>
      <b-card class="text-center">
        <h3>Solicitação já respondida!</h3>
        <p>Esta solicitação foi {{order.status == 'reproved' ? 'reprovada' : 'aprovada'}}</p>
      </b-card>
    </b-colxx>
  </b-row>

  <b-row class="invoice-vue" v-if="order && $route.params.response != 'reproved'">
    <b-colxx xxs="12" lg="6" class="mb-5">
      <b-card v-if="order.order_type != 3">
        <b-alert v-if="order.status == 'pending'" show variant="success">Gostaria de fazer uma aprovação parcial?<br /> Selecione as solicitações que você gostaria de aprovar</b-alert>

        <div v-if="order.status == 'pending'" class="row mb-3 list-head">
          <div class="col d-flex align-items-center">
            <button class="btn btn-outline-dark btn-sm" @click="() => {
              statusCheck = !statusCheck;
              order.orders = order.orders.map(r => {r.checked = statusCheck; return r;}
            )}"> {{statusCheck ? 'Desmarcar' : 'Marcar'}} todos
            </button>
          </div>
        </div>

        <div style="max-height:45vh; overflow-y:scroll">
          <table class="table">
            <tbody>
              <tr v-for="(ord, ordIndex) in order.orders" :key="ordIndex">
                <td>
                  <div v-if="order.status == 'pending'" class="custom-control custom-checkbox pl-1 align-self-center pr-4">
                    <div class="itemCheck mb-0 custom-control custom-checkbox">
                      <input type="checkbox" autocomplete="off" class="custom-control-input" :checked="ord.checked" @change="() => {
                        order.orders = order.orders.map((e,i) => {
                          if(i == ordIndex) {
                            e.checked = !e.checked
                          }
                          return e
                        })
                      }" :id="`check_${ordIndex}`">
                      <label class="custom-control-label" :for="`check_${ordIndex}`"></label>
                    </div>
                  </div>
                </td>
                <td>
                  <span v-for="(item, itIndex) in ord.attributes.info" :key="itIndex">
                    {{itIndex == 'name' ? 'Nome' : itIndex}}: {{item}}<br /></span>
                </td>
                <td>
                  <span v-for="(item, itIndex) in ord.attributes.lens" :key="itIndex">
                    -{{item.name}}<br /></span>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="order.status == 'pending'" class="row mt-3">
          <div class="col">
            Total:
          </div>
          <div class="col text-right">{{ sum_array(order.orders.filter(r => r.checked).map(r => r.attributes.price)) | numeroPreco }}</div>
        </div>
        <div v-if="order.status == 'pending'" class="my-3">
          <h5 class="mb-4">Pedido de compra</h5>
          <b-form-group label="Número do pedido" class="has-float-label mb-4">
              <b-form-input type="text" v-model="pc.number" />
          </b-form-group>
          {{pc.file}}
          <b-input-group class="mb-3">
            <b-form-file v-model="pc.file" placeholder="Anexar"></b-form-file>
          </b-input-group>
        </div>
        <b-button v-if="order.status == 'pending'" variant="success" :disabled="processing" :class="{'btn-block my-3 btn-multiple-state btn-shadow': true,
            'show-spinner': processing,
            'show-success': !processing && uploadError===false,
            'show-fail': !processing && uploadError }" @click="approveSelected">
            <span class="spinner d-inline-block">
                <span class="bounce1"></span>
                <span class="bounce2"></span>
                <span class="bounce3"></span>
            </span>
            <span class="icon success">
                Aprovar {{order.pedido_compra  == 1 ? 'e enviar pedido de compra' : ''}} <span class="badge badge-light">{{order.orders.filter(r => r.checked).length}}</span>
            </span>
            <span class="icon fail">
                <i class="simple-icon-exclamation"></i>
            </span>
            <span class="label">Aprovar proposta {{order.pedido_compra  == 1 ? 'e enviar pedido de compra' : ''}} <span class="badge badge-light">{{order.orders.filter(r => r.checked).length}}</span></span>
        </b-button>

      </b-card>
      <b-card v-if="order.order_type == 3">
        <table class="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(attr, index) in order.attr.products" :key="index">
              <td>{{attr.product}}</td>
              <td>{{attr.qtd}}</td>
            </tr>
            <tr>
              <td colspan="2" class="text-right">
                <b>Total: </b>
                {{
                  order.total | numeroPreco
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </b-card>
    </b-colxx>
  </b-row>

  <b-row class="invoice-vue" v-if="order && $route.params.response == 'reproved'">
    <b-colxx xxs="12" lg="12" class="mb-5">
      <b-card v-if="order.order_type != 3">

        <div style="max-height:45vh; overflow-y:scroll">
          <table class="table">
            <tbody>
              <tr v-for="(ord, ordIndex) in order.orders" :key="ordIndex">
                <td>
                  <span v-for="(item, itIndex) in ord.attributes.info" :key="itIndex">
                    {{itIndex == 'name' ? 'Nome' : itIndex}}: {{item}}<br /></span>
                </td>
                <td>
                  <span v-for="(item, itIndex) in ord.attributes.lens" :key="itIndex">
                    -{{item.name}}<br /></span>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-card>
      <b-card v-if="order.order_type == 3">
        <table class="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(attr, index) in order.attr.products" :key="index">
              <td>{{attr.product}}</td>
              <td>{{attr.qtd}}</td>
            </tr>
            <tr>
              <td colspan="2" class="text-right">
                <b>Total: </b>
                {{
                  order.total | numeroPreco
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </b-card>
    </b-colxx>
  </b-row>

  <b-row v-if="order === null">
      <b-colxx>
          <b-card>
              <div class="d-flex flex-column text-center">
                  <h1>Buscando a sua solicitação</h1>
                  <p>Por gentileza aguarde, estamos buscando informações da sua proposta.</p>
              </div>
          </b-card>
      </b-colxx>
  </b-row>
  <b-row v-if="order === false">
      <b-colxx>
          <b-card>
              <div class="d-flex flex-column text-center">
                  <h1>Pedido não encontrado!</h1>
                  <p>Por favor. certifique-se de ter acesado o link enviado ao seu e-mail.</p>
              </div>
          </b-card>
      </b-colxx>
  </b-row>
  </div>
</template>
<script>
import {api} from '@/constants/config';
export default {
    components: {},
    data(){
      return {
        approvedPart: {},
        statusCheck: false,
        pc: {
          file: null,
          number: null
        },
        rate: 3,
        order: null,
        response: this.$route.params.response,
        processing: false,
        processingPc: false,
        uploadError: false,
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
      async reproved(){
        const response = await api.put(`/reproved/${this.$route.params.hash}`);

        this.$notify(response.data.status == 'error' ? 'danger' : 'success', response.data.status == 'error' ? 'Opsss...!!!' : 'Sucesso', response.data.message, {
            duration: 3000,
            permanent: false
        });

        this.getOrder();
      },
      async getOrder() {
          const response = await api.get(`/proposta/${this.$route.params.hash}/${this.$route.params.response}`);
          if(response.data.status == 'success') {
            this.order = response.data.data;
              if(this.order.order_type != 3){
                if(this.order.attr.pc && this.order.attr.pc.number){
                  this.hasPC = true
                }
              }

          }else{
            this.$notify("error", 'Opsss...!', 'Pedido não encontrado! certifique-se de acessar o link enviado no seu e-mail.', {
                duration: 3000,
                permanent: false
            });
            this.order = false;
          }
      },
      async sendPedidoCompra(typeRequest = false){ //typeRequest é true quandoa função é chamada pelo proprio sistema e não pelo evento (click)
        if(!this.pc.number && !this.pc.file) {

        }else{
          this.processingPc = true;
          let fileName = '';
          console.log('Ois')
          if(this.pc.file) {
            console.log('Oi')
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

          if(!typeRequest) {
            this.$notify("success", 'Sucesso', 'Seu pedido de compra foi inserido com sucesso.', {
                duration: 3000,
                permanent: false
            });
          }

          return order
        }

      },
      changeAll(){
        let checked = this.order.orders.map(r => {
          r.checked = this.statusCheck; return r
        });
      },
      async approveSelected(){
        if(this.order.orders.length == 1) {
          this.order.orders[0].checked = true;
        }

        let checked = this.order.orders.filter(r => r.checked).map(r => r.order_id);
        if(checked.length == 0 && this.order.orders.length > 1) {
          this.$swal.fire({
            title: 'Ops...!',
            text: "Por favor, selecione pelo menos uma solicitação!",
            icon: 'error',
          });
          return false
        }

        if(this.order.pedido_compra == "1" && (!this.pc.number && !this.pc.file) && !this.order.orders[0].attributes.pc) {
          this.$swal.fire({
            title: 'Ops...!',
            text: "Por favor, adicione o pedido de compra!",
            icon: 'error',
          });
          return false;
        }

        if(this.pc.number || this.pc.file){
          await this.sendPedidoCompra();
        }


        this.processing = true;

        const split = await api.post('/order/split', {checked});
        this.$swal.fire({
          title: split.data.status == 'success' ? 'Sucesso' : 'Ops...!',
          text: split.data.message,
          icon: split.data.status,
        }).then(async (result) => {
          if (result.value) {

          }
        });
        this.processing = false;
        this.getOrder();
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
