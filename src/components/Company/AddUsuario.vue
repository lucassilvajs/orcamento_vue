<template>
  <div>
    <b-card class="mb-4" title="Usuários">
        <b-colxx md="12" lg="12">
            <b-row>
              <b-colxx md="4" lg="4" v-for="(user, index) in currentCompany.users.filter(r => r.concluido !== 0)" :key="index">
                <b-card class="p-2" no-body>
                  <p class="mb-1"><b>Nome: </b>{{user.name}}</p>
                  <p class="mb-1"><b>E-mail: </b>{{user.email}}</p>
                  <p class="mb-1"><b>Cargo/setor: </b>{{user.setor ? user.setor : 'Não adicionado'}}</p>
                  <p class="mb-1"><b>Responsável: </b> <span v-if="!user.responsavel">Não adicionado</span> {{user.responsavel | limit(25)}}</p>
                  <p class="mb-1" v-if="user.observacao"><b>Observações: </b> {{user.observacao | limit(50)}}</p>
                  <div class="d-flex justify-content-end">
                    <button @click="selected = index" class="btn btn-info btn-xs mx-2" v-b-modal.modaladduser><i class="glyph-icon simple-icon-pencil"/></button>
                    <button v-if="currentCompany.users.length > 1" @click="currentCompany.users.splice(index, 1)" class="btn btn-outline-danger btn-xs"><i class="glyph-icon simple-icon-trash"/></button>
                  </div>
                </b-card>
              </b-colxx>
            </b-row>
            <b-row class="mb-4">
              <b-colxx>
                <button @click="() => {currentCompany.users.push({name: '', email: '', password: '', responsavel: '', setor: '', observacao: '', concluido: 0}); selected = currentCompany.users.length-1; }" v-b-modal.modaladduser class="btn btn-outline-success float-right">Adicionar comprador <i class="glyph-icon simple-icon-plus p-0"></i></button>
              </b-colxx>
            </b-row>
        </b-colxx>
    </b-card>

    <modal-add-usuario :userSelected="selected" />
  </div>
</template>

<script>

import ModalAddUsuario from '@/components/Company/Modal/ModalAddUsuario';

import {
    mapGetters,
    mapActions
} from "vuex";

export default {
    components: {
      'modal-add-usuario': ModalAddUsuario

    },
    computed:{
      ...mapGetters(["currentCompany"])
    },
    data(){
      return {
        selected: null
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
