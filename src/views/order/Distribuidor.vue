<template>
  <div>
    <b-card class="mb-4" title="Adquira seus óculos sem grau e acessórios">
			<b-row v-if="products">
				<b-colxx md="4" lg="3" v-for="(pro, i) in products" :key="i" v-b-modal.modallg>
					<card-product :product="pro" />
				</b-colxx>
			</b-row>
			<b-row v-else class="align-items-center justify-content-center text-center">
				<h2>Buscando produtos...</h2>
			</b-row>
    </b-card>

    <ModalCart />
    <ModalItem />

  </div>
</template>

<script>
import myBreadCrumb from '@/components/breadcrumb';
import ModalItem from '@/components/Order/ModalItem';
import ModalCart from '@/components/Order/ModalCart';
import CardProduct from '@/components/Order/CardProduct';
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
          id: 1,
        },
        {
          image: 'https://api.idsafety.com.br/public/upload/product/spray.png',
          name: 'SPRAY ANTIEMBAÇANTE 15ML',
          description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae adipisci laboriosam iure rem atque',
          price: 15,
          id: 2,
        }
      ]
		}
	},
    components: {
        'my-breadcrumb': myBreadCrumb,
        ModalItem,
        ModalCart,
        'card-product': CardProduct
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
