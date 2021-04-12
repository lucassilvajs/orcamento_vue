<template>
  <div>
    <b-card class="mb-4" title="Adquira seus óculos com lentes e acessórios">
			<b-row v-if="products">
				<b-colxx md="4" lg="3" v-for="(pro, i) in products" :key="i" v-b-modal.modallg>
					<b-card @click="product = pro" class="mb-4" style="border:1px solid rgba(100,100,100,.5); border-radius:6px" no-body>
						<div class="position-relative">
              <img :src="pro.image" alt="" class="card-img-top">
						</div>
						<b-card-body>
							<form @submit.prevent="setProduct(pro)">
                <h5 class="price text-success text-right">{{pro.price | numeroPreco}}</h5>
                <h6 class="name-product">{{pro.name}}</h6>
                <p class="text-muted">{{pro.description}}</p>
							</form>
						</b-card-body>
					</b-card>
				</b-colxx>
			</b-row>
			<b-row v-else class="align-items-center justify-content-center text-center">
				<h2>Buscando produtos...</h2>
			</b-row>
    </b-card>

    <button v-b-modal.cart v-if="distribuidor" class="btn btn-success btn-cart">
      <i class="iconsminds-shopping-cart"></i>
      <div class="myBadge-danger" v-if="distribuidorCard.length">{{distribuidorCard.length}}</div>
    </button>

    <b-modal id="cart" ref="cart" title="Carrinho">
      <table class="table table-striped">
        <thead>
          <tr>
            <th></th>
            <th>Nome</th>
            <th>Quantidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in products.filter(r=> r.qty > 0)" :key="index">
            <td><img class="w-100px" :src="item.image" alt=""></td>
            <td>{{item.name}}</td>
            <td>{{item.qty}}</td>
            <td>
              <button class="btn btn-xs btn-danger">
                <i class="simple-icon-trash" @click="item.qty = 0" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <template slot="modal-footer">
        <b-button variant="secondary" @click="hideModal('cart')">Fechar</b-button>
        <b-button variant="primary" @click="finalizarPedido()" class="mr-1">Finalizar pedido</b-button>
      </template>
    </b-modal>

    <modalItem />

  </div>
</template>

<script>
import myBreadCrumb from '@/components/breadcrumb';
import modalItem from '@/components/Order/ModalItem';
import {api, baseURL} from '@/constants/config';
export default {
	data() {
		return {
      baseURL,
      distribuidor: false,
      distribuidorCard: [],
      inCart: [],
      products: [
        {
          image: 'https://api.idsafety.com.br/public/upload/product/spray.png',
          name: 'SPRAY ANTIEMBAÇANTE 15ML',
          description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae adipisci laboriosam iure rem atque',
          price: 15,
          qty: 0,
          id: 5,
        },
        {
          image: 'https://api.idsafety.com.br/public/upload/product/spray.png',
          name: 'SPRAY ANTIEMBAÇANTE 15ML',
          description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae adipisci laboriosam iure rem atque',
          price: 15,
          qty: 0,
          id: 5,
        }
      ]
		}
	},
    components: {
        'my-breadcrumb': myBreadCrumb,
        modalItem
	},
	methods: {
	},
	created() {
	}
}
</script>

<style>
.circle-color {
	width:25px;
	height: 25px;
	border-radius: 50%;
	background: #a00
}

.btn-cart {
  position: fixed;
  bottom: 25px;
  right: 25px;
  font-size: 1.5rem;
  z-index: 10;
}

.myBadge-danger {
  font-size: .7rem;
  position: absolute;
  top: 5px;
  right: 20px;
  background: red;
  border-radius: 50%;
  display: block;
  width: 17px;
  height: 17px;
}

h5.price {
  font-size: 1rem;
}

h6.name-product {

}

.modal-header{
  display: none !important;
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

.circle-item {
  width: 55px;
  height: 55px;
  border: 2px solid #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  margin-right: 5px;
  margin-bottom: 5px;
}

button.qty {
  background: transparent;
  border: 1px solid #aaa;
  width: 25px;
  height: 25px;
  border-radius: 50%;
}
button.qty:hover, button.qty:active {
  border: 1px solid rgb(0, 172, 149);
}

.control input[type="text"]{
  width: 35px;
  border: 0;
  text-align: center;
  font-weight: bold;
}
</style>
