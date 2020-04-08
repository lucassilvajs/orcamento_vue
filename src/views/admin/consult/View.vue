<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <h1>Consultores</h1>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row v-if="false">
    <b-colxx md="4" lg="3">
        <b-form-group label="Status" class="has-float-label mb-4">
            <select v-model="filter.status" id="status" class="form-control">
              <option value="">Todos</option>
              <option v-for="(status, index) in data.status" :key="status" :value="index">{{status}}</option>
            </select>
        </b-form-group>
    </b-colxx>
    <b-colxx md="8" lg="9">
        <button class="btn btn-outline-success float-right" @click="getSac()">Buscar</button>
    </b-colxx>
  </b-row>
  <b-row class="mb-5">
    <b-colxx xxs="12">
      <b-card class="mb-4" title="Consultores">
        <div class="table-responsive" v-if="data.consult.length > 0">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Numero de empresas</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody v-if="data.consult">
              <tr v-for="(consult, index) in data.consult" :key="index">
                <td>{{index + 1}}</td>
                <td>{{consult.vendedor ? consult.vendedor : 'Não atribuido'}}</td>
                <td>{{consult.email}}</td>
                <td>{{consult.totalComp}}</td>
                <td v-if="false">
                    <button @click="getInfoConsult(index)" v-b-modal.modalright class="btn btn-outline-success">
                        <div class="glyph-icon simple-icon-eye"/>
                    </button>
                </td>
                <td>
                  <router-link :to="`/admin/consult/edit/${consult.id}`" class="btn btn-outline-info">
                    <div class="glyph-icon simple-icon-pencil"></div>
                  </router-link>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr v-for="comp in 10" :key="comp">
                <td colspan="5" class="demo"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <div class="alert alert-info">Nenhuma solicitação foi encontrada!</div>
        </div>
      </b-card>
    </b-colxx>
  </b-row>

  <b-modal id="modalright" ref="modalright" :title="`SAC #${modal.id}`" modal-class="modal-right">
      <template slot="modal-footer">
            <b-button variant="success" @click="somethingModal('modalright')" class="mr-1">Aprovar</b-button>
            <b-button variant="secondary" @click="somethingModal('modalright')" class="mr-1">Reprovar</b-button>
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
      index: null,
      filter: {
        status: ''
      },
      baseURL,
      data: null,
      modal: {
        title: '',
        nota: '',
        colaborador: '',
        name: '',
        date:''
      }
    }
  },
  methods: {
    async getSac(){
      const filter = (this.filter.status ? this.filter.status : '');
      const response = await api.get(`admin/consult/${filter}`);
      this.data = response.data.data;
    },
    getInfoConsult(index) {
      this.modal = this.data.consult[index];
      this.index = index;
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
    },
    async changeStatus(status) {
      const response = await api.put(`admin/sac/${this.modal.id}`, {status, info: this.modal});
      let res = response.data;
      this.$notify(res.status, res.status == 'success' ? 'Sucesso' : 'Opsss!', res.message, {
        duration: 3000,
        permanent: false
      });

      this.data = response.data.data;


    }
  },
  created () {
      this.getSac();
  }
}
</script>
<style>
.demo {
  margin: auto;
  width: 100%;
  height: 30px;
  background-image: linear-gradient( 100deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 80% );
  background-repeat: repeat-y;
  background-size:50px 200px;
  background-position: 0 0;
}

.demo:nth-child(odd) {
  animation: shine 1s infinite;
}

.demo:nth-child(even) {
  animation: shine 2s infinite;
}

@keyframes shine {
  to {
  background-position:100% 0;
  }
}
</style>
