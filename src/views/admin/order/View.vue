<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <h1>Pedidos</h1>
      <div class="top-right-button-container">
        <b-button-group>
            <b-dropdown @click="targetSelectAll()" split right class="check-button" variant="primary">
                <label class="custom-control custom-checkbox pl-4 mb-0 d-inline-block" slot="button-content">
                    <input class="custom-control-input" type="checkbox" v-model="selectAll">
                    <span :class="{
    'custom-control-label' :true
  }">&nbsp;</span>
                </label>
                <b-dropdown-item @click="alertAction('Deseja mesmo emitir as NFs?', 'approved','pv')">Emitir NF</b-dropdown-item>
                <b-dropdown-item @click="alertActionDelete()">Deletar pedidos</b-dropdown-item>
            </b-dropdown>
        </b-button-group>
      </div>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row class="mb-5">
    <b-colxx class="mb-4">
      <b-card>
        <b-row>
          <b-colxx lg="3">
              <b-form-group label="Nome da empresa" class="has-float-label mb-4">
                  <b-form-input type="text" v-model="filter.name" />
              </b-form-group>
          </b-colxx>
          <b-colxx lg="3">
              <b-form-group label="Propostas partir de:" class="has-float-label mb-4">
                <v-date-picker mode="single" v-model="filter.start" :input-props="{ class:'form-control', placeholder: $t('form-components.date') }"></v-date-picker>
              </b-form-group>
          </b-colxx>
          <b-colxx lg="3">
              <b-form-group label="Propostas até:" class="has-float-label mb-4">
                <v-date-picker mode="single" v-model="filter.end" :input-props="{ class:'form-control', placeholder: $t('form-components.date') }"></v-date-picker>
              </b-form-group>
          </b-colxx>
          <b-colxx lg="3">
            <b-form-group label="Lentes:" class="has-float-label mb-4">
                <select v-model="filter.len" id="" class="form-control">
                  <option value="">Todas</option>
                  <option value="1">Solicitada</option>
                  <option value="0">Não solicitadas</option>
                </select>
            </b-form-group>
          </b-colxx>
          <b-colxx lg="3">
            <b-form-group label="Notas fiscais:" class="has-float-label mb-4">
                <select v-model="filter.nf" id="" class="form-control">
                  <option value="">Todas</option>
                  <option value="1">Emitidas</option>
                  <option value="0">Não Emitidas</option>
                </select>
            </b-form-group>
          </b-colxx>
          <b-colxx lg="12">
              <b-button variant="success" :disabled="processing" :class="{'mb-3 btn-multiple-state btn-shadow ml-3 float-right': true,
                'show-spinner': processing,
                'show-success': !processing}" @click="getOrder">
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
          </b-colxx>
        </b-row>
        <p><b>Selecionados</b>: {{
          items.filter(r => r.checked).length
        }} <br /><b>Total</b>: {{
          sum_array(items.filter(r => r.checked).map(sr => sr.parents.map(r => r.total).reduce(function(total, num){
                    return (parseFloat(total) + parseFloat(num))
                  }))) | numeroPreco }}</p>
      </b-card>
    </b-colxx>
    <b-colxx xxs="12">
      <b-card class="mb-4" title="Pedidos">
        <div v-if="items && items.length > 0">
          <table class="table table-striped" v-if="items && items.length > 0">
            <thead>
              <tr>
                <th></th>
                <th>#</th>
                <th>Empresa</th>
                <th>CNPJ</th>
                <th>Pedido de compra</th>
                <th>NF</th>
                <th>Colaborador</th>
                <th>Valor</th>
                <th>Aprovado</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index" :class="[{'son': item.son, 'parent': !item.son}]">
                <td>
                  <div v-if="!item.nota" class="custom-control custom-checkbox pl-1 align-self-center pr-4">
                    <div class="itemCheck mb-0 custom-control custom-checkbox">
                      <input type="checkbox" autocomplete="off" class="custom-control-input" v-model="item.checked" :id="`check_${item.id}`">
                      <label class="custom-control-label" :for="`check_${item.id}`"></label>
                    </div>
                  </div>
                </td>
                <td>{{item.id}}</td>
                <td>{{item.empresa}} <span v-if="item.pedido_compra == 1 && !item.object.pc" class="badge badge-danger">PC Pendente</span></td>
                <td>{{item.cnpj}}</td>
                <td>{{item.numeroPedido}} <router-link :to="`/admin/company/edit/${item.idCompany}`"><span v-if="!item.emailNf" class="badge badge-danger">E-mail XML não cadastrado</span></router-link> </td>
                <td>{{item.nota}}</td>
                <td v-if="isPage('proposal')">{{item.parents.map(r => JSON.parse(r.attr).info.name).join(', ')}}</td>
                <td v-else>{{item.name}}</td>
                <td>{{item.value}}</td>
                <td>{{item.date}}<br />
                  <span v-if="item.object.measure && item.len == 1" class="badge badge-success">DP: {{item.object.measure.pupillary_distance}} / ALT: {{item.object.measure.pupillary_height}}</span>
                  <span v-if="item.object.measure && item.len != 1" class="badge badge-danger">DP: {{item.object.measure.pupillary_distance}} / ALT: {{item.object.measure.pupillary_height}}</span>
                </td>
                <td>
                  <b-dropdown id="ddown1" text="Ações" variant="outline-primary">
                      <b-dropdown-item v-if="!item.nota && item.emailNf" @click="() => {
                    $swal.fire({
                      title: `Você tem certeza?`,
                      text: `Deseja realmente emitir essa nota?`,
                      icon: 'info',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Sim',
                      cancelButtonText: 'Não'
                    }).then((result) => {
                      if (result.value) {
                        const order = item.son ? item.son : item.id
                        generateNf(order)
                      }
                    });
                  }">Gerar Nota Fiscal </b-dropdown-item>
                      <b-dropdown-item v-if="!item.emailNf"><router-link :to="`/admin/company/edit/${item.idCompany}`">Cadastrar e-mail XML</router-link></b-dropdown-item>
                      <b-dropdown-item @click="getInfoOrder(index)" v-b-modal.modalright>Informações do pedido</b-dropdown-item>
                      <b-dropdown-item>
                        <router-link :to="`/admin/order/measure/${item.id}`" :id="`measure${item.id}`">Eye Measure</router-link>
                        </b-dropdown-item>
                      <b-dropdown-divider></b-dropdown-divider>
                      <b-dropdown-item @click="deleteOrder(item.id)">Excluir Pedido</b-dropdown-item>
                  </b-dropdown>
                </td>
              </tr>
            </tbody>
          </table>
          <b-pagination v-if="total > 100"
            size="sm"
            align="center"
            :total-rows="total"
            :per-page="100"
            @change="(numbe) => {
              filter.page = numbe;
              getOrder();
            }"
          />
        </div>
        <div v-else class="alert">Nenhuma informação foi encontrada</div>
      </b-card>
    </b-colxx>
  </b-row>

  <b-modal v-if="order" id="modalright" ref="modalright" :title="`Pedido #${order.id}`" modal-class="modal-right">
      <b>Data: </b>{{order.date}}<br />
      <b>Empresa: </b>{{order.empresa.split('-')[0]}}<br />
      <b>Colaborador: </b>{{order.object.info.name}}<br />
      <b>Valor: </b>{{order.value}}<br />
      <div v-if="order.object.measure">
        <b>DP:</b> {{order.object.measure.pupillary_distance}}<br />
        <b>ALT:</b> {{order.object.measure.pupillary_height}}<br />
      </div>
      <div v-if="order.feedback.feedback">
        <b>Feedback: </b>{{order.feedback.feedback}}<br />
        <b>Nota: </b><stars :disabled="true" v-model="order.feedback.rate"></stars><br />
      </div>
      <div v-if="order.object.pc">
        <b>PC: </b>{{order.object.pc.number}}<br />
        <a :href="baseURL + order.object.pc.file" target="_blank" class="btn btn-outline-info">Ver</a><br />
      </div>
      <hr>
      <div v-for="item in order.object.lens" :key="item.code">
        <b>{{item.type}}</b> {{item.name}}
      </div>
      <div>
        <b>Face: </b><br />
        <img class="w-100 mb-3" :src="baseURL + order.object.face" v-if="isImage(order.object.face)" alt="">
        <iframe height="350" v-else class="w-100 mb-3" :src="baseURL + order.object.face" frameborder="0"></iframe>
        <b>Receita: </b><br />
        <img class="w-100 mb-3" :src="baseURL + order.object.recipe" v-if="isImage(order.object.recipe)" alt="">
        <iframe height="350" v-else class="w-100 mb-3" :src="baseURL + order.object.recipe" frameborder="0"></iframe>

          <div v-if="items[index].len != 1" @click="changeLen(1)"><img :src="check" alt="" class="img-input"> Lente solicitada</div>
          <div v-else><img :src="checked" alt="" class="img-input"> Lente solicitada</div>
      </div>
      <div>

      </div>
      <template slot="modal-footer">
          <b-button v-if="order.status == 'Pendente'" variant="success" @click="changeStatus('approved', order.id)">Aprovar</b-button>
          <b-button v-if="order.status == 'Pendente'" variant="danger" @click="changeStatus('reproved', order.id)">Reprovar</b-button><br>
          <b-button v-if="order.status == 'Pendente'" variant="primary" @click="reenviar(order.id)">Reenviar</b-button>
          <b-button variant="info" @click="hideModal('modalright')">Fechar</b-button>
      </template>
  </b-modal>

</div>
</template>
<script>
import check from '@/assets/img/check.svg'
import checked from '@/assets/img/checked.svg'
import { api, baseURL } from '@/constants/config'
import Stars from '@/components/Common/Stars';
export default {
  components: {
    'stars': Stars
  },
  data () {
    return {
      check,
      checked,
      baseURL,
      filter: {},
      items: null,
      data: null,
      order: null,
      selectAll: false,
      filter: {},
      total: 0,
      index: null,
      processing: null
    }
  },
  computed: {
    },
  methods: {
    isPage(page) {
      return this.$route.path.split('/')[2] == page
    },
     isImage(ima){
      let existe = ['png', 'jpeg', 'jpg', 'gif', 'svg', 'heic'].map(r => { return ima.split(';')[0].indexOf(r) }).filter(r => r >= 0);
      return existe.length
    },
    async getOrder() {
      document.querySelector('.load-generic').classList.toggle('d-flex');
      this.processing = true;
      const items = await api.get('/admin/order', {params: this.filter});
      this.items = items.data.data.orders.map(r => {
        r.checked = false;
        return r
      });

      this.processing = false;
      this.total = items.data.data.total
      this.smoothScrollTo(0, 0, 500);
      document.querySelector('.load-generic').classList.toggle('d-flex');
    },
    getInfoOrder(index) {
      this.index = index;
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
    },
    async deleteOrder(id){
      this.$swal.fire({
        title: "Você está certo disso?",
        text: "Você deseja realmente deletar esse pedido?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: 'Deletar',
        confirmButtonColor: '#d33',
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true,
        preConfirm: async (login) => {
            id = [id];

            if(id.length > 0){
              const response = await api.put('/admin/order/multidelete', {id});
              return response.data;
            }else{
              return {
                status: 'error',
                title: "Você não selecionou nenhum pedido"
              }
            }

        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        this.$swal.fire({
          text: result.value.message,
          icon: result.value.status == 'success' ? 'success' : 'warning'
        });
        this.getOrder();
      })
    },
    async alertActionDelete(){
      this.$swal.fire({
        title: "Você está certo disso?",
        text: "Você deseja realmente deletar os pedidos selecionados",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: 'Deletar',
        confirmButtonColor: '#d33',
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true,
        preConfirm: async (login) => {
            let id = [];
            this.items.filter(r => r.checked).forEach(el => {
              id.push(el.id)
            });

            if(id.length > 0){
              const response = await api.put('/admin/order/multidelete', {id});
              return response.data;
            }else{
              return {
                status: 'error',
                title: "Você não selecionou nenhum pedido"
              }
            }

        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        this.$swal.fire({
          text: result.value.message,
          icon: result.value.status == 'success' ? 'success' : 'warning'
        });
        this.getOrder();
      })

    },
    sum_array(arr) {
        let total = 0;
        arr.forEach(e => {
          total += Number(e)
        });

        return total;
      },

    async alertAction(message, status, action){
      await this.$swal.fire({
        title: `O que você acha?`,
        text: `${message}`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        showLoaderOnConfirm: true,
      }).then((result) => {
        if (result.value) {
          let id = [];
          let cnpj = '';
          let valid = true;
          this.items.filter(r => r.checked).forEach(el => {
            if(cnpj == el.cnpj || cnpj == '') {
              id.push(el.id)
              cnpj = el.cnpj
            }else{
              valid = false;
            }
          });
          if(valid) {
            this.generateNf(id)

          }else{
            this.$swal.fire({
              title: `Isso não pode!`,
              text: `Você só pode unificar notas da mesma empresa`,
              icon: 'warning',
            });
          }
        }
      });
    },
    async generateNf(idOrder) {
      const response = await api.post(`/admin/order/generateNF`, {
        order: idOrder
      });

      let data = response.data;
      this.$swal.fire({
        title: `${data.status == 'success' ? 'Sucesso' : 'Ops..!'}`,
        text: `${data.message}`,
        icon: `${data.status}`,
      });
      this.getOrder();

    },
    async changeLen(len){
      const order = this.items[this.index];
      this.items[this.index].len = len
      const response = await api.put(`/admin/order/${order.id}`, {
        len
      })
      this.$notify("success", 'Sucesso', "Status de lente alterado com sucesso", {
          duration: 3000,
          permanent: false
      });
      this.hideModal('modalright')
      this.getOrder();
    },
    targetSelectAll() {
      this.selectAll = !this.selectAll;
        this.items = this.items.map(r => {
          r.checked = this.selectAll
          return r
        })
    },

    smoothScrollTo(endX, endY, duration) {
      const startX = window.scrollX || window.pageXOffset;
      const startY = window.scrollY || window.pageYOffset;
      const distanceX = endX - startX;
      const distanceY = endY - startY;
      const startTime = new Date().getTime();

      duration = typeof duration !== 'undefined' ? duration : 400;

      // Easing function
      const easeInOutQuart = (time, from, distance, duration) => {
        if ((time /= duration / 2) < 1) return distance / 2 * time * time * time * time + from;
        return -distance / 2 * ((time -= 2) * time * time * time - 2) + from;
      };

      const timer = setInterval(() => {
        const time = new Date().getTime() - startTime;
        const newX = easeInOutQuart(time, startX, distanceX, duration);
        const newY = easeInOutQuart(time, startY, distanceY, duration);
        if (time >= duration) {
          clearInterval(timer);
        }
        window.scroll(newX, newY);
      }, 1000 / 60); // 60 fps
    },



  },
  created(){
    this.getOrder();
  },

}
</script>
<style>
.img-input {
    width: 20px
}

/* .son {
  background: #fff;
}

.parent {
  background: #eee;
} */
</style>
