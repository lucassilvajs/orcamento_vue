<template>
  <div>
<!-- Tabela de preços para clientes distribuidores -->
    <b-card class="mb-4" title="Itens restritos" v-if="currentCompany.allProducts.products">
      <b-alert show variant="info" dismissible>Selecione os itens que deseja <b>restringir</b> de acordo com a categoria de compra.</b-alert>
      <fieldset v-for="(productCat, iAll) in currentCompany.allProducts.products" :key="iAll">
        <legend>{{currentCompany.allProducts.attrs[iAll]}}</legend>
        <b-row>
          <b-colxx class="mb-4" md="3" lg="3" v-for="(pro, index) in productCat" :key="index" >
            <b-card no-body class="p-3">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <span class="text-muted">{{pro.name}}</span>
              </div>
              <div>
                <b-form-checkbox class="ml-3" v-model="pro.restrito.completo" name="check-button" switch>Óculos completo</b-form-checkbox>
                <b-form-checkbox class="ml-3" v-model="pro.restrito.distribuicao" name="check-button" switch>Distribuição</b-form-checkbox>
                <button type="button" v-if="pro.attrs.length" @click="productSelected = [iAll, index]" v-b-modal.modalsm class="btn btn-link text-center btn-xs">Clique aqui para parametrizar atributos</button>
              </div>
            </b-card>
          </b-colxx>
        </b-row>
      </fieldset>
    </b-card>

    <ModalSettingRestriction :productSelected="productSelected" />

  </div>
</template>

<script>

import ModalSettingRestriction from '@/components/Company/Modal/ModalSettingRestriction';
import {Money} from '@/vmoney.js';
import {TheMask} from 'vue-the-mask';

import {
    mapGetters,
    mapActions
} from "vuex";

export default {
    components: {
      Money,
      TheMask,
      ModalSettingRestriction
    },
    computed:{
      ...mapGetters(["currentCompany"])
    },
    data(){
      return {
        productSelected: null
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
