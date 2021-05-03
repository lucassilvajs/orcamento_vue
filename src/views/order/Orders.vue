<template>
  <div v-if="items">
    <b-row>
      <b-colxx>
        <b-card class="mb-4">
          <b-row>
            <b-colxx lg="3">
                <b-form-group label="Pedido / Nota / Colaborador:" class="has-float-label mb-4">
                    <b-form-input type="text" v-model="filter.name" />
                </b-form-group>
            </b-colxx>
            <b-colxx lg="3">
                <b-form-group label="A partir de:" class="has-float-label mb-4">
                  <v-date-picker mode="single" v-model="filter.start" :input-props="{ class:'form-control', placeholder: $t('form-components.date') }"></v-date-picker>
                </b-form-group>
            </b-colxx>
            <b-colxx lg="3">
                <b-form-group label="Até:" class="has-float-label mb-4">
                  <v-date-picker mode="single" v-model="filter.end" :input-props="{ class:'form-control', placeholder: $t('form-components.date') }"></v-date-picker>
                </b-form-group>
            </b-colxx>
            <b-colxx lg="3">
              <!-- <b-form-group>
                <select name="" id="" class="form-control" v-model="filter.status">
                  <option checked value="">Todos</option>
                  <option v-for="sel in [{label: 'Pendente', code: 'pending'},{label: 'Recusado', code: 'reproved'}]" :value="sel.code" :key="sel.code">{{sel.label}}</option>
                </select>
              </b-form-group> -->
                <!-- <b-form-group label="Até:" class="has-float-label mb-4">
                </b-form-group> -->
            </b-colxx>
            <b-colxx lg="12" class="d-flex justify-content-end align-items-center">
                <!-- <button class="show-success btn btn-info mb-3 btn-multiple-state btn-shadow ml-3" @click="getOrderFilter()">
            <span class="label">Buscar</span>
            <span class="spinner d-inline-block">
              <span class="bounce1"></span>
              <span class="bounce2"></span>
              <span class="bounce3"></span>
            </span>
            <span class="icon success">
              Buscar
            </span>
          </button> -->
              <b-button  variant="success" :disabled="processing" :class="{'mb-3 btn-multiple-state btn-shadow ml-3': true,
                'show-spinner': processing,
                'show-success': !processing && uploadError===false,
                'show-fail': !processing && uploadError }" @click="getOrderFilter()">
                <span class="spinner d-inline-block">
                    <span class="bounce1"></span>
                    <span class="bounce2"></span>
                    <span class="bounce3"></span>
                </span>
                <span class="icon success">
                    Buscar
                </span>
                <span class="icon fail">
                    <i class="simple-icon-exclamation"></i>
                </span>
                <span class="label">Buscar</span>
              </b-button>
            </b-colxx>
          </b-row>
          <b-row>
          <p><b>Selecionados</b>: {{
          items.filter(r => r.checked).length
        }} <br /><b>Total</b>: {{
          sum_array(items.filter(r => r.checked).map(sr => sr.parents.map(r => r.total).reduce(function(total, num){
                    return (parseFloat(total) + parseFloat(num))
                  }))) | numeroPreco }}</p>

          </b-row>
        </b-card>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" :title="`Confira ${$route.path.split('/')[2] == 'proposal' ? 'sua propostas' : 'Seus pedidos'}`">
          <!-- <b-table v-if="items && items.length" striped :items="items" /> -->
            <div v-if="items && items.length">
              <table class="table b-table table-striped">
                <thead>
                  <tr>
                    <th>
                      <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
                        <div class="itemCheck mb-0 custom-control custom-checkbox">
                          <input type="checkbox" autocomplete="off" class="custom-control-input" :id="`check_all`">
                          <label class="custom-control-label" :for="`check_all`"  @click="() => {
                              statusCheck = !statusCheck;
                              items = items.map(r => {r.checked = statusCheck; return r;}
                            )}">
                          </label>
                        </div>
                      </div>
                    </th>
                    <th>#</th>
                    <th>Colaborador</th>
                    <th v-if="consultor">Empresa</th>
                    <th v-if="consultor">CNPJ</th>
                    <th v-if="$route.path.split('/')[2] != 'proposal'">Nota</th>
                    <th v-if="!totem">Valor</th>
                    <th v-if="$route.path.split('/')[2] != 'proposal'">Produto</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Informações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(it, index) in items" :key="index">
                    <td>
                      <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
                        <div class="itemCheck mb-0 custom-control custom-checkbox">
                          <input type="checkbox" autocomplete="off" class="custom-control-input"  :checked="it.checked" @change="() => {
                              items = items.map((e,i) => {
                                if(i == index) {
                                  e.checked = !e.checked
                                }
                                return e
                              })
                            }" :id="`check_${index}`">
                          <label class="custom-control-label" :for="`check_${index}`"></label>
                        </div>
                      </div>
                    </td>
                    <td>{{it.id}}</td>
                    <td>{{it.name}}</td>
                    <td v-if="consultor">{{it.company}}</td>
                    <td v-if="consultor">{{it.cnpj}}</td>
                    <td v-if="$route.path.split('/')[2] != 'proposal'">{{it.nota}}</td>
                    <td>{{it.value}}</td>
                    <td v-if="$route.path.split('/')[2] != 'proposal'">{{it.product}}</td>
                    <td>{{it.date}}</td>
                    <td>{{it.multiple == 'pending' ? 'Proposta agendada' : it.status}}</td>
                    <td>

                      <!-- <button v-if="it.status != 'Aprovado' && it.status != 'Aguardando'" @click="swalsendOrder(it.id)" v-b-modal.modalright class="d-none btn btn-outline-success">
                        <div class="simple-icon-doc"/>
                      </button>
                      <button v-if="it.status == 'Aguardando'" @click="swalsendOrderMulti(it.id)" v-b-modal.modalright class="d-none btn btn-outline-success">
                        <div class="simple-icon-docs"/>
                      </button> -->
                      <span @click="getInfoOrder(index)">
                        <button v-if="it.status == 'Reprovado' && !it.feedback && !consultor" v-b-modal.modalright2 class="btn btn-outline-danger">
                          <div class="simple-icon-pencil"/>
                        </button>
                      </span>
                      <a v-if="it.rastreio" target="_blank" :href="`https://www.linkcorreios.com.br/${it.rastreio}`" class="btn btn-success">
                          <div class="simple-icon-envelope"/>
                      </a>
                      <b-dropdown id="ddown1" text="Ações" variant="outline-primary">
                        <b-dropdown-item @click="getInfoOrder(index)" v-b-modal.modalright>Informações do pedido</b-dropdown-item>

                        <!-- <b-dropdown-item v-if="it.status == 'Pendente'">
                          <router-link :to="`/admin/company/edit`">
                            Cadastrar e-mail XML
                          </router-link>
                        </b-dropdown-item> -->
                      </b-dropdown>
                      <!-- <span @click="pc.order = it.id">
                        <button v-if="it.status == 'Aprovado' && !it.attr.pc && it.pedidoCompra != 222 && !consultor" class="btn btn-outline-warning" v-b-modal.modalright1>
                          <div class="simple-icon-doc"/>
                        </button>

                      </span> -->
                    </td>
                  </tr>
                </tbody>
              </table>
              <b-pagination v-if="false && total > 20"
                size="sm"
                align="center"
                :total-rows="total"
                :per-page="20"
                @change="(numbe) => {
                  filter.page = numbe;
                  getOrder();
                }"
              />
            </div>
          <div class="alert alert-info" v-else>Nenhuma informação foi encontrada</div>
        </b-card>
      </b-colxx>
    </b-row>

    <b-modal v-if="order" id="modalright" ref="modalright" :title="`Pedido #${order.id}`" modal-class="modal-right">
      <b>Data: </b>{{order.date}}<br />
      <b>Empresa: </b>{{order.company}}<br />
      <b>Colaborador: </b>{{order.attr.info.name}}<br />
      <span v-if="!totem"><b>Valor: </b>{{order.value}}<br /></span>
      <div v-if="order.attr.pc">
        <b>Pedido de compra: </b>{{order.attr.pc.number}}<br />
        <a v-if="order.attr.pc && order.attr.pc.file" :href="baseURL+order.attr.pc.file" class="btn btn-success btn-sm ">
          Download <i class="simple-icon-cloud-download"/>
        </a>
      </div>
      <div v-if="order.feedback">
        <b>Feedback: </b>{{order.feedback.feedback}}<br />
        <b>Nota: </b><stars :disabled="true" v-model="order.feedback.rate"></stars><br />
      </div>
      <hr>
      <div v-for="item in order.attr.lens" :key="item.code">
        <b>{{item.type}}</b> {{item.name}} <span v-if="item.attributes"> - {{item.attributes}} </span>
      </div>
      <!-- <div v-for="attr in order.attr.product.attributes" :key="attr.label">
        <b>{{attr.label}}: </b>{{attr.select}}
      </div> -->
      <div v-if="order.attr.measure">
        <b>DP:</b> {{order.attr.measure.pupillary_distance}}<br />
        <b>ALT:</b> {{order.attr.measure.pupillary_height}}<br />
      </div>
      <hr>
      <b>Face: </b><br />
      <img class="w-100" :src="baseURL + order.attr.face" v-if="isImage(order.attr.face)" alt="">
      <iframe height="350" v-else class="w-100" :src="baseURL + order.attr.face" frameborder="0"></iframe>
      <b>Receita: </b><br />
      <img class="w-100" :src="baseURL + order.attr.recipe" v-if="isImage(order.attr.recipe)" alt="">
      <iframe height="350" v-else class="w-100" :src="baseURL + order.attr.recipe" frameborder="0"></iframe>
      <template slot="modal-footer">
          <button class="btn btn-outline-warning" @click="hideModal('modalright')">Fechar</button>
          <router-link v-if="consultor" :to="`/app/order/edit/${order.id}`" class="btn btn-info">Editar</router-link>
      </template>
    </b-modal>

    <b-modal id="modalright1" ref="modalright1" title="Adicionar pedido de compra" modal-class="modal-right">
      <b-row>
        <b-colxx>
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
        </b-colxx>
      </b-row>
      <template slot="modal-footer">
          <b-button variant="info" @click="hideModal('modalright1')">Fechar</b-button>
      </template>
    </b-modal>

    <b-modal id="modalright2" ref="modalright2" title="Feedback" modal-class="modal-right">
      <b-row>
        <b-colxx>
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
        </b-colxx>
      </b-row>
      <template slot="modal-footer">
          <b-button variant="info" @click="hideModal('modalright2')">Fechar</b-button>
      </template>
    </b-modal>
  </div>
  <div v-else style="height:90vh; display:flex; justify-content:center; align-items:center">
    <h1>Buscando informações...</h1>
  </div>
</template>
<script>
import Stars from '@/components/Common/Stars';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import {api, baseURL} from '@/constants/config';
export default {
  components: {
    'v-select': vSelect,
    'stars': Stars
  },
  data () {
    return {
      pc:{},
      selectAll: false,
      statusCheck: false,
      feedback:'',
      order: null,
      items: null,
      filter: {},
      total: 300,
      baseURL,
      processingPc: false,
      processing: false,
      uploadError: false,
      rate: 3,
    }
  },
  computed: {
    consultor() {
      const colab = JSON.parse(window.localStorage.getItem('user'));
      return colab.user.colaborador;
    },
    totem() {
      return JSON.parse(window.localStorage.getItem('user')).user.totem;
    }
  },
  methods: {
    link(url){
      this.$router.push(`${url}`);
    },
    isImage(ima){
      let existe = ['png', 'jpeg', 'jpg', 'gif', 'svg', 'heic'].map(r => { return ima.split(';')[0].indexOf(r) }).filter(r => r >= 0);
      return existe.length
    },
    async getOrder() {
      this.items = null;
      const orderType = this.$route.path.split('/')[3];
      const items = await api.get('/order', {
        params: {
          status: orderType ? orderType : ''
        }
      });
      this.items = items.data.data.orders.map(r => {
        r.checked = false;
        return r;
      });
      this.total = items.data.data.total
    },
    getInfoOrder(index) {
      this.order = this.items[index]
      console.log(index)
    },
    async getOrderFilter() {
      this.processing = true;
      const orderType = this.filter.status ? this.filter.status : this.$route.path.split('/')[3];
      let params = this.filter;
      params.status = orderType ? orderType : ''
      const items = await api.get('/order', {
        params
      });
      this.items = items.data.data.orders
      this.processing = false;
    },
    async swalsendOrder(id) {
      await this.$swal.fire({
        title: `Tem certeza?`,
        text: `Você gostaria de reenviar essa proposta para aprovação?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Reenviar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          order.sendAwaiting = true
        }
      });
    },
    async swalsendOrderMulti(){
      await this.$swal.fire({
        title: `Tem certeza?`,
        text: `Essa empresa possui 5 propostas pendentes?`, //Trazer texto do back pra quando for consultor e cliente
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Envie todas',
        cancelButtonText: 'Apenas essa'
      }).then((result) => {
        if (result.value) {
          order.sendAwaiting = true
        }else{

        }
      });
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
        const order = await api.put(`order/addPc/${this.pc.order}`, {fileName, number: this.pc.number});
        this.processingPc = false;
        this.pcSend = true;
        this.$notify("success", 'Sucesso', 'Seu pedido de compra foi inserido com sucesso.', {
            duration: 3000,
            permanent: false
        });
        await this.getOrder();
       this.hideModal('modalright1')
      }
    },
    async sendFeedback() {
      this.processing = true;
      await api.post('feedback', {rate: this.rate, feedback: this.feedback, order: this.order});
      this.processing = false;
      this.feedbackSend = true;
      await this.getOrder();
      this.hideModal('modalright2')
    },
    hideModal (refname) {
      this.$refs[refname].hide()
      console.log('hide modal:: ' + refname)

      if (refname === 'modalnestedinline') {
        this.$refs['modalnested'].show()
      }
    },
    sum_array(arr) {
      let total = 0;
      arr.forEach(e => {
        total += Number(e)
      });

      return total;
    },
    allSelect(){
      this.items = this.items.map(r => {r.checked = this.selectAll; return r});
    }

  },
  created(){
    this.getOrder();
  },
  watch: {
    $route() {
      this.getOrder();
    }
  }
}
</script>
