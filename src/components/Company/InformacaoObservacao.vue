<template>
  <div>
    <b-card class="mb-4" title="Observações">
      <b-row>
        <b-colxx>
          <b-form-group label="Observações" class="has-float-label mb-2">
            <b-form-textarea v-model="currentCompany.observacao" type="text" placeholder="Observações" />
          </b-form-group>
          <b-alert variant="info" show  dismissible>Informações de <b>pagamento e forma de entrega</b> são concatenados automaticamente, ou seja, não é necessário preencher no campo de observações</b-alert>
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
