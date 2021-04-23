<template>
  <div>
    <b-card class="mb-4" title="Tabela de preços dinamica">
      <div class="alert alert-info">Para manter o preço original você pode deixar o campo do valor zerado</div>
      <fieldset v-for="(cat, index) in currentCompany.allProducts.products" :key="index">
        <legend>{{currentCompany.allProducts.attrs[index]}}</legend>
        <b-row>
            <b-colxx md="3" lg="3" v-for="(pro, iPro) in cat" :key="iPro">
                <div>
                  {{pro.name}}
                  <b-input-group class="mb-3">
                      <Money class="form-control" v-model="pro.value" :disabled="true" v-bind="{ decimal: ',',thousands: '.',prefix: 'R$ ',suffix: '',precision: 2,masked: false,}"/>
                      <Money class="form-control" v-model="pro.valueD" v-bind="{ decimal: ',',thousands: '.',prefix: 'R$ ',suffix: '',precision: 2,masked: false,}"/>
                  </b-input-group>
                </div>
            </b-colxx>
        </b-row>
      </fieldset>
    </b-card>
  </div>
</template>

<script>
import {Money} from '@/vmoney.js';
import {TheMask} from 'vue-the-mask';

import {
    mapGetters,
    mapActions
} from "vuex";

export default {
    components: {
      Money,
      TheMask
    },
    computed:{
      ...mapGetters(["currentCompany"])
    },
    data(){
      return {
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
