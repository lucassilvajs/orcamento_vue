<template>
  <div v-if="currentCompany && productSelected">
    <b-modal id="modalsm" ref="modalsm" hide-footer :title="currentCompany.allProducts.products[productSelected[0]][productSelected[1]].name">
        <b-row v-for="(a, ia) in currentCompany.allProducts.products[productSelected[0]][productSelected[1]].attrs" :key="ia" class="mt-0">
            <b-colxx md="12" lg="12" class="p-0">
              <h6 class="d-flex align-items-center justify-content-between"><b>{{a.label}}: </b></h6>
            </b-colxx>
            <b-colxx md="6" class="px-2 mb-4" v-for="(val, indexVal) in a.values" :key="indexVal">
                <span class="mb-1 font-weight-bold">{{val.label}} </span>
                <b-form-checkbox class="mb-1" v-model="val.restrito.completo" name="check-button" switch>Óculos Completo</b-form-checkbox>
                <b-form-checkbox class="mb-1" v-model="val.restrito.distribuicao" name="check-button" switch>Distribuição</b-form-checkbox>
            </b-colxx>
        </b-row>
        <button class="btn btn-success btn-block" @click="hideModal('modalsm')">Concluído</button>
    </b-modal>
  </div>
</template>

<script>
import InputTag from '@/components/Form/InputTag'

import {
    mapGetters,
    mapActions
} from "vuex";

export default {
    props:["productSelected"],
    components: {
      InputTag
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
