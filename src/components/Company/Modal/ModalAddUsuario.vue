<template>
  <div v-if="currentCompany && userSelected >= 0">
    <b-modal id="modaladduser" ref="modaladduser" size="sm" title="Configurar usuário" hide-footer>
        <b-row v-if="currentCompany.users[userSelected]">
          <b-colxx md="12">
            <b-form-group label="Nome" class="has-float-label mb-4">
              <b-form-input v-model="currentCompany.users[userSelected].name" type="text" placeholder="Nome" />
            </b-form-group>
          </b-colxx>

          <b-colxx md="12">
            <b-form-group label="E-mail" class="has-float-label mb-4">
              <b-form-input v-model="currentCompany.users[userSelected].email" type="text" placeholder="E-mail" />
            </b-form-group>
          </b-colxx>

          <b-colxx md="12">
            <b-form-group label="Senha" class="has-float-label mb-4">
              <b-form-input v-model="currentCompany.users[userSelected].password" type="text" placeholder="Senha" />
            </b-form-group>
          </b-colxx>

          <b-colxx md="12">
            <b-form-group label="Reponsável da aprovação (e-mail)" class="has-float-label mb-4">
              <b-form-input v-model="currentCompany.users[userSelected].responsavel" type="text" placeholder="Responsável" />
            </b-form-group>
          </b-colxx>

          <b-colxx md="12">
            <b-form-group label="Setor/cargo" class="has-float-label mb-4">
              <b-form-input v-model="currentCompany.users[userSelected].setor" type="text" placeholder="Setor/cargo" />
            </b-form-group>
          </b-colxx>

          <b-colxx md="12">
            <b-form-group label="Observações" class="has-float-label mb-4">
              <b-form-textarea v-model="currentCompany.users[userSelected].observacao" type="text" placeholder="Observações" />
            </b-form-group>
          </b-colxx>

        </b-row>
        <button @click="() => {currentCompany.users[userSelected].concluido = 1; hideModal('modaladduser')}" class="btn btn-success btn-block">Cadastrar</button>
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
    props:["userSelected"],
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
