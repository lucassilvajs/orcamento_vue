<template>
<div>
    <b-row>
        <b-colxx xxs="12">
          <div class="d-flex justify-content-between">
            <h1>Edição de pedido</h1>
            <div class="controllers">
              <button v-if="orders && orders.lenght >= 2" class="btn btn-outline-dark" @click="splitOrder">Dividir pedidos</button>
              <b-button-group class="mb-2">
                <b-dropdown variant="success" right text="Alterar status">
                    <b-dropdown-item :disabled="orders[0].order_status == 'pending'" @click="changeStatus('pending')">Pendente</b-dropdown-item>
                    <b-dropdown-item :disabled="orders[0].order_status == 'awaiting'" @click="changeStatus('awaiting')">Carrinho</b-dropdown-item>
                    <!-- <b-dropdown-item :disabled="orders[0].order_status == 'approved'" @click="changeStatus('approved')">Aprovado</b-dropdown-item> -->
                    <b-dropdown-item :disabled="orders[0].order_status == 'reproved'" @click="changeStatus('reproved')">Reprovado</b-dropdown-item>
                    <b-dropdown-item :disabled="orders[0].order_status == 'deleted'" @click="changeStatus('deleted')">Deletado</b-dropdown-item>
                </b-dropdown>
              </b-button-group>
            </div>

          </div>
            <div class="separator mb-5"></div>
        </b-colxx>
    </b-row>
    <b-row v-for="(order, index) in orders" :key="index">
        <b-colxx xxs="12">
            <b-card class="mb-4" :title="`Pedido #${order.order_id}`">
              <b-row>
                <b-colxx md="4" lg="3" v-for="(item, itemIndex) in order.order_attributes.info" :key="itemIndex">
                  <b-form-group :label="itemIndex == 'name' ? 'Nome' : itemIndex" class="has-float-label mb-4">
                      <b-form-input type="text" placeholder="Nome" v-model="orders[index].order_attributes.info[itemIndex]" />
                  </b-form-group>
                </b-colxx>
              </b-row>
              <hr>
              <b-row v-for="(item, itemIndex) in order.order_attributes.lens" :key="itemIndex">
                <b-colxx md="4" lg="3" v-for="(itemLen, lenIndex) in item" :key="lenIndex" >
                  <b-form-group :label="{code: 'Código', name: 'Nome', price: 'Preço', type: 'Tipo'}[lenIndex]" class="has-float-label mb-4">
                      <b-form-input v-if="lenIndex != 'price'" type="text" :disabled="lenIndex != 'price'" placeholder="Nome" v-model="orders[index].order_attributes.lens[itemIndex][lenIndex]" />
                      <Money v-else class="form-control" v-model="orders[index].order_attributes.lens[itemIndex][lenIndex]" v-bind="{ decimal: ',',thousands: '.',prefix: 'R$ ',suffix: '',precision: 2,masked: true,}"/>
                  </b-form-group>
                </b-colxx>
              </b-row>
              <b-row>
                <b-colxx md="4">
                  <b>Total:</b> {{sum_array(order.order_attributes.lens.map(r => r.price)) | numeroPreco}}<br />
                  <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
                    <div class="itemCheck mb-0 custom-control custom-checkbox">
                      <input type="checkbox" autocomplete="off" class="custom-control-input" v-model="order.checked" :id="`check_${index}`">
                      <label class="custom-control-label" :for="`check_${index}`">Selecionar pedido</label>
                    </div>
                  </div>
                </b-colxx>
                <b-colxx md="8" class="d-flex justify-content-end">
                  <button v-b-modal.modalright class="btn btn-outline-info mr-4" @click="orderModal = order">Ver informações</button>
                  <button class="btn btn-success float-right" @click="saveOrder(index)">Salvar informações</button>
                </b-colxx>
              </b-row>

            </b-card>
        </b-colxx>
    </b-row>

  <b-modal v-if="orderModal" id="modalright" ref="modalright" :title="`Pedido #${orderModal.order_id}`" modal-class="modal-right">
      <b>{{orderModal.order_attributes.product.name}} {{orderModal.order_attributes.product.color}} {{orderModal.order_attributes.product.size}}</b><br />
      <b>Data: </b>{{orderModal.order_date_added | datetime}}<br />
      <b>Colaborador: </b>{{orderModal.order_attributes.info.name}}<br />
      <b>Valor: </b>{{orderModal.order_value | numeroPreco}}<br />
      <hr>

      <!-- <div v-for="item in order.object.lens" :key="item.code">
        <b>{{item.type}}</b> {{item.name}}
      </div> -->
      <!-- <div v-for="(or, ind) in order.parents.map(r => {
          return {
            order_id: r.order_id,
            total: r.total,
            attr: JSON.parse(r.attr)
          }
        })" :key="ind">
        <div v-for="item in or.attr.lens" :key="item.code">
          <b>{{item.type}}</b> {{item.name}}
        </div> -->
        <b>Face: </b><br />
        <img class="w-100" @click="onThumbClick(0)" :src="baseURL + orderModal.order_face" v-if="isImage(orderModal.order_face)" alt="">
        <iframe height="350" v-else class="w-100" :src="baseURL + orderModal.order_face" frameborder="0"></iframe>
        <b>Receita: </b><br />
        <img class="w-100" @click="onThumbClick(1)" :src="baseURL + orderModal.order_recipe" v-if="isImage(orderModal.order_recipe)" alt="">
        <iframe height="350" v-else class="w-100" :src="baseURL + orderModal.order_recipe" frameborder="0"></iframe>
      <template slot="modal-footer">
          <b-button variant="info" @click="hideModal('modalright')">Fechar</b-button>
      </template>
  </b-modal>
  <LightGallery v-if="orderModal" :images="[baseURL + orderModal.order_face, baseURL + orderModal.order_recipe]" :index="photoIndex" :disable-scroll="true" @close="handleHide()" />
</div>
</template>

<script>

import {
    mapGetters,
    mapActions
} from "vuex";
import {Money} from '@/vmoney.js'
import {api, baseURL} from '@/constants/config';
import VueDropzone from 'vue2-dropzone';
import InputTag from '@/components/Form/InputTag';
import {LightGallery} from 'vue-light-gallery';
export default {
    components:{
        'vue-dropzone': VueDropzone,
        'input-tag': InputTag,
        Money,
        LightGallery
    },
    data() {
        return {
          orders: null,
          orderModal: null,
          order:null,
          ordersEdit: {},
          isOpen: false,
          photoIndex: null,
          baseURL
        }
    },
    computed: {
        dropzoneOptions: function() {
            const token = window.localStorage.getItem('token');
            return {
                url: `${baseURL}saveFile/consult`,
                thumbnailWidth: 150,
                maxFilesize: 1,
                headers: { "X-Auth-Token": token },
                dictDefaultMessage: "Adicionar Imagem do consultor",
                previewTemplate: this.dropzoneTemplate(),
                maxFiles: 1,
            }
        }
    },
    methods: {
      isImage(ima){
        let existe = ['png', 'jpeg', 'jpg', 'gif', 'svg', 'heic'].map(r => { return ima.split(';')[0].indexOf(r) }).filter(r => r >= 0);
        return existe.length
      },
      onThumbClick(index) {
        this.photoIndex = index;
        this.isOpen = true;
      },
      handleHide() {
        this.photoIndex = null;
        this.isOpen = false;
      },
      hideModal (refname) {
        this.$refs[refname].hide()
        console.log('hide modal:: ' + refname)

        if (refname === 'modalnestedinline') {
          this.$refs['modalnested'].show()
        }
      },
      async getOrder(){
        const orders = await api.get(`admin/order/${this.$route.params.id}`)
        this.orders = orders.data.data.map(r => {
          r.order_attributes = JSON.parse(r.order_attributes)
          r.order_info = JSON.parse(r.order_info)
          return r
        });
      },
      sum_array(arr) {
        let total = 0;
        arr.forEach(e => {
          total += Number(e.match(/\d+/g).join('')) / 100
        });

        return total;
      },
      async splitOrder(){
        const checked = this.orders.map(r => {
          if(r.checked){
            return r.order_id
          }
        }).filter(r => r);

        await this.$swal.fire({
          title: `Tem certeza?`,
          text: `Você deseja realmente dividir a solicitação?`,
          icon: 'question',
          showLoaderOnConfirm: true,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sim',
          cancelButtonText: 'Não'
        }).then(async (result) => {
          if (result.value) {

            const splited = await api.post(`admin/order/split`, {orders: checked});

            this.$swal.fire({
              title: splited.data.status == 'success' ? 'Sucesso' : 'Ops...!',
              text: splited.data.message,
              icon: splited.data.status,
            });

            this.getOrder();
          }
        });

      },
      async changeStatus(status){
        await this.$swal.fire({
          title: `Tem certeza?`,
          text: `Você deseja realmente alterar o status desse(s) pedido(s)?`,
          icon: 'question',
          showLoaderOnConfirm: true,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sim',
          cancelButtonText: 'Não'
        }).then(async (result) => {
          if (result.value) {
            const order = this.orders[0].order_id;
            const changed = await api.post(`admin/order/changeStatus`, {status, order});

            this.$swal.fire({
              title: splited.data.status == 'success' ? 'Sucesso' : 'Ops...!',
              text: splited.data.message,
              icon: splited.data.status,
            });

            this.getOrder();
          }
        });
      },
      async saveOrder(index){
        await this.$swal.fire({
          title: `Tem certeza?`,
          text: `Você deseja realmente alterar as informações desse pedido?`,
          icon: 'question',
          showLoaderOnConfirm: true,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sim',
          cancelButtonText: 'Não'
        }).then(async (result) => {
          if (result.value) {
            const orderChange = this.orders[index];
            const save = await api.put(`admin/order/edit/${orderChange.order_id}`, {attr: orderChange.order_attributes});
            this.$swal.fire({
              title: save.data.status == 'success' ? 'Sucesso' : 'Ops...!',
              text: save.data.message,
              icon: save.data.status,
            });
            this.getOrder();

          }
        });
      }

    },
    created(){
      this.getOrder();
    }
}
</script>

<style>
.product_title{
    position: absolute;
    bottom: 0;
    background: #fff;
    width: 100%;
    text-shadow: 1px 1px 2px rgba(0,0,0,.2);
}

.demo {
  margin: auto;
  width: 100%;
  height: 30px;
  background-image: linear-gradient( 100deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 80% );
  background-repeat: repeat-y;
  background-size:50px 200px;
  background-position: 0 0;
}

.demo:nth-child(odd) {
  animation: shine 1s infinite;
}

.demo:nth-child(even) {
  animation: shine 2s infinite;
}

@keyframes shine {
  to {
  background-position:100% 0;
  }
}
</style>
