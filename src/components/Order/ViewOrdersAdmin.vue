<template>
  <div>
      <b-modal id="viewOrder" size="lg" ref="viewOrder" hide-header hide-footer>
        <b-row v-if="order">
          <b-colxx>
            <div class="area-order">
              <div class="step" v-if="order.status.length">

                <div class="step-item" v-for="(status, iStatus) in order.status" :key="iStatus">
                  <div class="step-icon active">
                    <i :class="status.icon" />
                  </div>
                  <h5>{{status.status}}</h5>
                  <h6>{{status.added | datetime}}</h6>
                </div>

              </div>
              <hr>
              <h3>Informações do pedido</h3>

              <b-row v-if="order.order[0].type == '1'" >
                <b-colxx md="8">
                  <p class="mb-1"><b>Empresa: </b> {{order.order[0].name}}</p>
                  <p class="mb-1"><b>CNPJ: </b> {{order.order[0].cnpj}}</p>
                  <p class="mb-1"><b>Solicitante: </b> {{order.order[0].vendedor}}</p>
                  <p class="mb-1"><b>Valor: </b> {{order.order[0].value | numeroPreco}}</p>
                  <hr>

                  <div v-if="order.order[0].type == '1'" style="max-height:65vh; overflow: auto;">
                    <div v-for="(item, iItem) in order.order.filter(r => r.type == 1)" :key="iItem">

                      <h5>#{{item.id}}</h5>
                      <p class="mb-0" v-for="(info, iInfo) in JSON.parse(item.attributes).info" :key="iInfo"><b>{{iInfo == 'name' ? 'Nome' : iInfo}}: </b> {{info}}</p>
                      <div v-if="JSON.parse(item.attributes).measure">
                        <span class="badge badge-success">DP: {{JSON.parse(item.attributes).measure.pupillary_distance}} /
                        ALT: {{JSON.parse(item.attributes).measure.pupillary_height}} </span>
                      </div>
                      <p class="mb-0" v-for="len in JSON.parse(item.attributes).lens" :key="len.code">
                        <b>{{len.type}}</b> {{len.name}} <span v-if="len.type == 'Óculos'">{{JSON.parse(item.attributes).product.filter(r => r.name).map(r => r.value).join(' ')}}</span>
                      </p>
                      <div class="mt-4" v-if="JSON.parse(item.attributes).pc">
                        <b>Pedido de compra: </b>
                        <hr class="my-1">
                        <a target="_blank" v-if="JSON.parse(item.attributes).pc.file" :href="baseURL+JSON.parse(item.attributes).pc.file" class="btn btn-outline-success btn-xs">Ver pedido <i class="simple-icon-book-open" /></a>
                        <p v-if="JSON.parse(item.attributes).pc.number"><b>Numero: </b> {{JSON.parse(item.attributes).pc.number}} </p>
                      </div>

                      <p class="mb-0 mt-2" v-if="item.acessorio"><b>Acessórios:</b></p>
                      <table class="table table-striped" v-if="item.acessorio">
                        <thead>
                          <tr>
                            <th>Nome</th>
                            <th>QTD</th>
                            <th>Unitário </th>
                            <th>Preço </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(itemA, index) in JSON.parse(item.acessorio)" :key="index">
                            <td>{{itemA.name + ' ' + itemA.attributes.map(r => r.value).join(' ') }}</td>
                            <td>{{itemA.qty}}</td>
                            <td>{{itemA.price | numeroPreco}}</td>
                            <td> {{itemA.qty * itemA.price | numeroPreco}} </td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="mt-2">
                        <button @click="orderSelected = item" class="btn btn-xs btn-outline-info">Visualizar <i class="simple-icon-eye" /></button>

                        <router-link :to="`/admin/proposal/edit/${item.id}`" class="btn btn-xs btn-info">Editar <i class="simple-icon-pencil" /></router-link>

                        <button v-if="['approved'].indexOf(order.order[0].status) >= 0 && item.len == '0'"  @click="alertActionOnly(item.id, 'len', 'Deseja realmente confirmar a solicitação de lente? ')" class="btn btn-xs btn-outline-success">Solicitar lente <i class="simple-icon-magic-wand" /></button>

                        <button v-if="['approved'].indexOf(order.order[0].status) >= 0 && item.len == '1'" class="btn btn-xs btn-success">Lente já solicitada <i class="simple-icon-magic-wand" /></button>

                        <router-link v-if="['approved'].indexOf(order.order[0].status) >= 0" :to="`/admin/order/measure/${item.id}`" class="btn btn-warning btn-xs mr-2">Medição <i class="simple-icon-eye" /></router-link>

                        <button @click="alertActionOnly(item.id, 'deleted', 'Deseja realmente deletar essa proposta? ')" class="btn btn-outline-danger btn-xs mr-2">Deletar <i class="simple-icon-trash" /></button>

                      </div>
                      <hr>
                    </div>
                  </div>

                  <!-- <div v-if="['pending', 'reproved', 'awaiting'].indexOf(order.order[0].status) >= 0" class="controllers d-flex justify-content-start">
                    <button @click="alertActionOnly(order.order[0].id, 'approved', 'Deseja realmente aprovar essa proposta? ')" class="btn btn-success btn-sm mr-2">Aprovar/PV <i class="simple-icon-check" /></button>
                    <button @click="alertActionOnly(order.order[0].id, 'reproved', 'Deseja realmente reprovar essa proposta? ')" class="btn btn-danger btn-sm mr-2">Reprovar <i class="simple-icon-close" /></button>
                    <button  @click="alertActionOnly(order.order[0].id, 'resend', 'Deseja realmente reenviar essa proposta? ')" class="btn btn-info btn-sm mr-2">Reenviar proposta <i class="simple-icon-envelope" /></button>
                  </div>

                  <div v-if="['approved'].indexOf(order.order[0].status) >= 0" class="controllers d-flex justify-content-start">
                    <button @click="alertActionOnly(order.order[0].id, 'approved', 'Deseja realmente emitir a NF? ')" class="btn btn-success btn-sm mr-2">Emitir NF <i class="simple-icon-check" /></button>
                    <button  @click="alertActionOnly(order.order[0].id, 'pending', 'Deseja realmente voltar para proposta? ')" class="btn btn-warning btn-sm mr-2">Tornar proposta <i class="simple-icon-control-start" /></button>
                  </div> -->

                </b-colxx>
                <b-colxx md="4">
                  <div v-if="!orderSelected" class="d-flex align-itens-center justify-content-center h-100 text-center" style="align-items: center;">
                    Clique no pedido ao lado para visualizar anexos (Face e Receita)
                  </div>

                  <div v-if="orderSelected">
                    #{{orderSelected.id}}
                    <div class="d-flex flex-column flex-start">
                      <h6 class="m-0">Face</h6>
                      <single-lightbox v-if="orderSelected.face.indexOf('.pdf') < 0" :thumb="baseURL + orderSelected.face" :large="baseURL + orderSelected.face" class-name="w-100 mx-auto d-block p-2" />
                      <a v-else target="_blank" :href="baseURL + orderSelected.face" class="btn btn-info">Ver pedido</a>
                    </div>
                    <div class="d-flex flex-column flex-start">
                      <h6 class="m-0">Receita</h6>
                      <single-lightbox v-if="orderSelected.recipe.indexOf('.pdf') < 0" :thumb="baseURL + orderSelected.recipe" :large="baseURL + orderSelected.recipe" class-name="w-100 mx-auto d-block p-2" />
                      <a v-else target="_blank" :href="baseURL + orderSelected.recipe" class="btn btn-info">Ver pedido</a>

                    </div>
                  </div>

                </b-colxx>
              </b-row>

              <b-row v-if="order.order[0].type == '3'">
                <b-colxx md="12">
                  <table class="table table-striped" v-if="order.order[0]">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Nome</th>
                        <th>Quantidade</th>
                        <th>Unitário </th>
                        <th>Preço </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in JSON.parse(order.order[0].attributes)" :key="index">
                        <td>
                          <div class="w-100px bg-white">
                            <single-lightbox :thumb="baseURL+item.img" :large="baseURL+item.img" class-name="w-100" />
                          </div>
                        </td>
                        <td>{{item.name + ' ' + item.attributes.map(r => r.value).join(' ') }}</td>
                        <td>{{item.qty}}</td>
                        <td>{{item.price | numeroPreco}}</td>
                        <td> {{item.qty * item.price | numeroPreco}} </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td class="text-right" colspan="5">
                          <p>Valor total: <b>{{ getTotalCart(JSON.parse(order.order[0].attributes)) | numeroPreco }} </b> </p>
                        </td>
                      </tr>
                    </tfoot>
                  </table>

                  <!-- <div v-if="['pending', 'reproved', 'awaiting'].indexOf(order.order[0].status) >= 0" class="controllers d-flex justify-content-start">
                    <button @click="alertActionOnly(order.order[0].id, 'approved', 'Deseja realmente aprovar essa proposta? ')" class="btn btn-success btn-sm mr-2">Aprovar/PV <i class="simple-icon-check" /></button>
                    <button @click="alertActionOnly(order.order[0].id, 'reproved', 'Deseja realmente reprovar essa proposta? ')" class="btn btn-danger btn-sm mr-2">Reprovar <i class="simple-icon-close" /></button>
                    <button  @click="alertActionOnly(order.order[0].id, 'resend', 'Deseja realmente reenviar essa proposta? ')" class="btn btn-info btn-sm mr-2">Reenviar proposta <i class="simple-icon-envelope" /></button>
                  </div>

                  <div v-if="['approved'].indexOf(order.order[0].status) >= 0" class="controllers d-flex justify-content-start">
                    <button @click="alertActionOnly(order.order[0].id, 'approved', 'Deseja realmente emitir a NF? ')" class="btn btn-success btn-sm mr-2">Emitir NF <i class="simple-icon-check" /></button>
                    <button  @click="alertActionOnly(order.order[0].id, 'pending', 'Deseja realmente voltar para proposta? ')" class="btn btn-warning btn-sm mr-2">Tornar proposta <i class="simple-icon-control-start" /></button>
                  </div> -->
                </b-colxx>
              </b-row>

            </div>
          </b-colxx>
        </b-row>
        <b-row v-else>
          <b-colxx class="text-center">
            {{order}}
            <h3>Buscando Pedido...</h3>
          </b-colxx>
        </b-row>
      </b-modal>
  </div>
</template>

<script>

import {
    mapGetters,
    mapActions,
    mapState,
} from "vuex";
import SingleLightbox from "@/components/Pages/SingleLightbox";
import {api, baseURL} from '@/constants/config';
export default {
    props:["orderId"],
    components: {
      "single-lightbox": SingleLightbox,
    },
    computed:{},
    data(){
      return {
        baseURL: 'https://api.idsafety.com.br/',
        order: null,
        orderSelected: null
      }
    },
    methods:{
      somethingModal (refname) {
        this.$refs[refname].hide();
        if (refname === 'modalnestedinline') {
          this.$refs['modalnested'].show()
        }
      },
      async getOrder(){
        this.orderSelected = null
        this.order = null;
        const data = await api.get(`/order/view/${this.orderId}`);
        if(data.data.status == 'success') {
          console.log(data.data.data)
          this.order = data.data.data
        }
      },
      getTotalCart(cart){
        console.log('Cart:', cart);
        let total = 0;
        cart.forEach(element => {
          total += element.qty * element.price
        });
        return total;
      },
      async alertActionOnly(id, type, message){
        let response;
        this.$swal.fire({
          title: "Você está certo disso?",
          text: message,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          confirmButtonColor: '#6d6',
          cancelButtonText: "Cancelar",
          showLoaderOnConfirm: true,
          preConfirm: async (login) => {
              switch (type) {
                case 'approved':
                  response = await api.post(`/admin/order/changeStatus`, {
                    status: type,
                    order: id
                  })
                break;
                case 'reproved':
                  response = await api.post(`/admin/order/changeStatus`, {
                    status: type,
                    order: id
                  })
                break;
                case 'proposal':
                  response = await api.post(`/admin/order/changeStatus`, {
                    status: type,
                    order: id
                  })
                break;
                case 'resend':
                  response = await api.post(`/order/reSend`, {
                    order: id
                  });
                break;
                case 'deleted':
                  response = await api.put('/admin/order/multidelete', {id});
                break;
                case 'len':
                  response = await api.put(`/admin/order/${id}`, {
                    len: 1
                  });
                break;
                case 'nf':
                  response = await api.post(`/admin/order/generateNF`, {
                    order: id
                  });
                break;
                default:
                break;
              }
          },
          allowOutsideClick: () => !this.$swal.isLoading()
        }).then((result) => {
          this.getOrder();
        });
      },
    },
    created(){
    },
    watch:{
      orderId(){
        this.getOrder()
      }
    }
}
</script>
<style>
.w-100px {
  width: 100px;
}
.step {
  display: flex;
  position: relative;
  z-index: 1;
  justify-content: space-between;
}

.step::before {
  position: absolute;
  content: '';
  width: calc(100% - 68px);
  height: 3px;
  background: #07dae4;
  top: 30px;
  z-index: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
}

.step-item {
  display: flex;
  align-items: center;
  flex-direction: column;
  z-index: 0;
}

.step-icon {
  width: 60px;
  height: 60px;
  border: 3px solid #07dae4;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fff;

}

.step-icon i {
  font-size: 1.5rem;
  color: #07dae4;
}

.step-icon.active {
  background: #07dae4;
  border-color: #07dae4;
}
.step-icon.active i{
  color: #fff;
}

.step-item h5{
  font-size: 1rem;
  margin: 8px 0 0 0;
  color: #000;
}

.step-item h6{
  color: #adadad;
  font-weight: bold;
  font-size: .8rem;
}
</style>
