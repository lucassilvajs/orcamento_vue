<template>
<div>
  <div v-if="processing" class="d-flex align-items-center justify-content-center h-100">
    <h1>Buscando pedidos</h1>
  </div>
  <div v-else>
    <b-row>
      <b-colxx xxs="12">
        <h1>Ariba</h1>
        <div class="top-right-button-container">
          <b-button-group>
              <b-dropdown @click="targetSelectAll()" split right class="check-button" variant="primary">
                  <label class="custom-control custom-checkbox pl-4 mb-0 d-inline-block" slot="button-content">
                      <input class="custom-control-input" type="checkbox" v-model="selectAll">
                      <span :class="{
      'custom-control-label' :true
    }">&nbsp;</span>
                  </label>
                  <b-dropdown-item v-b-modal.modalsm >Reprovar pedidos</b-dropdown-item>
                  <b-dropdown-item @click="responseSelectedSap('approved')">Aprovar pedidos</b-dropdown-item>
              </b-dropdown>
          </b-button-group>
        </div>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row class="mb-5">
      <b-colxx xxs="12">
        <b-card class="mb-4" :title="this.$route.params.status == 'order' ? 'Pedidos' :`Propostas`">
          <div v-if="items && items.length > 0">
            <table class="table table-striped" v-if="items && items.length > 0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Empresa</th>
                  <th>CNPJ</th>
                  <th>Colaborador</th>
                  <th>Nº Pedido</th>
                  <th>Preço</th>
                  <th>NCM</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in items" :key="index" :class="[{'son': item.son, 'parent': !item.son}]">
                  <td>
                    <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
                      <div class="itemCheck mb-0 custom-control custom-checkbox">
                        <input type="checkbox" autocomplete="off" class="custom-control-input" v-model="item.checked" :id="`check_${item.id}`">
                        <label class="custom-control-label" :for="`check_${item.id}`"></label>
                      </div>
                    </div>
                  </td>
                  <td>{{item.empresa}} <button v-if="item.object.sap.orderType == 'update'" class="btn btn-info btn-xs">ChangeOrder</button> </td>
                  <td>{{item.cnpj}}</td>
                  <td>{{item.name}}</td>
                  <td>{{item.object.sap.orderId}}</td>
                  <td><b>ERP: </b>{{item.value}} <br /> <b>Cotado:</b> {{item.object.sap.price | numeroPreco}}</td>
                  <td>
                    {{item.object.sap.ncm}}
                  </td>
                  <td>
                    {{item.status}}
                  </td>
                  <td>
                    <b-dropdown id="ddown1" text="Ações" variant="outline-primary">
                        <b-dropdown-item @click="reenviarEmail(index)">Reenviar e-mail</b-dropdown-item>
                        <b-dropdown-item v-if="!item.pending" @click="getInfoOrder(index)" v-b-modal.modalright>Ver pedido</b-dropdown-item>
                        <b-dropdown-item><router-link :to="`/admin/proposal/edit/${item.id}`">Editar</router-link></b-dropdown-item>
                    </b-dropdown>
                  </td>
                </tr>
                <tr v-if="items.length == 0">
                  <td colspan="7">Nenhum pedido foi encontrado</td>
                </tr>
              </tbody>
            </table>
            <b-pagination v-if="total > 100"
              size="sm"
              align="center"
              :total-rows="total"
              :per-page="100"
              @change="(numbe) => {
                filter.page = numbe;
                getOrder();
              }"
            />
          </div>
          <div v-else class="alert">Nenhuma informação foi encontrada</div>
        </b-card>
      </b-colxx>
    </b-row>

          <b-modal id="modalChange" ref="modalChange" title="Mudanças" modal-class="modal-right">
                <p>
                  <b>Esperado em:</b>
                  <s class="mx-2">20/02/2021</s>
                  20/03/2021
                </p>
                <template slot="modal-footer">
                    <b-button variant="secondary" @click="hideModal('modalChange')">Fechar</b-button>
                </template>
            </b-modal>

      <b-modal v-if="order" id="modalright" ref="modalright" :title="`Pedido #${order.id}`" modal-class="modal-right">
      <b>{{order.product.name}} {{order.product.color}} {{order.product.size}}</b>
      <b>Número do pedido: </b>{{order.object.sap.orderId}}<br />
      <b>Data da solicitação: </b>{{order.date}}<br />
      <b>Empresa: </b>{{order.empresa.split('-')[0]}}<br />
      <b>Colaborador: </b>{{order.object.info.name}}<br />
      <b>Valor: </b>{{order.value}}<br />
      <b>Descrição: </b>{{order.object.sap.description}}<br />
      <b>Linha: </b>{{order.object.sap.linha}}<br />
      <b>Entrega esperada: </b>{{order.object.sap.requestedDeliveryDate | date}}<br />
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

  <b-modal id="modalsm" size="sm" title="Motivo da reprova" hide-footer>
      <b-form-group label="Razão da rejeição" class="has-float-label mt-4 mb-2">
          <select class="form-control" v-model="sap.reason">
            <option value="incorrectDeliveryDate">Data de entrega inválida</option>
            <option value="incorrectDescription">Descrição incorreta</option>
            <option value="incorrectPrice">Preço incorreto</option>
            <option value="incorrectQuantity">Quantidade incorreta</option>
            <option value="incorrectStockPartNumber">Estoque / número da peça incorreto</option>
            <option value="incorrectUOM">UOM inválido</option>
            <option value="unabletoSupplyItem">Item indisponível</option>
            <option value="other">Outro</option>
          </select>
      </b-form-group>
      <b-form-group label="Comente sua decisão">
          <b-form-input v-model="sap.comment" type="text" placeholder="Comente sua decisão" />
      </b-form-group>
      <b-button @click="responseSelectedSap('reproved')" variant="danger" class="btn-xs">Confirmar reprovação</b-button>
  </b-modal>

  </div>
</div>
</template>
<script>
import check from '@/assets/img/check.svg'
import checked from '@/assets/img/checked.svg'
import { api, baseURL } from '@/constants/config'
import Stars from '@/components/Common/Stars';
export default {
  components: {
    'stars': Stars
  },
  data () {
    return {
      check,
      checked,
      baseURL,
      filter: {},
      items: null,
      data: null,
      order: null,
      selectAll: false,
      filter: {},
      total: 0,
      index: null,
      processing: null,
      statusLabel: {
        pending: 'Pendente',
        awaiting: 'Aguardando envio',
        approved: 'Aprovado'
      },
      sap: {
        comment: null,
      }
    }
  },
  computed: {
    },
  methods: {
    isImage(ima){
      let existe = ['png', 'jpeg', 'jpg', 'gif', 'svg', 'heic'].map(r => { return ima.split(';')[0].indexOf(r) }).filter(r => r >= 0);
      return existe.length
    },
    async getOrder() {
      this.processing = true;
      let status = this.$route.params.status
      const items = await api.get('/admin/ariba', {params: {...this.filter, status}});
      this.items = items.data.data.orders.map(r => {
        r.checked = false;
        return r
      });

      this.processing = false;
      this.total = items.data.data.total
    },
    getInfoOrder(index) {
      this.index = index;
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
    targetSelectAll() {
      this.selectAll = !this.selectAll;
        this.items = this.items.map(r => {
          r.checked = this.selectAll
          return r
        })
    },
    async responseSelectedSap(response) {
      document.querySelector('.load-generic h1').innerHTML = 'Editando status';
      document.querySelector('.load-generic').classList.toggle('d-flex');

      let orders = this.items.filter(r => r.checked).map(r => r.id);

      const data = await api.put('admin/ariba/response', {order: orders, response, comment: this.sap.comment, reason: this.sap.reason});

      document.querySelector('.load-generic').classList.toggle('d-flex');
      this.$swal.fire({
        title: 'Sucesso',
        text: 'Pedidos respondidos com sucesso',
        icon: 'success',
      });
    },
    async reenviarEmail(index){
      this.$swal.fire({
        title: "Você está certo disso?",
        text: "Deseja reenviar o e-mail da proposta?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: 'Reenviar',
        confirmButtonColor: '#06f',
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true,
        preConfirm: async (login) => {
            let orderId = this.items[index].id;
            return await api.post('admin/helpers/sendMailAriba', {orderId});
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        console.log(result.value.data)
        this.$swal.fire({
          text: result.value.data.message,
          icon: result.value.data.status == 'success' ? 'success' : 'warning'
        });
      });

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
<style>
.img-input {
    width: 20px
}

/* .son {
  background: #fff;
}

.parent {
  background: #eee;
} */
</style>
