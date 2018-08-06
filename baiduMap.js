function FullScreen() {
    this._init();
    this.serviceToControl();
}

FullScreen.prototype = {

    /*
    * 初始化函数
    * */
    _init:function () {
        this.initBaiduMap();
        this.showDataPick();
        this.showPeacElement();
        this.showTangle();
        this.showPeaceTripod();
        this.showVipControl();
        this.showPoepleService();
        this.showComplexControl();
    },
    
    /*
    * 初始化百度地图
    * */
    initBaiduMap:function () {
        var me = this;
        me.map = new BMap.Map("container");
        me.point = new BMap.Point(108.95815828, 34.2737999);
        me.map.centerAndZoom(me.point, 14);
        me.map.enableScrollWheelZoom(true);
        me.map.setMapStyle({
            styleJson:[
                {
                    "featureType": "arterial",
                    "elementType": "all",
                    "stylers": {
                        "color": "#28586cff"
                    }
                },
                {
                    "featureType": "background",
                    "elementType": "all",
                    "stylers": {
                        "color": "#043448ff"
                    }
                },
                {
                    "featureType": "local",
                    "elementType": "all",
                    "stylers": {
                        "color": "#28586cff"
                    }
                },
                {
                    "featureType": "highway",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#42cecdff"
                    }
                },
                {
                    "featureType": "highway",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#000000ff",
                        "visibility": "on"
                    }
                },
                {
                    "featureType": "subway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#2adeebff"
                    }
                },
                {
                    "featureType": "subway",
                    "elementType": "labels.icon",
                    "stylers": {
                        "color": "#2adeebff",
                        "visibility": "off"
                    }
                },
                {
                    "featureType": "poilabel",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                },
                {
                    "featureType": "subway",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#42cecdff"
                    }
                },
                {
                    "featureType": "subway",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#000000ff"
                    }
                },
                {
                    "featureType": "district",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2ca1a2ff",
                        "visibility": "on"
                    }
                },
                {
                    "featureType": "poilabel",
                    "elementType": "all",
                    "stylers": {
                        "visibility": "off"
                    }
                },
                {
                    "featureType": "arterial",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#42cecdff"
                    }
                },
                {
                    "featureType": "arterial",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#000000ff"
                    }
                },
                {
                    "featureType": "district",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#043448ff",
                        "visibility": "on"
                    }
                },
                {
                    "featureType": "town",
                    "elementType": "all",
                    "stylers": {}
                },
                {
                    "featureType": "highway",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#42cecdff"
                    }
                },
                {
                    "featureType": "highway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#42cecdff"
                    }
                }
            ]
        });
        me.map.enableHighResolution = true;
    },

    /*
    * 综治数据采集datapick
    * */
    showDataPick: function () {
        var myChart = echarts.init(document.getElementById('datapick'),'macarons');
        var option = {
            /*tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },*/
            legend: {
                orient: 'horizontal',
                x: 'center',
                y:'bottom',
                textStyle:{
                    color:'#fff'
                },
                data:['机构队伍','实有人口','社会组织','特殊人群','重点青少年','社会治安','矛盾纠纷排查','校园周边安全','护路护线']
            },
            series: [
                {
                    itemStyle : {
                        normal : {
                            label : {
                                show : false
                            },
                            labelLine : {
                                show : false
                            }
                        },
                        emphasis : {
                            label : {
                                show : true,
                                position : 'center',
                                textStyle : {
                                    fontSize : '15',
                                    fontWeight : 'bold'
                                }
                            }
                        }
                    },
                    name:'访问来源',
                    type:'pie',
                    center:['50%','30%'],
                    radius: ['40%', '55%'],
                    data:[
                        {value:335, name:'机构队伍'},
                        {value:310, name:'实有人口'},
                        {value:234, name:'社会组织'},
                        {value:135, name:'特殊人群'},
                        {value:1548, name:'重点青少年'},
                        {value:548, name:'社会治安'},
                        {value:158, name:'矛盾纠纷排查'},
                        {value:148, name:'校园周边安全'},
                        {value:154, name:'护路护线'}
                    ]
                }
            ]
        };
        myChart.setOption(option, true);
    },

    /*
    * 平安元素peacelement
    * */
    showPeacElement:function(){

    },

    /*
    * 矛盾纠纷tangle
    * */
    showTangle :function () {
        var myChart = echarts.init(document.getElementById('tangle'),'macarons');
        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                x: 'center',
                y:'bottom',
                textStyle:{
                    color:'#fff'
                },
                data:['事件登记','事件指派','事件处理','事件考评']
            },
            calculable : false,
            series : [
                {
                    name:'访问来源',
                    type:'pie',
                    center:['50%','40%'],
                    radius : '55%',
                    itemStyle : {
                        normal : {
                            label : {
                                show : false
                            },
                            labelLine : {
                                show : false
                            }
                        }
                    },
                    data:[
                        {value:335, name:'事件登记'},
                        {value:310, name:'事件指派'},
                        {value:234, name:'事件处理'},
                        {value:135, name:'事件考评'}
                    ]
                }
            ]
        };
        myChart.setOption(option, true);
    },

    /*
    * 平安鼎考核peacetripod
    * */
    showPeaceTripod :function () {
        var myChart = echarts.init(document.getElementById('peacetripod'),'macarons');
        var option = {
            tooltip : {
                trigger: 'axis'
            },
            grid:{
                x:'5%',
                y2:'10%',
                y:46,
                borderColor:'#053867'
            },
            title:{
                text: '平安鼎考核',
                padding:10,
                textStyle:{
                    color:'#fff'
                }
            },
            legend: {
                orient: 'horizontal',
                x: 'right',
                padding:15,
                textStyle:{
                    color:'#6aa6da',
                    fontWeight:700
                },
                data:['政治安全稳定','经济健康发展','社会秩序','公共安全稳固','人民安居乐业']
            },
            calculable : false,
            xAxis : [
                {
                    type : 'category',//category
                    boundaryGap : false,
                    axisLabel: {
                        textStyle: {
                            color: "#6aa6da" //刻度线标签颜色
                        },
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#053867', //X轴颜色
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#053867'// 使用深浅的间隔色
                        }
                    },
                    data : ['新城区','碑林区','莲湖区','雁塔区','未央区','灞桥区','长安区','阎良区','临潼区','高陵区','鄠邑区','航天','周至县','蓝田县']
                }
            ],
            yAxis : [
                {
                    type : 'value',//value
                    axisLabel: {
                        textStyle: {
                            color: "#6aa6da" //刻度线标签颜色
                        }
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#053867', //X轴颜色
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: '#053867'
                        }
                    },
                }
            ],
            series : [
                {
                    name:'政治安全稳定',
                    type:'line',
                    stack: '总量',
                    symbol: 'rectangle',
                    smooth:false,
                    data:[520, 32, 201, 134, 90, 230, 210,1120, 132, 101, 1134, 90, 230, 210]
                },
                {
                    name:'经济健康发展',
                    type:'line',
                    stack: '总量',
                    symbol: 'rectangle',
                    smooth:false,
                    data:[1220, 182, 191, 234, 1290, 330, 310,220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name:'社会秩序',
                    type:'line',
                    stack: '总量',
                    symbol: 'rectangle',
                    smooth:false,
                    data:[150, 232, 201, 154, 190, 330, 1410,220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name:'公共安全稳固',
                    type:'line',
                    stack: '总量',
                    symbol: 'rectangle',
                    smooth:false,
                    data:[320, 332, 301, 334, 1390, 330, 320,320, 332, 1301, 334, 1390, 330, 320]
                },
                {
                    name:'人民安居乐业',
                    type:'line',
                    stack: '总量',
                    symbol: 'rectangle',
                    smooth:false,
                    data:[1820, 32, 901, 934, 1290, 1330, 1320,320, 332, 1301, 334, 390, 330, 320]
                }
            ]
        };
        myChart.setOption(option, true);
    },

    /*
    * 重点人员管控vipcontrol
    * */
    showVipControl: function () {
        var myChart = echarts.init(document.getElementById('vipcontrol'),'macarons');
        var option = {
            tooltip : {
                trigger: 'axis'
            },
            calculable : false,
            polar : [
                {
                    indicator : [
                        {text : '刑满释放人员', max  : 100},
                        {text : '精神病人员', max  : 100},
                        {text : '重点青少年', max  : 100},
                        {text : '艾滋病人员', max  : 100},
                        {text : '矫正人员', max  : 100},
                        {text : '吸毒人员', max  : 100}
                    ],
                    radius : 55,
                    name: {
                        textStyle: {
                            color: '#fff'
                        }
                    },
                }
            ],
            series : [
                {
                    type: 'radar',
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: 'default'
                            }
                        }
                    },
                    data : [
                        {
                            value : [97, 42, 88, 94, 90, 86],
                            name : '舍普琴科'
                        }
                    ]
                }
            ]
        };
        myChart.setOption(option, true);
    },

    /*
    * 便民服务
    * */
    showPoepleService: function () {
        var myChart = echarts.init(document.getElementById('poepleservice'),'macarons');
        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                x: 'center',
                y:'bottom',
                textStyle:{
                    color:'#fff'
                },
                data:['快捷报警','视频报警','消息报警','一键求助']
            },
            calculable : false,
            series : [
                {
                    name:'半径模式',
                    type:'pie',
                    radius : [25, 80],
                    center : ['50%', '40%'],
                    roseType : 'radius',
                    width: '40%',       // for funnel
                    max: 40,            // for funnel
                    itemStyle : {
                        normal : {
                            label : {
                                show : false
                            },
                            labelLine : {
                                show : false
                            }
                        },
                        emphasis : {
                            label : {
                                show : true
                            },
                            labelLine : {
                                show : true
                            }
                        }
                    },
                    data:[
                        {value:10, name:'快捷报警'},
                        {value:5, name:'视频报警'},
                        {value:15, name:'消息报警'},
                        {value:25, name:'一键求助'}
                    ]
                }
            ]
        };

        myChart.setOption(option, true);
    },

    /*
    * 综治防控showComplexControl
    * */
    showComplexControl:function () {

    },

    /*
    * 右下便民服务和综治防控切换
    * */
    serviceToControl :function () {
        $('.rightBottomItems').click(function () {
            $('.rightBottomItems').css('borderTop','3px solid rgba(2,29,40,0.7)');
            $(this).css('borderTop','3px solid #f9e600');
            if(this.innerHTML === '便民服务'){
                $('#poepleservice').slideDown();
                $('#complexcontrol').slideUp();
            }else{
                $('#complexcontrol').slideDown();
                $('#poepleservice').slideUp();
            }
        })
    }
};

var fullscreen = new FullScreen();
