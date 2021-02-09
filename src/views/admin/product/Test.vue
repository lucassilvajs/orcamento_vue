<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <h1>Validação de produto</h1> <router-link to="/admin/order" class="float-right btn btn-sm btn-outline-success">Voltar</router-link>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row class="mb-5">
    <b-colxx xxs="12">
      <b-card class="mb-4">
        <b-row>
          <b-colxx xxs="12">
            {{image}}
            <vue-dropzone @vdropzone-complete="completeUpload" ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" />
          </b-colxx>
          <b-colxx class="mt-3">
            <b-input-group class="mb-3">
                <b-form-input v-model="referenciaAux" />
                <b-input-group-append>
                    <b-button @click="referencia = referenciaAux" variant="outline-secondary">Testar nova referência</b-button>
                    <b-button @click="saveReference(referencia)" variant="outline-success">Salvar referência</b-button>
                </b-input-group-append>
            </b-input-group>
          </b-colxx>
          <b-colxx md="12">
            <iframe v-if="image" :src="`${baseURL}test/${image.split('/').pop()}/${product}?size=${referencia}`" frameborder="0" style="width:100%; height:1000px;"></iframe>
          </b-colxx>
        </b-row>
      </b-card>
    </b-colxx>
  </b-row>
</div>
</template>
<script>
import { api, baseURL } from '@/constants/config'
import VueDropzone from 'vue2-dropzone';
export default {
  components: {
    'vue-dropzone': VueDropzone,
  },
  data () {
    return {

      referencia: 0,
      image: '', //Imagem cadastrada para teste
      file: null,
      baseURL,
      items: null,
      data: null,
      order: null,
    }
  },
  computed: {
    dropzoneOptions: function() {
      const token = window.localStorage.getItem('token');
      return {
          url: `${baseURL}saveFile/test`,
          thumbnailWidth: 150,
          headers: { "X-Auth-Token": token },
          dictDefaultMessage: "Adicionar imagem para teste",
          previewTemplate: this.dropzoneTemplate(),
      }
    },
    product(){
      return this.$route.params.id
    }
  },
  methods: {
    completeUpload(file) {
      this.file = file;
      this.image = JSON.parse(file.xhr.response).data;
    },
    async saveReference(reference){
        const data = await api.put(`admin/test/${this.product}`, {internal: reference});
        this.$notify("success", "Sucesso!", "Você precisa inserir uma imagem e o nome da cor", {
          duration: 3000,
          permanent: false
        });
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
    }
  },
  created(){
  }
}
</script>
