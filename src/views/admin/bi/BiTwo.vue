<template>
<div>
    <b-row>
        <b-colxx xxs="12">
            <h1>BI</h1>
            <a href="https://idsafety.com.br/bi/bi/bi.html" target="_blank" class="btn btn-success float-right">versão Dashboard</a>
          <div class="separator mb-5"></div>
        </b-colxx>
    </b-row>
    <b-row>
        <b-colxx xxs="12">
            <b-card class="mb-4" title="Consultores">
                <b-row>
                    <b-colxx lg="4" xxs="12" class="mb-4">
                        <b-card title="Consultores">
                            <vue-perfect-scrollbar class="scroll dashboard-list-with-user" :settings="{ suppressScrollX: true, wheelPropagation: false }">
                                <list-with-user-item v-for="(ticket, index) in data.infoConsult" :data="ticket" :key="index" @consult="getInfoConsult"/>
                            </vue-perfect-scrollbar>
                        </b-card>
                    </b-colxx>
                    <b-colxx lg="8" xxs=12>

                      <b-card v-if="data.consult && buscandoInfoConsultor == false">
                        <b-row>
                          <b-colxx xxs="12" lg="4">
                            <h3>{{data.consult.consultor.name}}</h3>
                            <img v-if="false" class="w-100" src="http://via.placeholder.com/200" alt="">
                            <b-colxx xxs="12">
                              <b-form-group label="Mês da meta (mês/ano)" class="has-float-label mb-4">
                              <the-mask class="form-control" v-model="data.consult.consultor.date" :masked="false" :mask="['##/##', '##/####']" />
                              </b-form-group>
                            </b-colxx>
                            <b-colxx xxs="12">
                              <b-form-group :label="data.consult.consultor.name" class="has-float-label">
                                <Money class="form-control" v-model="data.consult.consultor.value"  v-bind="{ decimal: ',',thousands: '.',prefix: 'R$ ',suffix: '',precision: 2,masked: true,}"/>
                              </b-form-group>
                              <div class="ml-3 mt-1 mb-4" v-if="consultCurrent.today">
                                <h5>Meta do mês<br />{{consultCurrent.today | numeroPreco}}</h5>
                              </div>
                            </b-colxx>
                            <button @click="addMeta(data.consult.consultor.id)" class="btn-block btn btn-success">Atribuir metas</button>
                          </b-colxx>
                          <b-colxx xxs="12" lg="8">
                            <div class="d-flex align-items-center justify-content-between">
                              <h6 class="card-subtitle">Status de pedidos</h6>
                              <b-input-group class="mb-3 w-50">
                                <b-form-select v-if="false" @change="getConsultor()" v-model="filter.consult.status.period" :options="[
                                  {value: 7, text: '7 Dias'},
                                  {value: 30, text: '30 Dias'},
                                  {value: 90, text: '90 Dias'},
                                  {value: 180, text: '180 Dias'},
                                  {value: 360, text: '360 Dias'},
                                ]" plain />
                              </b-input-group>
                            </div>
                            <div class="chart-container">
                              <doughnut-shadow-chart :data="data.consult" :height="300" />
                            </div>
                          </b-colxx>
                        </b-row>
                      </b-card>
                      <b-card no-body class="h-100 d-flex justify-content-center align-items-center" v-else-if="buscandoInfoConsultor">
                        <h2>Buscando informações do consultor...</h2>
                      </b-card>
                      <b-card no-body class="h-100 d-flex justify-content-center align-items-center" v-else>
                        <h2>Selecione ao lado um consultor para visualizar suas métricas</h2>
                      </b-card>
                    </b-colxx>

                </b-row>
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
import ListWithUserItem from '@/components/Listing/ListWithUserItem'

import CountNumber from '@/components/Bi/CountNumber'

import tickets from '@/data/tickets'

import {Money} from '@/vmoney.js';
import {TheMask} from 'vue-the-mask';

export default {
    components: {
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
      'icon-card': IconCard,
      'list-with-user-item': ListWithUserItem,
      'count-number': CountNumber,
      Money,
      TheMask
    },
    data() {
        return {
          buscandoInfoConsultor: false,
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
          tickets,
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
          data: {
            orders: null,
            faturamento: null,
            consult: null,
            comparativo: null
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
              period: 6,
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
      async addMeta(consultor){
        const data = await api.post('admin/metas', {consultor, date: this.data.consult.consultor.date, value: this.data.consult.consultor.value});

      },
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

        const list = await api.get('admin/bi/list');
        this.list = list.data.data
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
        if(this.buscandoInfoConsultor === true) return false;
        this.buscandoInfoConsultor = true;
        if(id) this.filter.consultId = id;

        const response = await api.get('admin/bi/consult', {
          params: {...this.filter.consult, id: this.filter.consultId}
        });

        this.data.consult = response.data.data.consult
          this.buscandoInfoConsultor = false;
      },

      async getCompanies() {

      }
    },
    created() {
      this.getFaturamento();
      this.getComparativo();
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

</style>
