<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" title="Confira seu pedidos">
          <b-table v-if="items" striped :items="items" />
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>
<script>
import {api} from '@/constants/config';
export default {
  data () {
    return {
      items: null,
    }
  },
  methods: {
    async getOrder() {
      const items = await api.get('/order');
      this.items = items.data.data 
    }
  },
  created(){
    this.getOrder();
  }
}
</script>
