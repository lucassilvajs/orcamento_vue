<template>
  <div>
    <b-card class="mb-4" title="Informações adicionais e flags" v-if="currentCompany">
      <b-row>
        <b-colxx md="4" lg="3">
          <div v-for="(flag, iFlag) in flags" :key="iFlag">
            <b-form-checkbox class="ml-3 mb-3" v-model="currentCompany[flag.slug]" name="check-button" switch>{{flag.name}}</b-form-checkbox>
            <b-form-group v-if="currentCompany.multiple_order == 1 && flag.slug == 'multiple_order'" label="Período de envio" class="has-float-label mb-4">
              <b-form-input v-model="currentCompany.days_sent" type="text" placeholder="Nome da empresa" />
            </b-form-group>
          </div>
        </b-colxx>
        <b-colxx lg="9">
          <b-row>
            <b-colxx md="6" lg="6" v-if="transporte">
              <b-form-group label="Método de envio" class="has-float-label mb-4">
                <select class="form-control" v-model="currentCompany.envio">
                  <option v-for="(pay, indexPay) in transporte" :key="pay" :value="indexPay">{{pay}}</option>
                </select>
              </b-form-group>
            </b-colxx>
            <b-colxx md="6" lg="6">
              <vue-dropzone
                  @vdropzone-complete="completeUpload"
                  ref="myVueDropzone" id="dropzone" class="w-100" :options="dropzoneOptions">
              </vue-dropzone>
            </b-colxx>
          </b-row>
        </b-colxx>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import {Money} from '@/vmoney.js';
import {TheMask} from 'vue-the-mask';
import VueDropzone from 'vue2-dropzone';
import {api, baseURL} from '@/constants/config';
import {
    mapGetters,
    mapActions
} from "vuex";

export default {
    props: ["transporte"],
    components: {
      Money,
      TheMask,
      'vue-dropzone': VueDropzone,
    },
    computed:{
      ...mapGetters(["currentCompany"]),
        dropzoneOptions: function() {
          const token = window.localStorage.getItem('token');
          return {
            url: `${baseURL}saveFile/company`,
            thumbnailWidth: 150,
            maxFilesize: 1,
            headers: { "X-Auth-Token": token },
            dictDefaultMessage: "Clique ou arraste para adicionar uma imagem",
            previewTemplate: this.dropzoneTemplate(),
            maxFiles: 1
          }
        }
    },
    data(){
      return {
        flags: [
          {name: 'Empresa com contrato', slug: 'has_contract'},
          {name: 'Pedido de compra', slug: 'pedido_compra'},
          {name: 'Multiplos pedidos', slug: 'multiple_order'},
          {name: 'PDF Anexo', slug: 'attachment'}
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
      dropzoneTemplate() {
        return `<div class="dz-preview dz-file-preview mb-3">
              <div class="d-flex flex-row "> <div class="p-0 w-30 position-relative">
                  <div class="dz-error-mark"><span><i></i>  </span></div>
                  <div class="dz-success-mark"><span><i></i></span></div>
                  <div class="preview-container">
                    <img data-dz-thumbnail class="img-thumbnail border-0" />
                    <i class="simple-icon-doc preview-icon"></i>
                  </div>
              </div>
              <div class="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative">
                <div> <span data-dz-name /> </div>
                <div class="text-primary text-extra-small" data-dz-size /> </div>
                <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                <div class="dz-error-message"><span data-dz-errormessage></span></div>
              </div>
              <a href="#" class="remove" data-dz-remove> <i class="glyph-icon simple-icon-trash"></i> </a>
            </div>`
        },
        completeUpload(file) {
            this.currentCompany.image = JSON.parse(file.xhr.response).data;
        },
    },
    watch: {

    }
}
</script>

<style>

</style>
