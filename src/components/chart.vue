<template>
    <div class="chart-container">
        <v-chart class="chart" v-for="(record, index) in data" :key="index" :option="getChartOptions(record,index)" v-if="isRender" />
        <div v-if="!isRender" class="loader"></div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TitleComponent, GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import axios from 'axios';
import type { Photo } from '@/assets/types';
import { useCookies } from 'vue3-cookies';
import VChart from 'vue-echarts';
import { useRouter } from 'vue-router';
import * as echarts from 'echarts/core';

use([GridComponent, LineChart, CanvasRenderer,TooltipComponent,TitleComponent])
let $emit = defineEmits(['toggleLogin', 'toggleManager']);

const router = useRouter();
const isRender = ref(false);
const { cookies } = useCookies();

const data = computed(() => {
  return myData.value.reduce((acc: Record<string, Photo[]>, photo) => {
    const location = photo.location;
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(photo);
    return acc;
  }, {} as Record<string, Photo[]>);
});
const myData = ref<Array<Photo>>([]);


const logout = () => {
    cookies.remove('token');
    $emit('toggleLogin', false);
    $emit('toggleManager', false);
    router.push('/login');
};

const getData = async () => {
    await axios.get('http://localhost:5173/api/photo/timeRange', {
        params: {
            startDate: "2020-03-13T00:00:30",
            endDate: "2020-03-13T07:59:45",
        },
        headers: {
            Authorization: `${cookies.get('token')}`,
        },
    }).then((response) => {
        myData.value = response.data;
        isRender.value = true;
    }).catch((error) => {
        console.error(error);
        alert('获取数据失败');
        logout();
    });
}

const option = computed(() => {
    return {
        title: {
            text: 'airport',
            left: 'center',
            top: "0%",
            textStyle: {
                color: '#ccc',
            }
        },
        xAxis: {
            type: 'time',
        },
        yAxis: {
            type: 'value'
        },
        tooltip: {
            trigger: 'axis', // 显示横坐标值
        },
        dataZoom: [
            {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                start: 0,
                end: 100,
                bottom: 0,
            }
        ],
        series: [
            {
                name: 'visibility',
                data: data.value.airport.map((photo) => {
                    return [photo.date, photo.visibility];
                }),
                symbol: 'none',
                type: 'line',
                itemStyle: {
                    color: 'rgb(255, 70, 131)'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgb(255, 158, 68)'
                        },
                        {
                            offset: 1,
                            color: 'rgb(255, 70, 131)'
                        }
                    ])
                },
            }
        ]
    }
});

const getChartOptions = (record: Photo[], index: string) => {
    return {
        title: {
            text: index,
            left: 'center',
            top: "0%",
            textStyle: {
                color: '#ccc',
            }
        },
        xAxis: {
            type: 'time',
        },
        yAxis: {
            type: 'value'
        },
        tooltip: {
            trigger: 'axis', // 显示横坐标值
        },
        dataZoom: [
            {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                start: 0,
                end: 100,
                bottom: 0,
            }
        ],
        series: [
            {
                name: 'visibility',
                data: record.map((photo) => {
                    return [photo.date, photo.visibility];
                }),
                symbol: 'none',
                type: 'line',
                itemStyle: {
                    color: 'rgb(255, 70, 131)'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgb(255, 158, 68)'
                        },
                        {
                            offset: 1,
                            color: 'rgb(255, 70, 131)'
                        }
                    ])
                },
            }
        ]
    }
}

getData();
</script>

<style scoped>
.chart-container {
    display: flex;
    justify-content: space-between;
    align-items: start;
    flex-direction: row;
    height: 100%;
}
.chart {
    height: 200px;
    width: 400px;
}

.loader {
    width: 60px;
    height: 60px;
    border: 10px solid #1cd42550;
    border-top-color: #1cd425;
    animation: spin013151 1s linear infinite;
    border-radius: 100%;
}

@keyframes spin013151 {
    to {
        transform: rotate(360deg);
    }
}
</style>