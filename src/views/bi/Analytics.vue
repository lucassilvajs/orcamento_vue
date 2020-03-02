<template>
<div>
    <b-row>
        <b-colxx xxs="12">
            <h1>Analytics</h1>
            <div class="separator mb-5"></div>
        </b-colxx>
    </b-row>
    <b-row>
        <b-colxx xl="12" lg="12" md="12" class="mb-4">
            <b-card title="Metas">
                <div v-for="(s,index) in profileStatuses" :key="index" class="mb-4">
                    <p class="mb-2">
                        {{ s.title }}
                        <span class="float-right text-muted">{{s.status}}/{{s.total}}</span>
                    </p>
                    <b-progress :value="(s.status / s.total) * 100"></b-progress>
                </div>
            </b-card>
        </b-colxx>
        <b-colxx xl="12" lg="12" md="12">
            <b-row>
                <b-colxx xxs="12">
                    <h3>Metrica semanal</h3>
                    <div class="separator mb-5"></div>
                </b-colxx>
                <b-colxx xxs="6" class="mb-4">
                    <small-line-chart-card class="dashboard-small-chart-analytics" :data="smallChartData1" />
                </b-colxx>
                <b-colxx xxs="6" class="mb-4">
                    <small-line-chart-card class="dashboard-small-chart-analytics" :data="smallChartData2" />
                </b-colxx>
                <b-colxx xxs="6" class="mb-4">
                    <small-line-chart-card class="dashboard-small-chart-analytics" :data="smallChartData3" />
                </b-colxx>
                <b-colxx xxs="6" class="mb-4">
                    <small-line-chart-card class="dashboard-small-chart-analytics" :data="smallChartData4" />
                </b-colxx>
            </b-row>
        </b-colxx>
    </b-row>
</div>
</template>

<script>

import SmallLineChartCard from '@/components/Cards/SmallLineChartCard'
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

export default {
    components: {
        'small-line-chart-card': SmallLineChartCard,
    },
    data() {
        return {
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
            }
        }
    }
}
</script>
