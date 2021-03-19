<template>
  <div class="comment d-flex flex-column justify-content-end" v-if="comments">
    <div class="comments-area mb-3" style="overflow: auto;">
      <div class="comments d-flex align-items-start mb-5" v-for="(comment, commentIndex) in comments" :key="commentIndex">
        <img class="profile mr-3" src="http://via.placeholder.com/30" alt="Avatar">
        <div>
          <h3 v-if="comment.user">{{comment.user.name}}</h3>
          <div class="description ml-0">
            {{comment.content}}
            <div class="description-info">
              {{comment.added }} {{comment.stage}}
            </div>
          </div>
        </div>
      </div>
      <b-alert v-if="!comments.length" show variant="info">Nenhum comentário foi adicionado</b-alert>
    </div>
    <div class="label">
      <h4>Comentário</h4>
      <h6 class="empty">Clique para adicionar</h6>
    </div>
  </div>
  <div v-else class="d-flex align-items-center justify-content-center">
    <h1>Buscando comentários</h1>
  </div>
</template>

<script>
import {TheMask} from 'vue-the-mask';
import {Money} from '@/vmoney.js';
import VueDropzone from 'vue2-dropzone';
import {api, baseURL, firebaseConfig} from '@/constants/config';

export default {
    props: ['comments'],
    data() {
      return {
        selectedValueSingle: null
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
