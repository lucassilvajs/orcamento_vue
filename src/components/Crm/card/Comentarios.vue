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
      <b-form-group label="Insira seu comentário" class="has-float-label mb-4">
        <b-form-textarea v-model="comentario" />
      </b-form-group>
      <div @click="addComment">
        <ButtonLoad :error="error" :processing="processing" message="Criar comentário" class="float-right" />
      </div>
    </div>
  </div>
  <div v-else class="d-flex align-items-center justify-content-center h-100">
    <h3>Buscando comentários</h3>
  </div>
</template>

<script>
import {TheMask} from 'vue-the-mask';
import {Money} from '@/vmoney.js';
import VueDropzone from 'vue2-dropzone';
import {api, baseURL, firebaseConfig} from '@/constants/config';
import ButtonLoad from '@/components/ButtonLoad';

export default {
    props: ['id'],
    data() {
      return {
        comments: null,
        comentario: null,
        error: false,
        processing: false
      }
    },
    components: {
      TheMask,
      Money,
      ButtonLoad
    },
    computed: {
    },
    methods: {
      async getComment() {
        const data = await api.get(`crm/card/comment/${this.id}`);

        if(data.data.status == 'success') {
          this.comments = data.data.data.comment;
        }
      },

      async addComment(){
        this.processing = true;

        const data = await api.post('crm/comment', {
          id: this.id,
          value: this.comentario
        });
        this.comentario = '';
        this.comments = data.data.data.comment

        this.processing = false;
      }
    },
    watch: {
    },
    created(){
      this.getComment()
    }
}
</script>
<style>

</style>
