<template>
<div>
  <div v-if="processing" class="d-flex align-items-center justify-content-center h-100">
    <h1>Buscando pedidos</h1>
  </div>
  <div v-else>
    <b-row>
      <b-colxx xxs="12">
        <h1>Distribuidor</h1>
        <div class="top-right-button-container" v-if="false">
          <b-button-group>
              <b-dropdown @click="targetSelectAll()" split right class="check-button" variant="primary">
                  <label class="custom-control custom-checkbox pl-4 mb-0 d-inline-block" slot="button-content">
                      <input class="custom-control-input" type="checkbox" v-model="selectAll">
                      <span :class="{
                        'custom-control-label' :true
                      }">&nbsp;</span>
                  </label>
                  <b-dropdown-item @click="alertActionDelete()">Deletar pedidos</b-dropdown-item>
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
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in items" :key="index" :class="[{'son': item.son, 'parent': !item.son}]">
                  <td>{{item.order_id}}</td>
                  <td>{{item.name}}</td>
                  <td>{{item.cnpj}}</td>
                  <td>{{item.order_value | numeroPreco}}</td>
                  <td>{{statusLabel[item.order_status]}}</td>
                  <td>
                    <b-dropdown id="ddown1" text="Ações" variant="outline-primary">
                        <b-dropdown-item v-b-modal.modalCart @click="modalCart(index)">Ver pedido</b-dropdown-item>
                        <b-dropdown-item @click="changeOrder(item.order_id, 'reenviar')">Reenviar proposta</b-dropdown-item>
                        <b-dropdown-item @click="changeOrder(item.order_id, 'nf')" v-if="$route.params.status == 'order' && !item.order_bling">Gerar Nota Fiscal</b-dropdown-item>
                        <b-dropdown-item @click="changeOrder(item.order_id, 'approve')" v-if="$route.params.status != 'order'">Aprovar</b-dropdown-item>
                        <b-dropdown-item @click="changeOrder(item.order_id, 'delete')">Excluir Pedido</b-dropdown-item>
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

    <b-modal id="modalCart" size="lg" title="Large Modal" hide-footer hide-header v-if="item">
      <table class="table table-striped">
        <thead>
          <tr>
            <th></th>
            <th>Nome</th>
            <th>Quantidade</th>
            <th>Preço </th>
            <th>Preço praticado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(it, index) in item" :key="index">
            <td>
              <div class="w-100px bg-white">
                <single-lightbox :thumb="baseURL+it.img" :large="baseURL+it.img" class-name="w-100" />
              </div>
            </td>
             <td>{{it.name.toUpperCase() + ' ' + it.attributes.map(r => r.value).join(' ').toUpperCase() }}</td>
            <td>

              <div class="control text-center">
                <b>{{it.qty}}</b>
              </div>

            </td>
            <td> {{it.qty * it.price | numeroPreco}} </td>
            <td> {{it.price | numeroPreco}} </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td class="text-right" colspan="5">
              <p>Valor total: <b>{{ getTotalCart() | numeroPreco }} </b> </p>
            </td>
          </tr>
        </tfoot>
      </table>
    </b-modal>


  </div>
</div>
</template>
<script>
import check from '@/assets/img/check.svg'
import checked from '@/assets/img/checked.svg'
import { api, baseURL } from '@/constants/config'
import Stars from '@/components/Common/Stars';
import SingleLightbox from "@/components/Pages/SingleLightbox";
export default {
  components: {
    'stars': Stars,
    "single-lightbox": SingleLightbox,
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
      item: null
    }
  },
  computed: {
    },
  methods: {
    async getOrder() {
      this.processing = true;
      let status = this.$route.params.status
      const items = await api.get('/admin/distribution', {params: {...this.filter, status}});
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
    async changeOrder(idOrder, action){
      let message = '';
      if(action == 'nf') message = 'Você realmente deseja emitir a nota fiscal desse pedido?';
      if(action == 'approve') message = 'Você realmente deseja aprovar esse pedido?';
      if(action == 'delete') message = 'Você realmente deseja deletar esse pedido?';
      if(action == 'reenviar') message = 'Você realmente deseja reenviar a proposta?';

      this.$swal.fire({
        title: "Você está certo disso?",
        text: message,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#3d3',
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true,
        preConfirm: async (login) => {
          const response = await api.put(`/admin/distribution/${action}`, {idOrder});
          return response.data;
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
    modalCart(index){
      this.item = JSON.parse(this.items[index].order_attributes)
    },
    getTotalCart(){
      let total = 0;
      this.item.forEach(element => {
        total += element.qty * element.price
      });
      return total;
    },
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

.w-100px {
  display: flex;
  align-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border: 1px solid #aaa;
  border-radius: 7px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.w-100px:hover, .w-100px.active, .circle-item:hover, .circle-item.active {
  border: solid rgb(0, 172, 149);
  cursor: pointer;
}
/* .son {
  background: #fff;
}

.parent {
  background: #eee;
} */
</style>
