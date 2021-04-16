<template>
  <div>
    <button v-if="currentCart.length > 0" v-b-modal.cart  class="btn btn-success btn-cart">
      <i class="iconsminds-shopping-cart"></i>
      <div class="myBadge-danger">{{currentCart.length}}</div>
    </button>

    <b-modal id="cart" ref="cart" title="Carrinho" size="lg">
      <h3 class="title">Confira o seu carrinho</h3>
      <table class="table table-striped" v-if="currentCart.length">
        <thead>
          <tr>
            <th></th>
            <th>Nome</th>
            <th>Quantidade</th>
            <th>Preço </th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in currentCart" :key="index">
            <td>
              <div class="w-100px bg-white">
                <single-lightbox :thumb="item.image" :large="item.image" class-name="w-100" />
              </div>
            </td>
            <td>{{item.name.toUpperCase() + ' ' + item.attributes.map(r => r.value).join(' ').toUpperCase() }}</td>
            <td>

              <div class="control">
                <button class="remover" :disabled="item.qty <= 0" @click="deleteItemCartConfirm(index)" v-if="item.qty == 1"><i class="simple-icon-trash" /></button>
                <button class="qty" :disabled="item.qty <= 0" @click="changeCartQty({index, val: -1})" v-else>-</button>
                <input readonly type="text" name="" id="" v-model="item.qty" class="bg-transparent">
                <button class="qty" @click="changeCartQty({index, val: 1})">+</button>
              </div>

            </td>
            <td> {{item.qty * item.price | numeroPreco}} </td>
            <td>
              <button class="btn btn-xs btn-danger" @click="deleteItemCartConfirm(index)">
                <i class="simple-icon-trash" />
              </button>
            </td>
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
      <b-alert show variant="info" v-else>Seu carrinho está vazio</b-alert>
      <template slot="modal-footer">
        <b-button variant="light" @click="hideModal('cart')">Fechar</b-button>
        <b-button v-if="currentCart.length" variant="success" :disabled="processing" :class="{'mr-1 btn-multiple-state btn-shadow': true,
            'show-spinner': processing,
            'show-success': !processing && uploadError===false,
            'show-fail': !processing && uploadError }" @click="finalizarPedido">
            <span class="spinner d-inline-block">
                <span class="bounce1"></span>
                <span class="bounce2"></span>
                <span class="bounce3"></span>
            </span>
            <span class="icon success">
                Finalizar pedido
            </span>
            <span class="icon fail">
                <i class="simple-icon-exclamation"></i>
            </span>
            <span class="label">Finalizar pedido</span>
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import {
    mapGetters,
    mapActions,
    mapState
} from "vuex";

import SingleLightbox from "@/components/Pages/SingleLightbox";
export default {
    components:{
      "single-lightbox": SingleLightbox,
    },
    computed:{
      ...mapGetters(["currentCart"]),
    },
    data(){
      return {
        processing: false,
        uploadError: false
      }
    },
    methods: {
      ...mapActions(["deleteItemCart", "changeCartQty", "finalizarOrder"]),
      deleteItemCartConfirm(index){
        this.$swal.fire({
          title: "Você está certo disso?",
          text: "Você realmente deseja remover o item?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: 'Remover',
          confirmButtonColor: '#faa',
          cancelButtonText: "Cancelar",
          showLoaderOnConfirm: true,
          preConfirm: (login) => {
            this.deleteItemCart(index);
          },
          allowOutsideClick: () => !this.$swal.isLoading()
        });
      },
      getTotalCart(){
        let total = 0;
        this.currentCart.forEach(element => {
          total += element.qty * element.price
        });
        return total;
      },
      hideModal (refname) {
        this.$refs[refname].hide()
        if (refname === 'modalnestedinline') {
          this.$refs['modalnested'].show()
        }
      },
      finalizarPedido(){
        this.$swal.fire({
          title: "Você está certo disso?",
          text: "Deseja finalizar a sua solicitação?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: 'Finalizar',
          confirmButtonColor: '#7f7',
          cancelButtonText: "Cancelar",
          showLoaderOnConfirm: true,
          preConfirm: (login) => {
            this.finalizarOrder()
          },
          allowOutsideClick: () => !this.$swal.isLoading()
        });
      }
    },
    watch: {
      'item.qty'(){
        console.log('Change')
      }
    }
}
</script>
<style scoped>
.btn-cart {
  position: fixed;
  bottom: 25px;
  right: 25px;
  font-size: 1.5rem;
  z-index: 10;
}

.remover {
  background: #fff;
  border: 1px solid #aaa;
  border-radius: 10px;
}

.bg-tranparent {
    background: transparent;
}
</style>
