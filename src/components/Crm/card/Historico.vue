<template>
  <div class="historic d-flex flex-column justify-content-end" v-if="history">
    <div class="comments-area" style="overflow: auto;">
      <div class="actives mb-3 d-flex flex-column" v-for="(historic, historicIndex) in history" :key="historicIndex">
        <div class="d-flex align-items-start">
          <div :class="'mr-3 status-item ' + historic.color">
            <div :class="'glyph-icon ' + historic.icon"/>
          </div>
          <div>
            <h3 class="title-active mb-0">{{historic.title}}</h3>
            <span class="time">{{historic.added}}</span>
          </div>
        </div>
        <div v-if="historic.description" class="description" v-html="historic.description">
        </div>
      </div>
      <b-alert v-if="history.length == 0" show variant="info">Nenhuma atividade foi encontrada</b-alert>
    </div>
  </div>
  <div v-else class="d-flex align-items-center justify-content-center h-100">
    <h3>Buscando histórico...</h3>
  </div>
</template>

<script>
import {TheMask} from 'vue-the-mask';
import {Money} from '@/vmoney.js';
import VueDropzone from 'vue2-dropzone';
import {api, baseURL, firebaseConfig} from '@/constants/config';

export default {
    props: ['id'],
    data() {
      return {
        selectedValueSingle: null,
        history: null
      }
    },
    components: {
      TheMask,
      Money,
    },
    computed: {
    },
    methods: {
      async getHistory(){
        const data = await api.get(`crm/card/history/${this.id}`);

        if(data.data.status == 'success') {
          this.history = data.data.data.historic;
        }
      }
    },
    watch: {
    },
    created(){
      this.getHistory()
    }
}
</script>
<style>

</style>
