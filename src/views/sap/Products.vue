<template>
  <div>
     <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" title="Selecione o item">
			<b-row v-if="products">
				<b-colxx md="4" lg="3" v-for="(pro, i) in products" :key="i">
					<b-card class="mb-4" style="border:1px solid rgba(100,100,100,.5); border-radius:6px" no-body>
						<div class="position-relative">
              <img :src="baseURL + getProductImage(pro)" alt="" class="card-img-top">
						</div>
						<b-card-body>
							<form @submit.prevent="setProduct(pro)">
								<p class="mb-2 card-subtitle">{{pro.information.pro_name}} <sub v-if="pro.information.pro_ca">CA: {{pro.information.pro_ca}}</sub> </p>
								<div class="separator mb-2"></div>
                <b-form-group v-for="(attr, indexAttr) in pro.attrs" :key="`${indexAttr}_${i}`" :label="indexAttr" class="has-float-label mb-4">
                  <b-form-select :options="option(attr)" plain v-model="pro['items_'+indexAttr]" />
                </b-form-group>
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
      baseURL,
		}
	},
    components: {
        'my-breadcrumb': myBreadCrumb
	},
	methods: {


		setProduct: function (item) {
      if(false) {
        this.addProductToCard(item)
      }else{
        let attr = [];
        for(let i in item) {
          if(i.indexOf('items_') >= 0) {
            attr.push({attr: i.replace('items_', ''), value: item[i]})
          }
        }

        attr.push({attr: 'model', value: item.information.pro_id});

        let order = window.localStorage.getItem('order');
        if(order){
          order = JSON.parse(order);
        }else{
          order = {};
        }

        order.product = attr
        window.localStorage.setItem('order', JSON.stringify(order));
        this.$router.push("/sap/lens");
      }


		},

		getProducts: async function()
		{
      let order = JSON.parse(window.localStorage.getItem('order'));

      let company = '';
      console.log(order)
      if(true) {
        if(!order) {
          this.$notify("error", 'Opsss.!!!', "Por favor, selecione uma empresa para buscarmos a relação de produto disponível", {
            duration: 5000,
            permanent: false
          });
          return false;
        }else{
          company = order.company;
        }
      }
			const products = JSON.parse(window.localStorage.getItem('information')).products;
			this.products = products
    },
    option(attr){
      let retorno = [];
      for(let i in attr) {
        retorno.push({
          value: attr[i],
          text: attr[i]
        });
      }

      return retorno
    },
    getProductImage(item){

      let image = item.variation[0].filter(r => {
        if(r.label == 'Imagem'){return r}
      })[0].value;

      console.log(image)

      let attr = [];

      for(let i in item) {
        if(i.indexOf('items_') >= 0) {
          attr.push({attr: i.replace('items_', ''), value: item[i]})
        }
      }

      let color = attr.filter(r => {
        if(r.attr == 'Cor') {
          return r.value
        }
      });

      let allAttr = []
      if(color.length > 0) {
        color = color[0].value;
        for(let i in item.variation) {
          let imagem = '';
          let cor = '';
          for(let j in item.variation[i]){
            if(item.variation[i][j].label == 'Imagem') {
              imagem = item.variation[i][j].value
            }

            if(item.variation[i][j].label == 'Cor') {
              cor = item.variation[i][j].value
            }
          }
          if(cor == color) {
            allAttr.push({imagem, cor});
          }
        }

        let myImage = allAttr.filter(r => {
          if(r.cor == color) {
            return r.imagem
          }
        });

        if(allAttr.length > 0) {
          image = allAttr[0].imagem
        }

      }

      return image
    },

    hideModal (refname) {
      this.$refs[refname].hide()
      console.log('hide modal:: ' + refname)

      if (refname === 'modalnestedinline') {
        this.$refs['modalnested'].show()
      }
    },
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
