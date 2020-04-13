<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <h1>Propostas</h1>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row class="mb-5">
    <b-colxx xxs="12">
      <b-card class="mb-4" title="Propostas">
        <table class="table table-striped" v-if="items && items.length > 0">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Nota</th>
              <th>Solicitação</th>
              <th>Valor</th>
              <th>Produto</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td>{{index+1}}</td>
              <td>{{item.name}}</td>
              <td>{{item.nota}}</td>
              <td>{{item.date}}</td>
              <td>{{item.value}}</td>
              <td>{{item.product}}</td>
              <td>{{item.status}}</td>
              <td>
                <button @click="getInfoOrder(index)" v-b-modal.modalright class="btn btn-outline-success">
                  <div class="simple-icon-doc"/>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="alert">Nenhuma informação foi encontrada</div>
      </b-card>
    </b-colxx>
  </b-row>

  <b-modal v-if="order" id="modalright" ref="modalright" :title="`Pedido #${order.id}`" modal-class="modal-right">
      <b>Data: </b>{{order.date}}<br />
      <b>Empresa: </b>{{order.empresa.split('-')[0]}}<br />
      <b>Colaborador: </b>{{order.object.info.name}}<br />
      <b>Valor: </b>{{order.value}}<br />
      <hr>
      <div v-for="item in order.object.lens" :key="item.code">
        <b>{{item.type}}</b> {{item.name}}
      </div>
      <b>Face: </b><br />
      <img class="w-100" :src="baseURL + order.object.face" alt="">
      <b>Receita: </b><br />
      <img class="w-100" :src="baseURL + order.object.recipe" alt="">
      <template slot="modal-footer">
          <b-button variant="info" @click="hideModal('modalright')">Fechar</b-button>
      </template>
  </b-modal>

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
      const items = await api.get('/admin/proposal');
      this.items = items.data.data
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
