<template>
  <div>
    <b-card class="mb-4" title="Produtos especifícos">
        <b-alert variant="info" fade show dismissible>Os produtos cadastrados aqui vão aparecer apenas para essa empresa!</b-alert>
        <b-row v-for="(product, index) in currentCompany.newProduct" :key="index">
          <b-colxx md="4" lg="3">
            <b-form-group label="Nome do Produto" class="has-float-label mb-4">
              <b-form-input v-model="product.name" type="text" placeholder="Nome do Produto" />
            </b-form-group>
          </b-colxx>
          <b-colxx md="4" lg="3">
            <b-form-group label="Preço" class="has-float-label mb-4">
              <fieldset class="form-group has-float-label mb-4">
                <legend tabindex="-1" class="bv-no-focus-ring col-form-label pt-0">Preço</legend>
                <div tabindex="-1" role="group" class="bv-no-focus-ring">
                    <Money class="form-control" v-model="product.price" v-bind="{ decimal: ',',thousands: '.',prefix: 'R$ ',suffix: '',precision: 2,masked: true,}"/>
                </div>
              </fieldset>
            </b-form-group>
          </b-colxx>
          <b-colxx md="4" lg="3">
            <b-form-group>
              <select class="form-control" v-model="product.type">
                <option value="">Tipo do produto</option>
                <option value="2">Lente</option>
                <option value="3">Diopmetria</option>
                <option value="4">Tratamento</option>
              </select>
            </b-form-group>
          </b-colxx>
          <b-colxx md="4" lg="3">
            <button class="btn btn-outline-danger float-right" @click="currentCompany.newProduct.splice(index, 1)"><i class="glyph-icon simple-icon-trash p-0"></i></button>
          </b-colxx>
        </b-row>
        <b-row>
          <b-colxx>
            <button class="btn btn-outline-success float-right " @click="currentCompany.newProduct.push({name: '', type: '', price: ''})">Adicionar produto <i class="glyph-icon simple-icon-plus p-0"></i></button>
          </b-colxx>
        </b-row>
    </b-card>
  </div>
</template>

<script>
import {Money} from '@/vmoney.js';

import {
    mapGetters,
    mapActions
} from "vuex";

export default {
    components: {
      Money
    },
    computed:{
      ...mapGetters(["currentCompany"])
    },
    data(){
      return {
        newProduct:[
          {
            name: '',
            type: '',
            price: ''
          }
        ],
      }
    },
    methods: {
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
    },
    watch: {

    }
}
</script>

<style>

</style>
