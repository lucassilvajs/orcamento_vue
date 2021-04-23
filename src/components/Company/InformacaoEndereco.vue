<template>
  <div>
    <b-card class="mb-4" title="Informações de endereço">
      <b-row>
        <b-colxx md="4" lg="3">
          <b-form-group label="CEP" class="has-float-label mb-4">
            <the-mask class="form-control" v-model="currentCompany.cep" @keyup.native="buscarCep"  :mask="['#####-###']" placeholder="CEP" />
          </b-form-group>
        </b-colxx>
        <b-colxx md="4" lg="3">
          <b-form-group label="Endereço" class="has-float-label mb-4">
            <b-form-input v-model="currentCompany.endereco" type="text" placeholder="Endereço" />
          </b-form-group>
        </b-colxx>
        <b-colxx md="4" lg="3">
          <b-form-group label="Número" class="has-float-label mb-4">
            <b-form-input v-model="currentCompany.numero" type="text" placeholder="Número" ref="numero"/>
          </b-form-group>
        </b-colxx>
        <b-colxx md="4" lg="3">
          <b-form-group label="Complemento" class="has-float-label mb-4">
            <b-form-input v-model="currentCompany.complemento" type="text" placeholder="Complemento" />
          </b-form-group>
        </b-colxx>
        <b-colxx md="4" lg="3">
          <b-form-group label="Bairro" class="has-float-label mb-4">
            <b-form-input v-model="currentCompany.bairro" type="text" placeholder="Bairro" />
          </b-form-group>
        </b-colxx>
        <b-colxx md="4" lg="3">
          <b-form-group label="Cidade" class="has-float-label mb-4">
            <b-form-input v-model="currentCompany.cidade" type="text" placeholder="Cidade" />
          </b-form-group>
        </b-colxx>
        <b-colxx md="4" lg="3">
          <b-form-group label="UF" class="has-float-label mb-4">
            <b-form-input v-model="currentCompany.uf" type="text" placeholder="UF" />
          </b-form-group>
        </b-colxx>
      </b-row>
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
      ...mapActions(["buscarCep"]),
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
