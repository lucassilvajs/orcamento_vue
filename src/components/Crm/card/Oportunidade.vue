<template>
  <div class="oportunidade d-block">
    <div class="h-100" v-if="fields" >
      <h3 class="form-label mb-0">Formulário inicial</h3>
      <div class="form-basic">
        <FormDinamic :fields="fields" :id="id"/>
      </div>
    </div>
  </div>

</template>

<script>
import {TheMask} from 'vue-the-mask';
import {Money} from '@/vmoney.js';
import FormDinamic from '@/components/Crm/card/FormDinamic';

export default {
    props: ['fields', 'id'],
    components: {
      TheMask,
      Money,
      FormDinamic
    },
    methods: {
      setInfo(info){
        return info.map(r => {
          if(r.type == 'checkbox' && typeof r.value != 'object' && r.value.length) {
            try {
              r.value = JSON.parse(r.value)
            } catch (error) {
              r.value = [].concat(r.value)
            }
            // r.value = JSON.parse(r.value)
          }
          return r;
        })
      }
    },
    watch: {
    }
}
</script>
<style>
.color-label {
  width: 12px;
  height: 12px;
  display: inline-block;
  border-radius: 3px;
}
</style>
