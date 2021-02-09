<template>
<div>
    <b-row class="mb-2">
      <b-colxx lg="4">
        <b-card no-body title="Faturamento" class="p-2 center-card">
          <span class="label-info">Faturamento</span>
          <h1 class="faturamento d-block"><count-number :total="data.faturamento.thisMonth" :speed="1000" /></h1>
          <div class="d-flex justify-content-center justify-content-between">
            <div class="d-flex flex-column text-center priceLastYear">
              <span class="label-info">Ano anterior</span>
              <span class="label-value" v-html="getPercent(data.faturamento.thisMonth, data.faturamento.lastYear)"></span>
              <span class="label-total">{{data.faturamento.lastYear | numeroPreco}}</span>
            </div>

            <div class="d-flex flex-column text-center priceLastMonth">
              <span class="label-info">Mês anterior</span>
              <span class="label-value" v-html="getPercent(data.faturamento.thisMonth, data.faturamento.lastMonth)"></span>
              <span class="label-total">{{data.faturamento.lastMonth | numeroPreco}}</span>
            </div>

            <div class="d-flex flex-column text-center priceProjetado">
              <span class="label-info">Meta</span>
              <span class="label-value" v-html="getPercent(data.faturamento.thisMonth, data.faturamento.meta)"></span>
              <span class="label-total">{{data.faturamento.meta | numeroPreco}}</span>
            </div>
          </div>
        </b-card>
      </b-colxx>
      <b-colxx lg="8">
        <b-card class="p-2 center-card">
          <span class="label-info">Faturamento (12 meses)</span>
          <line-shadow-chart :data="data.comparativo" :height="150" />
          <div class="d-flex align-items-center w-100 flex-row justify-content-center mt-2">
              <div class="legend present mr-5">Ano atual</div>
              <div class="legend past">Ano anterior</div>
          </div>
        </b-card>
      </b-colxx>
    </b-row>

    <b-row class="mb-2">
      <b-colxx lg="4">
        <b-card class="p-2 center-card" v-if="data.tv">
          <pie-chart :data="data.tv" :height="230" :options="{legend: {position: 'top',labels: {
      padding: 10,usePointStyle: true,fontSize: 12}},responsive: true,maintainAspectRatio: false,title: {display: false},
  layout: {padding: {bottom: 0}},tooltips: {enabled: false}}" />
        </b-card>
      </b-colxx>

      <b-colxx lg="8" v-if="data.infoConsult">
        <b-card class="p-2 center-card">
          <glide-component :settings="glideIconsOption">
            <icon-card-consult v-for="(card, index) in data.infoConsult" :key="index" :title="card.name" class="d-flex flex-column justify-content-center align-items-center">
              <radial-progress-card v-if="false" class="mx-auto" :title="$t('dashboards.work-progress')" :percent="(parseFloat(card.vendido) * 100 / parseFloat(card.today)).toFixed(1)" />

              <pie-chart-small :data="card.chart" :height="150"/>


            </icon-card-consult>
          </glide-component>
        </b-card>
      </b-colxx>
    </b-row>


    <b-row class="mb-2">
      <b-colxx lg="4">
        <b-card class="p-2 center-card" v-if="data.tv">
          <!-- <pie-chart :data="data.tv" :height="230" :options="{legend: {position: 'top',labels: {
      padding: 10,usePointStyle: true,fontSize: 12}},responsive: true,maintainAspectRatio: false,title: {display: false},
  layout: {padding: {bottom: 0}},tooltips: {enabled: false}}" /> -->
        </b-card>
      </b-colxx>

      <b-colxx lg="8" v-if="data.infoConsult">
        <b-card class="p-2 center-card">
          <glide-component :settings="glideIconsOption">
            <icon-card-consult v-for="(card, index) in [
            {name: 'DI ANCONA OTICA LTDA ME', last: '22/09/2020', total: '34668'},
            {name: 'SERVAL - SERVICOS E EQUIPAMENTOS INDUSTRIAIS LTDA', last: '22/09/2020', total: '1040 '},
            {name: '	FORSHIP ENGENHARIA S/A', last: '22/09/2020', total: '1050 '},
            {name: '	METSO BRASIL INDUSTRIA E COMERCIO LTDA', last: '22/09/2020', total: '350 '},
            {name: '		SOTREQ S/A', last: '22/09/2020', total: '1773 '},
            ]" :key="index" :title="card.name" class="d-flex flex-column justify-content-center align-items-center">
              <div class="mt-3">
                <p>{{card.last}} - {{card.total | numeroPreco}}</p>
              </div>
            </icon-card-consult>
          </glide-component>
        </b-card>
      </b-colxx>
    </b-row>
</div>
</template>

<script>
import {api, baseURL} from '@/constants/config';

import { ThemeColors } from '@/utils'
const colors = ThemeColors()


import {
    lineChartData,
    areaChartData,
    scatterChartData,
    radarChartData,
    pieChartData,
    doughnutChartData
} from '@/data/charts'
import LineShadowChart from '@/components/Charts/LineShadow'
import LineChart from '@/components/Charts/Line'
import PolarAreaShadowChart from '@/components/Charts/PolarAreaShadow'
import PolarAreaChart from '@/components/Charts/PolarArea'
import AreaShadowChart from '@/components/Charts/AreaShadow'
import AreaChart from '@/components/Charts/Area'
import ScatterShadowChart from '@/components/Charts/ScatterShadow'
import ScatterChart from '@/components/Charts/Scatter'
import BarShadowChart from '@/components/Charts/BarShadow'
import BarChart from '@/components/Charts/Bar'
import RadarShadowChart from '@/components/Charts/RadarShadow'
import RadarChart from '@/components/Charts/Radar'
import PieShadowChart from '@/components/Charts/PieShadow'
import PieChart from '@/components/Charts/Pie'
import DoughnutShadowChart from '@/components/Charts/DoughnutShadow'
import DoughnutChart from '@/components/Charts/Doughnut'

import GlideComponent from '@/components/Carousel/GlideComponent'
import IconCard from '@/components/Cards/IconCard';
import IconCardConsult from '@/components/Cards/IconCardConsult';
import ListWithUserItem from '@/components/Listing/ListWithUserItem'

import CountNumber from '@/components/Bi/CountNumber'
import RadialProgressCard from '@/components/Cards/RadialProgressCards'
import tickets from '@/data/tickets'


import {Money} from '@/vmoney.js';
import {TheMask} from 'vue-the-mask';
import PieShadowSmall from '../../../components/Charts/PieShadowSmall';

export default {
  components: {
      'radial-progress-card': RadialProgressCard,
      'line-chart': LineChart,
      'line-shadow-chart': LineShadowChart,
      'polar-area-chart': PolarAreaChart,
      'polar-area-shadow-chart': PolarAreaShadowChart,
      'area-chart': AreaChart,
      'area-shadow-chart': AreaShadowChart,
      'scatter-shadow-chart': ScatterShadowChart,
      'scatter-chart': ScatterChart,
      'bar-shadow-chart': BarShadowChart,
      'bar-chart': BarChart,
      'radar-shadow-chart': RadarShadowChart,
      'radar-chart': RadarChart,
      'pie-shadow-chart': PieShadowChart,
      'pie-chart': PieChart,
      'doughnut-shadow-chart': DoughnutShadowChart,
      'doughnut-chart': DoughnutChart,
      'glide-component' : GlideComponent,
      'icon-card-consult': IconCardConsult,
      'list-with-user-item': ListWithUserItem,
      'count-number': CountNumber,
      Money,
      TheMask,
      'pie-chart-small':PieShadowSmall
    },
    data() {
        return {
          list: {
            companies: {
            sales: null,
            lose: null
            }
          },
          lineChartData,
          areaChartData,
          scatterChartData,
          radarChartData,
          pieChartData,
          doughnutChartData,
          start: 3000,
          tickets,
          glideIconsOption: {
            autoplay:true,
            animationDuration: 3500,
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
          data: {
            orders: null,
            faturamento: null,
            consult: null,
            comparativo: null,
            infoConsult: null
          },
          filter: {
            faturamento: {
              year: new Date().getFullYear(),
              month: new Date().getMonth()+1,
            },
            comparativo: {
              year: [
                new Date().getFullYear(),
                new Date().getFullYear()-1
              ],
              period: 12,
            },
            consult: {
              status: {
                period: 30
              },
              id: 0
            }
          },
          consultCurrent: null,
          //Charts
          barChartData: {
            labels: ['Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            datasets: [
              {
                label: 'Ano Atual',
                borderColor: colors.themeColor1,
                backgroundColor: colors.themeColor1_10,
                data: [456, 479, 324, 569, 702, 600],
                borderWidth: 2
              },
              {
                label: 'Ano Anterior',
                borderColor: colors.themeColor2,
                backgroundColor: colors.themeColor2_10,
                data: [364, 504, 605, 400, 345, 320],
                borderWidth: 2
              },
              {
                label: 'Meta desse ano',
                borderColor: colors.themeColor3,
                backgroundColor: colors.themeColor3_10,
                data: [550, 550, 600, 600, 650, 650],
                borderWidth: 2
              }
            ]
          },
          polarConsultStatus: {
            labels: ['Cakes', 'Desserts', 'Cupcakes'],
            datasets: [
              {
                data: [80, 90, 70],
                borderWidth: 2,
                borderColor: [colors.themeColor1, colors.themeColor2, colors.themeColor3],
                backgroundColor: [
                  colors.themeColor1_10,
                  colors.themeColor2_10,
                  colors.themeColor3_10
                ]
              }
            ]
          },
          lineConsultCrm: {
            labels: ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            datasets: [
              {
                label: 'Prospecção/contato inicial',
                data: [0, 0, 0, 0, 0, 25, 135],
                borderColor: colors.themeColor1,
                pointBackgroundColor: colors.foregroundColor,
                pointBorderColor: colors.themeColor1,
                pointHoverBackgroundColor: colors.themeColor1,
                pointHoverBorderColor: colors.foregroundColor,
                pointRadius: 6,
                pointBorderWidth: 2,
                pointHoverRadius: 8,
                fill: false
              },
              {
                label: 'Follow-up',
                data: [0, 0, 0, 0, 0, 23, 80],
                borderColor: colors.themeColor2,
                pointBackgroundColor: colors.foregroundColor,
                pointBorderColor: colors.themeColor2,
                pointHoverBackgroundColor: colors.themeColor2,
                pointHoverBorderColor: colors.foregroundColor,
                pointRadius: 6,
                pointBorderWidth: 2,
                pointHoverRadius: 8,
                fill: false
              },
              {
                label: 'Agendamento (Visita, videoconferencia)',
                data: [0, 0, 0, 0, 0, 19, 120],
                borderColor: colors.themeColor3,
                pointBackgroundColor: colors.foregroundColor,
                pointBorderColor: colors.themeColor3,
                pointHoverBackgroundColor: colors.themeColor3,
                pointHoverBorderColor: colors.foregroundColor,
                pointRadius: 6,
                pointBorderWidth: 2,
                pointHoverRadius: 8,
                fill: false
              },
            ]
          }
        }
    },
    computed: {
      year() {
        let a = new Date();
        let arr = [];
        for(let i=2015; i<= a.getFullYear(); i++) {
          arr.push(i)
        }

        return arr;

      }
    },
    methods: {
      getInfoConsult(consult){
        this.consultCurrent = consult
        this.getConsultor(consult.id)
      },
      getPercent(a,b) {
        //Verifica se é uma filtragem no periodo atual
        if(this.filter.faturamento.year == new Date().getFullYear() && this.filter.faturamento.month == new Date().getMonth() - 1){
          a = a / new Date().getDate()
        }else{
          a = a / 30;
        }

        b = b / 30;
        let percent = (a/b-1) * 100
        return `${percent.toFixed(0)}% <small class="${(percent <= 0 ? 'text-danger simple-icon-arrow-down-circle' : 'text-success simple-icon-arrow-up-circle')} glyph-icon "></small>`
      },

      getMeta(a,b) {
        let today = a / new Date().getDate()
        let project = b / 30

        let percent = (project/today-1) * 100
        return `${percent.toFixed(0)}% <small class="${(percent <= 0 ? 'text-danger simple-icon-arrow-down-circle' : 'text-success simple-icon-arrow-up-circle')} glyph-icon "></small>`
      },

      async getBI() {
        const response = await api.get('admin/bi2', {params: this.filter.faturamento});
        this.data.orders = response.data.data
        this.data.infoConsult = response.data.data.consult
      },

      async getFaturamento(){
        this.getBI();
        const response = await api.get('admin/bi/faturamento', {
          params: this.filter.faturamento
        });

        this.data.faturamento = response.data.data.faturamento

      },

      async getComparativo(){
        const response = await api.get('admin/bi/comparativo', {
          params: this.filter.comparativo
        });

        this.data.comparativo = response.data.data.comparativo
      },

      async getConsultor(id = '') {
        if(id) this.filter.consultId = id;

        const response = await api.get('admin/bi/consult', {
          params: {...this.filter.consult, id: this.filter.consultId}
        });

        this.data.consult = response.data.data.consult
      },

      async getTv() {
        const response = await api.get('admin/bi/tv');

        this.data.tv = response.data.data
      },

      async getCompanies() {

      }
    },
    created() {
      this.getFaturamento();
      this.getComparativo();
      this.getTv();
    }

}
</script>

<style>
span.search-icon {
    position: absolute;
    top: .23rem;
    right: 10px;
    font-size: 1.2rem;
}

.faturamento {
  font-size: 2.5rem;
  color:#00b3b7;
  text-align: center;
}

span.label-info {
    color: #aaa;
    font-size: 1rem;
}

span.label-value {
    font-size: 1.1rem;
    color:#00b3b7;
    font-weight: 600;
}

span.label-total {
    color: #aaa;
}

.center-card {
  height: 30vh;
  display: flex;
  justify-content: center;
}

.legend::before {
  content: '';
  width:15px;
  height:15px;
  display: block;
}

.legend.present::before {
  background: #55efc4;
}

.legend.past::before {
  background: #d63031;
}

</style>
