<template>
  <div>
    <h3 class="form-label mb-0">Anexos inseridos</h3>
    <vue-dropzone class="mb-3" @vdropzone-complete="completeUpload" ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" />
    <div>
      <div class="d-flex justify-content-between my-2" v-for="(a,i) in attachment" :key="i">
        <a href="#">
          <i class="glyph-icon iconsminds-file"></i> c4ca4238a0b923820dcc509a6f75849b.jpg
        </a>
        <button class="btn btn-danger btn-xs"><i class="glyph-icon simple-icon-trash"></i></button>
      </div>
      <b-alert v-if="!attachment" show variant="info">Nenhuma anexo foi inserido</b-alert>
    </div>
  </div>

</template>

<script>
import {TheMask} from 'vue-the-mask';
import {Money} from '@/vmoney.js';
import VueDropzone from 'vue2-dropzone';
import {api, baseURL, firebaseConfig} from '@/constants/config';

export default {
    props: ['attachment'],
    components: {
      TheMask,
      Money,
      'vue-dropzone': VueDropzone
    },
    computed: {
        dropzoneOptions: function() {
        const token = window.localStorage.getItem('token');
        return {
          url: `${baseURL}saveFile/crm`,
          thumbnailWidth: 150,
          headers: { "X-Auth-Token": token },
          dictDefaultMessage: "Arraste ou clique para adicionar",
          previewTemplate: this.dropzoneTemplate(),
        }
      },
    },
    methods: {
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
        this.file = file;
        this.saveProduct.image = JSON.parse(file.xhr.response).data;
      },
    },
    watch: {
    }
}
</script>
<style>

</style>
