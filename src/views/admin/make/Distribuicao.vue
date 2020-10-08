<template>
  <div>
     <b-row v-if="1">
      <b-colxx xxs="12">
        <b-card class="mb-4" title="Novo pedido para Coca-cola do Brasil">
          <b-row class="flex-column mb-3">
            <b-colxx>
              <h5 class="sub-title" style="color: #444;border-bottom: 1px solid;">Adicionar Itens</h5>
            </b-colxx>
            <b-colxx class="mb-3 d-flex justify-content-between align-items-end">
              <div>
                <span>Pagina: <input type="text" v-model="filter.page" style="height:25px; max-width:40px;"> de 5 páginas</span>
              </div>
              <div>
                <button class="btn btn-sm btn-outline-info">Limpar busca</button>
                <button class="btn btn-sm btn-info">Buscar</button>

              </div>
            </b-colxx>
            <b-colxx>
              <table class="w-100 table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>SKU</th>
                    <th>Selecione</th>
                    <th>Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="filter-table-area" style="background: rgb(78 173 188)!important">
                    <td><input type="text" v-model="filter.id" style="height:25px; max-width:30%;"></td>
                    <td><input type="text" v-model="filter.name" style="height:25px; min-width:60%;"></td>
                    <td><input type="text" v-model="filter.sku" style="height:25px; max-width:50%;"></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr v-for="l in 5" :key="l">
                    <td>15</td>
                    <td>EPI ID 101 A</td>
                    <td>100152</td>
                    <td>
                      <b-form-checkbox-group>
                        <b-form-checkbox value="first"></b-form-checkbox>
                      </b-form-checkbox-group>
                    </td>
                    <td>
                      <input type="text" style="height:25px; width:60px;">
                    </td>
                  </tr>
                  <tr class="py-2">
                    <td colspan="5">
                      <button class="btn btn-sm btn-outline-info float-right">Adicionar selecionados</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </b-colxx>
          </b-row>
          <b-row class="flex-column mb-3">
            <b-colxx>
              <h5 class="sub-title" style="color: #444;border-bottom: 1px solid;">Itens adicionados</h5>
            </b-colxx>
            <b-colxx>
              <table class="w-100 table-striped">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Preço</th>
                    <th>Quantidade</th>
                    <th>Subtotal</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="l in 5" :key="l">
                    <td><b>Haste 101 A - Azul</b><br><b>SKU: </b>600005</td>
                    <td>R$ 5,00</td>
                    <td><input type="text" style="height:25px; max-width:60px;"></td>
                    <td>R$50,00</td>
                    <td>
                      <button class="btn btn-xs btn-danger">
                        <i class="simple-icon-trash" />
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="5">
                      <span><b>Total: </b> 5 produto(s)</span><br>
                      <span><b>Subtotal: </b> R$ 250,00</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </b-colxx>
          </b-row>
          <b-row>
            <b-colxx>
              <button class="btn btn-success float-right">Finalizar pedido</button>
            </b-colxx>
          </b-row>
        </b-card>
      </b-colxx>
    </b-row>
    <b-row v-else class="align-items-center justify-content-center text-center">
      <h2>Buscando produtos...</h2>
    </b-row>
  </div>
</template>

<script>
import myBreadCrumb from '@/components/adminBreadcrumb';
import {api, baseURL} from '@/constants/config';
export default {
	data() {
		return {
			products: null,
      baseURL,
      filter: {},
		}
	},
    components: {
        'my-breadcrumb': myBreadCrumb
	},
	methods: {
		setProduct: function (index) {
      let resp = false;
      // if(this.products.data[index].attributes){
      //   resp = this.products.data[index].attributes.filter(r => {
      //     if(r.select.length) {
      //       return r
      //     }
      //   });
      // }

      if(!resp || resp.length == 0){
        if(this.products.data[index].attributes) {
          if(!this.products.data[index].attributes.select) {
            this.$notify("error", 'Opsss.!!!', "Você precisa selecionar o item", {
              duration: 3000,
              permanent: false
            }); return false
          }
        }else if( (!this.products.data[index].colorSelected || !this.products.data[index].sizeSelected) ){
          this.$notify("error", 'Opsss.!!!', "Você precisa selecionar o tamanho e a cor do seu óculos", {
            duration: 3000,
            permanent: false
          }); return false
        }
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
        image: this.products.data[index].color ? this.products.data[index].color.filter(color => color.name == this.products.data[index].colorSelected)[0].image : '',
        attributes: this.products.data[index].attributes.select
			};
			window.localStorage.setItem('order',JSON.stringify(order));
			this.$router.push("/admin/make/lens");
		},

		getProducts: async function()
		{
      let order = JSON.parse(window.localStorage.getItem('order'));
      let user = JSON.parse(window.localStorage.getItem('user'));
      let company = '';
      console.log(order)
      console.log(user)
      if(true) {
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

table td {
  padding: 3px;
}
</style>
