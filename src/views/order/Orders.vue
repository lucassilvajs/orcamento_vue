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
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th v-if="consultor">Empresa</th>
                  <th v-if="consultor">CNPJ</th>
                  <th>Colaborador</th>
                  <th>Solicitante</th>
                  <th>Solicitação</th>
                  <th>Valor</th>
                  <th>NF</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in items" :key="index">
                  <td>{{item.id}}</td>
                  <td v-if="consultor">{{item.empresa}} <span v-if="item.type == 4" class="badge badge-success">ARIBA: Aguardando aprovação interna!</span></td>
                  <td v-if="consultor">{{item.cnpj}}</td>
                  <td v-if="item.type = '1'">{{item.name}}</td>
                  <td v-else> {{item.acessorio}} Itens <span class="badge badge-danger">Distribuição</span> </td>
                  <td>{{item.solicitante}}</td>
                  <td>{{item.date}}</td>
                  <td>{{item.value | numeroPreco}}</td>
                  <td>{{item.bling}}</td>
                  <td>{{item.multiple == 'pending' ? 'Proposta agendada' : item.status}}</td>
                  <td>

                    <button @click="orderId = item.id" v-b-modal.viewOrder class="btn btn-outline-success">
                      <div class="simple-icon-doc"/>
                    </button>
                    <a v-if="item.rastreio" target="_blank" :href="`https://www.linkcorreios.com.br/${item.rastreio}`" class="btn btn-success">
                        <div class="simple-icon-envelope"/>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
              <b-pagination v-if="total > perPage"
                size="sm"
                align="center"
                :total-rows="total"
                :per-page="perPage"
                @change="(numbe) => {
                  filter.page = numbe;
                  getOrderFilter();
                }"
              />
            </div>
          <div class="alert alert-info" v-else>Nenhuma informação foi encontrada</div>
        </b-card>
      </b-colxx>
    </b-row>


    <ViewOrder :orderId="orderId" />

  </div>
  <div v-else style="height:90vh; display:flex; justify-content:center; align-items:center">
    <h1>Buscando informações...</h1>
  </div>
</template>
<script>
import {
    mapGetters,
    mapMutations,
    mapActions
} from 'vuex'

import Stars from '@/components/Common/Stars';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import {api, baseURL} from '@/constants/config';
import ViewOrder from "@/components/Order/ViewOrders"
export default {
  components: {
    'v-select': vSelect,
    'stars': Stars,
    ViewOrder
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
      total: null,
      perPage: null,
      baseURL,
      processingPc: false,
      processing: false,
      uploadError: false,
      rate: 3,
      orderId: null
    }
  },
  computed: {
    consultor() {
      const colab = JSON.parse(window.localStorage.getItem('user'));
      return colab.user.colaborador;
    },
    totem() {
      return JSON.parse(window.localStorage.getItem('user')).user.totem;
    },

    typeOrder(){
      return "Pedidos"
    }
  },
  methods: {
    ...mapActions(['loading']),
    link(url){
      this.$router.push(`${url}`);
    },
    isImage(ima){
      let existe = ['png', 'jpeg', 'jpg', 'gif', 'svg', 'heic'].map(r => { return ima.split(';')[0].indexOf(r) }).filter(r => r >= 0);
      return existe.length
    },
    async getOrder() {
      this.getOrderFilter();
      // this.items = null;
      // const orderType = this.$route.path.split('/')[3];
      // const items = await api.get('/order', {
      //   params: {
      //     status: orderType ? orderType : '',
      //   }
      // });
      // this.items = items.data.data.orders.map(r => {
      //   r.checked = false;
      //   return r;
      // });
      // this.total = items.data.data.total
    },
    getInfoOrder(index) {
      this.order = this.items[index]
      console.log(index)
    },
    async getOrderFilter() {
      this.loading(true);
      this.processing = true;
      const orderType = this.filter.status ? this.filter.status : this.$route.path.split('/')[3];
      let params = this.filter;
      params.status = orderType ? orderType : ''
      const items = await api.get('/order', {
        params
      });

      this.loading(false);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })

      this.items = items.data.data.orders;
      this.perPage = items.data.data.perPage;
      this.total = items.data.data.total;
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
