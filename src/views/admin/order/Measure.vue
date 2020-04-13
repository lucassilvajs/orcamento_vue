<template>
<div>
  <b-row v-if="items">
    <b-colxx xxs="12">
      <h1>Measure - Pedido #{{items.id}}</h1> <router-link to="/admin/order" class="float-right btn btn-sm btn-outline-success">Voltar</router-link>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row class="mb-5" v-if="items">
    <b-colxx xxs="12">
      <b-card class="mb-4" :title="`Measure - Pedido #${items.id}`">
        <b-row>
          <b-colxx md="12">
            <iframe :src="`${baseURL}measure/${items.id}`" frameborder="0" style="width:100%; height:1000px;"></iframe>
          </b-colxx>
        </b-row>
      </b-card>
    </b-colxx>
  </b-row>
</div>
</template>
<script>
import { api, baseURL } from '@/constants/config'

export default {
  components: {
  },
  data () {
    return {
      baseURL,
      items: null,
      data: null,
      order: null
    }
  },
  methods: {
    async getOrder() {
      const items = await api.get(`admin/order/measure/${this.$route.params.id}`);
      this.items = items.data.data[0]
    },
    getInfoOrder(index) {
      this.order = this.items[index]
    },
    hideModal (refname) {
      this.$refs[refname].hide()
      console.log('hide modal:: ' + refname)

      if (refname === 'modalnestedinline') {
        this.$refs['modalnested'].show()
      }
    },
    somethingModal (refname) {
      this.$refs[refname].hide()
      console.log('something modal:: ' + refname)

      if (refname === 'modalnestedinline') {
        this.$refs['modalnested'].show()
      }
    }
  },
  created(){
    this.getOrder();
  }
}
</script>
