<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <h1>Propostas</h1>
      <div class="top-right-button-container">
        <b-button-group>
            <b-dropdown @click="targetSelectAll()" split right class="check-button" variant="primary">
                <label class="custom-control custom-checkbox pl-4 mb-0 d-inline-block" slot="button-content">
                    <input class="custom-control-input" type="checkbox" v-model="selectAll">
                    <span :class="{
    'custom-control-label' :true
  }">&nbsp;</span>
                </label>
                <b-dropdown-item @click="alertAction('Deseja mesmo aprovar e emitir o PV das propostas selecionadas?', 'approved','pv')">Aprovar e emitir PV</b-dropdown-item>
                <b-dropdown-item @click="alertAction('Deseja mesmo reprovar as propostas selecionadas?','reproved','pv_nf')">Reprovar</b-dropdown-item>
                <b-dropdown-item @click="alertAction('Deseja mesmo reenviar as propostas selecionadas?','reproved','resend')">Reenviar</b-dropdown-item>
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
              <b-form-group label="Propostas partir de:" class="has-float-label mb-4">
                <v-date-picker mode="single" v-model="filter.start" :input-props="{ class:'form-control', placeholder: $t('form-components.date') }"></v-date-picker>
              </b-form-group>
          </b-colxx>
          <b-colxx lg="3">
              <b-form-group label="Propostas até:" class="has-float-label mb-4">
                <v-date-picker mode="single" v-model="filter.end" :input-props="{ class:'form-control', placeholder: $t('form-components.date') }"></v-date-picker>
              </b-form-group>
          </b-colxx>
          <b-colxx lg="3">
              <b-form-group label="Consultor" class="has-float-label mb-4">
                <v-select v-model="filter.consult" :options="suggestions" dir="ltr"></v-select>
              </b-form-group>
          </b-colxx>
          <b-colxx lg="12">
              <button class="btn btn-outline-success float-right" @click="() => {filter.page = 1; getOrder()}">Buscar</button>
          </b-colxx>
        </b-row>
      </b-card>
    </b-colxx>
    <b-colxx xxs="12">
      <b-card class="mb-4" title="Propostas">
        <p><b>Selecionados</b>: {{
          items.filter(r => r.checked).length
        }} <br /><b>Total</b>: {{
          sum_array(items.filter(r => r.checked).map(sr => sr.parents.map(r => r.total).reduce(function(total, num){
                    return (parseFloat(total) + parseFloat(num))
                  }))) | numeroPreco }}</p>
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
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index">
                <td>
                  <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
                    <div class="itemCheck mb-0 custom-control custom-checkbox">
                      <input type="checkbox" autocomplete="off" class="custom-control-input" v-model="item.checked" :id="`check_${item.id}`">
                      <label class="custom-control-label" :for="`check_${item.id}`"></label>
                    </div>
                  </div>
                </td>
                <td>{{item.id}}</td>
                <td>{{item.empresa}} <span v-if="item.type == 4" class="badge badge-success">ARIBA: Aguardando aprovação interna!</span></td>
                <td>{{item.cnpj}}</td>
                <td>{{
                  item.parents.map(r => JSON.parse(r.attr).info.name).join(', ')

                  }}</td>
                <td>{{item.solicitante}}</td>
                <td>{{item.date}}</td>
                <td>{{item.parents.map(r => r.total).reduce(function(total, num){
                    return (parseFloat(total) + parseFloat(num))
                  }) | numeroPreco}}</td>
                <td>{{item.multiple == 'pending' ? 'Proposta agendada' : item.status}}</td>
                <td>
                  <button @click="getInfoOrder(index)" v-b-modal.modalright class="btn btn-outline-success">
                    <div class="simple-icon-doc"/>
                  </button>
                  <button class="btn btn-outline-danger" @click="deleteOrder(item.id)"><div class="simple-icon-trash"/></button>
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

  <b-modal v-if="order" id="modalright" ref="modalright" :title="`Pedido #${order.id}`" modal-class="modal-right">
      <b>{{order.product.name}} {{order.product.color}} {{order.product.size}}</b>
      <b>Data: </b>{{order.date}}<br />
      <b>Empresa: </b>{{order.empresa.split('-')[0]}}<br />
      <b>Colaborador: </b>{{order.object.info.name}}<br />
      <b>Valor: </b>{{order.value}}<br />
      <b>Feedback: </b>{{order.feedback.feedback}}<br />
      <b>Nota: </b><stars :disabled="true" v-model="order.feedback.rate"></stars><br />
      <hr>
      <div v-if="order.type == 4">
        <h5>Pedido está ok?</h5>
        <p>Você pode confirmar o pedido ou reprovar ele!</p>
        <div class="alert alert-info">Preencher somente em caso de rejeição</div>
        <b-form-group label="Razão da rejeição" class="has-float-label mb-2">
            <select class="form-control" v-model="sap.reason">
              <option value="incorrectDeliveryDate">Data de entrega inválida</option>
              <option value="incorrectDescription">Descrição incorreta</option>
              <option value="incorrectPrice">Preço incorreto</option>
              <option value="incorrectQuantity">Qauntidade incorreta</option>
              <option value="incorrectStockPartNumber">Estoque / número da peça incorreto</option>
              <option value="incorrectUOM">UOM inválido</option>
              <option value="unabletoSupplyItem">Item indisponível</option>
              <option value="other">Outro</option>
            </select>
        </b-form-group>
        <b-form-group label="Comente sua decisão">
            <b-form-input v-model="sap.comment" type="text" placeholder="Comente sua decisão" />
        </b-form-group>
        <div class="d-flex mb-4">
          <button class="btn btn-xs btn-success mr-3" @click="responseSap('approved')">Aprovar</button>
          <button class="btn btn-xs btn-danger" @click="responseSap('reproved')">Reprovar</button>
        </div>
      </div>
      <!-- <div v-for="item in order.object.lens" :key="item.code">
        <b>{{item.type}}</b> {{item.name}}
      </div> -->
      <div v-for="(or, ind) in order.parents.map(r => {
          return {
            order_id: r.order_id,
            total: r.total,
            attr: JSON.parse(r.attr)
          }
        })" :key="ind">
        <div v-for="item in or.attr.lens" :key="item.code">
          <b>{{item.type}}</b> {{item.name}}
        </div>
        <b>Face: </b><br />
        <img class="w-100" :src="baseURL + or.attr.face" v-if="isImage(or.attr.face)" alt="">
        <iframe height="350" v-else class="w-100" :src="baseURL + or.attr.face" frameborder="0"></iframe>
        <b>Receita: </b><br />
        <img class="w-100" :src="baseURL + or.attr.recipe" v-if="isImage(or.attr.recipe)" alt="">
        <iframe height="350" v-else class="w-100" :src="baseURL + or.attr.recipe" frameborder="0"></iframe>
        <hr class="my-3">
      </div>
      <template slot="modal-footer">
          <b-button v-if="false && order.status == 'Pendente'" variant="success" @click="changeStatus('approved', order.id)">Aprovar</b-button>
          <b-button v-if="false && order.status == 'Pendente'" variant="danger" @click="changeStatus('reproved', order.id)">Reprovar</b-button><br>
          <b-button v-if="false && order.status == 'Pendente'" variant="primary" @click="reenviar(order.id)">Reenviar</b-button>
          <button class="btn btn-outline-danger" @click="hideModal('modalright')">Fechar</button>
          <router-link class="btn btn-info" :to="`/admin/proposal/edit/${order.id}`">Editar</router-link>

      </template>
  </b-modal>

</div>
</template>
<script>
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import { api, baseURL } from '@/constants/config'
import Stars from '@/components/Common/Stars';
export default {
  components: {
    'stars': Stars,
    'v-select': vSelect,
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
      }
    }
  },
  methods: {
    isImage(ima){
      let existe = ['png', 'jpeg', 'jpg', 'gif', 'svg', 'heic'].map(r => { return ima.split(';')[0].indexOf(r) }).filter(r => r >= 0);
      return existe.length
    },
    async getOrder() {
      // document.querySelector('.load-generic').classList.toggle('d-flex');
      this.items = null;
      const items = await api.get('/admin/proposal', {
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
    getInfoOrder(index) {
      this.order = this.items[index]
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
      })

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

          this.items.map(r => {
            if(r.checked) {
              if(action == 'resend') {
                this.reenviar(r.id)
              }else{
                this.changeStatus(status, r.id);
              }
            }
          })
          this.getOrder();

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
    }


},
   created(){
    this.getOrder();
  }
}
</script>
