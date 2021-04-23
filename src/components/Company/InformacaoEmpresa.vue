<template>
  <div v-if="currentCompany">
    <b-card class="mb-4" title="Informações da empresa">
      <b-row>
          <b-colxx md="4" lg="3">
            <b-form-group label="CNPJ" class="has-float-label mb-4">
                <the-mask class="form-control " v-model="currentCompany.cnpj" :mask="['###.###.###-##', '##.###.###/####-##']" />
            </b-form-group>
          </b-colxx>
          <b-colxx md="4" lg="3">
              <b-form-group label="Razão Social" class="has-float-label mb-4">
                  <b-form-input v-model="currentCompany.name" type="text" placeholder="Razão Social" />
              </b-form-group>
          </b-colxx>
          <b-colxx md="4" lg="3">
              <b-form-group label="Nome fantasia" class="has-float-label mb-4">
                  <b-form-input v-model="currentCompany.fantasia" type="text" placeholder="Nome fantasia" />
              </b-form-group>
          </b-colxx>
          <b-colxx md="4" lg="3">
              <b-form-group label="Inscrição Estadual / RG" class="has-float-label mb-4">
                  <b-form-input v-model="currentCompany.ie_rg" type="text" placeholder="IE / RG" />
              </b-form-group>
          </b-colxx>
          <b-colxx md="4" lg="3">
              <b-form-group label="E-mail(s) para aprovar/reprovar" class="has-float-label mb-4">
                  <b-form-input v-model="currentCompany.email" type="text" placeholder="E-mail" />
              </b-form-group>
          </b-colxx>
          <b-colxx md="4" lg="3" v-if="consultores">
              <b-form-group label="Vendedor" class="has-float-label mb-4">
                <select class="form-control" v-model="currentCompany.vendedor">
                  <option v-for="(consult, consultIndex) in consultores" :key="consultIndex" :value="consult.vendedor">{{consult.vendedor}}</option>
                </select>
              </b-form-group>
          </b-colxx>
          <b-colxx md="4" lg="3">
              <b-form-group label="E-mail NF" class="has-float-label mb-4">
                  <b-form-input v-model="currentCompany.email_nf" type="text" placeholder="E-mail NF" />
              </b-form-group>
          </b-colxx>
          <b-colxx md="4" lg="3">
              <b-form-group label="Telefone" class="has-float-label mb-4">
                  <the-mask class="form-control" v-model="currentCompany.fone" :mask="['(##) ####-####']" placeholder="Telefone" />
              </b-form-group>
          </b-colxx>
          <b-colxx md="4" lg="3">
              <b-form-group label="Celular" class="has-float-label mb-4">
                  <the-mask class="form-control" v-model="currentCompany.celular" :mask="['(##) # ####-####']" placeholder="Telefone" />
              </b-form-group>
          </b-colxx>
          <b-colxx md="4" lg="3">
              <b-form-group label="Informação do contato" class="has-float-label mb-4">
                  <b-form-input v-model="currentCompany.informacaoContato" type="text" placeholder="Informação do contato" />
              </b-form-group>
          </b-colxx>
          <b-colxx md="4" lg="3">
            <b-form-group label="Contribuinte" class="has-float-label mb-4">
              <select class="form-control" v-model="currentCompany.contribuinte">
                <option value="1">Contribuinte do ICMS</option>
                <option value="2">Contribuinte isento do ICMS</option>
                <option value="9">Não contribuinte</option>
              </select>
            </b-form-group>
          </b-colxx>
          <b-colxx md="4" lg="3">
              <b-form-group label="Campos para criação de pedido" class="has-float-label mb-2">
                  <input-tag v-model="currentCompany.fields"></input-tag>
              </b-form-group>
          </b-colxx>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import {Money} from '@/vmoney.js';
import {TheMask} from 'vue-the-mask';
import InputTag from '@/components/Form/InputTag'
import {api, baseURL} from '@/constants/config';
import {
    mapGetters,
    mapActions
} from "vuex";

export default {
    components: {
      Money,
      TheMask,
      InputTag
    },
    computed:{
      ...mapGetters(["currentCompany"])
    },
    data(){
      return {
        consultores: {}
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
      async getConsultores(){
        const consultores = await api.get('admin/consult');
        this.consultores = consultores.data.data.consult;
      },
    },
    async created() {
      await this.getConsultores();
    }
}
</script>

<style>

</style>
