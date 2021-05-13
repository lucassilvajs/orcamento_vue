<template>
  <div>
    <b-card class="mb-4" title="Adquira seus óculos sem grau e acessórios">
			<b-row v-if="products">
				<b-colxx :lg="lg" v-for="(pro, i) in products" :key="i" v-b-modal.modallg>
					<card-product :product="pro" @click.native="setItem(pro.id)" />
				</b-colxx>
			</b-row>
			<b-row v-else class="align-items-center justify-content-center text-center">
				<h2>Buscando produtos...</h2>
			</b-row>
    </b-card>

    <ModalCart :idCompany="idCompany" />
    <ModalItem typeItem="distribuicao" :idProduct="idProduct" :idCompany="idCompany" />

  </div>
</template>

<script>
import myBreadCrumb from '@/components/breadcrumb';
import ModalItem from '@/components/Order/ModalItem';
import ModalCart from '@/components/Order/ModalCart';
import CardProduct from '@/components/Order/CardProduct';
import {api, baseURL} from '@/constants/config';

import {
    mapGetters,
    mapActions,
    mapState,
} from "vuex";

export default {
  props: ["idCompany"],
	data() {
		return {
      baseURL,
      products: null,
      idProduct: null,
		}
	},
  components: {
    'my-breadcrumb': myBreadCrumb,
    ModalItem,
    ModalCart,
    'card-product': CardProduct
	},
  computed: {
    ...mapGetters(["currentCart"]),
    lg(){
      return this.$route.path.indexOf('confirmation') >= 0 ? 6 : 3;
    }

  },
	methods: {
    getProducts: async function()
		{
			const products = await api.get(`/distribuicao/${ isNaN(this.idCompany) ? 0 : this.idCompany}`);
			this.products = products.data.data
    },
    setItem(item) {
      this.idProduct = item;
    }
	},
	created() {
    this.getProducts();
	},
  watch: {
    idCompany(){
      this.getProducts();
    }
  }
}
</script>

<style>


</style>
