<template>
    <div style="width:calc(100% - 10px);height:305px;" id="home_page_map"></div>
</template>

<script>

import cityData from '../map-data/get-city-value.js';
import geoData from '../map-data/get-geography-value.js';
import styleJson from '../map-data/get-style-json.js';
const path = require('path');
const axios = require('axios');

import echarts from 'echarts';

export default {
    name: 'homeMap',
    mounted () {
        var convertData = function (data) {
            let res = [];
            let len = data.length;
            for (var i = 0; i < len; i++) {
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

        var map = echarts.init(document.getElementById('home_page_map'));
        const map_path = path.join(__dirname, './src/views/home/map-data/china.json');
        axios.get(map_path).then((chinaJson) => {
            echarts.registerMap('china', chinaJson.data);
            map.setOption({
                backgroundColor: '#FFF',
                // title: {
                //     text: "今日流量地理分布",
                //     left: "center",
                //     textStyle: {
                //         color: '#2d8cf0'
                //     }
                // },
                geo: {
                    map: 'china',
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: '#EFEFEF',
                            borderColor: '#CCC'
                        },
                        emphasis: {
                            areaColor: '#E5E5E5'
                        }
                    }
                },
                grid: {
                    top: 0,
                    left: '2%',
                    right: '2%',
                    bottom: '0',
                    containLabel: true
                },
                series: [{
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: convertData(cityData),
                    symbolSize: function(val) {
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
                            color: '#0099CC'
                        }
                    }
                },
                {
                    name: 'Top 5',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    data: convertData(cityData.sort(function(a, b) {
                        return b.value - a.value;
                    }).slice(0, 6)),
                    symbolSize: function(val) {
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
                            color: '#0099CC',
                            shadowBlur: 10,
                            shadowColor: '#333'
                        }
                    },
                    zlevel: 1
                }]

            });
        }) 
        window.addEventListener( 'resize', function(){
            map.resize();
        } )
    }
}
</script>

<style>

</style>


