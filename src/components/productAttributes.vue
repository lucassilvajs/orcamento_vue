<template>
  <b-colxx lg="4" xxs="12" v-if="productInfo.attributes">
    <b-card class="mb-4" title="Atributos">
      <draggable class="list-group min-height" :list="productInfo.attributes" :group="{ name: 'people', pull: 'clone'}" @change="refreshElements">
        <div class="list-group-item" v-for="(element, index) in productInfo.attributes" :key="index">
          <span>{{element.label}}</span>
        </div>
      </draggable>
      <b-row class="mt-5">
        <b-colxx xxs="12">
          <button v-if="!edit.status" class="btn btn-success btn-block" @click="() => {
            edit.status = true
          }">Adicionar atributo</button>
        </b-colxx>
        <b-colxx v-if="edit.status" xxs="12">
          <h6 class="title">Criar atributo</h6>
          <b-form-group  label="Nome do atributo" class="has-float-label mb-4">
            <b-form-input v-model="edit.name" type="text" placeholder="Nome do atributo" />
          </b-form-group>
          <b-form-radio-group v-model="edit.customize">
            <b-form-radio :value="true">Customizavel</b-form-radio>
            <b-form-radio :value="false">Não Customizavel</b-form-radio>
          </b-form-radio-group>
          <button class="btn btn-success btn-block mt-3" @click="saveAttr">Adicionar atributo</button>
        </b-colxx>
      </b-row>
    </b-card>
  </b-colxx>
</template>

<script>
import { api, baseURL } from '@/constants/config'
import {
    mapGetters,
    mapActions
} from "vuex";
import draggable from "vuedraggable";

export default {
  data(){
    return {
      edit: {
        status: false,
        name: '',
        customize: true
      },
    }
  },
  props: ['productInfo'],
  components: {
    draggable
  },
  methods: {
    async saveAttr(){
      const response = await api.post(`admin/product/attribute`, this.edit);
      this.productInfo = response.data.data
      this.edit = {
        status: false,
        name: '',
        customize: true
      }
    }
  }
}
</script>
