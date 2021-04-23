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


</style>
