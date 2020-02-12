<template>
  <div>
    <my-breadcrumb />
     <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" title="Imagem da receita">
        </b-card>
      </b-colxx>
    </b-row>
	<b-alert variant="info" class="text-center mx-auto" fade show dismissible>Estamos tentando acessar a sua <b>câmera</b> de seu navegador.<br />Caso apareça algum alerta, permita que tenhamos acesso à sua câmera.</b-alert>
    <b-row>
		<div class="target-foto">
			
			<div class="controlls">
				<div>
					<button class="btn btn-outline-dark btn-sm mr-1"> - </button>
					<button class="btn btn-outline-dark btn-sm"> + </button>
				</div>

				<button class="btn btn-outline-light mr-2">
					<div class="glyph-icon simple-icon-camera"></div>
				</button>
				<button class="btn btn-outline-light ml-2">
					<div class="glyph-icon simple-icon-paper-clip"></div>
				</button>
			</div>
		</div>
    </b-row>
  </div>
</template>

<script>
import myBreadCrumb from '@/components/breadcrumb';
export default {
    components: {
        'my-breadcrumb': myBreadCrumb
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

<style scoped>
	.target-foto {
		width:500px;
		height:500px;
		display: block;
		margin: 0 auto;
		background: #333;
		position: relative;
	}

	.controlls {
		width: 100%;
		height: 65px;
		background: #00b3b7;
		position: absolute;
		left: 0;
		right: 0;
		margin: 0 auto 20px auto;
		bottom: 0;
		display: flex;
		justify-content: space-around;
		align-items: center
	}
</style>