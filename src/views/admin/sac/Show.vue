<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <h1>SAC</h1>
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
      <b-card class="mb-4" title="SAC">
        <div class="table-responsive" v-if="data.sac.length > 0">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nota</th>
                <th>Colaborador</th>
                <th>Solicitante</th>
                <th>Empresa</th>
                <th>CNPJ</th>
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
                <td>{{sac.solicitante}}</td>
                <td>{{sac.name}}</td>
                <td>{{sac.cnpj}}</td>
                <td>{{sac.date | date}}</td>
                <td>
                  <span :style="{background:sac.color}" style="color:#fff; padding:5px 7px; border-radius:3px;">{{sac.status}}</span> </td>
                <td>
                    <button @click="getInfoSAC(index)" v-b-modal.r class="btn btn-outline-success">
                        <div class="glyph-icon simple-icon-eye"/>
                    </button>
                    <button @click="deleteSac(sac.id)" class="btn btn-danger">
                      <div class="glyph-icon simple-icon-trash"></div>
                    </button>
                </td>
                <!-- <td>
                    <router-link v-if="false" :to="`/admin/sac/view/${sac.id}`" class="btn btn-outline-info">
                        <div class="glyph-icon iconsminds-speach-bubble"/>
                    </router-link>
                </td> -->
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

  <b-modal id="r" ref="r" :title="`SAC #${modal.id}`" modal-class="modal-right">
    <div>
      <b>Nota: </b>{{modal.nota}}<br />
      <b>Colaborador: </b>{{modal.colaborador}}<br />
      <b>empresa: </b>{{modal.name.split('-')[0]}}<br />
      <b>Solicitação: </b>{{modal.date | date}}<br />
      <b>O que aconteceu:</b> {{modal.about}} <br />
      <b>Imagens:</b> <br />
      <div v-for="(img, i) in modal.image" :key="i">
        <img target="_blank" v-if="['jpg', 'jpeg', 'png', 'gif', 'svg'].indexOf(img.split('.')[img.split('.').length - 1]) >= 0" :src="baseURL+img" class="w-100 mt-3" alt="">
        <iframe v-else class="w-100 mt-3" :src="baseURL + img" frameborder="0"></iframe>
      </div>
      <hr class="my-3">

      <div v-for="(ord, indexOrd) in modal.orders" :key="indexOrd" style="border-bottom:1px solid rgba(100,100,100,.5); padding:10px 0;">
        <b class="mb-3" v-if="indexOrd == 0">Pedidos encontrados: </b>
        <div>
          <b>Pedido: </b> {{ord.order_id}} <br>
          <div v-for="(attr, indexAttr) in JSON.parse(ord.order_attributes).info" :key="indexAttr">
            <b>{{indexAttr == 'name' ? 'Nome' : indexAttr}}: </b> {{attr}} <br>
          </div>

          <div v-for="(attr, indexAttr) in JSON.parse(ord.order_attributes).product" :key="'a'+indexAttr">
            <div v-if="['model', 'color', 'image', 'size', 'attributes'].indexOf(indexAttr) == -1">
              <b>{{indexAttr == 'name' ? 'Produto' : indexAttr}}: </b> {{attr}} <br>
            </div>
          </div>

        </div>
     </div>
      <br>
        <p>Número do pedido</p>
        <b-form-group v-if="!modal.order_id" label="Número do pedido" class="has-float-label mb-2">
          <b-form-input type="text" v-model="modal.idOrder" />
        </b-form-group>

      <div class="feedback mt-5"  v-if="modal.status == 'Aberto'">
        <p>Você gostaria de enviar enviar algo ao cliente?</p>

        <b-form-group label="Informação" class="has-float-label mb-2">
          <textarea v-model="modal.info" rows="3" class="form-control"></textarea>
        </b-form-group>

      </div>
    </div>

      <template slot="modal-footer">
          <div v-if="modal.status == 'Aberto'">
            <b-button variant="success" @click="changeStatus('approved')" class="mr-1">Aprovar</b-button>
            <b-button variant="secondary" @click="changeStatus('reproved')" class="mr-1">Reprovar</b-button>

          </div>
          <b-button variant="info" @click="hideModal('r')">Fechar</b-button>
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
        date:'',
        idOrder: '',
      }
    }
  },
  methods: {
    async getSac(){
      const filter = (this.filter.status ? this.filter.status : '');
      const response = await api.get(`admin/sac/${filter}`);
      this.data = response.data.data;
      this.data.sac = this.data.sac.map(r => {
        let image = [];

        try {
          image = JSON.parse(r.image)
        } catch (error) {
          image.push(r.image)
        }

        r.image = image
        return r;
      })
    },
    getInfoSAC(index) {
      this.index = index;
      this.modal = this.data.sac[this.index];
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

      if (refname === 'modalnestedinline') {
        this.$refs['modalnested'].show()
      }
    },
    async changeStatus(status) {
       await this.$swal.fire({
        title: `O que você acha?`,
        text: `Você realmente deseja ${status == 'approved' ? 'aprovar' :  'reprovar'} essa solicitação?`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        showLoaderOnConfirm: true,
      }).then(async (result) => {
        if(result.value) {
          if(status != '') {
            if(status == 'approved' && !this.modal.idOrder) {
              this.$notify('error', 'Ops...!', 'Por favor, preencha o número do pedido', {
                duration: 3000,
                permanent: false
              });

              return false;
            }
            const response = await api.put(`admin/sac/${this.modal.id}`, {status, info: this.modal});
            let res = response.data;
            this.$notify(res.status, res.status == 'success' ? 'Sucesso' : 'Opsss!', res.message, {
              duration: 3000,
              permanent: false
            });
            await this.getSac();

            this.modal = this.data.sac[this.index];

            if(res.status == 'success') {
              this.somethingModal('modalright')
            }
          }
        }

      });
    },
    async deleteSac(sac) {
      await this.$swal.fire({
        title: `O que você acha?`,
        text: `Você realmente deletar esse SAC?`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        showLoaderOnConfirm: true,
      }).then(async (result) => {
        if(result.value) {
          const response = await api.delete(`admin/sac/${sac}`);
          let res = response.data;
          this.$notify(res.status, res.status == 'success' ? 'Sucesso' : 'Opsss!', res.message, {
            duration: 3000,
            permanent: false
          });
          await this.getSac();
        }

      });
    },
    addOrder(order){
      console.log(order)
      this.modal.lucas = "Lindo"
    }
  },
  created () {
      this.getSac();
  }
}
</script>
