<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <h1>{{typeOrder}}</h1>
      <div class="top-right-button-container">
        <b-button-group v-if="typeOrder == 'Propostas'">
            <b-dropdown @click="targetSelectAll()" split right class="check-button" variant="primary">
                <label class="custom-control custom-checkbox pl-4 mb-0 d-inline-block" slot="button-content">
                    <input class="custom-control-input" type="checkbox" v-model="selectAll">
                    <span :class="{'custom-control-label' :true}">&nbsp;</span>
                </label>
                <b-dropdown-item @click="alertAction('Deseja mesmo aprovar e emitir o PV das propostas selecionadas?', 'approved','pv')">Aprovar e emitir PV</b-dropdown-item>
                <b-dropdown-item @click="alertAction('Deseja mesmo reprovar as propostas selecionadas?','reproved','pv_nf')">Reprovar</b-dropdown-item>
                <b-dropdown-item @click="alertAction('Deseja mesmo reprovar as propostas selecionadas?','pending','pv_nf')">Tornar proposta</b-dropdown-item>
                <b-dropdown-item @click="alertAction('Deseja mesmo reenviar as propostas selecionadas?','reproved','resend')">Reenviar</b-dropdown-item>
                <b-dropdown-item @click="alertActionDelete()">Deletar pedidos</b-dropdown-item>
            </b-dropdown>
        </b-button-group>
        <b-button-group v-else>
            <b-dropdown @click="targetSelectAll()" split right class="check-button" variant="primary">
                <label class="custom-control custom-checkbox pl-4 mb-0 d-inline-block" slot="button-content">
                    <input class="custom-control-input" type="checkbox" v-model="selectAll">
                    <span :class="{'custom-control-label' :true}">&nbsp;</span>
                </label>
                <b-dropdown-item @click="alertAction('Deseja mesmo emitir as NFs?', '','nf')">Emitir NF</b-dropdown-item>
                <b-dropdown-item @click="alertActionDelete()">Deletar pedidos</b-dropdown-item>
            </b-dropdown>
        </b-button-group>
    </div>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row class="mb-5">
    <b-colxx class="mb-4">
      <b-card>
        <b-row>
          <b-colxx lg="3">
              <b-form-group label="Nome da empresa" class="has-float-label mb-4">
                  <b-form-input type="text" v-model="filter.name" />
              </b-form-group>
          </b-colxx>
          <b-colxx lg="3">
              <b-form-group label="Consultor" class="has-float-label mb-4">
                <v-select v-model="filter.consult" :options="suggestions" dir="ltr"></v-select>
              </b-form-group>
          </b-colxx>
          <b-colxx lg="3">
            <b-form-group label="Lentes:" class="has-float-label mb-4">
                <select v-model="filter.len" id="" class="form-control">
                  <option value="">Todas</option>
                  <option value="1">Solicitada</option>
                  <option value="0">Não solicitadas</option>
                </select>
            </b-form-group>
          </b-colxx>
          <b-colxx lg="3">
            <b-form-group label="Notas fiscais:" class="has-float-label mb-4">
                <select v-model="filter.nf" id="" class="form-control">
                  <option value="">Todas</option>
                  <option value="1">Emitidas</option>
                  <option value="0">Não Emitidas</option>
                </select>
            </b-form-group>
          </b-colxx>
          <b-colxx lg="12">
              <button class="btn btn-outline-success float-right" @click="() => {filter.page = 1; getOrder()}">Buscar</button>
          </b-colxx>
        </b-row>
      </b-card>
    </b-colxx>
    <b-colxx xxs="12">
      <b-card class="mb-4" :title="typeOrder">
        <!-- <p><b>Selecionados</b>: {{
          items.filter(r => r.checked).length
        }} <br /><b>Total</b>: {{
          sum_array(items.filter(r => r.checked).map(sr => sr.parents.map(r => r.total).reduce(function(total, num){
                    return (parseFloat(total) + parseFloat(num))
                  }))) | numeroPreco }}</p> -->
        <div v-if="items && items.length > 0">
          <table class="table table-striped">
            <thead>
              <tr>
                <th></th>
                <th>#</th>
                <th>Empresa</th>
                <th>CNPJ</th>
                <th>Colaborador</th>
                <th>Solicitante</th>
                <th>Solicitação</th>
                <th>Valor</th>
                <th v-if="typeOrder == 'Pedidos'">NF</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index">
                <td v-if="!item.bling">
                  <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
                    <div class="itemCheck mb-0 custom-control custom-checkbox">
                      <input type="checkbox" autocomplete="off" class="custom-control-input" v-model="item.checked" :id="`check_${item.id}`">
                      <label class="custom-control-label" :for="`check_${item.id}`"></label>
                    </div>
                  </div>
                </td>
                <td v-else></td>
                <td>{{item.id}}</td>
                <td>{{item.empresa}} <span v-if="item.type == 4" class="badge badge-success">ARIBA: Aguardando aprovação interna!</span></td>
                <td>{{item.cnpj}}</td>
                <td v-if="item.type = '1' && item.parents.length">{{item.parents.map(r => JSON.parse(r.attr).info.name).join(', ')}}</td>
                <td v-else> {{item.acessorio}} Itens <span class="badge badge-danger">Distribuição</span> </td>
                <td>{{item.solicitante}}</td>
                <td>{{item.date}}</td>
                <td>{{item.value | numeroPreco}}</td>
                <td v-if="typeOrder == 'Pedidos'">{{item.bling}}</td>
                <td>{{item.multiple == 'pending' ? 'Proposta agendada' : item.status}}</td>
                <td>
                  <button @click="orderId = item.id" v-b-modal.viewOrder class="btn btn-outline-success">
                    <div class="simple-icon-doc"/>
                  </button>

                  <button class="btn btn-outline-danger" @click="deleteOrder(item.id)"><div class="simple-icon-trash"/></button>

                  <div v-if="$route.path.indexOf('app') >= 0">


                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <b-pagination v-if="total > 20"
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
        <div v-else class="alert alert-info">Nenhuma informação foi encontrada</div>
      </b-card>
    </b-colxx>
  </b-row>

  <ViewOrder v-if="orderId" :orderId="orderId" />

</div>
</template>
<script>
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import { api, baseURL } from '@/constants/config'
import Stars from '@/components/Common/Stars';
import SingleLightbox from "@/components/Pages/SingleLightbox";
import ViewOrder from "@/components/Order/ViewOrdersAdmin"
export default {
  components: {
    'stars': Stars,
    'v-select': vSelect,
    "single-lightbox": SingleLightbox,
    ViewOrder
  },
  data () {
    return {
      baseURL,
      items: null,
      data: null,
      order: null,
      check: null,
      selectAll: false,
      filter: {},
      total: 0,
      suggestions: [],
      sap: {
        comment: null
      },
      orderId: 1
    }
  },
  computed:{
    typeOrder(){
      return this.$route.path.indexOf('proposal') >= 0 ? 'Propostas' : 'Pedidos';
    }
  },
  methods: {
    isImage(ima){
      if (typeof ima == 'object') ima = ima.value;
      let total = ima.split('.').length;
      let existe = ['png', 'jpeg', 'jpg', 'gif', 'svg', 'heic'].map(r => { return ima.split('.')[total - 1].indexOf(r) }).filter(r => r >= 0);
      return existe.length
    },
    async getOrder() {
      this.items = null;
      let typeOrder = this.$route.path.indexOf('proposal') >= 0 ? 'proposal' : 'order';
      const items = await api.get(`/admin/proposal_order/${typeOrder}`, {
        params: this.filter
      });

      this.suggestions = items.data.data.consult.map(r => {
        return {
          code: r.id,
          label: r.name
        }
      });

      this.items = items.data.data.orders.map(r => {
        r.checked = false
        return r
      });

      this.total = items.data.data.total;
      // document.querySelector('.load-generic').classList.toggle('d-flex');
      this.smoothScrollTo(0,0,500);
    },
    hideModal (refname) {
      this.$refs[refname].hide()
      console.log('hide modal:: ' + refname)

      if (refname === 'modalnestedinline') {
        this.$refs['modalnested'].show()
      }
    },
    somethingModal (refname) {
      this.$refs[refname].hide()
      console.log('something modal:: ' + refname)

      if (refname === 'modalnestedinline') {
        this.$refs['modalnested'].show()
      }
    },

    async deleteOrder(id){
      this.$swal.fire({
        title: "Você está certo disso?",
        text: "Você deseja realmente deletar esse pedido?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: 'Deletar',
        confirmButtonColor: '#d33',
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true,
        preConfirm: async (login) => {
            id = [id];

            if(id.length > 0){
              const response = await api.put('/admin/order/multidelete', {id});
              return response.data;
            }else{
              return {
                status: 'error',
                title: "Você não selecionou nenhum pedido"
              }
            }

        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        this.$swal.fire({
          text: result.value.message,
          icon: result.value.status == 'success' ? 'success' : 'warning'
        });
        this.getOrder();
      })
    },

    async alertActionDelete(){
      this.$swal.fire({
        title: "Você está certo disso?",
        text: "Você deseja realmente deletar os pedidos selecionados",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: 'Deletar',
        confirmButtonColor: '#d33',
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true,
        preConfirm: async (login) => {
            let id = [];
            this.items.filter(r => r.checked).forEach(el => {
              id.push(el.id)
            });

            if(id.length > 0){
              const response = await api.put('/admin/order/multidelete', {id});
              return response.data;
            }else{
              return {
                status: 'error',
                title: "Você não selecionou nenhum pedido"
              }
            }

        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        this.$swal.fire({
          text: result.value.message,
          icon: result.value.status == 'success' ? 'success' : 'warning'
        });
        this.getOrder();
      });
    },
    async alertAction(message, status, action){
      await this.$swal.fire({
        title: `O que você acha?`,
        text: `${message}`,
        icon: 'info',
        showLoaderOnConfirm: true,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não'
      }).then((result) => {
        if (result.value) {

          if(action == 'nf') {
            const cnpj = new Set();
            this.items.filter(r => r.checked).map(r => {
              cnpj.add(r.cnpj);
            });

            if(cnpj.size > 1) {
              this.$swal.fire({
                title: `Ops...!!!`,
                text: `Você não pode vincular notas de empresas diferentes`,
                icon: 'error',
              });
            }else{
              //Retorna IDs Selecionados
              const id = this.items.filter(r => r.checked).map(r => r.id)
              this.generateNf(id)
            }

          }else{
            this.items.map(r => {
              if(r.checked) {
                if(action == 'resend') {
                  this.reenviar(r.id)
                }else if(action != 'nf'){ // Melhorar esse IF se acrescentar outra condição ele vai entrar !!!!!
                  this.changeStatus(status, r.id);
                  this.getOrder();
                }
              }
            })
          }

        }
      });
    },
    changeStatusGroup(status, actions) {
      this.items.map(r => {
        if(r.checked) {
          this.changeStatus(status, r.id, actions);
        }
      })
    },
    async changeStatus(status, order, actions = null) {
      const response = await api.post(`/admin/order/changeStatus`, {
        status,
        order,
        actions
      }).data;

      this.$swal.fire({
        title: `Sucesso`,
        text: `Status alterado com sucesso`,
        icon: 'success',
      });


    },
    async reenviar(order) {
      const response = await api.post(`/order/reSend`, {
        order
      });
      this.$swal.fire({
        title: `Sucesso`,
        text: `Proposta re-enviadas com sucesso`,
        icon: 'success'
      });
    },
    targetSelectAll() {
      this.selectAll = !this.selectAll;
        this.items = this.items.map(r => {
          r.checked = this.selectAll
          return r
        })
    },
    sum_array(arr) {
      let total = 0;
      arr.forEach(e => {
        total += Number(e)
      });

      return total;
    },
    smoothScrollTo(endX, endY, duration) {
      const startX = window.scrollX || window.pageXOffset;
      const startY = window.scrollY || window.pageYOffset;
      const distanceX = endX - startX;
      const distanceY = endY - startY;
      const startTime = new Date().getTime();

      duration = typeof duration !== 'undefined' ? duration : 400;

      // Easing function
      const easeInOutQuart = (time, from, distance, duration) => {
        if ((time /= duration / 2) < 1) return distance / 2 * time * time * time * time + from;
        return -distance / 2 * ((time -= 2) * time * time * time - 2) + from;
      };

      const timer = setInterval(() => {
        const time = new Date().getTime() - startTime;
        const newX = easeInOutQuart(time, startX, distanceX, duration);
        const newY = easeInOutQuart(time, startY, distanceY, duration);
        if (time >= duration) {
          clearInterval(timer);
        }
        window.scroll(newX, newY);
      }, 1000 / 60); // 60 fps
    },

    async responseSap(response){
      console.log(this.order)
      const data = await api.put('admin/ariba/response', {order: this.order.id, response, comment: this.sap.comment, reason: this.sap.reason});

      this.getOrder();
      this.$swal.fire({
        title: data.data.status == 'success' ? 'Sucesso' : 'Opsss!!!',
        text: data.data.message,
        icon: data.data.status,
      });
    },
    async generateNf(idOrder) {
      const response = await api.post(`/admin/order/generateNF`, {
        order: idOrder
      });

      let data = response.data;
      this.$swal.fire({
        title: `${data.status == 'success' ? 'Sucesso' : 'Ops..!'}`,
        text: `${data.message}`,
        icon: `${data.status}`,
      });
      this.getOrders();
    },
  },
  watch: {
    '$route'(){
      this.getOrder();
    }
  },
  created(){
    this.getOrder();
  }
}
</script>
