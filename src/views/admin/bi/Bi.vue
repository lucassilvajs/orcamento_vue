<template>
<div>
    <b-row>
        <b-colxx xxs="12">
            <h1>BI</h1>
            <div class="float-right">
              <button v-b-modal.modalright class="btn btn-success">Definir Meta</button>
            </div>
            <div class="separator mb-5"></div>
        </b-colxx>
    </b-row>
    <b-row v-if="data">
        <b-colxx xl="6" lg="6" md="6" class="mb-4">
            <b-card title="Metas">
                <div v-for="(s,index) in data.metrics" :key="index" class="mb-4">
                    <p class="mb-2">
                        {{ s.label }}
                        <span class="float-right text-muted">{{s.total}}/{{s.objective}}</span>
                    </p>
                    <b-progress :value="(s.total / s.objective) * 100"></b-progress>
                </div>
            </b-card>
        </b-colxx>
        <b-colxx lg="6">
            <div class="icon-cards-row">
                <glide-component :settings="glideIconsOption">
                    <icon-card v-for="(card, index) in data.orders" :key="index" :title="card.label" :icon="card.icon" :value="card.value" />
                </glide-component>
            </div>
        </b-colxx>
    </b-row>
    <b-row>
        <b-colxx xl="6" lg="6" md="6" xxs="12">
            <b-row>
                <b-colxx xxs="12">
                    <b-card title="Top Empresas">
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nome</th>
                                    <th>Último Pedido</th>
                                    <th>Total</th>
                                    <th>Pedidos Aprovados</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(comp, index) in data.companies.sales" :key="index">
                                    <td>{{index+1}}</td>
                                    <td>{{comp.name}}</td>
                                    <td>{{comp.last_order | date}}</td>
                                    <td>{{comp.total_month | numeroPreco}}</td>
                                    <td>{{comp.total_win}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </b-card>
                </b-colxx>
            </b-row>
        </b-colxx>
        <b-colxx>
            <b-row>
                <b-colxx xxs="12">
                    <b-card title="Perdidos">
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nome</th>
                                    <th>Último Pedido</th>
                                    <th>Total</th>
                                    <th>Pedidos reprovados</th>
                                </tr>
                            </thead>
                            <tbody>
                                 <tr v-for="(comp, index) in data.companies.lose" :key="index">
                                    <td>{{index+1}}</td>
                                    <td>{{comp.name}}</td>
                                    <td>{{comp.last_order | date}}</td>
                                    <td>{{comp.total_month | numeroPreco}}</td>
                                    <td>{{comp.total_lose}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </b-card>
                </b-colxx>
            </b-row>
        </b-colxx>
    </b-row>
    <b-row key="thumb">
        <b-colxx xxs="12" class="mb-3" v-for="(item,index) in values " :key="index" :id="item.id">
            <thumb-list-item :key="item.id" :data="item" v-contextmenu:contextmenu />
        </b-colxx>
    </b-row>

    <b-modal id="modalright" ref="modalright" title="Metas" modal-class="modal-right" v-if="data">
      <b-row>
        <b-colxx xxs="12">
          <b-form-group label="Mês da meta (mês/ano)" class="has-float-label mb-4">
            <the-mask class="form-control" v-model="period" :mask="['##/##', '##/####']" />
          </b-form-group>
        </b-colxx>
        <b-colxx xxs="12" class="my-3">
          <h5>Consultores</h5>
        </b-colxx>
        <b-colxx xxs="12" v-for="consult in data.consult" :key="consult.id">
          <b-form-group :label="consult.name" class="has-float-label">
            <Money class="form-control" v-model="consult.meta"  v-bind="{ decimal: ',',thousands: '.',prefix: 'R$ ',suffix: '',precision: 2,masked: true,}"/>
          </b-form-group>
          <div class="ml-3 mt-1 mb-4" v-if="consult.metas">
            <h5>Metas adicionadas</h5>
            <p class="mb-1" v-for="(val, index) in consult.metas" :key="index"><b>{{index}}:</b> {{val | numeroPreco}}</p>
          </div>
        </b-colxx>
      </b-row>
      <template slot="modal-footer">
          <b-button variant="success" @click="saveMeta()" :disabled="processing" :class="{'float-right btn-multiple-state btn-shadow': true,
                'show-spinner': processing,
                'show-success': !processing && errorButton===false,
                'show-fail': !processing && errorButton }">
                <span class="spinner d-inline-block">
                    <span class="bounce1"></span>
                    <span class="bounce2"></span>
                    <span class="bounce3"></span>
                </span>
                <span class="icon success">
                    Salvar Métricas
                </span>
                <span class="icon fail">
                    <i class="simple-icon-exclamation"></i>
                </span>
                <span class="label">Salvar Métricas</span>
            </b-button>

          <b-button variant="info" @click="hideModal('modalright')">Fechar</b-button>
      </template>
    </b-modal>
</div>
</template>

<script>
import {api, baseURL} from '@/constants/config';
import SmallLineChartCard from '@/components/Cards/SmallLineChartCard'
import GlideComponent from '@/components/Carousel/GlideComponent'
import { ThemeColors } from '@/utils'
import {Money} from '@/vmoney.js';
import {TheMask} from 'vue-the-mask';
const colors = ThemeColors()
import IconCard from '@/components/Cards/IconCard'
import GradientWithRadialProgressCard from '@/components/Cards/GradientWithRadialProgressCard'
import ThumbListItem from '@/components/Listing/ThumbListItem'
export default {
    components: {
        'small-line-chart-card': SmallLineChartCard,
        'icon-card': IconCard,
        'glide-component' : GlideComponent,
        'gradient-with-radial-progress-card': GradientWithRadialProgressCard,
        'thumb-list-item': ThumbListItem,
        TheMask,
        Money
    },
    data() {
        return {
            values:  [
        {
            id: 18,
            title: "Bebinca",
            img: "/assets/img/bebinca-thumb.jpg",
            category: "Desserts",
            status: "PROCESSED",
            statusColor: "secondary",
            description: "Homemade cheesecake with fresh berries and mint",
            sales: 574,
            stock: 16,
            date: "17.02.2020"
        },
        {
            id: 18,
            title: "Bebinca",
            img: "/assets/img/bebinca-thumb.jpg",
            category: "Desserts",
            status: "PROCESSED",
            statusColor: "secondary",
            description: "Homemade cheesecake with fresh berries and mint",
            sales: 574,
            stock: 16,
            date: "17.02.2020"
        }],
            glideIconsOption: {
                gap: 5,
                perView: 3,
                type: "carousel",
                breakpoints: {
                    320: {
                        perView: 1
                    },
                    576: {
                        perView: 1
                    },
                    1600: {
                        perView: 3
                    },
                    1800: {
                        perView: 3
                    }
                },
                hideNav: true
            },
            profileStatuses: [
                {
                    title: 'Vendas (R$)',
                    total: 18000,
                    status: 12500
                },
                {
                    title: 'Media',
                    total: 12,
                    status: 14
                },
            ],
            data: null,
            period: '',
            processing: false,
            errorButton: false
        }
    },
    methods: {
        async getBI() {
            const response = await api.get('admin/bi');
            this.data = response.data.data
        },
        async saveMeta() {
          if(this.period.length < 4){
            this.$notify("error", 'Opsss...!', 'Você precisa colocar o mês do vigor da meta', {
                duration: 3000,
                permanent: false
            });

            this.errorButton = true
            setTimeout(() => {
              this.errorButton = false
            }, 3000);


          }else{
            this.processing = true;
            if(this.period.indexOf('/') < 0) this.period = this.period.slice(0,2)+'/'+this.period.slice(2);
            const response = await api.post('/admin/metas', {consult: this.data.consult, date: this.period});
              this.processing = false;
            this.$notify(response.data.status, 'Opsss...!', response.data.message, {
              duration: 3000,
              permanent: false
            });

            if(response.data.status == 'error') {
              this.errorButton = true
              setTimeout(() => {
                this.errorButton = false
              }, 3000);
            }else{
              this.data.consult = response.data.data.consult;
            }
          }
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
    created() {
        this.getBI();
    }
}
</script>
