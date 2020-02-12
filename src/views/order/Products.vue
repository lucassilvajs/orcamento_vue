<template>
  <div>
    <my-breadcrumb />
     <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" title="Selecione o item">
        </b-card>
      </b-colxx>
    </b-row>
		<b-row>
			<b-colxx v-for="i in [1,2,3,4]" :key="i">
				<b-card md="3" class="mb-4" style="border:1px solid rgba(100,100,100,.5); border-radius:6px" no-body>
					<div class="position-relative">
						<img src="https://dp.idsafety.com.br/upload/product/mg9aJbaMVYbTgFhXFQef.jpg" class="card-img-top" />
					</div>
					<b-card-body>
						<P class="mb-2 card-subtitle">ID 101 B - CA 39018</P>
						<p>SKU: 1</p>
						<div class="separator mb-3"></div>
						<button @click="setProduct(i)" class="btn btn-outline-success float-right">Adicionar</button>
					</b-card-body>
				</b-card>
			</b-colxx>
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

<style>

</style>