<template>
  <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>
</template>

<script>

import vue2Dropzone from 'vue2-dropzone'
import {baseURL, api} from '@/constants/config'
// import 'vue2-dropzone/dist/vue2Dropzone.min.css'
export default {
  name: 'app',
  components: {
    vueDropzone: vue2Dropzone
  },
  data: function () {
    return {
      dropzoneOptions
    }
  },
  computed: {
    dropzoneOptions: function() {
      return {
          url: `${baseURL}saveFile/product`,
          thumbnailWidth: 150,
          maxFilesize: 0.5,
          headers: { "X-Auth-Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9pZHNhZmV0eS5vcmNhbWVudG8uYXBpXC8iLCJhdWQiOiJodHRwOlwvXC9pZHNhZmV0eS5vcmNhbWVudG8uYXBpXC8iLCJpYXQiOjE1ODM3ODY4NzYsInN1YiI6IjEifQ.ibivQLa83xBgEXEoqOI0TMF6xHpY4_kXxzJr-qeFIuI' },
          dictDefaultMessage: "Adicionar Imagem do produto"
      }
    }
  }
}
</script>

<style>
</style>
