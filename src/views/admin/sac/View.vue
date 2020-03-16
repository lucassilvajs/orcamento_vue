<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <h1>SAC</h1>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row class="mb-5">
    <b-colxx xxs="12">
      <b-card class="mb-4" title="SAC">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nota</th>
                <th>Colaborador</th>
                <th>Empresa</th>
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(sac, index) in data.sac" :key="index">
                <td>{{sac.id}}</td>
                <td>{{sac.nota}}</td>
                <td>{{sac.colaborador}}</td>
                <td>{{sac.name}}</td>
                <td>{{sac.date | date}}</td>
                <td> <span :style="{background:sac.color}" style="color:#fff; padding:5px 7px; border-radius:3px;">{{sac.status}}</span> </td>
                <td>
                    <button @click="getInfoSAC(index)" v-b-modal.modalright class="btn btn-outline-success">
                        <div class="glyph-icon simple-icon-eye"/>
                    </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-card>
    </b-colxx>
  </b-row>

  <b-modal id="modalright" ref="modalright" :title="`SAC #${modal.id}`" modal-class="modal-right">
      <b>Nota: </b>{{modal.nota}}<br />
      <b>Colaborador: </b>{{modal.colaborador}}<br />
      <b>empresa: </b>{{modal.name.split('-')[0]}}<br />
      <b>Solicitação: </b>{{modal.date | date}}<br />
      <b>Nota:</b> <br />
      <img class="w-100" :src="baseURL + modal.image" alt="">
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
        const response = await api.get('admin/sac');
        this.data = response.data.data;
    },
    getInfoSAC(index) {
      this.modal = this.data.sac[index];
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
  created () {
      this.getSac();
  }
}
</script>
