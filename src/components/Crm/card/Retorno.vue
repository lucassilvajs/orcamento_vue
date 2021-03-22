<template>
  <div class="retorno">
    <div class="label mt-4">
      <v-date-picker v-model="date" mode="dateTime" is24hr :minute-increment="5" :model-config="{type: 'date'}" show-current="2013-07-13" :attributes="attr">
        <template v-slot="{inputEvents }">
          <b-form-group label="Selecionar data" class="has-float-label mb-4">
            <b-form-input v-if="date" ref="date" type="text" :value="typeof date == 'string' ? date : date.toLocaleDateString() + ' ' + date.toLocaleTimeString()" v-on="inputEvents" readonly/>
            <b-form-input v-else ref="date" type="text" :value="date" v-on="inputEvents"/>
          </b-form-group>
        </template>
      </v-date-picker>
    </div>

    <div class="label">
      <b-form-group label="Descrição" class="has-float-label mb-4">
        <b-textarea v-model="description" ref="descricao"></b-textarea>
      </b-form-group>
    </div>

    <div @click="addRetorno">
      <ButtonLoad :error="error" :processing="processing" message="Adicionar retorno" class="float-right" />
    </div>
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
        error: null,
        processing: null,
        date: null,
        description: null,
        return: null,
        attr: [
          {
            key: 'today',
            highlight: {
              color: 'purple',
              fillMode: 'solid',
              contentClass: 'italic',
            },
            dates: new Date(),
          },
        ]
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
      async addRetorno(){
        this.processing = true;
        const data = await api.put('crm/card/retorno', {
          date: this.date,
          description: this.description,
          id: this.id
        });

        this.$notify("success", "Sucesso", "Data de retorno inserida com sucesso", {
          duration: 3000,
          permanent: false
        });

        await this.getRetorno();
        this.processing = false;
      },

      async getRetorno(){
        const data = await api.get(`crm/card_retorno/${this.id}`);

        if(data.data.status == 'success' && data.data.data) {
          this.date = data.data.data.date;
          this.description = data.data.data.description;

          console.log(new Date(this.date))
          this.attr = [
            {
              key: 'today',
              highlight: {
                color: 'purple',
                fillMode: 'solid',
                contentClass: 'italic',
              },
              dates: new Date(this.date),
            },
          ]
        }
      }
    },
    watch: {
    },
    created(){
      this.getRetorno();
    }
}
</script>
<style>

</style>
