<template>
  <div>
    <my-breadcrumb />
     <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" title="Imagem da face">
			<b-alert variant="info" class="text-center mx-auto" fade show dismissible>Estamos tentando acessar a sua <b>câmera</b> de seu navegador.<br />Caso apareça algum alerta, permita que tenhamos acesso à sua câmera.</b-alert>
			<b-row>
				<take-photo target="face" />
			</b-row>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import takePhoto from '@/components/takePhoto';
import myBreadCrumb from '@/components/breadcrumb';
export default {
    components: {
        'my-breadcrumb': myBreadCrumb,
        'take-photo': takePhoto,
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
			this.$router.push("/order/face");
		}
	}
}
</script>