<template>
<div>
  <b-row v-if="!data">
    <b-colxx xxs="12" class="d-flex justify-content-center align-items-center">
    <h1>Buscando informações</h1>
    </b-colxx>
  </b-row>
  <b-row v-if="data">
    <b-colxx xxs="12">
      <h1>BI</h1>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row v-if="data">
    <b-colxx xl="6" lg="6" md="6" class="mb-4">
      <b-card title="Metas">
      <b-row>
        <b-colxx class="col-md-8 col-xs-12">
        <div v-for="(s,index) in data.metrics" :key="index" class="mb-4">
          <p class="mb-2">
            {{ s.label }}
            <span class="float-right text-muted">{{s.total.toFixed(2)}}/{{s.objective.toFixed(2)}}</span>
          </p>
          <b-progress :value="(s.total / s.objective) * 100"></b-progress>
        </div>
        </b-colxx>
        <b-colxx class="d-flex justify-content-center align-items-center">
        <div class="area-price w-100">
          <span>Faturamento:</span>
          <h2>{{data.metrics.sales.total | numeroPreco}}</h2>
          <div class="metrics d-flex justify-content-between">

          <span class="item">Ano Anterior
            <span class="valor" :class="[
              {'text-success': data.metrics.sales.progressSalesLastYear},
              {'text-danger': !data.metrics.sales.progressSalesLastYear}
            ]">{{ parseInt(100 * data.metrics.sales.total / data.metrics.sales.totalLastYear)}}%</span>
            <i class="glyph-icon p-0" id="tool-month" :class="[
              {'simple-icon-arrow-up-circle': data.metrics.sales.progressSalesLastYear},
              {'simple-icon-arrow-down-circle': !data.metrics.sales.progressSalesLastYear}
            ]"></i>
            <b-tooltip target="tool-month"
              placement="top"
              :title="`Faturado no ano anterior ${(data.metrics.sales.totalLastYear).toLocaleString('pt-BR', {style: 'currency', 'currency': 'BRL'})}`">
            </b-tooltip>
          </span>

          <span class="item">Meta mês<br />
            <span class="valor" :class="[
              {'text-success': data.metrics.sales.progressSales},
              {'text-danger': !data.metrics.sales.progressSales}
            ]">{{parseInt(data.metrics.sales.total * 100 / data.metrics.sales.objective)}}% </span>
            <i class="glyph-icon p-0" :class="[
              {'simple-icon-arrow-up-circle': data.metrics.sales.progressSales},
              {'simple-icon-arrow-down-circle': !data.metrics.sales.progressSales}
            ]"></i>
          </span>
          </div>
        </div>
        </b-colxx>
      </b-row>
      </b-card>
    </b-colxx>
    <b-colxx class="mb-4 col-md-6 col-lg-6 col-xl-6 col-12">
      <div class="icon-cards-row">
        <glide-component :settings="glideIconsOption">
          <icon-card v-for="(card, index) in data.orders" :key="index" :title="card.label" :icon="card.icon" :value="card.value" :total="card.total" :money="card.money" />
        </glide-component>
      </div>
    </b-colxx>
  </b-row>

  <b-row class="mb-4" v-if="data">
    <b-colxx>
    <b-card title="Consultores">
      <table class="table table-hover">
      <thead>
        <tr>
          <th>#</th>
          <th>Nome</th>
          <th>Vendas no Mês</th>
          <th>Meta</th>
          <th>Progresso</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(consu, index) in data.consult" :key="index">
        <td>{{index + 1}}</td>
        <td>{{consu.name}}</td>
        <td>{{consu.vendido | numeroPreco}}</td>
        <td>{{consu.today | numeroPreco}}</td>
        <td v-if="consu.today">{{ (parseFloat(consu.vendido) * 100 / parseFloat(consu.today)).toFixed(2) }}%<b-progress :value=" parseFloat(consu.vendido) * 100 / parseFloat(consu.today) "></b-progress></td>
        <td v-else>Meta não atribuida</td>
        <td><button v-b-modal.modalright class="btn btn-success btn-xs" @click="consult_select = index">Definir Meta</button></td>
        </tr>
      </tbody>
      </table>
    </b-card>
    </b-colxx>
  </b-row>

  <b-row>


    <b-colxx xl="6" lg="6" md="6" xxs="12" class="mb-4">
      <b-row>
        <b-colxx xxs="12">
          <b-card title="Top clientes não compradores">
            <span style="margin-top:-25px; display:block;">Empresas que nunca compraram</span>
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>Cadastro</th>
                  <th>CNPJ</th>
                </tr>
              </thead>
              <tbody v-if="list.companies.nobuy">
                 <tr v-for="(comp, index) in list.companies.nobuy" :key="index">
                  <td>{{index+1}}</td>
                  <td>{{comp.name}}</td>
                  <td>{{comp.created | date}}</td>
                  <td>{{comp.cnpj}}</td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr v-for="comp in 10" :key="comp">
                  <td colspan="5" class="demo"></td>
                </tr>
              </tbody>
            </table>
          </b-card>
        </b-colxx>
      </b-row>
    </b-colxx>

    <b-colxx xl="6" lg="6" md="6" xxs="12">
      <b-row>
        <b-colxx xxs="12">
          <b-card title="Top clientes perdidos">
            <span style="margin-top:-25px; display:block;">Clientes que não compram a mais de 30 dias</span>
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>Último Pedido</th>
                  <th>Total</th>
                  <th>Pedidos</th>
                </tr>
              </thead>
              <tbody v-if="list.companies.lose">
                 <tr v-for="(comp, index) in list.companies.lose" :key="index">
                  <td>{{index+1}}</td>
                  <td>{{comp.name}}</td>
                  <td>{{comp.last_order | date}}</td>
                  <td>R$ {{comp.total_month}}</td>
                  <td>{{comp.total_orders}}</td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr v-for="comp in 10" :key="comp">
                  <td colspan="5" class="demo"></td>
                </tr>
              </tbody>
            </table>
          </b-card>
        </b-colxx>
      </b-row>
    </b-colxx>

    <b-colxx xl="6" lg="6" md="6" xxs="12">
      <b-row>
        <b-colxx xxs="12">
          <b-card title="Top Empresas">
            <span style="margin-top:-25px; display:block;">Novas empresas cadastradas</span>
            <table class="table table-striped table-hover">
            <thead>
              <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Primeiro Pedido</th>
              <th>Total</th>
              <th>Pedidos</th>
              </tr>
            </thead>
            <tbody v-if="list.companies.sales">
              <tr v-for="(comp, index) in list.companies.sales" :key="index">
              <td>{{index+1}}</td>
              <td>{{comp.name}}</td>
              <td>{{comp.first_order | date}}</td>
              <td>{{comp.total_month}}</td>
              <td>{{comp.total_orders}}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr v-for="comp in 10" :key="comp">
              <td colspan="5" class="demo"></td>
              </tr>
            </tbody>
            </table>
          </b-card>
        </b-colxx>
      </b-row>
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
    <b-colxx xxs="12">
      <b-form-group :label="data.consult[consult_select].name" class="has-float-label">
      <Money class="form-control" v-model="data.consult[consult_select].meta"  v-bind="{ decimal: ',',thousands: '.',prefix: 'R$ ',suffix: '',precision: 2,masked: true,}"/>
      </b-form-group>
      <div class="ml-3 mt-1 mb-4" v-if="data.consult[consult_select].metas">
      <h5>Metas adicionadas</h5>
      <p class="mb-1" v-for="(val, index) in data.consult[consult_select].metas" :key="index"><b>{{index}}:</b> {{val | numeroPreco}}</p>
      </div>
    </b-colxx>
    <b-colxx xxs="12" class="my-3">
      <h5>ID Safety</h5>
    </b-colxx>
    <b-colxx xxs="12">
      <b-form-group label="ID Safety" class="has-float-label">
      <Money class="form-control" v-model="metasCompany"  v-bind="{ decimal: ',',thousands: '.',prefix: 'R$ ',suffix: '',precision: 2,masked: true,}"/>
      </b-form-group>
      <div class="ml-3 mt-1 mb-4" v-if="data.metasCompany">
      <h5>Metas adicionadas</h5>
      <p class="mb-1" v-for="(val, index) in data.metasCompany.metas" :key="index"><b>{{index}}:</b> {{val | numeroPreco}}</p>
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
      consult_select: 0,
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
      list: {
        companies: {
        sales: null,
        lose: null
        }
      },
      period: '',
      processing: false,
      errorButton: false,
      metasCompany: 0
    }
  },
  methods: {
    async getBI() {
      const response = await api.get('admin/bi');
      this.data = response.data.data

      const list = await api.get('admin/bi/list');
      this.list = list.data.data
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
      if(this.period.indexOf('/') < 0) this.period = this.period.slice(0,2)+'/'+this.period.slice(2);

      if(this.metasCompany != 'R$ 0,00'){
        console.log(this.data.consult)
        this.data.consult.push({meta: this.metasCompany, id: 0});
        this.metasCompany = 0;
      }

      this.processing = true;
      const response = await api.post('/admin/metas', {consult: this.data.consult, date: this.period});
      this.processing = false;
      this.$notify(response.data.status, response.data.status == 'error' ? 'Ops...!' : 'Sucesso!', response.data.message, {
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
        this.data.metasCompany = response.data.data.metasCompany;
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
<style scoped>

.demo {
  margin: auto;
  width: 100%;
  height: 30px;
  background-image: linear-gradient( 100deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 80% );
  background-repeat: repeat-y;
  background-size:50px 200px;
  background-position: 0 0;
}

.demo:nth-child(odd) {
  animation: shine 1s infinite;
}

.demo:nth-child(even) {
  animation: shine 2s infinite;
}

@keyframes shine {
  to {
  background-position:100% 0;
  }
}

.area-price h2 {
  color: #00b3b7;
}

.area-price > span {
  display: block;
  color: #8f8f8f;
}

.area-price .metrics .item{
  color: #8f8f8f;
}

.area-price .metrics .valor{
  color: #8f8f8f;
  font-size: 1.2em;
  margin-right: 5px;
}


</style>
