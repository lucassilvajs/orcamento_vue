<template>
  <div>
    <my-breadcrumb :distribuidor="distribuidor" />
     <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" title="Selecione o item">
          <b-row v-if="products">
            <b-colxx md="4" lg="3" v-for="(pro, i) in products" :key="i" v-b-modal.modallg>
              <CardProduct :product="pro" />
            </b-colxx>
          </b-row>
          <b-row v-else class="align-items-center justify-content-center text-center">
            <h2>Buscando produtos...</h2>
          </b-row>
        </b-card>
      </b-colxx>
    </b-row>

    <ModalItem typeItem="complete" />


  </div>
</template>

<script>
import myBreadCrumb from '@/components/breadcrumb';
import CardProduct from '@/components/Order/CardProduct';
import ModalItem from '@/components/Order/ModalItem';

import {api, baseURL} from '@/constants/config';
export default {
	data() {
		return {
			products: [
        {
          image: 'https://api.idsafety.com.br/public/upload/product/spray.png',
          name: 'SPRAY ANTIEMBAÇANTE 15ML',
          description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae adipisci laboriosam iure rem atque',
          price: 15,
          id: 1,
        },
        {
          image: 'https://api.idsafety.com.br/public/upload/product/spray.png',
          name: 'SPRAY ANTIEMBAÇANTE 15ML',
          description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae adipisci laboriosam iure rem atque',
          price: 15,
          id: 2,
        }
      ],
      baseURL,
      distribuidor: false,
      distribuidorCard: []
		}
	},
  components: {
    'my-breadcrumb': myBreadCrumb,
    CardProduct,
    ModalItem
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
        this.distribuidor = true;

      }

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
			const products = await api.get(`/products/${company}`);
			this.products = products.data
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
		// this.getProducts();
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
