<template>
<div>
    <b-row v-if="!success">
        <b-colxx xxs="3" md="3" class="mt-4" v-if="company && false">
          <list-sap :company="company" @setOrder="setOrder" />
        </b-colxx>
        <b-colxx xxs="12" class="mt-4">
            <b-card class="mb-4" title="Confirmação da solicitação">
                <b-row v-if="order.type_user != 'distribuidor'">
                    <b-colxx md="3" lg="3" class="">
                        <h5 class="mb-2 mt-4 card-title">Dados do colaborador</h5>
                        <div v-if="order && order.info">
                            <p v-for="(field, index) in order.info" :key="index"><b>{{index == 'name' ? 'Nome': index}}: </b>{{field}}</p>
                        </div>
                        <div v-else>
                            <p class="text-center">Você não inseriu dados do coladorador <router-link to="/sap/information">Clique aqui</router-link> para adicionar</p>
                        </div>
                    </b-colxx>
                    <b-colxx md="3" lg="3" class="">
                        <h5 class="mb-2 mt-4 card-title">Produto Selecionado</h5>
                        <div v-if="order && order.product">
                            <p v-for="(pro, indexProduct) in order.product.filter(r => {if(r.attr != 'model') return r})" :key="indexProduct"><b>{{pro.attr}}: </b>{{pro.value}}</p>
                            <hr />
                            <div v-if="order.lens">
                                <div v-for="(lens, index) in order.lens" :key="index">
                                    <p v-for="(l, i) in lens" :key="i"><b>{{ index == 0 ? 'Lentes' : (index == 1 ? 'Dioptria' : 'Tratamento') }}: </b>{{l.name}}</p>
                                </div>

                            </div>
                            <img class="w-100" :src="`${baseURL}${order.product.image}`" alt="">
                        </div>
                        <div v-else>
                            <p class="text-center">Você ainda não selecionou o óculos <router-link to="/sap/products">Clique aqui</router-link> para adicionar</p>
                        </div>
                    </b-colxx>
                    <b-colxx md="3" lg="3" class="">
                        <h5 class="mb-2 mt-4 card-title">Captura da face</h5>
                        <div v-if="order && order.face">
                            <img v-if="isImage(order.face)" class="w-100" :src="`${baseURL}${order.face}`" alt="">
                            <iframe style="height:300px;" :src="`${baseURL}${order.face}`" v-else frameborder="0"></iframe>
                        </div>
                        <div v-else>
                            <p class="text-center">Você ainda não anexou a face <router-link to="/sap/face">Clique aqui</router-link> para anexar</p>
                        </div>
                    </b-colxx>
                    <b-colxx md="3" lg="3" class="">
                        <h5 class="mb-2 mt-4 card-title">Captura da receita</h5>
                        <div v-if="order && order.recipe">
                            <img v-if="isImage(order.recipe)" class="w-100" :src="`${baseURL}${order.recipe}`" alt="">
                            <iframe style="height:300px;" :src="`${baseURL}${order.recipe}`" v-else frameborder="0"></iframe>
                        </div>
                        <div v-else>
                            <p class="text-center">Você ainda não anexou a receita <router-link to="/sap/recipe">Clique aqui</router-link> para anexar</p>
                        </div>
                    </b-colxx>
                    <b-colxx class="d-flex justify-content-end mt-4">
                      <b-button variant="success" :disabled="processing" :class="{'mb-3 btn-multiple-state btn-shadow ml-3': true,
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
            </b-card>
        </b-colxx>
    </b-row>
    <b-row v-if="success" class="text-center align-items-center justify-content-center h-100">
      <b-colxx xxs="3" md="3" class="mt-4" v-if="company && false">
        <list-sap :company="company" @setOrder="setOrder" />
      </b-colxx>
      <b-colxx class="mt-4" xxs="12" md="12">
        <b-card>
          <b-colxx>
            <h2 class="text-success" v-if="!link">Pedido concluído com sucesso!</h2>
            <h2 class="text-success" v-if="link">Linha inserida com sucesso</h2>
            <h5 v-if="!link">Seu pedido foi concluído com sucesso e já está em processo de confecção.</h5>
            <h5 v-if="link">A linha na qual você preencheu foi concluída com sucesso! <br /> Você tem outras linhas pendentes se quiser conclui-lás clique no botão abaixo</h5>

            <router-link v-if="link" :to="`/sap-order/${link}`" class="btn btn-outline-success">Nova solicitação</router-link>
          </b-colxx>
        </b-card>
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
import listSap from '@/components/ListSap';

export default {
    components: {
        'my-breadcrumb': myBreadCrumb,
        'list-sap': listSap,
    },
    data() {
        return {
            order: null,
            baseURL,
            processing: false,
            uploadError: false,
            orderAwaiting: 0,
            success: false,
            company: JSON.parse(window.localStorage.getItem('information')),
            link: null
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
    },
    methods: {
      ...mapActions(['getAwaitingOrders']),
      isImage(ima){
        let existe = ['png', 'jpeg', 'jpg', 'gif', 'svg', 'heic'].map(r => { return ima.split(';')[0].indexOf(r) }).filter(r => r >= 0);
        return existe.length
      },
      sendInfo: async function(){
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

            let orderSeted = 0;
            let information = JSON.parse(window.localStorage.getItem('information'));

            if(information.orders.length > 1) {
              let used = information.orders.filter(r => r.used);
              console.log(used)
              if(used.length == 0) {
                this.$notify("error", 'Opsss...!', 'Você precisa selecionar um pedido para vincularmos a essa solicitação', {
                    duration: 10000,
                    permanent: false
                });
                this.processing = false;
                return false;
              }else{
                orderSeted = used[0].order;
              }
            }else{
              orderSeted = order.company.order;
            }

            order.order_id = orderSeted;

            const response = await api.put('/ariba/order', order);
            let data = response.data;
            if(data.status == 'success') {
                this.$notify("success", order.new ? 'Sucesso' : `Sucesso`, data.message, {
                    duration: 3000,
                    permanent: false
                });

                information.orders = information.orders.map(r => {
                  if(r.used) r.status = 'complete'
                  return r
                });

                window.localStorage.removeItem('order');
                this.success = true

                if(information.orders.filter(r => r.status == 'incomplete').length > 0) {
                  this.link = data.redirect
                }

                window.localStorage.setItem('information', JSON.stringify(information));
                window.localStorage.removeItem('order');
            }else{
                this.uploadError = false;
                this.$notify("error", 'Opsss...!', data.message, {
                    duration: 3000,
                    permanent: false
                });
                this.processing = false
            }


          }
      },
      infoOrder: function() {
          this.order = JSON.parse(window.localStorage.getItem('order'));
          if(!this.order) {
              this.$router.push('/login');
          }
      },

      setOrder: function(order){
        let information = JSON.parse(window.localStorage.getItem('information'));
        information.orders = information.orders.map((r, i) => {
          r.used = i == order ? true : false;
          return r
        });

        window.localStorage.setItem('information', JSON.stringify(information))
      }
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
