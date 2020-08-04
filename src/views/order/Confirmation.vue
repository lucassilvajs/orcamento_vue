<template>
<div>
    <my-breadcrumb />
    <b-row>
        <b-colxx xxs="12">
            <b-card class="mb-4" title="Confirmação da solicitação">
                <b-row>
                    <b-colxx md="3" lg="3" class="">
                        <h5 class="mb-2 mt-4 card-title">Dados do colaborador</h5>
                        <div v-if="order && order.info">
                            <p v-for="(field, index) in order.info" :key="index"><b>{{index == 'name' ? 'Nome': index}}: </b>{{field}}</p>
                        </div>
                        <div v-else>
                            <p class="text-center">Você não inseriu dados do coladorador <router-link to="/app/order/information">Clique aqui</router-link> para adicionar</p>
                        </div>
                    </b-colxx>
                    <b-colxx md="3" lg="3" class="">
                        <h5 class="mb-2 mt-4 card-title">Produto Selecionado</h5>
                        <div v-if="order && order.product">
                            <p v-if="order.product.name"><b>Nome: </b>{{order.product.name}}</p>
                            <p v-if="order.product.size"><b>Tamanho: </b>{{order.product.size}}</p>
                            <p v-if="order.product.color"><b>Cor: </b>{{order.product.color}}</p>
                            <div v-if="order.product.attributes">
                              {{order.product.attributes}}
                              <!-- <p v-for="(attr, iAttr) in order.product.attributes" :key="iAttr">- <b>{{attr.select}}</b></p> -->
                            </div>
                            <hr />
                            <div v-if="order.lens">
                                <div v-for="(lens, index) in order.lens" :key="index">
                                    <p v-for="(l, i) in lens" :key="i"><b>{{ index == 0 ? 'Lentes' : (index == 1 ? 'Dioptria' : 'Tratamento') }}: </b>{{l.name}}</p>
                                </div>

                            </div>
                            <img class="w-100" :src="`${baseURL}${order.product.image}`" alt="">
                        </div>
                        <div v-else>
                            <p class="text-center">Você ainda não selecionou o óculos <router-link to="/app/order/products">Clique aqui</router-link> para adicionar</p>
                        </div>
                    </b-colxx>
                    <b-colxx md="3" lg="3" class="">
                        <h5 class="mb-2 mt-4 card-title">Captura da face</h5>
                        <div v-if="order && order.face">
                            <img v-if="isImage(order.face)" class="w-100" :src="`${baseURL}${order.face}`" alt="">
                            <iframe style="height:300px;" :src="`${baseURL}${order.face}`" v-else frameborder="0"></iframe>
                        </div>
                        <div v-else>
                            <p class="text-center">Você ainda não anexou a face <router-link to="/app/order/face">Clique aqui</router-link> para anexar</p>
                        </div>
                    </b-colxx>
                    <b-colxx md="3" lg="3" class="">
                        <h5 class="mb-2 mt-4 card-title">Captura da receita</h5>
                        <div v-if="order && order.recipe">
                            <img v-if="isImage(order.recipe)" class="w-100" :src="`${baseURL}${order.recipe}`" alt="">
                            <iframe style="height:300px;" :src="`${baseURL}${order.recipe}`" v-else frameborder="0"></iframe>
                        </div>
                        <div v-else>
                            <p class="text-center">Você ainda não anexou a receita <router-link to="/app/order/recipe">Clique aqui</router-link> para anexar</p>
                        </div>
                    </b-colxx>
                </b-row>
            </b-card>
        </b-colxx>
    </b-row>
    <b-row>
        <b-colxx class="d-flex justify-content-end">
          <button v-if="!hasMultiple" class="show-success btn btn-info mb-3 btn-multiple-state btn-shadow ml-3" @click="() => {
              if(order) {
                order.new = true;
              }
              sendInfo()
            }">
            <span class="label">Finalizar e iniciar nova solicitação</span>
            <span class="spinner d-inline-block">
              <span class="bounce1"></span>
              <span class="bounce2"></span>
              <span class="bounce3"></span>
            </span>
            <span class="icon success">
              Finalizar e iniciar nova solicitação
            </span>
          </button>

            <b-button v-if="awaitingOrders.length == 0" variant="success" :disabled="processing" :class="{'mb-3 btn-multiple-state btn-shadow ml-3': true,
                'show-spinner': processing,
                'show-success': !processing && uploadError===false,
                'show-fail': !processing && uploadError }" @click="sendInfo">
                <span class="spinner d-inline-block">
                    <span class="bounce1"></span>
                    <span class="bounce2"></span>
                    <span class="bounce3"></span>
                </span>
                <span class="icon success">
                    Enviar Solicitação
                </span>
                <span class="icon fail">
                    <i class="simple-icon-exclamation"></i>
                </span>
                <span class="label">Enviar Solicitação</span>
            </b-button>
        </b-colxx>
    </b-row>
</div>
</template>

<script>
import {
    mapGetters,
    mapMutations,
    mapActions
} from 'vuex'
import {api, baseURL} from '@/constants/config';
import myBreadCrumb from '@/components/breadcrumb';
export default {
    components: {
        'my-breadcrumb': myBreadCrumb
    },
    data() {
        return {
            order: null,
            baseURL,
            processing: false,
            uploadError: false,
            orderAwaiting: 0
        }
    },

    computed: {
        ...mapGetters(["loginError", "awaitingOrders"]),
        valido: function(){
            let message = '';
            let status = true;

            let order = window.localStorage.getItem('order');
            order = JSON.parse(order)

            try {
              order.info.name
            } catch (error) {
                 status = false;
                message += '- Nome do solicitante<br />';
            }

            //Product
            try {
              order.product
            } catch (error) {
              status = false;
              message += '- Óculos<br />';
            }

            try {
              order.face
            } catch (error) {
                status = false;
                message += '- Imagem da face<br />';
            }

            try {
              order.recipe
            } catch (error) {
                status = false;
                message += '- Imagem da receita<br />';
            }

            try {
              order.lens[0][0].name
              console.log(order.lens[0][0].name)
            } catch (error) {
                status = false;
                message +=  '- Tipo de lente<br />';
            }

            return {
                status,
                message
            }
        },
        hasMultiple: function(){
          return JSON.parse(window.localStorage.getItem('user')).user.multiple_order;
        }
    },
    methods: {
      ...mapActions(['getAwaitingOrders']),
      isImage(ima){
        let existe = ['png', 'jpeg', 'jpg', 'gif', 'svg', 'heic'].map(r => { return ima.split(';')[0].indexOf(r) }).filter(r => r >= 0);
        return existe.length
      },
      sendInfo: async function(){
        if(false) {
        }else{
          if(!this.valido.status) {
              this.$notify("error", "Faltam algumas coisas", this.valido.message, {
                  duration: 3000,
                  permanent: false
              });
          }else{
            this.processing = true;
            let order = JSON.parse(window.localStorage.getItem('order'));
            if(this.order.new) { // Verifica se o usuário necessita cadastrar multiplos pedidos antes de efetuar a proposta
              order.new = true;
            }
            const response = await api.post('/order', order);
            let data = response.data;
            if(data.status == 'success') {
                this.$notify("success", order.new ? 'Sucesso' : `Pedido #${data.data.order.id}`, data.message, {
                    duration: 3000,
                    permanent: false
                });

                window.localStorage.removeItem('order');
                this.$router.push(data.data.order.target);
            }else{
                this.uploadError = false;
                this.$notify("error", 'Opsss...!', data.message, {
                    duration: 3000,
                    permanent: false
                });
                this.processing = false
            }

            this.getAwaitingOrders();
          }
        }
      },
      infoOrder: function() {
          this.order = JSON.parse(window.localStorage.getItem('order'));
      },
    },
    created() {
        this.infoOrder();
    },
    watch: {
    }
}
</script>

<style scoped>
    p{
        margin-bottom: 5px!important;
    }

    .text-center a{
        color: #00b3b7
    }
</style>
