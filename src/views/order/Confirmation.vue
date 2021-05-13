<template>
<div style="margin-top:80px;">
    <my-breadcrumb />
    <b-row>
        <b-colxx xxs="12" md="3">
          <b-card class="mb-4" no-body v-if="currentOrder.face && currentOrder.recipe">
            <single-lightbox v-if="isImage(baseURL+currentOrder.face.value)" :thumb="baseURL+currentOrder.face.value" :large="baseURL+currentOrder.face.value" class-name="img-thumbnail card-img mx-auto d-block p-2" />
            <b-card-body class="pt-0">
              <router-link v-if="!currentOrder.recipe" to="/app/order/recipe" class="btn btn-xs btn-danger">Adicionar receita</router-link>
              <div v-if="isImage(baseURL+currentOrder.recipe.value)">
                <LightGallery
                  :images="[baseURL+currentOrder.recipe.value]"
                  :index="photoIndex"
                  :disable-scroll="true"
                  @close="handleHide()"
                />
                <router-link class="btn btn-xs btn-outline-info mt-1" to="#" @click.native.prevent="onThumbClick(0)">Ver receita</router-link>
              </div>
              <div v-else>
                <a class="btn btn-xs btn-outline-info mt-1" target="_blank" :href="baseURL+currentOrder.recipe.value">Ver receita</a>
              </div>
              <div v-if="!isImage(baseURL+currentOrder.face.value)">
                <a class="btn btn-xs btn-outline-info mt-1" target="_blank" :href="baseURL+currentOrder.face.value">Ver face</a>
              </div>
              <div class="info mt-3" v-for="(info, iInfo) in currentOrder.info" :key="iInfo">
                <p class="text-muted text-small">{{iInfo == 'name' ? 'Nome' : iInfo}}</p>
                <p v-if="info.length == 0" class="mb-3" style="letter-spacing:.13rem; text-decoration:underline;">Não preenchido</p>
                <p v-else class="mb-3">{{info}}</p>
              </div>
            </b-card-body>
          </b-card>
          <b-card v-else>
            <h5>Você precisa anexar: </h5>
              <router-link v-if="!currentOrder.face" to="/app/order/face">Imagem da face</router-link><br>
              <router-link v-if="!currentOrder.recipe" to="/app/order/recipe">Imagem da receita</router-link>
          </b-card>
        </b-colxx>

        <b-colxx xxs="12" md="6">
          <b-card no-body>
            <div class="d-flex product" v-if="currentOrder.product">
              <single-lightbox :thumb="baseURL+currentOrder.product.img" :large="baseURL+currentOrder.product.img" class-name="img-thumbnail img-product mx-auto d-block p-2" />
              <div class="p-3">
                <h4 class="title">{{currentOrder.product.name.toUpperCase() + ' ' + currentOrder.product.attributes.map(r => r.value).join(' ').toUpperCase()}}</h4>
                <p v-for="(attr, iAttr) in currentOrder.product.attributes" :key="iAttr"><b>{{attr.name}}: </b>{{attr.value}}</p>
                <p class="mb-3">
                  <b-badge variant="outline-secondary" class="mb-1 mr-1" pill v-for="(attr, iAttr) in lens" :key="iAttr">{{attr[0].name}}</b-badge>
                </p>
              </div>
            </div>
            <div v-else>
              <h5>Você precisa selecionar o produto: </h5>
              <router-link to="/app/order/products">Clique para selecionar</router-link>
            </div>
          </b-card>
          <distribuidor v-if="acessorio" class="mt-4" col="6"
            title="Adicione acessórios ao seu pedido"
            :not="[1]" :idCompany="currentOrder.company.company"
          />
        </b-colxx>

        <b-colxx xxs="12" md="3">
          <b-card title="Resumo da compra">
            <div class="d-flex justify-content-between">
              <h6 class="text-dark">Valor total:</h6>
              <h6 v-if="price"><b>{{price | numeroPreco}}</b></h6>
              <h6 v-else><b>Indisponível</b></h6>
            </div>
            <div class="d-flex justify-content-between" v-if="acessorio && currentCart.length">
              <h6 class="text-dark">Acessórios:</h6>
              <h6><b>{{sumCurrentCart | numeroPreco}}</b></h6>
            </div>
            <hr>
              <b-form-checkbox v-model="acessorio" name="check-button">
                Adicionar acessórios na solicitação
              </b-form-checkbox>
            <hr>
            <b-form-checkbox v-if="awaitingOrders.length == 0" v-model="isMulti" name="check-button">
              Após finalizar, iniciar nova solicitação
            </b-form-checkbox>
            <b-button variant="success" :disabled="processing" :class="{'m-3 btn-multiple-state btn-shadow btn-block': true,
                'show-spinner': processing,
                'show-success': !processing && uploadError===false,
                'show-fail': !processing && uploadError }" @click="sendInfo">
                <span class="spinner d-inline-block">
                    <span class="bounce1"></span>
                    <span class="bounce2"></span>
                    <span class="bounce3"></span>
                </span>
                <span class="icon success">
                    Enviar Solicitação
                </span>
                <span class="icon fail">
                    <i class="simple-icon-exclamation"></i>
                </span>
                <span class="label">Enviar Solicitação</span>
            </b-button>
          </b-card>
        </b-colxx>
    </b-row>
</div>
</template>

<script>
import {
    mapGetters,
    mapMutations,
    mapActions
} from 'vuex'

import {LightGallery} from "vue-light-gallery";
import {api, baseURL} from '@/constants/config';
import myBreadCrumb from '@/components/breadcrumb';
import SingleLightbox from "@/components/Pages/SingleLightbox";
import distribuidor from '@/views/order/Distribuidor';
export default {
    components: {
        'my-breadcrumb': myBreadCrumb,
        "single-lightbox": SingleLightbox,
        LightGallery,
        distribuidor
    },
    data() {
      return {
        order: null,
        baseURL,
        uploadError: false,
        price: 0,
        isNew: 0,
        photoIndex: null,
        processing: false,
        isMulti: false,
        acessorio: false,
      }
    },

    computed: {
        ...mapGetters(["loginError", "awaitingOrders", "currentOrder", "currentCart", "haveParent"]),
        lens(){
          let lens = [];
          for(let i in this.currentOrder.lens) {
            if(this.currentOrder.lens[i].length > 0) {
              lens.push(this.currentOrder.lens[i])
            }
          }

          return lens;
        },

        sumCurrentCart(){
          let price = 0;
          this.currentCart.forEach(element => {
            price += (parseFloat(element.price) * parseInt(element.qty));
          });
          return price;
        }
    },
    methods: {
      ...mapActions(['getAwaitingOrders', 'clearCart', 'finalizarOrder']),
      onThumbClick(index) {
        this.photoIndex = index;
      },
      handleHide() {
        this.photoIndex = null;
      },
      isImage(ima){
        let existe = ['png', 'jpeg', 'jpg', 'gif', 'svg', 'heic'].map(r => { return ima.split(';')[0].indexOf(r) }).filter(r => r >= 0);
        return existe.length
      },
      sendInfo: async function(){
          let order = this.currentOrder;
          let company  = order.company ? order.company.company : false;
          order.consulta = false;
          order.new = this.awaitingOrders.length == 0 ? (this.isMulti ? 1 : 0) : 1;
          this.processing = true
          let cart = this.acessorio ? this.currentCart : {};
          const response = await api.post('/order_distribuidor', {order, cart});
          let data = response.data;
          if(data.status == 'success') {
              this.$notify("success", `Sucesso`, data.message, {
                  duration: 3000,
                  permanent: false
              });
              this.clearCart();
              let base = this.$route.path.indexOf('admin') >= 0 ? '/admin/make/' : '/app/order/';
              this.$router.push(`${base}success`);
          }else{
              this.uploadError = false;
              this.$notify("error", 'Opsss...!', data.message, {
                  duration: 3000,
                  permanent: false
              });
          }

          this.getAwaitingOrders();
          this.processing = false
      },
      async getValue(){
        let order = this.currentOrder;
        order.consulta = true;
        const response = await api.post('/order_distribuidor', {order, cart: {}});
        if(response.data.status == 'success') {
          this.price = response.data.data;
        }
      }
    },
    created() {
      this.getValue();
    },
    watch: {
    }
}
</script>

<style>
p{
    margin-bottom: 5px!important;
}

.text-center a{
   color: #00b3b7
}

.mh-150{
  max-height: 150px!important;
}

h4.title {
  font-weight: bold;
  font-size: 1rem;
}

.img-product {
  width: 250px!important;
  display: none;
}
</style>
