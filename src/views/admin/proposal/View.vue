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
            <b-form-group>
            </b-form-group>
              <!-- <b-form-group label="Até:" class="has-float-label mb-4">
              </b-form-group> -->
          </b-colxx>
          <b-colxx lg="12">
              <button class="btn btn-outline-success float-right" @click="() => {filter.page = 1; getOrder()}">Buscar</button>
          </b-colxx>
        </b-row>
      </b-card>
    </b-colxx>
    <b-colxx xxs="12">
      <b-card class="mb-4" title="Propostas">
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
                <td>{{item.empresa}}</td>
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
          <b-button variant="info" @click="hideModal('modalright')">Fechar</b-button>
      </template>
  </b-modal>

</div>
</template>
<script>
import { api, baseURL } from '@/constants/config'
import Stars from '@/components/Common/Stars';
export default {
  components: {
    'stars': Stars
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
      total: 0
    }
  },
  methods: {
    isImage(ima){
      let existe = ['png', 'jpeg', 'jpg', 'gif', 'svg', 'heic'].map(r => { return ima.split(';')[0].indexOf(r) }).filter(r => r >= 0);
      return existe.length
    },
    async getOrder() {
      const items = await api.get('/admin/proposal', {
        params: this.filter
      });

      this.items = items.data.data.orders.map(r => {
        r.checked = false
        return r
      });

      this.total = items.data.data.total;

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
    }
  },
  created(){
    this.getOrder();
  }
}
</script>
