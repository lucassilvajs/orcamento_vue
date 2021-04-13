<template>
  <div>
    <button v-if="currentCart.length > 0" v-b-modal.cart  class="btn btn-success btn-cart">
      <i class="iconsminds-shopping-cart"></i>
      <div class="myBadge-danger">{{currentCart.length}}</div>
    </button>

    <b-modal id="cart" ref="cart" title="Carrinho" size="lg">
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
                <img class="w-100" :src="item.image" alt="">
              </div>
            </td>
            <td>{{item.name.toUpperCase() + ' ' + item.attributes.map(r => r.value).join(' ').toUpperCase() }}</td>
            <td>

              <div class="control">
                <button class="remover" :disabled="item.qty <= 0" @click="deleteItemCartConfirm(index)" v-if="item.qty == 1"><i class="simple-icon-trash" /></button>
                <button class="qty" :disabled="item.qty <= 0" @click="item.qty -= 1" v-else>-</button>
                <input readonly type="text" name="" id="" v-model="item.qty">
                <button class="qty" @click="item.qty += 1">+</button>
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
              <p>Valor Total {{ getTotalCart() | numeroPreco }} </p>
            </td>
          </tr>
        </tfoot>
      </table>
      <b-alert show variant="info" v-else>Seu carrinho está vazio</b-alert>
      <template slot="modal-footer">
        <b-button variant="light" @click="hideModal('cart')">Fechar</b-button>
        <b-button variant="success" v-if="currentCart.length" class="mr-1">Finalizar pedido</b-button>
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

export default {
    computed:{
      ...mapGetters(["currentCart"]),
    },
    data(){
      return {
      }
    },
    methods: {
      ...mapActions(["deleteItemCart"]),
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
        })
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
</style>
