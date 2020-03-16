<template>
<div>
    <b-row>
        <b-colxx xxs="12">
            <h1>BI</h1>
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
</div>
</template>

<script>
import {api, baseURL} from '@/constants/config';
import SmallLineChartCard from '@/components/Cards/SmallLineChartCard'
import GlideComponent from '@/components/Carousel/GlideComponent'
import { ThemeColors } from '@/utils'
const colors = ThemeColors()
// import {
//     areaChartData,
//     conversionChartData,
//     doughnutChartData,
//     // smallChartData1,
//     smallChartData2,
//     smallChartData3,
//     smallChartData4,
//     polarAreaChartData,
//     radarChartData,
//     lineChartData
// } from '@/data/charts'
// import profileStatuses from '@/data/profileStatuses'
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
            smallChartData1: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
                datasets: [
                    {
                        label: 'Pedidos',
                        borderColor: colors.themeColor1,
                        pointBorderColor: colors.themeColor1,
                        pointHoverBackgroundColor: colors.themeColor1,
                        pointHoverBorderColor: colors.themeColor1,
                        pointRadius: 2,
                        pointBorderWidth: 3,
                        pointHoverRadius: 2,
                        fill: false,
                        borderWidth: 2,
                        data: [3, 8, 0, 0, 2, 5, 15],
                        datalabels: {
                            align: 'end',
                            anchor: 'end'
                        }
                    }
                ]
            },
            smallChartData2: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
                datasets: [
                    {
                    label: 'Pedidos pendentes',
                    borderColor: colors.themeColor1,
                    pointBorderColor: colors.themeColor1,
                    pointHoverBackgroundColor: colors.themeColor1,
                    pointHoverBorderColor: colors.themeColor1,
                    pointRadius: 2,
                    pointBorderWidth: 3,
                    pointHoverRadius: 2,
                    fill: false,
                    borderWidth: 2,
                    data: [115, 120, 300, 222, 105, 85, 36],
                    datalabels: {
                        align: 'end',
                        anchor: 'end'
                    }
                    }
                ]
            },
            smallChartData3: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
                datasets: [
                    {
                    label: 'Pedidos Aprovados',
                    borderColor: colors.themeColor1,
                    pointBorderColor: colors.themeColor1,
                    pointHoverBackgroundColor: colors.themeColor1,
                    pointHoverBorderColor: colors.themeColor1,
                    pointRadius: 2,
                    pointBorderWidth: 3,
                    pointHoverRadius: 2,
                    fill: false,
                    borderWidth: 2,
                    data: [350, 452, 762, 952, 630, 85, 158],
                    datalabels: {
                        align: 'end',
                        anchor: 'end'
                    }
                    }
                ]
            },
            smallChartData4: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
                datasets: [
                    {
                    label: 'Pedidos Recusado',
                    borderColor: colors.themeColor1,
                    pointBorderColor: colors.themeColor1,
                    pointHoverBackgroundColor: colors.themeColor1,
                    pointHoverBorderColor: colors.themeColor1,
                    pointRadius: 2,
                    pointBorderWidth: 3,
                    pointHoverRadius: 2,
                    fill: false,
                    borderWidth: 2,
                    data: [200, 452, 250, 630, 125, 85, 20],
                        datalabels: {
                            align: 'end',
                            anchor: 'end'
                        }
                    }
                ]
            },
            data: null
        }
    },
    methods: {
        async getBI() {
            const response = await api.get('bi');
            this.data = response.data.data
            this.data.orders[this.data.orders.length] = {label: 'Ticket Médio', icon: 'simple-icon-chart', value: 'R$ 516,32'}
        }
    },
    created() {
        this.getBI();
    }
}
</script>
