function FullScreen() {
    this._init();
    this.serviceToControl();
    this.areaToDivision();
}

FullScreen.prototype = {
    /*
    * ajax封装
    * */
    _ajax:function (from,type,callback){
        $.ajax({
            url:from,
            type:type,
            dataType:'json',
            success:function (res) {
                callback(res);
            },
            error:function () {

            }
        });
    },
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
            },
            series: [
                {
                    itemStyle : {
                        normal : {
                            label : {
                                show : false,
                                formatter : function (params){
                                    return 100 - params.value + '%'
                                },
                                textStyle: {
                                    baseline : 'top'
                                }
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
                }
            ]
        };
        this._ajax('data.json','get',function (res) {
            console.log(res);
            if(res){
                option.series[0].data = res.zongshishujucaiji.v;
                var arr = [];
                $.each(option.series[0].data,function (index,value) {
                    arr.push(value.name);
                });
                option.legend.data = arr;
            }else{
                option.series.data = [];
            }
            myChart.setOption(option, true);
        });
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
                formatter: "{b} :<br/> {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                x: 'center',
                y:'bottom',
                textStyle:{
                    color:'#fff'
                }
            },
            calculable : false,
            // color:['rgba(0,0,0,1)', 'green','yellow','blueviolet'],
            series : [
                {
                    // name:'访问来源',
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
                    }
                }
            ]
        };
        this._ajax('data.json','get',function (res) {
            console.log(res);
            if(res){
                option.series[0].data = res.maodunjiufen.v;
                var arr = [];
                $.each(option.series[0].data,function (index,value) {
                    arr.push(value.name);
                });
                option.legend.data = arr;
            }else{
                option.series.data = [];
            }
            myChart.setOption(option, true);
        });
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
                x2:'2%',
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
                    splitArea:{
                        show:false
                    },
                }
            ]
        };
        this._ajax('data.json','get',function (res) {
            if(res){
                option.legend.data = res.pinganding.y;
                option.xAxis[0].data = res.pinganding.x;
                var arr = [];
                $.each(res.pinganding.v,function (i,v) {
                    var obj = {
                        type:'line',
                        symbol: 'rectangle',
                        smooth:false,
                    };
                    obj.name = option.legend.data[i];
                    obj.data = v;
                    arr.push(obj);
                });
                option.series = arr;
            }else{
                option.series = [];
            }
            myChart.setOption(option, true);
        });
    },

    /*
    * 重点人员管控vipcontrol
    * */
    showVipControl: function () {
        var myChart = echarts.init(document.getElementById('vipcontrol'),'default');
        var option = {
            tooltip : {
                trigger: 'axis'
            },
            calculable : false,
            polar : [
                {
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
                            name : '人员分类'
                        }
                    ]
                }
            ]
        };
        this._ajax('data.json','get',function (res) {
            console.log(res);
            if(res){
                option.series[0].data[0].value = res.renyuanguankong.v;
                var arr = [];
                $.each(res.renyuanguankong.x,function (index,value) {
                    var obj = {
                        max:100
                    }
                    obj.text = value;
                    arr.push(obj);
                });
                option.polar[0].indicator = arr;
            }else{
                option.series.data = [];
            }
            myChart.setOption(option, true);
        });
    },

    /*
    * 便民服务
    * */
    showPoepleService: function () {
        var myChart = echarts.init(document.getElementById('poepleservice'),'macarons');
        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{b} :<br/> {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                x: 'center',
                y:'bottom',
                textStyle:{
                    color:'#fff'
                }
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
                        /*emphasis : {
                            label : {
                                show : true
                            },
                            labelLine : {
                                show : true
                            }
                        }*/
                    }
                }
            ]
        };
        this._ajax('data.json','get',function (res) {
            console.log(res);
            if(res){
                option.series[0].data = res.bianminfuwu.v;
                var arr = [];
                $.each(option.series[0].data,function (index,value) {
                    arr.push(value.name);
                });
                option.legend.data = arr;
            }else{
                option.series.data = [];
            }
            myChart.setOption(option, true);
        });
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
                $('#poepleservice').show();
                $('#complexcontrol').hide();
            }else{
                $('#complexcontrol').show();
                $('#poepleservice').hide();
            }
        })
    },

    /*
    * 中间底部当月区县考核 市局部门考核切换
    * */
    areaToDivision: function () {
        $('.kaoHe').click(function () {
            $('.kaoHe').css('boxShadow','');
            $(this).css('boxShadow','0px 0px 5px #f9e600 inset');
            if(this.innerHTML === '当月区县考核'){
                $('#peacetripod').show();
                $('#bumen').hide();
            }else{
                $('#bumen').show();
                $('#peacetripod').hide();
            }
        });
    }
};

var fullscreen = new FullScreen();
