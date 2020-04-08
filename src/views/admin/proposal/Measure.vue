<template>
<div>
  <b-row v-if="items">
    <b-colxx xxs="12">
      <h1>Measure - Pedido #{{items.id}}</h1>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row class="mb-5" v-if="items">
    <b-colxx xxs="12">
      <b-card class="mb-4" :title="`Measure - Pedido #${items.id}`">
        <b-row>
          <b-colxx md="8">
            <img class="w-100" :src="baseURL+items.object.face" alt="">
          </b-colxx>
          <b-colxx md="4">
            <b-row class="align-items-start">
              <b-colxx lg="12" v-for="(item, index ) in items.object.info" :key="index">
                <b>{{index == 'name' ? 'Nome' : index}}:</b> {{item}} <br />
              </b-colxx>
              <b-colxx lg="12">
              </b-colxx>
            </b-row>
            <b-row class="align-items-end">
              <b-colxx lg="12">
                <button type="button" class="btn btn-outline-success mt-5">Salvar Medidas</button>
              </b-colxx>
            </b-row>
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
