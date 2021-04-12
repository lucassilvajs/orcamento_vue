<template>
  <div class="no-header">
    <b-modal id="modallg" size="lg" title="Large Modal" ref="modallg" hide-footer>
      <button @click="hideModal('modallg')" class="btn-close">
      <i class="glyph-icon simple-icon-close"/>
      </button>
        <div class="row" v-if="product">
          <b-colxx md="6" sm="12" class="d-flex align-items-center">
            <div v-if="img && img.length > 1">
              <carousel :perPage="1">
                <slide v-for="(imm, i) in img" :key="i">
                  <img class="w-100" :src="imm" alt="">
                </slide>
              </carousel>
            </div>
            <img v-else class="w-100" :src="img ? img : product.image" alt="">
          </b-colxx>
          <b-colxx md="6" sm="12">
            <h5>{{product.name}}</h5>
            <p>{{product.description}}</p>
            <h5 class="price text-success">{{product.price + getSelected() | numeroPreco}}</h5>

            <div class="attrs" v-for="(p, i) in product.attributes" :key="i">

              <div class="type-img mb-4" v-if="p.type == 'img'">
                <p class="mb-1"><b>{{p.name}}: </b> {{p.selected.value}}</p>
                <div class="d-flex align-items-start flex-direct-row">
                  <div class="w-100px" :class="{active: p.selected.value == item.value}" v-for="item in p.items" :key="item.value" @click="() => {img = item.img; p.selected = item}">
                    <img class="w-100" :src="item.img[0]" alt="">
                  </div>
                </div>
              </div>

              <div class="type-circle mb-4" v-if="p.type == 'circle'">
                <p class="mb-1"><b>{{p.name}}: </b> {{p.selected.value}}</p>
                <div class="d-flex align-items-start flex-direct-row">
                  <div class="circle-item" :class="{active: item.value == p.selected.value}" v-for="item in p.items" :key="item" @click="p.selected = item">
                    {{item.value}}
                  </div>
                </div>
              </div>

            </div>
            <div class="type-qty d-flex justify-content-between align-items-center">
              <div class="control">
                <button class="qty" :disabled="product.qty <= 0" @click="product.qty -= 1">-</button>
                <input readonly type="text" name="" id="" v-model="product.qty">
                <button class="qty" @click="product.qty += 1">+</button>
              </div>
              <button @click="addToCart" class="btn btn-success">Adicionar ao carrinho <span class="ml-3">{{product.qty * (product.price + getSelected()) | numeroPreco}}</span></button>
            </div>
          </b-colxx>
        </div>
        <div v-else class="d-flex align-items-center justify-content-center">
          <h3>Buscando produto...</h3>
        </div>
    </b-modal>
  </div>
</template>

<script>
import {
    mapGetters,
    mapActions,
} from "vuex";
import { Carousel, Slide } from 'vue-carousel';
export default {
    components: {
      Carousel,
      Slide
    },
    computed:{
      ...mapGetters(["cart"])
    },
    data(){
      return{
        id: 1, //Vem da prop
        img: null,
        product: {
          image: 'https://api.idsafety.com.br/public/upload/product/a94292edae5c2939ae6460e10ffbeaf4.jpeg',
          name: 'ARMAÇÃO EPI 101 R',
          description: 'Proteção total com ajuste de haste retrátil e fendas para ventilação. Armação e hastes injetadas em polímero de alta resistência.',
          price: 69,
          qty: 0,
          attributes: [
            {
              obrigatorio: true,
              name: 'Tamanho',
              type: 'circle',
              items: [
                {
                  value: '52',
                  price: 0
                },
                {
                  value: '56',
                  price: 5
                },
              ],
              selected: ''
            },
            {
              obrigatorio: true,
              name: 'Cor',
              type: 'img',
              selected: '',
              items: [
                {
                  img: ['https://api.idsafety.com.br/public/upload/product/a94292edae5c2939ae6460e10ffbeaf4.jpeg', 'https://api.idsafety.com.br/public/upload/product/a94292edae5c2939ae6460e10ffbeaf41.jpeg'],
                  value: 'Cristal',
                  price: 0
                },
                {
                  img: ['https://api.idsafety.com.br/public/upload/product/a94292edae5c2939ae6460e10ffbeaf41.jpeg'],
                  value: 'Fume',
                  price: 0
                },
                {
                  img: ['https://api.idsafety.com.br/public/upload/product/a94292edae5c2939ae6460e10ffbeaf42.jpeg'],
                  value: 'Branco',
                  price: 5
                },
              ]
            }
          ]
        },
      }
    },
    methods: {
      ...mapActions(["setItemCart"]),
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
      addToCart(){
        this.$store.dispatch('setItemCart');
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
      }
    },
    watch: {
    }
}
</script>
<style scoped>
.btn-close{
  background: transparent;
  border: none;
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 2rem;
  color: #aaa;
}
</style>
