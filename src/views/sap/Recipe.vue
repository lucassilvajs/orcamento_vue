<template>
  <div>
     <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" title="Imagem da receita">
			<b-alert variant="info" class="text-center mx-auto" fade show dismissible>Estamos tentando acessar a sua <b>câmera</b> de seu navegador.<br />Caso apareça algum alerta, permita que tenhamos acesso à sua câmera.</b-alert>
			<b-row :style="{'marginTop': (totem ? 'calc( 100vh - 1000px )' : '0px') }">
				<take-photo target="recipe"/>
			</b-row>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import myBreadCrumb from '@/components/breadcrumb';
import takePhoto from '@/components/takePhoto';
export default {
    components: {
		'my-breadcrumb': myBreadCrumb,
		'take-photo': takePhoto,
	},
	computed: {
		totem() {
        if(JSON.parse(window.localStorage.getItem('user'))) {
          return JSON.parse(window.localStorage.getItem('user')).user.totem;
        }else{
          return false
        }
    }
	},
	methods: {
		setProduct: function (item) {
			let order = window.localStorage.getItem('order');
			if(order){
				order = JSON.parse(order);
			}else{
				order = {};
			}
			order.product = item;
			window.localStorage.setItem('order',JSON.stringify(order));
			this.$router.push("/app/order/face");
		}
	}
}
</script>
