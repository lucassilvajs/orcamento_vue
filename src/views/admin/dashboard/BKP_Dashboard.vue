<template>
<div>
    <b-row>
        <b-colxx xxs="12">
            <h1>Dashboard</h1>
            <div class="separator mb-5"></div>
        </b-colxx>
    </b-row>
    <b-row v-if="data">
        <b-colxx xl="6" lg="12">
            <b-row>
                <b-colxx md="12" class="mb-4">
                    <b-card title="Vendas no mês">
                        <div class="dashboard-line-chart">
                            <line-shadow-chart :data='{ "labels": data.orders.labels, "datasets": [ { "label": "", "data": data.orders.datasets[0].data, "borderColor": "#00b3b7", "pointBackgroundColor": "white", "pointBorderColor": "#00b3b7", "pointHoverBackgroundColor": "#00b3b7", "pointHoverBorderColor": "white", "pointRadius": 6, "pointBorderWidth": 2, "pointHoverRadius": 8, "fill": false, "_meta": {} } ] }' :height="300" />
                        </div>
                    </b-card>
                </b-colxx>
            </b-row>
            <b-row v-if="data">
              <b-colxx lg="12" md="12" class="mb-4">
            <b-card title="Logs">
                <vue-perfect-scrollbar class="dashboard-logs scroll" :settings="{ suppressScrollX: true, wheelPropagation: false }">
                    <log-list :logs="data.logs" />
                </vue-perfect-scrollbar>
            </b-card>
        </b-colxx>

        <b-colxx lg="12" md="12" class="mb-4">
            <b-card title="SAC">
                <vue-perfect-scrollbar class="scroll dashboard-list-with-user" :settings="{ suppressScrollX: true, wheelPropagation: false }">
                    <list-with-user-item v-for='(ticket, index) in data.sac' :data="ticket" :detail-path="`/admin/sac/`" :key="index" />
                </vue-perfect-scrollbar>
            </b-card>
        </b-colxx>
            </b-row>
        </b-colxx>

        <b-colxx lg="12" xl="6" class="mb-4">
            <b-card title="Pedidos Recentes">
                <vue-perfect-scrollbar class="scroll dashboard-list-with-thumbs" :settings="{ suppressScrollX: true, wheelPropagation: false }">
                    <recent-order-item v-for='(order,index) in data.ordersList' :order="order" :detail-path="`/admin/order/${order.id}`" :key="index" />
                </vue-perfect-scrollbar>
            </b-card>
        </b-colxx>
    </b-row>

    <b-row>

    </b-row>
</div>
</template>

<script>
import GlideComponent from '../../../components/Carousel/GlideComponent'

import {
    CalendarView,
    CalendarViewHeader,
    CalendarMathMixin
} from 'vue-simple-calendar'

import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '../../../components/Common/VuetablePaginationBootstrap'

import Draggable from 'vuedraggable'

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import IconCard from '../../../components/Cards/IconCard'
import GradientCard from '../../../components/Cards/GradientCard'
import GradientWithRadialProgressCard from '../../../components/Cards/GradientWithRadialProgressCard'
import SmallLineChartCard from '../../../components/Cards/SmallLineChartCard'

import RadialProgressCard from '../../../components/Cards/RadialProgressCard'
import LineShadowChart from '../../../components/Charts/LineShadow'
import PolarAreaShadowChart from '../../../components/Charts/PolarAreaShadow'
import AreaShadowChart from '../../../components/Charts/AreaShadow'

import RecentOrderItem from '../../../components/Listing/RecentOrderItem'
import LogList from '../../../components/Listing/LogList'
import ListWithUserItem from '../../../components/Listing/ListWithUserItem'
import TwoColumnList from '../../../components/Listing/TwoColumnList'
import TopRatedSlideItem from '../../../components/Listing/TopRatedSlideItem'

import {
    lineChartData,
    polarAreaChartData,
    areaChartData,
    conversionChartData,
    smallChartData1,
    smallChartData2,
    smallChartData3,
    smallChartData4
} from '../../../data/charts'
import logs from '../../../data/logs'
import products from '../../../data/products'
import tickets from '../../../data/tickets'
import profileStatuses from '../../../data/profileStatuses'
import cakes from '../../../data/cakes'
import {
    apiUrl,
    api,
    baseURL
} from '../../../constants/config'
export default {
    components: {
        'glide-component': GlideComponent,
        'icon-card': IconCard,
        'gradient-card': GradientCard,
        'line-shadow-chart': LineShadowChart,
        'recent-order-item': RecentOrderItem,
        'polar-area-shadow-chart': PolarAreaShadowChart,
        'area-shadow-chart': AreaShadowChart,
        'log-list': LogList,
        'list-with-user-item': ListWithUserItem,
        'calendar-view': CalendarView,
        'calendar-view-header': CalendarViewHeader,
        'vuetable': Vuetable,
        'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
        'two-column-list': TwoColumnList,
        'draggable': Draggable,
        'radial-progress-card': RadialProgressCard,
        'gradient-with-radial-progress-card': GradientWithRadialProgressCard,
        'v-select': vSelect,
        'small-line-chart-card': SmallLineChartCard,
        'top-rated-slide-item': TopRatedSlideItem
    },
    mixins: [CalendarMathMixin],
    data() {
        return {
            data: null,
            baseURL,
            glideIconsOption: {
                gap: 5,
                perView: 4,
                type: "carousel",
                breakpoints: {
                    320: {
                        perView: 1
                    },
                    576: {
                        perView: 2
                    },
                    1600: {
                        perView: 3
                    },
                    1800: {
                        perView: 4
                    }
                },
                hideNav: true
            },
            lineChartData,
            products,
            polarAreaChartData,
            logs,
            tickets,
            calendar: {
                showDate: this.thisMonth(1),
                events: [{
                        id: 'e2',
                        startDate: this.thisMonth(15),
                        title: 'Meeting',
                        classes: 'secondary'
                    },
                    {
                        id: 'e3',
                        startDate: this.thisMonth(8, 9, 25),
                        endDate: this.thisMonth(9, 16, 30),
                        title: 'Sales',
                        classes: 'primary'
                    },
                    {
                        id: 'e5',
                        startDate: this.thisMonth(5),
                        endDate: this.thisMonth(12),
                        title: 'Tax Days',
                        classes: 'secondary'
                    },
                    {
                        id: 'e10',
                        startDate: this.thisMonth(27),
                        title: 'My Birthday!'
                    }
                ]
            },
            bestsellers: {
                apiUrl: apiUrl + '/cakes/fordatatable',
                fields: [{
                        name: 'title',
                        sortField: 'title',
                        title: 'Name',
                        titleClass: '',
                        dataClass: 'list-item-heading'
                    },
                    {
                        name: 'sales',
                        sortField: 'sales',
                        title: 'Sales',
                        titleClass: '',
                        dataClass: 'text-muted'
                    },
                    {
                        name: 'stock',
                        sortField: 'stock',
                        title: 'Stock',
                        titleClass: '',
                        dataClass: 'text-muted'
                    },
                    {
                        name: 'category',
                        sortField: 'category',
                        title: 'Category',
                        titleClass: '',
                        dataClass: 'text-muted'
                    }
                ]
            },
            profileStatuses,
            cakes,
            areaChartData,
            conversionChartData,
            selectData: [{
                    label: 'Chocolate',
                    value: 'chocolate'
                },
                {
                    label: 'Vanilla',
                    value: 'vanilla'
                },
                {
                    label: 'Strawberry',
                    value: 'strawberry'
                },
                {
                    label: 'Caramel',
                    value: 'caramel'
                },
                {
                    label: 'Cookies and Cream',
                    value: 'cookiescream'
                },
                {
                    label: 'Peppermint',
                    value: 'peppermint'
                }
            ],
            smallChartData1,
            smallChartData2,
            smallChartData3,
            smallChartData4,
            glideTopRatedOption: {
                gap: 5,
                perView: 1,
                type: "carousel",
                peek: {
                    before: 0,
                    after: 100
                },
                breakpoints: {
                    480: {
                        perView: 1
                    },
                    992: {
                        perView: 2
                    },
                    1200: {
                        perView: 1
                    }
                },
                hideNav: true
            },
        }
    },

    methods: {
        refreshButtonClick() {
            console.log('refreshButtonClick')
        },
        thisMonth(d, h, m) {
            const t = new Date()
            return new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0)
        },
        onClickDay(d) {
            console.log(`You clicked: ${d.toLocaleDateString()}`)
        },
        onClickEvent(e) {
            console.log(`You clicked: ${e.title}`)
        },
        setShowDate(d) {
            this.calendar.showDate = d
        },
        onDropDate(event, date) {
            console.log(`You dropped ${event.id} on ${date.toLocaleDateString()}`)

            const eLength = this.dayDiff(event.startDate, date)
            event.originalEvent.startDate = this.addDays(event.startDate, eLength)
            event.originalEvent.endDate = this.addDays(event.endDate, eLength)
        },
        onPaginationData(paginationData) {
            this.$refs.pagination.setPaginationData(paginationData)
        },
        onChangePage(page) {
            this.$refs.vuetable.changePage(page)
        },
        async getData() {
            const response = await api.get('admin/')
            this.data = response.data.data;
            this.data.sac = this.data.sac.map(r => {r.thumb = baseURL+r.thumb; return r})
        }
    },
    created() {
        this.getData();
    }
}
</script>

<style>
.img-thumbnail {
    width:20px;
    height: 20px;
}
</style>
