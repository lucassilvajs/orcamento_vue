<template>
  <div>
    <b-card class="mb-4" title="Informações de pagamento">
      <b-row>
        <b-colxx md="4" lg="3">
          <b-form-group label="Forma de pagamento" class="has-float-label mb-4">
            <select v-if="pagamento" class="form-control" v-model="currentCompany.pagamento">
              <option v-for="(pay, indexPay) in pagamento" :key="indexPay" :value="indexPay">{{pay}}</option>
            </select>
          </b-form-group>
        </b-colxx>
        <b-colxx md="4" lg="3">
          <b-form-group label="Condição de pagamento" class="has-float-label mb-2">
            <b-form-input v-model="currentCompany.paymentCondition" type="text" placeholder="Condição de pagamento" />
          </b-form-group>
          <b-alert variant="info" show  dismissible>Parcelas e prazo. Ex: 30, 60, 90 dias</b-alert>
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
    props: ["pagamento"],
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
