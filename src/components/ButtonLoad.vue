<template>
  <b-button variant="success" :disabled="processing" :class="{'mb-3 btn-multiple-state btn-shadow ml-3': true,
      'show-spinner': processing,
      'show-success': !processing && error===false,
      'show-fail': !processing && error }">
      <span class="spinner d-inline-block">
          <span class="bounce1"></span>
          <span class="bounce2"></span>
          <span class="bounce3"></span>
      </span>
      <span class="icon success">
          {{message}}
      </span>
      <span class="icon fail">
          <i class="simple-icon-exclamation"></i>
      </span>
      <span class="label">{{message}}</span>
  </b-button>
</template>

<script>
import {TheMask} from 'vue-the-mask';
import {Money} from '@/vmoney.js';
import VueDropzone from 'vue2-dropzone';
import {api, baseURL, firebaseConfig} from '@/constants/config';

export default {
    data() {
      return {

      }
    },
    props: ['error', 'processing', 'message'],
    computed:{
    },
    components: {
      TheMask,
      Money,
    },
    computed: {
    },
    methods: {
    },
    watch: {
    }
}
</script>
<style>

</style>
