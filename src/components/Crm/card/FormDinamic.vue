<template>

<form class="form-inicial pt-3 pr-3" v-if="fields.length" @submit.prevent="submit">
  <div class="label" v-for="(card, cardIndex) in setInfo(fields)" :key="cardIndex">
    <b-form-group v-if="card.type == 'text'" :label="card.label" class="has-float-label mb-4">
      <b-form-input type="text" v-model="card.value" />
    </b-form-group>
    <b-form-group v-if="card.type == 'textarea'" :label="card.label" class="has-float-label mb-4">
      <b-form-textarea v-model="card.value" />
    </b-form-group>
    <b-form-group v-if="card.type == 'mask'" :label="card.label" class="has-float-label mb-4">
      <the-mask class="form-control" v-model="card.value" :mask="JSON.parse(card.aux)" />
    </b-form-group>
    <b-form-group v-if="card.type == 'checkbox'" :label="card.label">
      <b-form-checkbox-group v-model="card.value">
        <b-form-checkbox v-for="(c, i) in JSON.parse(card.aux)" :key="i" :value="c">{{c}}</b-form-checkbox>
      </b-form-checkbox-group>
    </b-form-group>
    <b-form-group v-if="card.type == 'select'" :label="card.label" class="has-float-label mb-4">
      <b-form-select v-model="card.value" :options="JSON.parse(card.aux)" size="sm"></b-form-select>
    </b-form-group>
    <b-form-group v-if="card.type == 'radio'" :label="card.label" v-slot="{ ariaDescribedby }">
      <b-form-radio-group
        id="radio-group"
        v-model="card.value"
        :options="JSON.parse(card.aux).map(r => {
          return {text: r, value: r}
        })"

        :aria-describedby="ariaDescribedby"
        name="radio-options"
      ></b-form-radio-group>
    </b-form-group>
    <div v-if="card.type == 'tag'" class=" d-flex flex-column">
      <div v-for="(c, ci) in JSON.parse(card.aux)" :key="ci" class="cursor-pointer color-area d-flex align-items-center justify-content-between mb-2 w-50">
        <div @click="() => {card.value = c.value;}">
          <div class="color-label mr-3" :style="{background: c.color}"></div>
          <span class="color-value mr-3">{{c.value}}</span>
        </div>
        <div v-if="c.value == card.value" :class="'d-inline-block mr-3 glyph-icon simple-icon-check'"/>
      </div>
    </div>
    <div v-if="['date', 'dateTime'].indexOf(card.type) >= 0" class="label">
      <v-date-picker v-model="card.value" :mode="card.type" is24hr :minute-increment="5" :model-config="{type: 'date'}" show-current="2013-07-13">
        <template v-slot="{ inputValue, inputEvents }">
          <b-form-group :label="card.label" class="has-float-label mb-4">
            <b-form-input v-if="card.value" ref="date" type="text" :value="typeof card.value == 'string' ? card.value : card.value.toISOString().substr(0, 10).split('-').reverse().join('/')" v-on="inputEvents"/>
            <b-form-input v-else ref="date" type="text" :value="card.value" v-on="inputEvents"/>
          </b-form-group>
        </template>
      </v-date-picker>
    </div>
    <b-form-group v-if="card.type == 'money'" :label="card.label" class="has-float-label mb-4">
      <Money class="form-control" v-model="card.value" v-bind="{ decimal: ',',thousands: '.',prefix: 'R$ ',suffix: '',precision: 2,masked: false,}"/>
    </b-form-group>
  </div>
  <button class="btn btn-success float-right">Salvar</button>
</form>
<div class="h-100 d-flex align-items-center justify-content-center" v-else>
  <h4>Nenhum informação necessária nesta fase</h4>
</div>


</template>

<script>
import {TheMask} from 'vue-the-mask';
import {Money} from '@/vmoney.js';
import {api, baseURL} from '@/constants/config';

export default {
    props: ['fields', 'id'],
    components: {
      TheMask,
      Money,
    },
    computed: {
    },
    data(){
      return {
        selectedDate: null,
      }
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
      },
      submit(){
        const data = api.put(`crm/card/${this.id}`, this.fields);
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
