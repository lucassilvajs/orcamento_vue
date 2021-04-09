<template>
  <div>
    <b-card class="mb-4" title="Selecione o item">
			<b-row v-if="products">
				<b-colxx md="4" lg="3" v-for="(pro, i) in products" :key="i" v-b-modal.modallg>
					<b-card @click="product = pro" class="mb-4" style="border:1px solid rgba(100,100,100,.5); border-radius:6px" no-body>
						<div class="position-relative">
              <img :src="pro.image" alt="" class="card-img-top">
						</div>
						<b-card-body>
							<form @submit.prevent="setProduct(pro)">
                <h6 class="name-product">{{pro.name}}</h6>
                <p class="text-muted">{{pro.description}}</p>
                <h5 class="price text-success">{{pro.price | numeroPreco}}</h5>
							</form>
						</b-card-body>
					</b-card>
				</b-colxx>
			</b-row>
			<b-row v-else class="align-items-center justify-content-center text-center">
				<h2>Buscando produtos...</h2>
			</b-row>
    </b-card>

    <button v-b-modal.cart v-if="distribuidor" class="btn btn-success btn-cart">
      <i class="iconsminds-shopping-cart"></i>
      <div class="myBadge-danger" v-if="distribuidorCard.length">{{distribuidorCard.length}}</div>
    </button>

    <b-modal id="cart" ref="cart" title="Carrinho">
      <table class="table table-striped">
        <thead>
          <tr>
            <th></th>
            <th>Nome</th>
            <th>Quantidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in products.filter(r=> r.qty > 0)" :key="index">
            <td><img class="w-100px" :src="item.image" alt=""></td>
            <td>{{item.name}}</td>
            <td>{{item.qty}}</td>
            <td>
              <button class="btn btn-xs btn-danger">
                <i class="simple-icon-trash" @click="item.qty = 0" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <template slot="modal-footer">
        <b-button variant="secondary" @click="hideModal('cart')">Fechar</b-button>
        <b-button variant="primary" @click="finalizarPedido()" class="mr-1">Finalizar pedido</b-button>
      </template>
    </b-modal>

    <modalItem  />

  </div>
</template>

<script>
import myBreadCrumb from '@/components/breadcrumb';
import modalItem from '@/components/Order/ModalItem';
import {api, baseURL} from '@/constants/config';
export default {
	data() {
		return {
      baseURL,
      distribuidor: false,
      distribuidorCard: [],
      inCart: [],
      product: null,
      products: [
        {
          image: 'http://localhost/orcamento_api/public/upload/product/spray.png',
          name: 'SPRAY ANTIEMBAÇANTE 15ML',
          description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae adipisci laboriosam iure rem atque',
          price: 15,
          qty: 0,
          attributes: [
            {
              name: 'Quantidade',
              type: 'circle',
              items: [
                {
                  value: '15 ml',
                  price: 0
                },
                {
                  value: '30 ml',
                  price: 5
                },
                {
                  value: '100 ml',
                  price: 15
                },
              ],
              selected: ''
            },
          ]
        },
        {
          image: 'http://localhost/orcamento_api/public/upload/product/a94292edae5c2939ae6460e10ffbeaf4.jpeg',
          name: 'ARMAÇÃO EPI 101 R',
          description: 'Proteção total com ajuste de haste retrátil e fendas para ventilação. Armação e hastes injetadas em polímero de alta resistência.',
          price: 69,
          qty: 0,
          attributes: [
            {
              name: 'Tamanho',
              type: 'circle',
              items: [
                {
                  value: '52',
                  price: 0
                },
                {
                  value: '56',
                  price: 0
                },
              ],
              selected: ''
            },
            {
              name: 'Cor',
              type: 'img',
              selected: '',
              items: [
                {
                  img: 'http://localhost/orcamento_api/public/upload/product/a94292edae5c2939ae6460e10ffbeaf4.jpeg',
                  value: 'Cristal',
                  price: 0
                },
                {
                  img: 'http://localhost/orcamento_api/public/upload/product/a94292edae5c2939ae6460e10ffbeaf41.jpeg',
                  value: 'Fume',
                  price: 0
                },
                {
                  img: 'http://localhost/orcamento_api/public/upload/product/a94292edae5c2939ae6460e10ffbeaf42.jpeg',
                  value: 'Branco',
                  price: 5
                },
              ]
            }
          ]
        },
      ]
		}
	},
    components: {
        'my-breadcrumb': myBreadCrumb,
        modalItem
	},
	methods: {
    addProductToCard(item){
      console.log(item)
      let attr = [];
        for(let i in item) {
          if(i.indexOf('items_') >= 0) {
            attr.push({attr: i.replace('items_', ''), value: item[i]})
          }
        }

      attr.push({attr: 'model', value: item.information.pro_id});
      attr.push({attr: 'nome', value: item.information.pro_name});
      attr.push({attr: 'qtd', value: item.qtd});

      this.$notify("success", 'Sucesso', "Item adicionado com sucesso", {
          duration: 3000,
          permanent: false
      });

      this.distribuidorCard.push(attr);


    },

    finalizarPedido(){
        let order = JSON.parse(window.localStorage.getItem('order'));
        order.distribuidorCard = this.distribuidorCard
        order = JSON.stringify(order);
        console.log(order)
        window.localStorage.setItem('order', JSON.stringify({type_user: 'distribuidor', distribuidorCard: this.distribuidorCard}));

        this.$router.push("/app/order/confirmation");
    },

		setProduct: function (item) {
      if(this.distribuidor) {
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
        this.$router.push("/app/order/lens");
      }


		},

		getProducts: async function()
		{
      let order = JSON.parse(window.localStorage.getItem('order'));
      let user = JSON.parse(window.localStorage.getItem('user'));

      if(user.user.distribuidor == '1') {
        if(order.distribuidorCard) {
          this.distribuidorCard = order.distribuidorCard
        }
      }

      this.distribuidor = true;

			// const products = await api.get(`/products/1730`);
			// this.products = products.data
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
    somethingModal (refname) {
      this.$refs[refname].hide()
      console.log('something modal:: ' + refname)

      if (refname === 'modalnestedinline') {
        this.$refs['modalnested'].show()
      }
    },
    getProductModal(index){
      this.product = this.products[index];
      console.log(index)
    },
    getSelected(){
      let value = 0;
      this.product.attributes.forEach(r => {
        if(r.selected) {
          console.log(Number(r.selected.price))
          value += Number(r.selected.price)
        }
      });

      return value
    },
    addToCard(){

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

h5.price {
  font-size: 1rem;
}

h6.name-product {

}

.modal-header{
  display: none !important;
}

.w-100px {
  display: flex;
  align-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border: 1px solid #aaa;
  border-radius: 7px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.w-100px:hover, .w-100px.active, .circle-item:hover, .circle-item.active {
  border: solid rgb(0, 172, 149);
  cursor: pointer;
}

.circle-item {
  width: 55px;
  height: 55px;
  border: 2px solid #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  margin-right: 5px;
  margin-bottom: 5px;
}

button.qty {
  background: transparent;
  border: 1px solid #aaa;
  width: 25px;
  height: 25px;
  border-radius: 50%;
}
button.qty:hover, button.qty:active {
  border: 1px solid rgb(0, 172, 149);
}

.control input[type="text"]{
  width: 35px;
  border: 0;
  text-align: center;
  font-weight: bold;
}
</style>
