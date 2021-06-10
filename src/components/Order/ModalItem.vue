<template>
    <b-modal id="modallg" size="lg" title="Large Modal" ref="modallg" hide-header hide-footer>
      <button @click="hideModal('modallg')" class="btn-close">
      <i class="glyph-icon simple-icon-close"/>
      </button>
        <div class="row" v-if="product">
          <b-colxx md="6" sm="12" class="d-flex align-items-center">
            <div v-if="false && typeof product.img == 'object' && product.img.length > 1">
              <carousel :perPage="1">
                <slide v-for="(imm, i) in product.img" :key="i">
                  <img class="w-100" :src="baseURL+imm" alt="">
                </slide>
              </carousel>
            </div>
            <img v-else class="w-100" :src="baseURL+product.img" alt="">
          </b-colxx>
          <b-colxx md="6" sm="12">
            <h5>{{product.name}}</h5>
            <p>{{product.description}}</p>
            <h5 class="price text-success">{{product.price + getSelected() | numeroPreco}}</h5>
            <div class="attrs" v-for="(p, i) in product.attributes" :key="i">
              <div class="type-img mb-4" v-if="p.type == 'img'">
                <p class="mb-1"><b>{{p.name}}: </b> {{p.selected.value}}</p>
                <div class="d-flex align-items-start flex-direct-row">
                  <div class="w-100px" :class="{active: p.selected.value == item.value}" v-for="item in p.items.filter(r => !r.no)" :key="item.value" @click="() => {product.img = item.img; p.selected = item}">
                    <img class="w-100" :src="baseURL+item.img" alt="">
                  </div>
                </div>
              </div>
              <div class="type-circle mb-4" v-if="p.type == 'circle'">
                <p class="mb-1"><b>{{p.name}}: </b> {{p.selected.value}}</p>
                <div class="d-flex align-items-start flex-direct-row">
                  <div class="circle-item" :class="{active: item.value == p.selected.value}" v-for="(item, itemIndex) in p.items.filter(r => !r.no)" :key="itemIndex" @click="p.selected = item">
                    {{item.value}}
                  </div>
                </div>
              </div>
            </div>

            <div class="type-qty d-flex justify-content-between align-items-center">
              <div class="control" v-if="typeItem != 'complete'">
                <button class="qty" :disabled="product.qty <= 0" @click="product.qty -= 1">-</button>
                <input readonly type="text" name="" id="" v-model="product.qty">
                <button class="qty" @click="product.qty += 1">+</button>
              </div>
              <button v-if="typeItem == 'complete'" @click="addItem" class="btn btn-success">Prosseguir solicitação</button>
              <button v-else :disabled="product.qty == 0" @click="addToCart" class="btn btn-success">Adicionar ao carrinho <span class="ml-3">{{product.qty * (product.price + getSelected()) | numeroPreco}}</span></button>
            </div>
          </b-colxx>
        </div>
        <div v-else class="d-flex align-items-center justify-content-center">
          <h3>Buscando produto...</h3>
        </div>
    </b-modal>
</template>

<script>

import {
    mapGetters,
    mapActions,
    mapState,
} from "vuex";

import {api, baseURL} from '@/constants/config';
import { Carousel, Slide } from 'vue-carousel';
export default {
    props:["typeItem", "idProduct", "idCompany", "link"],
    components: {
      Carousel,
      Slide
    },
    computed:{
      ...mapGetters(["currentCart"]),
    },
    data(){
      return {
        baseURL,
        product: null,
      }
    },
    methods: {
      ...mapActions(["setItemOrder"]),
      getSelected(){
        let value = 0;
        this.product.attributes.forEach(r => {
          if(r.selected) {
            value += Number(r.selected.price)
          }
        });
        return value
      },

      addToCart(){
        const valida = this.product.attributes.filter(r => r.obrigatorio && !r.selected);
        if(valida.length > 0){
          this.$notify("error", "Opsss", "Você precisa selecionar o(a) " + valida[0].name + " do produto", {
            duration: 5000,
            permanent: false
          });
          return false;
        }

        let {id, name, img, qty} = this.product;
        let price = this.product.price + this.getSelected()
        let item = {id,name,img,qty,price}

        item.attributes = this.product.attributes.map(r => {
          return {
            name: r.name,
            value: r.selected.value
          }
        });

        this.product.qty = 0;
        this.product.attributes = this.product.attributes.map(r =>{
          r.selected = '';
          return r;
        });

        this.$store.dispatch('setItemCart', item);
        this.$notify("success", "Sucesso", "Item adicionado ao carrinho", {
          duration: 5000,
          permanent: false
        });
      },

      isEdit(){
        let {id, name, img, qty} = this.product;
        let price = this.product.price + this.getSelected()
        let item = {id,name,img,qty,price}

        item.attributes = this.product.attributes.map(r => {
          return {
            name: r.name,
            value: r.selected.value
          }
        });

        let isEdit = false;
        console.log('Size: ',this.currentCart.length)
        if(this.currentCart.length > 0) { //Verifica se já exite item no carrinho
          this.currentCart.forEach(r => { // passa por todos os itens do carrinho
            if(JSON.stringify(r.attributes) === JSON.stringify(item.attributes) && r.id == item.id ) { // Verifica se algum item corresponde ao inserido
              isEdit = true; // Confirma que é uma edição

              // if(this.product.qty == 0) this.product.qty = r.qty;
            }
          });
        }
        return isEdit;
      },

      hideModal (refname) {
        this.$refs[refname].hide()
        if (refname === 'modalnestedinline') {
          this.$refs['modalnested'].show()
        }
      },

      somethingModal (refname) {
        this.$refs[refname].hide()


        if (refname === 'modalnestedinline') {
          this.$refs['modalnested'].show()
        }
      },

      addItem(){
        const valida = this.product.attributes.filter(r => r.obrigatorio && !r.selected);
        if(valida.length > 0){
          this.$notify("error", "Opsss", "Você precisa selecionar o(a) " + valida[0].name + " do produto", {
            duration: 5000,
            permanent: false
          });
          return false;
        }

        let {id, name, img, qty} = this.product;
        let price = this.product.price + this.getSelected()
        let item = {id,name,img,qty,price}

        item.attributes = this.product.attributes.map(r => {
          return {
            name: r.name,
            value: r.selected.value
          }
        });
        // console.log(this.product);
        this.product.qty = 0;
        this.product.attributes = this.product.attributes.map(r =>{
          r.selected = '';
          return r;
        });

        item.type = 'product';

        this.setItemOrder(item)
        let base = this.$route.path.indexOf('admin') >= 0 ? '/admin/make/' : '/app/order/';
        this.$router.push(`${base}lens`);
      },

      async getProduct() {
        const data = await api.get(`${this.typeItem == 'complete' ? 'product' : 'distribuicao'}/${this.idProduct}/${this.idCompany}`);
        this.product = data.data.data;
      }
    },
    created(){

    },
    watch: {
      async idProduct(){
        this.product = null;
        await this.getProduct();
      }

    }
}
</script>
<style>
.btn-close{
  background: transparent;
  border: none;
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 2rem;
  color: #aaa;
}

.circle-color {
	width:25px;
	height: 25px;
	border-radius: 50%;
	background: #a00
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

</style>
