<template>
    <div style="width:calc(100% - 10px);height:345px;margin-top:5px;" id="home_page_map"></div>
</template>

<script>

import data from '../map-data/get-city-value.js';
import geoData from '../map-data/get-geography-value.js';
import styleJson from '../map-data/get-style-json.js';

import echarts from 'echarts';
require('echarts/extension/bmap/bmap');

var convertData = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoData[data[i].name];
                if (geoCoord) {
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });
                }
            }
            return res;
        };

        const option = {
            title: {
                text: '今日流量地理分布',
                left: 'center'
            },
            tooltip : {
                trigger: 'item'
            },
            bmap: {
                center: [104.114129, 37.550339],
                zoom: 5,
                roam: true,
                mapStyle: {
                    styleJson: styleJson
                }
            },
            series : [
                {
                    name: 'pm2.5',
                    type: 'scatter',
                    coordinateSystem: 'bmap',
                    data: convertData(data),
                    symbolSize: function (val) {
                        return val[2] / 10;
                    },
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'purple'
                        }
                    }
                },
                {
                    name: 'Top 5',
                    type: 'effectScatter',
                    coordinateSystem: 'bmap',
                    data: convertData(data.sort(function (a, b) {
                        return b.value - a.value;
                    }).slice(0, 6)),
                    symbolSize: function (val) {
                        return val[2] / 10;
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'purple',
                            shadowBlur: 10,
                            shadowColor: '#fff'
                        }
                    },
                    zlevel: 1
                }
            ]
        };

export default {
    name: 'homeMap',
    mounted () {
        const mapCharts = echarts.init(document.getElementById('home_page_map'));
        this.$nextTick(() => {
            mapCharts.setOption(option)
        })
    }
}
</script>

<style>

</style>


