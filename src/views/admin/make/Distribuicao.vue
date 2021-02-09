<template>
  <div>
     <b-row v-if="1">
      <b-colxx xxs="12">
        <b-card class="mb-4" :title="`Novo pedido para: ${products.company}`">
          <b-row class="flex-column mb-3">
            <b-colxx>
              <h5 class="sub-title" style="color: #444;border-bottom: 1px solid;">Adicionar Itens</h5>
            </b-colxx>
            <b-colxx class="mb-3 d-flex justify-content-between align-items-end">
              <div>
                <span>Pagina: <input type="text" v-model="filter.page" style="height:25px; max-width:40px;"> de {{Math.ceil(Number(products.total) / 10)}} páginas</span>
              </div>
              <div>
                <button class="btn btn-sm btn-outline-info" @click="() => {filter = {}; getProducts()}">Limpar busca</button>
                <button class="btn btn-sm btn-info" @click="getProducts">Buscar</button>

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
                    <td><input v-on:keyup.enter="getProducts" type="text" v-model="filter.id" style="height:25px; max-width:30%;"></td>
                    <td><input v-on:keyup.enter="getProducts" type="text" v-model="filter.name" style="height:25px; min-width:60%;"></td>
                    <td><input v-on:keyup.enter="getProducts" type="text" v-model="filter.sku" style="height:25px; max-width:50%;"></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr v-for="(pro, proIndex) in products.products" :key="proIndex">
                    <td>{{pro.id}}</td>
                    <td>{{pro.name}}</td>
                    <td>{{pro.sku ? pro.sku : '-'}}</td>
                    <td>
                      <b-form-checkbox-group>
                        <b-form-checkbox v-model="pro.checked"></b-form-checkbox>
                      </b-form-checkbox-group>
                    </td>
                    <td>
                      <input type="text" v-model="pro.qtd" style="height:25px; width:60px;">
                    </td>
                  </tr>
                  <tr v-if="productsProcessing" class="text-center">
                    <td colspan="5">
                      <h4 class="title">Buscando produtos</h4>
                    </td>
                  </tr>
                  <tr v-if="!productsProcessing && products.products.length == 0" class="text-center">
                    <td colspan="5">
                      <h4 class="title">Nenhum produto foi encontrado</h4>
                    </td>
                  </tr>
                  <tr v-if="products.products.length > 0" class="py-2">
                    <td colspan="5">
                      <button class="btn btn-sm btn-outline-info float-right" @click="addSelected">Adicionar selecionados</button>
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
                  <tr v-for="(pro, indexPro) in productSelected" :key="indexPro">
                    <td><b>{{pro.name}}</b><br><b>SKU: </b>{{pro.sku}}</td>
                    <td>{{proPrice(pro.id) | numeroPreco}}</td>
                    <td><input type="text" v-model="pro.qtd" style="height:25px; max-width:60px;"></td>
                    <td>{{ proPrice(pro.id) * pro.qtd | numeroPreco }}</td>
                    <td>
                      <button @click="() => {
                        productSelected.splice(indexPro, 1);
                      }" class="btn btn-xs btn-danger">
                        <i class="simple-icon-trash" />
                      </button>
                    </td>
                  </tr>
                  <tr v-if="productSelected.length == 0" class="text-center">
                    <td colspan="5">
                      <h4 class="title">Nenhum item adicionado</h4>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="5">
                      <span><b>Total: </b> {{productSelected.length}} produto(s)</span><br>
                      <span v-if="productSelected.length > 0"><b>Subtotal: </b> {{ productSelected.map(r => {
                        return Number(proPrice(r.id)) * Number(r.qtd)
                      }).reduce( (total, current) => {
                        return total + current
                      }) | numeroPreco}} </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </b-colxx>
          </b-row>
          <b-row>
            <b-colxx>
              <button @click="addOrder" class="btn btn-success float-right">Finalizar pedido</button>
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
			products: [],
      baseURL,
      company: null,
      filter: {},
      productsProcessing: false,
      productSelected: []
		}
	},
    components: {
        'my-breadcrumb': myBreadCrumb
	},
	methods: {
		setProduct: function (index) {
      let resp = false;
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
			window.localStorage.setItem('order',JSON.stringify(order));
			this.$router.push("/admin/make/lens");
		},

		getProducts: async function()
		{
      this.productsProcessing = true;
      this.products.products = [];
      let company = JSON.parse(window.localStorage.getItem('order')).company;
			const products = await api.get(`admin/distribution/${company}`, {params: this.filter});
			this.products = products.data.data;
      this.productsProcessing = false;
    },

    addSelected() {
      this.products.products.forEach(element => {
        if(element.checked) {
          element.qtd = element.qtd > 1 ? element.qtd : 1;

          this.productSelected.push(element)
        }
      });

      let selected = [];
      this.productSelected.forEach(element => {
        if(selected.filter(r => r.id == element.id).length == 0){
          selected.push(element);
        }
      })

      this.productSelected = selected;

    },
    proPrice(idProduct){

      let produto = this.productSelected.filter(r => r.id == idProduct)[0];
      let preco = 0;
      produto.price.forEach(r => {
        if(Number(produto.qtd) >= Number(r.qty)) {
          preco = r.value
        }
      });
      return preco;
    },
    async addOrder(){
      let company = JSON.parse(window.localStorage.getItem('order')).company;
      const response = await api.post(`admin/distribution`, {product: this.productSelected, company});
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
