<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <h1>SAC</h1>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-card class="mb-2" title="Filtro">
    <b-row>
      <b-colxx xs="12" lg="3">
        <b-form-group label="Empresa, Colaborador e NF  " class="has-float-label mb-2">
          <b-form-input type="text" v-model="filter.name" />
        </b-form-group>
      </b-colxx>
      <b-colxx xs="12" lg="3">
          <b-form-group label="Status" class="has-float-label mb-4">
              <b-form-select v-model="filter.status" :options="{0:'Todos',...data.status}" plain />
          </b-form-group>
      </b-colxx>
      <b-colxx xxs="12" v-if="false" md="3">
        <b-form-group label="Resultados por página" class="has-float-label mb-4">
          <b-form-select v-model="order.limit" :options="[
            { value: '20', text: '20' },
            { value: '50', text: '50' },
            { value: '100', text: '100' },
          ]" plain />
        </b-form-group>
      </b-colxx>
      <b-colxx xxs="12" v-if="false" md="3">
        <b-form-group label="Ordenação" class="has-float-label mb-4">
          <b-form-select v-model="order.orderBy" :options="[
            { value: 'DESC', text: 'Decrescente' },
            { value: 'ASC', text: 'Crescente' },
          ]" plain />
        </b-form-group>
      </b-colxx>
      <b-colxx xxs="12" v-if="false" md="3">
        <b-form-group label="Ordenar por" class="has-float-label mb-4">
          <b-form-select v-model="order.orderByValue" :options="[
            { value: 'sac_date_added', text: 'Criação' },
            { value: 'name', text: 'Empresa' },
            { value: 'sac_colaborador', text: 'Colaborador' },
          ]" plain />
        </b-form-group>
      </b-colxx>
      <b-colxx lg="3"></b-colxx>
      <b-colxx xs="12" lg="3" class="text-right">
          <b-button variant="success" :disabled="processing" :class="{'btn-multiple-state text-sucess': true,
              'show-spinner': processing,
              'show-success': !processing}" @click="getSac(1)">
              <span class="spinner d-inline-block">
                  <span class="bounce1"></span>
                  <span class="bounce2"></span>
                  <span class="bounce3"></span>
              </span>
              <span class="icon success">
                  Buscar
              </span>
              <span class="icon fail">
                  <i class="simple-icon-exclamation"></i>
              </span>
              <span class="label">Buscar</span>
          </b-button>
          <!-- <button class="show-success btn btn-info mb-3 btn-multiple-state btn-shadow ml-3" @click="getSac(1)">
            <span class="label">Buscar</span>
            <span class="spinner d-inline-block">
              <span class="bounce1"></span>
              <span class="bounce2"></span>
              <span class="bounce3"></span>
            </span>
            <span class="icon success">
              Buscar
            </span>
          </button> -->
      </b-colxx>
    </b-row>
  </b-card>




  <b-row class="mb-5">
    <b-colxx xxs="12">
      <b-card class="mb-4" title="SAC">
        <b-row class="mb-3">

          <b-colxx xxs="12" md="11">
          </b-colxx>

          <b-colxx xxs="12" md="1" class="text-right">
            <b-button-group>
              <b-dropdown split right class="check-button" variant="primary btn-xs">
                <label class="pt-2 custom-control custom-checkbox pl-4 mb-0 d-flex justify-content-center align-items-center" slot="button-content">
                  <input v-model="selectAll" @change="() => {data.sac = data.sac.map(r => {r.selected = selectAll; return r;})}" class="custom-control-input" type="checkbox" />
                  <span class="custom-control-label">&nbsp;</span>
                </label>
                <b-dropdown-item v-for="(status, index) in data.status" :key="index" @click="changeStatusSelected(index)">{{status}}</b-dropdown-item>
                </b-dropdown>
            </b-button-group>
          </b-colxx>
        </b-row>
        <b-row>
        </b-row>
        <div class="table-responsive" v-if="data.sac.length > 0">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>ID</th>
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
                <td>
                  <label class="pt-2 custom-control custom-checkbox pl-4 mb-0 d-flex justify-content-center align-items-center" slot="button-content">
                    <input class="custom-control-input" v-model="sac.selected" type="checkbox" />
                    <span class="custom-control-label indeterminate">&nbsp;</span>
                  </label>
                </td>
                <td> {{sac.id}}</td>
                <td>{{sac.nota}}</td>
                <td>{{sac.colaborador}}</td>
                <td>{{sac.solicitante}}</td>
                <td>{{sac.name}}</td>
                <td>{{sac.cnpj}}</td>
                <td>{{sac.date | date}}</td>
                <td>
                  <span :style="{background:sac.color}" style="color:#fff; padding:5px 7px; border-radius:3px;">{{sac.status}}</span>
                </td>
                <td>
                  <b-dropdown v-if="'Deletado' != sac.status" id="ddown1" text="Ações" variant="outline-primary">
                    <b-dropdown-item @click="getInfoSAC(index)" v-b-modal.r>Acessar solicitação</b-dropdown-item>
                    <b-dropdown-item @click="() => {$router.push(`/admin/sac/view/${sac.id}`) }">Chat</b-dropdown-item>
                    <b-dropdown-item @click="deleteSac(sac.id)">Excluir</b-dropdown-item>
                  </b-dropdown>
                  <b-dropdown v-else text="Restaurar" variant="outline-dark btn-xs">
                    <b-dropdown-item @click="changeStatus(sac.id, 1)">Aberto</b-dropdown-item>
                    <b-dropdown-item @click="changeStatus(sac.id, 5)">Aprovado</b-dropdown-item>
                    <b-dropdown-item @click="changeStatus(sac.id, 6)">Recusado</b-dropdown-item>
                  </b-dropdown>


                    <!-- <button @click="getInfoSAC(index)" v-b-modal.r class="btn btn-outline-success">
                        <div class="glyph-icon simple-icon-eye"/>
                    </button>
                    <button @click="deleteSac(sac.id)" class="btn btn-danger">
                      <div class="glyph-icon simple-icon-trash"></div>
                    </button>
                    <router-link :to="`/admin/sac/view/${sac.id}`" class="btn btn-outline-info">
                        <div class="glyph-icon simple-icon-eye"/>
                    </router-link> -->
                </td>
                <!-- <td>
                </td> -->
              </tr>
            </tbody>
          </table>
          <b-pagination v-if="false && total > limit"
            size="sm"
            align="center"
            :total-rows="total"
            :per-page="limit"
            @change="(numbe) => {
              order.page = numbe;
              getSac(1);
            }"
          />
        </div>
        <div v-else-if="data.sac.length == 0 && processing == false">
          <div class="alert alert-info">Nenhuma solicitação foi encontrada!</div>
        </div>
        <div v-else >
          <h3 class="text-center">Buscando informações</h3>
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
      <div v-if="modal.feedback"><hr><b>Considerações:</b> {{modal.feedback}} <hr> <br /></div>

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
      <div class="feedback mt-5"  v-if="modal.status == 'Aberto'">
        <p>Você gostaria de enviar enviar algo ao cliente?</p>

        <b-form-group label="Informação" class="has-float-label mb-2">
          <textarea v-model="modal.info" rows="3" class="form-control"></textarea>
        </b-form-group>

      </div>
    </div>

      <template slot="modal-footer">
          <div v-if="modal.status == 'Aberto'">
            <b-button variant="success" @click="changeStatus(modal.id, 5, modal.info)" class="mr-1">Aprovar</b-button>
            <b-button variant="secondary" @click="changeStatus(modal.id, 6, modal.info)" class="mr-1">Reprovar</b-button>

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
      baseURL,
      selectAll: false,
      index: null,
      processing: false,
      filter: {},
      order: {
        limit: 100,
        orderBy: 'DESC',
        orderByValue: 'sac_date_added'
      },
      data: {},
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
    async getSac(hasFilter = false){
      this.data.sac = [];
      this.processing = true;
      const response = await api.get(`admin/sac/`, {params: {...this.order, ...this.filter}});
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
      });

      this.processing = false;
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

    async changeStatusSelected(status, feedback = '') {
      await this.$swal.fire({
        title: `O que você acha?`,
        text: `Você realmente deseja alterar o status dos SACs selecionados?`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        showLoaderOnConfirm: true,
      }).then(async (result) => {
        if(result.value) {
          this.data.sac.filter(r => r.selected).map(async r => {
              const response = await api.put(`admin/sac/${r.id}`, {update: {status, feedback}} );
          });
        }
      });

      this.modal.info = ''
      await this.getSac();

    },

    async changeStatus(sac, status, feedback = '') {
       await this.$swal.fire({
        title: `O que você acha?`,
        text: `Você realmente deseja alterar o status do SAC selecionado?`,
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
            const response = await api.put(`admin/sac/${sac}`, {update: {status, feedback}});
            let res = response.data;
            this.$notify(res.status, res.status == 'success' ? 'Sucesso' : 'Opsss!', res.message, {
              duration: 3000,
              permanent: false
            });

            this.modal.info = ''
            await this.getSac();
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
