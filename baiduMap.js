function FullScreen() {
    this._init();
    this.serviceToControl();
    // this.areaToDivision();
}

FullScreen.prototype = {
    IP : 'http://172.20.36.123:8100',
    IP1 : 'http://172.20.36.34:8100',
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
        this.showMiddleFour();
        this.showPeaceTripod();
        this.showTopFive();
        this.showVipControl();
        this.showPoepleService();
        this.showComplexControl();
        this.clock();
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
                data:["机构队伍", "实有人口", "社会组织", "特殊人群", "重点青少年", "社会治安", "矛盾纠纷排查", "校园周边安全", "护路护线"]
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
                    data:[
                        {"value":335, "name":"机构队伍"},
                        {"value":310, "name":"实有人口"},
                        {"value":234, "name":"社会组织"},
                        {"value":135, "name":"特殊人群"},
                        {"value":1548,"name":"重点青少年"},
                        {"value":548, "name":"社会治安"},
                        {"value":158, "name":"矛盾纠纷排查"},
                        {"value":148, "name":"校园周边安全"},
                        {"value":154, "name":"护路护线"}
                    ]
                }
            ]
        };
        myChart.setOption(option, true);
        /*this._ajax(this.IP+'/dashboard/findComprehensiveTreatmentData','get',function (res) {
            console.log(res);
            if(res){
                option.series[0].data = res.v;
                var arr = [];
                $.each(option.series[0].data,function (index,value) {
                    arr.push(value.name);
                });
                option.legend.data = arr;
            }else{
                option.series.data = [];
            }
            myChart.setOption(option, true);
        });*/
    },

    /*
    * 平安元素peacelement
    * */
    showPeacElement:function(){
        /*this._ajax(this.IP+'/dashboard/findSafeElement','get',function (res) {
            console.log(res);
            var html
            $.each(res.v,function (i,ivalue) {
                let inum = i+1;
                html += '<tr>';
                html += '<td style="width: 33px">'+inum+'<td style="width: 96px">'+ivalue.name+'</td>'+'<td style="width: 97px">'+ivalue.value+'</td>';
                html += '</tr>';
            });

            $('#safeTbody').append(html);
        })*/
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
                },
                data:["事件登记","事件指派","事件处理","事件考评"]
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
                    },
                    data:[
                        {"value":1335, "name":"事件登记"},
                        {"value":310, "name":"事件指派"},
                        {"value":234, "name":"事件处理"},
                        {"value":135, "name":"事件考评"}
                    ]
                }
            ]
        };
        myChart.setOption(option, true);
        /*this._ajax(this.IP+'/dashboard/findDisputeCount','get',function (res) {
            console.log(res);
            if(res){
                option.series[0].data = res.v;
                var arr = [];
                $.each(option.series[0].data,function (index,value) {
                    arr.push(value.name);
                });
                option.legend.data = arr;
            }else{
                option.series.data = [];
            }
            myChart.setOption(option, true);
        });*/
    },

    /*
    * 特殊人群、重点青少年、社会治安、矛盾纠纷
    * */
    showMiddleFour:function () {
        /*this._ajax(this.IP+'/dashboard/findDataList','get',function (res) {
        // this._ajax('http://172.20.36.34:8100/dashboard/findMonthTestData','get',function (res) {
            console.log(res);
            $('#teenCount').text(res.v[1].value);
            $('#publicSecurity').text(res.v[3].value);
            $('#specialPopu').text(res.v[2].value);
            $('#dispute').text(res.v[0].value+'%');
        })*/
    },

    /*
    * 平安鼎考核peacetripod
    * */
    showPeaceTripod :function () {
        /*$.ajax({
            url:'http://172.20.36.34:8100/dashboard/findMonthTestData',
            type:'get',
            success:function (res) {
                if(res){
                    var myChart = echarts.init(document.getElementById('peacetripod'),'macarons');
                    var option = {
                        grid:{
                            x:'5%',
                            x2:'2%',
                            y2:'20%',
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
                        tooltip : {
                            trigger: 'axis'
                        },
                        calculable : true,
                        xAxis : [
                            {
                                type : 'category',
                                axisLabel: {
                                    interval:0,
                                    rotate:45,
                                    margin:1,
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
                                data : res.x
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
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
                        ],
                        series : [
                            {
                                type:'bar',
                                itemStyle: {
                                    normal: {
                                        color: function(params) {
                                            // build a color map as your need.
                                            var colorList = [
                                                '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B','#FAD860','#9BCA63',
                                                '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD','#F4E001','#F4E001',
                                                '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0','#FE8463','#27727B'
                                            ];
                                            return colorList[params.dataIndex]
                                        },
                                    }
                                },
                                data:res.v[0]
                            }
                        ]
                    };
                    myChart.setOption(option, true);
                }
            },
            error:function () {

            }
        });*/
        var myChart = echarts.init(document.getElementById('peacetripod'),'macarons');
        var option = {
            grid:{
                x:'5%',
                x2:'2%',
                y2:'20%',
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
            tooltip : {
                trigger: 'axis'
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    axisLabel: {
                        interval:0,
                        rotate:45,
                        margin:1,
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
                    data : ["新城区","碑林区","莲湖区","雁塔区","未央区","灞桥区","长安区","阎良区","临潼区","高陵区","鄠邑区","西咸新区","周至县","蓝田县","浐灞生态区","港务区","高新区","航空基地","航天基地","经开区","曲江新区"]
                }
            ],
            yAxis : [
                {
                    type : 'value',
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
            ],
            series : [
                {
                    type:'bar',
                    itemStyle: {
                        normal: {
                            color: function(params) {
                                // build a color map as your need.
                                var colorList = [
                                    '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B','#FAD860','#9BCA63',
                                    '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD','#F4E001','#F4E001',
                                    '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0','#FE8463','#27727B'
                                ];
                                return colorList[params.dataIndex]
                            },
                        }
                    },
                    data:[920, 932, 901, 934, 990, 930, 910,920, 932, 901, 934, 990, 930, 910, 932, 901, 934, 901, 930, 910,920]
                }
            ]
        };
        myChart.setOption(option, true);
    },

    /*
    * 考核指标细则排名扣分前五 topFive
    * */
    showTopFive: function(){
        var myChart = echarts.init(document.getElementById('topFive'),'macarons');
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
                },
                data:["政治安全稳定","经济健康发展","社会秩序","公共安全稳固","人民安居乐业"]
            },
            calculable : false,
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
                    },
                    data:[
                        {value:335, name:'政治安全稳定'},
                        {value:310, name:'经济健康发展'},
                        {value:234, name:'社会秩序'},
                        {value:135, name:'公共安全稳固'},
                        {value:1548, name:'人民安居乐业'}
                    ]
                }
            ]
        };
        myChart.setOption(option, true);
    },

    /*
    * 综治关注人员管控vipcontrol
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
                    indicator:[
                        {
                            max:100,
                            text:"刑满释放人员"
                        },
                        {
                            max:100,
                            text:"精神病人员"
                        },
                        {
                            max:100,
                            text:"重点青少年"
                        },
                        {
                            max:100,
                            text:"艾滋病人员"
                        },
                        {
                            max:100,
                            text:"矫正人员"
                        },
                        {
                            max:100,
                            text:"吸毒人员"
                        }
                    ]
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
                            name : '人员分类',
                            value:[97, 42, 88, 94, 90, 86]
                        }
                    ]
                }
            ]
        };
        myChart.setOption(option, true);
        /*this._ajax(this.IP+'/dashboard/findKeyPersonnel','get',function (res) {
            console.log(res);
            if(res){
                option.series[0].data[0].value = res.v;
                var arr = [];
                $.each(res.x,function (index,value) {
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
            $('#todayAlermNum').text(res.y[0].value);
            $('#topAlerm').text(res.y[1].value);
        });*/
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
                },
                data:["快捷报警","视频报警","消息报警","一键求助"]
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
                        }
                    },
                    data:[
                        {"value":10, "name":"快捷报警"},
                        {"value":5, "name":"视频报警"},
                        {"value":15, "name":"消息报警"},
                        {"value":25, "name":"一键求助"}
                    ]
                }
            ]
        };
        myChart.setOption(option, true);
        /*this._ajax(this.IP+'/dashboard/findConvenienceServices','get',function (res) {
            console.log(res);
            if(res){
                option.series[0].data = res.v;
                var arr = [];
                $.each(option.series[0].data,function (index,value) {
                    arr.push(value.name);
                });
                option.legend.data = arr;
            }else{
                option.series.data = [];
            }
            myChart.setOption(option, true);
        });*/
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
    /*areaToDivision: function () {
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
    },*/

    /*
    * 时钟
    * */
    clock :function () {
        setInterval(function () {
            let now = new Date(); // 得到当前时间
            let y = now.getFullYear();
            let M = now.getMonth()+1;
            let d = now.getDate();
            let h = now.getHours()<10?'0'+now.getHours():now.getHours();
            let m = now.getMinutes()<10?'0'+now.getMinutes():now.getMinutes();
            let s = now.getSeconds()<10?'0'+now.getSeconds():now.getSeconds();
            timeStr1 = y+'.'+M+'.'+d;
            timeStr2 = h+':'+m+':'+s;
            $('.headerTime>span:eq(0)').text(timeStr1);
            $('.headerTime>span:eq(1)').text(timeStr2);
        },1000);
    }
};

var fullscreen = new FullScreen();
