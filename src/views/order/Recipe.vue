<template>
  <div>
    <my-breadcrumb />
     <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" title="Imagem da receita">
			<b-alert variant="info" class="text-center mx-auto" fade show dismissible>Estamos tentando acessar a sua <b>câmera</b> de seu navegador.<br />Caso apareça algum alerta, permita que tenhamos acesso à sua câmera.</b-alert>
			<b-row :style="{'marginTop': (totem ? 'calc( 100vh - 1000px )' : '0px') }">
				<take-photo :link="$route.path.indexOf('admin') >= 0 ? '/admin/make/' : '/app/order/'" target="recipe"/>
			</b-row>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from 'vuex'
import myBreadCrumb from '@/components/breadcrumb';
import takePhoto from '@/components/takePhoto';
export default {
    components: {
		'my-breadcrumb': myBreadCrumb,
		'take-photo': takePhoto,
	},
	computed: {
    ...mapGetters(["currentUser"]),
		totem() {
      return this.currentUser.user.totem
    }
	},
	methods: {
    ...mapActions(['setItemOrder']),
		setProduct: function (item) {
      this.setItemOrder({...item, type: 'recipe'})
			this.$router.push("/app/order/confirmation");
		}
	}
}
</script>
