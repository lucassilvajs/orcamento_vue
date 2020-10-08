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
                      <th>Status</th>
                      <th>Ações</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(item, index) in items" :key="index">
                      <td>{{item.id}}</td>
                      <td>{{item.colaborador}}</td>
                      <td>{{item.date | date}}</td>
                      <td><span class="badge text-white" :style="[{background: item.color}]">{{item.status}}</span></td>
                      <td>
                        <button  @click="getInfoSAC(index)" v-b-modal.modalright class="btn btn-outline-success btn-sm">
                          <div class="glyph-icon simple-icon-eye"/>
                        </button>
                        <router-link v-if="item.hasChat" :to="`/app/sac/view/${item.id}`" class="btn btn-outline-info btn-sm">
                          <i class="glyph-icon iconsminds-speach-bubble"></i>
                        </router-link>
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
        <b>Sobre: </b>{{modal.about}}<br />
        <b>Imagem:</b> <br />
        <hr>
        <div v-if="modal.feedback">
          <b>Feedback:</b> {{modal.feedback}} <br />

        </div>
        <div v-for="(img, i) in modal.image" :key="i">
          <img target="_blank" v-if="['jpg', 'jpeg', 'png', 'gif', 'svg'].indexOf(img.split('.')[img.split('.').length - 1]) >= 0" :src="baseURL+img" class="w-100 mt-3" alt="">
          <iframe v-else class="w-100 mt-3" :src="baseURL + img" frameborder="0"></iframe>
        </div>
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
      this.items = items.data.data.map(r => {
        let image = [];
        try {
          image = JSON.parse(r.image)
        } catch (e) {
          image.push(r.image)
        }
        r.image = image;
        return r
      })
    },
    getInfoSAC(index) {
      this.modal = this.items[index];
    },
    hideModal (refname) {
          this.$refs[refname].hide()
          console.log('hide modal:: ' + refname)

          if (refname === 'modalnestedinline') {
            this.$refs['modalnested'].show()
          }
        },
  },
  created(){
    this.getOrder();
  }
}
</script>
