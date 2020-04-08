<template>
  <div>
    <my-breadcrumb />
     <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" title="Selecione o item">
			<b-row v-if="products">
				<b-colxx md="4" lg="3" v-for="(pro, i) in products.data" :key="i">
					<b-card class="mb-4" style="border:1px solid rgba(100,100,100,.5); border-radius:6px" no-body>
						<div class="position-relative">
							<img v-if="pro.colorSelected" :src="`${pro.color.filter(color => color.name == pro.colorSelected)[0].image ? baseURL+pro.color.filter(color => color.name == pro.colorSelected)[0].image : 'https://via.placeholder.com/870x470'}`" class="card-img-top" />
							<img v-else :src="`${pro.image ? baseURL+pro.image : 'https://via.placeholder.com/870x470' }`" class="card-img-top" />
						</div>
						<b-card-body>
							<form @submit.prevent="setProduct(i)">
								<p class="mb-2 card-subtitle">{{pro.name}}</p>
								<p>SKU: {{pro.sku}}</p>
								<div class="separator mb-2"></div>
									<select v-model="pro.sizeSelected" name="" id="" class="form-control mb-2">
										<option value="">Selecione o tamanho</option>
										<option v-for="(s, ci) in pro.size" :key="ci">
											{{s}} MM
										</option>
									</select>
									<select v-model="pro.colorSelected" name="" id="" class="form-control">
										<option value="">Selecione a cor</option>
										<option v-for="(color, ci) in pro.color" :key="ci">
											{{color.name}}
										</option>
									</select>
								<div class="separator my-2"></div>
								<button class="btn btn-outline-success float-right w-100">Adicionar</button>
							</form>
						</b-card-body>
					</b-card>
				</b-colxx>
			</b-row>
			<b-row v-else class="align-items-center justify-content-center text-center">
				<h2>Buscando produtos...</h2>
			</b-row>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import myBreadCrumb from '@/components/breadcrumb';
import {api, baseURL} from '@/constants/config';
export default {
	data() {
		return {
			products: null,
			baseURL
		}
	},
    components: {
        'my-breadcrumb': myBreadCrumb
	},
	methods: {
		setProduct: function (index) {
			if(!this.products.data[index].colorSelected || !this.products.data[index].sizeSelected){
				this.$notify("error", 'Opsss.!!!', "Você precisa selecionar o tamanho e a cor do seu óculos", {
					duration: 3000,
					permanent: false
				});
			}
			let order = window.localStorage.getItem('order');
			if(order){
				order = JSON.parse(order);
			}else{
				order = {};
			}
			order.product = {
				model: this.products.data[index].id,
				name: this.products.data[index].name,
				color: this.products.data[index].colorSelected,
				size: this.products.data[index].sizeSelected,
				image: this.products.data[index].color.filter(color => color.name == this.products.data[index].colorSelected)[0].image
			};
			window.localStorage.setItem('order',JSON.stringify(order));
			this.$router.push("/order/lens");
		},

		getProducts: async function()
		{
      let order = JSON.parse(window.localStorage.getItem('order'));
      let user = JSON.parse(window.localStorage.getItem('user'));
      let company = '';
      console.log(order)
      console.log(user)
      if(user.user.colaborador) {
        if(!order || !order.company) {
          this.$notify("error", 'Opsss.!!!', "Por favor, selecione uma empresa para buscarmos a relação de produto disponível", {
            duration: 5000,
            permanent: false
          });
          return false;
        }else{
          company = order.company;
        }
      }
			const products = await api.get(`/products/${company}`);
			this.products = products.data
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
</style>
