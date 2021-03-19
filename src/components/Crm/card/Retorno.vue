<template>
  <div class="retorno">
    <div class="label">
      <h4>Data do Retorno</h4>
      <v-date-picker mode="dateTime" is24hr v-model="retorno.date" :input-props="{ class:'form-control', placeholder: $t('form-components.date') }"></v-date-picker>
    </div>

    <div class="label">
      <b-form-group label="Descrição" class="has-float-label mb-4">
        <b-textarea v-model="retorno.description" ref="descricao"></b-textarea>
      </b-form-group>
    </div>

    <button class="btn btn-success floar-right">Adicionar</button>
  </div>

</template>

<script>
import {TheMask} from 'vue-the-mask';
import {Money} from '@/vmoney.js';
import VueDropzone from 'vue2-dropzone';
import {api, baseURL, firebaseConfig} from '@/constants/config';

export default {
    props: [],
    data() {
      return {
        retorno: {
          date: null,
          description: null
        }
      }
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
