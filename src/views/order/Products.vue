<template>
  <div>
    <my-breadcrumb />
     <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" title="Selecione o item">
          <b-row v-if="products">
            <b-colxx md="4" lg="3" v-for="(pro, i) in products" :key="i">
              <CardProduct typeItem="complete" :product="pro" @click.native="setItem(pro.id)" v-b-modal.modallg />
            </b-colxx>
          </b-row>
          <b-row v-else class="align-items-center justify-content-center text-center">
            <h2>Buscando produtos...</h2>
          </b-row>
        </b-card>
      </b-colxx>
    </b-row>

    <ModalItem typeItem="complete" link="/app/order" :idProduct="idProduct" :idCompany="idCompany" />


  </div>
</template>

<script>
import {
    mapGetters,
    mapActions,
    mapState,
} from "vuex";
import myBreadCrumb from '@/components/breadcrumb';
import CardProduct from '@/components/Order/CardProduct';
import ModalItem from '@/components/Order/ModalItem';

import {api, baseURL} from '@/constants/config';
export default {
	data() {
		return {
      products: null,
      idProduct: 0,
      baseURL,
		}
	},
  components: {
    'my-breadcrumb': myBreadCrumb,
    CardProduct,
    ModalItem
	},
  computed: {
    ...mapGetters(["currentOrder"]),
    idCompany(){
      return this.currentOrder.company ? this.currentOrder.company.company : 0;
    }
  },
	methods: {

		getProducts: async function()
		{
      console.log(this.currentOrder)
      if(!this.currentOrder.info) {
        this.$notify("error", 'Opsss.!!!', "Por favor, selecione uma empresa para buscarmos a relação de produto disponível", {
          duration: 5000,
          permanent: false
        });
      }

      let company = this.currentOrder.company ? this.currentOrder.company.company : 0;
			const products = await api.get(`/products/${company}`);
			this.products = products.data.data
    },

    hideModal (refname) {
      this.$refs[refname].hide()
      console.log('hide modal:: ' + refname)

      if (refname === 'modalnestedinline') {
        this.$refs['modalnested'].show()
      }
    },

    setItem(item) {
      this.idProduct = item;
    }
	},
	created() {
		this.getProducts();
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
</style>
