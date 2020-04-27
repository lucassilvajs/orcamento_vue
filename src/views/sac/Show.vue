<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <router-link to="/app/sac/new" class="btn btn-success float-right">Abrir solicitação</router-link>
          <h4 class="card-title">Solicitações</h4>
          <table class="table" v-if="items.length">
              <thead>
                  <tr>
                      <th>#</th>
                      <th>Colaborador</th>
                      <th>Data</th>
                      <th>Ações</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(item, index) in items" :key="index">
                      <td>{{index + 1}}</td>
                      <td>{{item.colaborador}}</td>
                      <td>{{item.date | date}}</td>
                      <td>
                        <button  @click="getInfoSAC(index)" v-b-modal.modalright class="btn btn-outline-success btn-sm">
                          <div class="glyph-icon simple-icon-eye"/>
                        </button>
                      </td>
                  </tr>
              </tbody>
          </table>
          <div v-else>
            <div class="alert-info alert">Você ainda não solicitou nenhum atendimento!</div>
          </div>
        </b-card>
      </b-colxx>
    </b-row>

      <b-modal id="modalright" ref="modalright" :title="`SAC #${modal.id}`" modal-class="modal-right">
        <b>Nota: </b>{{modal.number}}<br />
        <b>Colaborador: </b>{{modal.colaborador}}<br />
        <b>Solicitação: </b>{{modal.date | date}}<br />
        <b>Imagem:</b> <br />
        <img class="w-100" :src="baseURL + modal.image" alt="">
        <template slot="modal-footer">
          <b-button variant="info" @click="hideModal('modalright')">Fechar</b-button>
        </template>
    </b-modal>

  </div>
</template>
<script>
import {api, baseURL} from '@/constants/config';
export default {
  data () {
    return {
      baseURL,
      items: null,
      modal: {
        id: '',
        title: '',
        number: '',
        colaborador: '',
        date:'',
        image: ''
      }
    }
  },
  methods: {
    async getOrder() {
      const items = await api.get('/sac');
      this.items = items.data.data
    },
    getInfoSAC(index) {
      this.modal = this.items[index];
    },
  },
  created(){
    this.getOrder();
  }
}
</script>
