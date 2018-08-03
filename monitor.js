/**
 * 实时报警监控js
 * @author shiyajian
 * @constructor
 */
function Monitor() {

    this.center = {Lat: 34.19478, Lng: 108.86849};
    this.defaultZoomLevel = 13;// 自定义缩放级别 [4,17]
    this.QQmap = undefined;
    this.hotQQMap = undefined;
    this.countQQMap = undefined;
    this.currentOrgCode = localStorage.getItem("currentOrgCode");
    this.currentUserCode = localStorage.getItem("currentUserCode");

    this.rtc = undefined;
    this.isSaved = false;

    // 所有覆盖物集合
    this.markers = [];
    this.countMarkers = [];

    this._init();
}

Monitor.prototype = {

    _init: function () {
        this.initPostMessage();
        this.initQQMap();
        this.updateAlarmList();
        this.initMarquees();
        this.lazyInitOtherMap();
    },
    /**
     * 初始化QQ地图
     */
    initQQMap: function () {
        var me = this;
        me.QQmap = new qq.maps.Map(document.getElementById("container"), {
            // 地图的中心地理坐标。
            center: new qq.maps.LatLng(me.center.Lat, me.center.Lng),
            zoom: me.defaultZoomLevel,
            zoomControl: false,
            panControl: false
        });
    },
    /**
     * 在方法最后把热力图和统计页面加载出来
     */
    lazyInitOtherMap: function () {
        var me = this;
        me.hotQQMap = new qq.maps.Map(document.getElementById("hotContainer"), {
            // 地图的中心地理坐标。
            center: new qq.maps.LatLng(me.center.Lat, me.center.Lng),
            zoom: me.defaultZoomLevel,
            zoomControl: false,
            panControl: false
        });
        me.countQQMap = new qq.maps.Map(document.getElementById("countContainer"), {
            // 地图的中心地理坐标。
            center: new qq.maps.LatLng(me.center.Lat, me.center.Lng),
            zoom: me.defaultZoomLevel,
            zoomControl: false,
            panControl: false
        });
    },
    /**
     * 点击按钮切换地图
     */
    changeMap: function (id, e) {
        var me = this;
        $('.map-div').attr('style', 'display:none');
        $('#' + id).removeAttr('style');

        // 相邻按钮取消选中样式，本按钮增加选中样式
        var target = e.target;
        var siblings = $(target).siblings('button');
        siblings.removeClass('btn-primary').addClass('btn-default');
        $(target).removeClass('btn-default').addClass('btn-primary');

        if (id == 'hotDiv') {
            me.updateHotMap();
        } else if (id == 'countDiv') {
            me.updateCountMap();
        }
    },
    /**
     * sip2主框架页面发送过来的消息，收到信息之后去数据库查询最新的报警信息
     */
    initPostMessage: function () {
        var me = this;
        window.addEventListener('message', function (event) {

            if (!event.data || event.data.code == 0) {
                me.updateAlarmList();
                return;
            }

            var code = event.data.code;
            // 来信息刷新滚动
            if (code == 2) {
                var data = event.data.data;
                var obj = JSON.parse(data);
                var html;
                // 报警
                if (obj.type == 1) {
                    html = me.getAlarmHtml(obj);
                    $('#alarmLst').append(html);
                    if ($('#alarmLst').length >= 10) {
                        $('#alarmLst').find('li:first').remove();
                    }
                    // 接警
                } else if (obj.type == 2) {
                    html = me.getRecevieHtml(obj);
                    $('#receiveLst').append(html);
                    if ($('#receiveLst').length >= 10) {
                        $('#receiveLst').find('li:first').remove();
                    }
                    //处警
                } else {
                    html = me.getReceiptHtml(obj);
                    $('#receiptLst').append(html);
                    if ($('#receiptLst').length >= 10) {
                        $('#receiptLst').find('li:first').remove();
                    }
                }
            }
        }, false);
    },
    initFormValidator: function () {
        var me = this;

        me.commonFormValidator = $('#commonForm').validate({
            rules: {
                alarmPersonId: {
                    maxlength: 18
                },
                alarmText: {
                    required: true,
                    maxlength: 1000
                },
                police: {
                    required: true
                }
            }, messages: {
                alarmPersonId: {
                    maxlength: '身份证号格式不正确！'
                },
                alarmText: {
                    required: "报警信息不能为空！",
                    maxlength: "报警信息不能超过1000个字"
                },
                police: {
                    required: "请选择出警员！"
                }
            }, highlight: function (element) {
                $(element).parents('.form-group').addClass('has-error has-feedback');
            },
            unhighlight: function (element) {
                $(element).parents('.form-group').removeClass('has-error');
            },
            submitHandler: function (form) {
                if (!$(form).valid()) {
                    layer.alert("请完善报警信息");
                    return false;
                }
                $('.layui-layer-btn').hide();
                var inputs = $(form).find('input,textarea,select');
                var params = {};
                $.each(inputs, function () {
                    if ($(this).is('input') || $(this).is('select')) {
                        params[$(this).attr('name')] = $(this).val();
                    } else {
                        // textarea 取html值
                        params[$(this).attr('name')] = $(this).html();
                    }
                });

                var officerId = $(form).find('select').val();

                $.ajax({
                    url: "/alarmReceive/saveAlarmReceive",
                    method: 'post',
                    data: JSON.stringify(params),
                    dataType: "JSON",
                    contentType: "application/json"
                }).success(function (data) {
                    if (data.state == 1) {

                        // 修改警察状态
                        $.ajax({
                            url: "/iemp/officer/" + officerId + "/status",
                            method: 'put',
                            dataType: "JSON",
                            contentType: "application/json"
                        }).success().error(function (error) {
                            console.log(error);
                        });


                        me.isSaved = true;
                        layer.confirm('生成出警单成功,是否关闭当前窗口？', {
                            btn: ['确定', '取消']
                        }, function (index, layero) {
                            me.quitRtc();
                            layer.closeAll();
                        });

                        me.updateAlarmList();
                    } else {
                        layer.alert(data.data);
                        $('.layui-layer-btn').show();
                    }
                }).error(function () {
                    $('.layui-layer-btn').show();
                })
            }
        });
    },
    /**
     * 初始化轮播图
     */
    initMarquees: function () {

        var me = this;
        $.ajax({
            url: "/alarmReceive/halfdata",
            method: 'get',
            data: {
                code: me.currentOrgCode
            },
            dataType: "JSON",
            contentType: "application/json"
        }).success(function (data) {
            if (data.state == 1) {
                var alarmHtml = '', receiveHtml = '', receiptHtml = '';

                $('#alarmLst').empty();
                $.each(data.data.alarmLst, function () {
                    alarmHtml += me.getAlarmHtml(this);
                });
                alarmHtml && $('#alarmLst').append(alarmHtml);

                $('#receiveLst').empty();
                $.each(data.data.receiveLst, function () {
                    receiveHtml += me.getRecevieHtml(this);
                });
                receiveHtml && $('#receiveLst').append(receiveHtml);

                $('#receiptLst').empty();
                $.each(data.data.receiptLst, function () {
                    receiptHtml += me.getReceiptHtml(this);
                });
                receiptHtml && $('#receiptLst').append(receiptHtml);
            }
        }).error(function (error) {
            console.log(error);
        })
    },
    getAlarmHtml: function (obj) {
        return "<li>报警人：" + obj.nickname + "<br>" +
            "报警时间：" + obj.alarmTime + "<br>" +
            "报警内容：" + (obj.alarmText || '') + "</li><hr style='border: dashed 1px;align-content: center;width: 90%'>";
    },
    getRecevieHtml: function (obj) {
        return "<li>报警单号：" + obj.alarmNum + "<br>" +
            "接警人：" + obj.receivePerson + "<br>" +
            "接警时间：" + obj.receiveTime + "<br>" +
            "出警员：" + obj.name + "</li><hr style='border: dashed 1px;align-content: center;width: 90%'>";
    },
    getReceiptHtml: function (obj) {
        return "<li>处警人：" + obj.name + "<br>" +
            "出警时间：" + obj.outTime + "<br>" +
            "现场情况：" + obj.fieldSituation + "<br>" +
            "处理情况：" + obj.outboundSituation + "</li><hr style='border: dashed 1px;align-content: center;width: 90%'>";
    },
    /**
     * 报警热力图
     */
    updateHotMap: function () {
        var me = this;
        var hotData = {};
        $.ajax({
            method: 'get',
            url: '/alarm/hotpicture',
            dataType: 'JSON',
            data: {
                code: me.currentOrgCode
            },
            success: function (data) {
                hotData['max'] = 10,
                hotData['data'] = data.data
            },
            error: function () {
                console.log("报警热力图异常！");
            }
        });
        // 地图异步加载，在idle或者tilesloaded后初始化
        qq.maps.event.addListenerOnce(me.hotQQMap, "idle", function () {
            if (QQMapPlugin.isSupportCanvas) {
                var heatmap = new QQMapPlugin.HeatmapOverlay(me.hotQQMap,
                    {
                        // 点半径，设置为1即可
                        "radius": 1,
                        // 热力图最大透明度
                        "maxOpacity": 0.8,
                        // 是否在每一屏都开启重新计算，如果为true则每一屏都会有一个红点
                        "useLocalExtrema": true,
                        //设置大小字段
                        "valueField": 'count'
                    }
                );
                // 重新确定中心坐标
                if(hotData.data.length>0){
                    me.hotQQMap.setCenter(new qq.maps.LatLng(hotData.data[0].lat, hotData.data[0].lng));
                }
                // 绘制热力图
                heatmap.setData(hotData);
            } else {
                alert("您的浏览器不支持canvas，无法绘制热力图！！")
            }

        });
    },
    /**
     * 接处警图
     */
    updateCountMap: function () {
        var me = this;
        $.ajax({
            url: 'alarm/alarmhandle',
            method: 'get',
            dataType: 'JSON',
            data: {
                code: me.currentOrgCode
            },
            success: function (response) {
                // 循环清除所有标记点
                $.each(me.countMarkers, function () {
                    this.setMap(null);
                });
                // 释放内存，将旧的坐标集合置空
                me.countMarkers = [];
                me.markAllPointsToMap(response.data);
            },
            error: function () {
                console.log("接处警图异常！");
            }
        });
    },
    /**
     * 更新报警信息
     */
    updateAlarmList: function () {
        var me = this;
        var param = {
            orgCode: me.currentOrgCode
        };

        $.ajax({
            url: '/alarm/findAlarmList',
            method: 'post',
            dataType: "JSON",
            contentType: "application/json",
            data: JSON.stringify(param)
        }).success(function (response) {

            // 循环清除所有标记点
            $.each(me.markers, function () {
                this.setMap(null);
            });
            // 释放内存，将旧的坐标集合置空
            me.markers = [];

            if (!response.data || response.data.length == 0) {
                // 此方法在sip2项目中，用于清空右上角的消息通知
                top.bell.clearNotice();
                return;
            }
            me.markPointToMap(response.data);
        }).error(function (e) {
            console.error(e);
        })
    },
    /**
     *  重新定位map的中心，重新设置覆盖点
     */
    markPointToMap: function (data) {
        var me = this;
        var isSetCenterPointer = false;

        $.each(data, function (i, item) {
            // 将地图的中心点设置为最早的视频报警的坐标
            if (!isSetCenterPointer && item.alarmType == 3) {
                me.QQmap.setCenter(new qq.maps.LatLng(item.latitude, item.longitude));
                isSetCenterPointer = true;
            }
            var marker = new CustomOverlay(new qq.maps.LatLng(item.latitude, item.longitude), item);
            marker.setMap(me.QQmap);
            // 把每个坐标保存进去
            me.markers.push(marker);
        });

        // 如果没有视频报警，则把中心放置到最早的报警上
        if (!isSetCenterPointer && data && data.length > 0) {
            me.QQmap.setCenter(new qq.maps.LatLng(data[0].latitude, data[0].longitude));
            isSetCenterPointer = true;
        }
    },
    /**
     *  显示所有接处警点位
     */
    markAllPointsToMap: function (data) {
        var me = this;
        var isSetCenterPointer = false;
        $.each(data, function (i, item) {
            // 重新确定地图中心点
            if (!isSetCenterPointer) {
                me.countQQMap.setCenter(new qq.maps.LatLng(item.lat, item.lng));
                isSetCenterPointer = true;
            }
            var infoWin = new qq.maps.InfoWindow({
                map: me.countQQMap,
            });
            var marker = new policeOverlay(new qq.maps.LatLng(item.lat, item.lng), item, infoWin);
            marker.setMap(me.countQQMap);
            // 把每个坐标保存进去
            me.countMarkers.push(marker);
        });
    },
    /**
     * 生成QQ小图标
     */
    makeIcon: function (type) {
        var icon = '';
        if (type === '1') {
            icon = $('#fastUrl').attr('data-url');
        } else if (type === '2') {
            icon = $('#messageUrl').attr('data-url');
        } else if (type === '3') {
            icon = $('#videoUrl').attr('data-url');
        }
        var anchor = new qq.maps.Point(14, 38);
        var size = new qq.maps.Size(28, 38);
        var origin = new qq.maps.Point(0, 0);
        return new qq.maps.MarkerImage(icon, size, origin, anchor);
    },
    /**
     * 视频报警图标点击事件
     */
    clickAudio: function (item) {
        var me = this;
        layer.confirm('接听报警？', {
            btn: ['接听', '取消']
        }, function (index, layero) {
            layer.closeAll();
            // me.connectAudio(item);
            $.ajax({
                url: '/alarm/updateStateById',
                data: JSON.stringify({
                    id: item.id,
                    state: 1
                }),
                method: 'post',
                dataType: "JSON",
                contentType: "application/json",
            }).success(function (response) {
                if (response.state == 1) {
                    me.connectAudio(item);
                } else {
                    layer.alert("接警失败，此报警已经被其他坐席人员接听！");
                    me.updateAlarmList();
                }
            }).error(function () {
                layer.alert("接警失败！");
            })
        });
    },
    /**
     * 连接视频
     */
    connectAudio: function (item) {
        var me = this;
        var html = me.getAudioDom(item);
        layer.open({
            title: '视频报警',
            type: 1,
            area: ['800px', '600px'],
            content: html,
            btn: ['生成出警单'],
            yes: function (index) {
                $('#commonForm').submit();
            },
            // 页面弹出成功的方法
            success: function () {
                me.isSaved = false;
                // 初始化表单的校验组件
                me.initFormValidator();
                // 获得视频的私钥
                $.ajax({
                    url: '/alarm/getVideoKey',
                    data: JSON.stringify({
                        alarmNum: item.alarmNum,
                        roomId: item.roomId,
                        userId: me.currentUserCode
                    }),
                    method: 'post',
                    dataType: "JSON",
                    contentType: "application/json"
                }).success(function (response) {
                    if (response.state != 1) {
                        console.log('获取视频信息出错')
                    }
                    me.createRTC(response.data, item.alarmNum);
                    me.createVideoCommunication(response.data);
                    // 创建RTC流
                }).error(function (error) {
                    console.log('获取视频信息出错');
                })
            },
            // 关闭右上角的方法
            cancel: function () {
                if (!me.isSaved) {
                    layer.confirm('数据未保存，你确定要退出吗？？', {
                        btn: ['确定', '取消']
                    }, function (index, layero) {
                        layer.closeAll();
                        me.quitRtc();
                        me.updateAlarmList();
                    }, function () {

                    });
                    return false;
                }
            }
        });
    },
    /**
     * 快捷报警点击事件
     */
    clickFast: function (item) {
        this.openCommonWin(1, item);
    },
    /**
     * 信息报警点击事件
     */
    clickMsg: function (item) {
        this.openCommonWin(2, item);
    },
    /**
     * 打开通用报警页面，根据type判断是否加载图片和音频
     * @param type   1:快捷报警  2：信息报警
     */
    openCommonWin: function (type, item) {
        var me = this;
        // 先把状态占用了
        $.ajax({
            url: '/alarm/updateStateById',
            data: JSON.stringify({
                id: item.id,
                state: 1
            }),
            method: 'post',
            dataType: "JSON",
            contentType: "application/json"
        }).success(function (response) {
            if (response.state == 1) {
                var title = type == 1 ? '快捷报警' : '信息报警';
                var html = me.getCommonFormDom(type, item);
                layer.open({
                    title: title,
                    type: 1,
                    area: ['450px', '400px'],
                    content: html,
                    btn: ['生成出警单'],
                    yes: function (index, e, m) {
                        me.isSaved = false;
                        $('#commonForm').submit();
                    },
                    // 页面弹出成功的方法
                    success: function () {
                        if (type == 1) {
                            $('#imgAndVideoArea').attr('hidden', 'hidden');
                            $('#imgAndVideoArea').attr('disabled', 'disabled');
                        } else {
                            $('#imgAndVideoArea').removeAttr('hidden');
                            $('#imgAndVideoArea').removeAttr('disabled');
                        }
                        me.initFormValidator();
                    },
                    // 关闭右上角的方法
                    cancel: function () {
                        if (!me.isSaved) {
                            layer.confirm('数据未保存，你确定要退出吗？？', {
                                btn: ['确定', '取消']
                            }, function (index, layero) {
                                layer.closeAll();
                                $.ajax({
                                    url: '/alarm/updateStateById',
                                    data: JSON.stringify({
                                        id: item.id,
                                        state: 0
                                    }),
                                    method: 'post',
                                    dataType: "JSON",
                                    contentType: "application/json"
                                })
                            }, function () {

                            });
                            return false;
                        }
                    }
                })
            } else {
                layer.alert("接警失败，此报警已经被其他坐席人员接听！");
            }
            me.updateAlarmList();
        }).error(function (e) {
            console.log(e);
        })
    },
    /**
     * 创建RTC视频流
     */
    createRTC: function (data, alarmNum) {
        var me = this;
        WebRTCAPI.fn.detectRTC(function (info) {
            if (!info.support) {
                alert('不支持WebRTC');
                return;
            }
        });
        var opts = {
            userId: me.currentUserCode,
            sdkAppId: data.sdkAppId,
            accountType: data.accountType,
            userSig: data.userSig
        };
        var roomOpts = {
            roomid: data.roomId,
            privateMapKey: data.privMapEncrypt,
            role: data.role
        };
        me.rtc = new WebRTCAPI(opts, function successCallBack(data) {
            me.updateTips("初始化……", true);
            me.rtc.createRoom(roomOpts,
                function successCallBack() {
                    me.updateTips("进入房间……", true);
                    $('#closeAudioBtn').removeAttr('style');
                },
                function successCallBack() {
                    console.log('进入房间失败')
                });
            me.rtc.on('onLocalStreamAdd', function (data) {
                if (data && data.stream) {
                    document.querySelector("#localVideoMedia").srcObject = data.stream;
                }
            });
            //  远端流 新增/更新
            var status = 0;
            me.rtc.on('onRemoteStreamUpdate', function (data) {
                if (data && data.stream) {
                    status = status + 1;
                    me.updateTips("", false);
                    document.querySelector("#remoteVideoMedia").srcObject = data.stream;
                    if (status === 2) {
                        $.ajax({
                            url: "/alarm/convertVideo",
                            data: JSON.stringify({
                                alarmNum: alarmNum,
                                userId: me.currentUserCode,
                                roomId: data.roomId
                            }),
                            method: 'post',
                            dataType: "JSON",
                            contentType: "application/json"
                        }).success(function () {

                        }).error(function () {

                        })
                    }
                }
            });
            me.rtc.on('onRemoteStreamRemove', function () {
                me.quitRtc();
            });
            me.rtc.on('onWebSocketClose', function () {
                me.quitRtc();
            });
            me.rtc.on('onRelayTimeout', function () {
                me.quitRtc();
            });
        }, function errorCallBack(error) {
            console.log('初始化rtc失败', error);
        });
    },
    /**
     * 创建连接
     */
    createVideoCommunication: function (data) {
        var me = this;
        var params = {
            alarmNum: data.alarmNum,
            roomId: data.roomId,
            userId: me.currentUserCode
        };
        $.ajax({
            url: "/alarm/convertVideo",
            data: JSON.stringify(params),
            method: 'post',
            dataType: "JSON",
            contentType: "application/json"
        }).success(function () {

        }).error(function () {

        })
    },
    /**
     * 退出rtc视频聊天
     */
    quitRtc: function () {
        var me = this;
        if (me.rtc) {
            me.rtc.quit();
            document.querySelector("#remoteVideoMedia").srcObject = undefined;
            document.querySelector("#localVideoMedia").srcObject = undefined;
            me.updateTips("通话已结束", true);
            me.rtc = undefined;
            $('#closeAudioBtn').css('display', 'none');
        }
    },
    /**
     * 修改提示信息
     * @param msg: 显示的提示信息
     * @param flag: true(显示) false(隐藏)
     */
    updateTips: function (msg, flag) {
        var me = this;
        $('#msgTips').html(msg);
        if (flag) {
            $('#msgTips').removeAttr('hidden');
        } else {
            $('#msgTips').attr('hidden', 'hidden');
        }
    },
    /**
     * 挂断视频
     */
    closeVideo: function () {
        var me = this;
        layer.confirm("确定结束本次通话?", {
            btn: ['确认', '取消'],
            yes: function (index) {
                layer.close(index);
                me.rtc.closeVideo();
                me.quitRtc();
            }
        })
    },
    /**
     * 双击打开浏览器打开图片
     */
    openImg: function (e) {
        var target = e.target;
        var src = $(target).attr('src');
        window.open(src);
    },
    getAudioDom: function (item) {
        var me = this;
        var html = "<div id='videoWIn' class='center-block row' style='margin:0'>" +
            "        <div class='col-md-6'>" +
            "            <video id='remoteVideoMedia'  autoPlay playsInline class='remote-video' ></video>" +
            "            <div class='row' id='msgTips'>正在连接中……</div>" +
            "            <button id='closeAudioBtn' style='display: none' class='btn btn-danger btn-circle' type='button' onclick='monitor.closeVideo()'><i class='glyphicon glyphicon-remove'></i></button>" +
            "        </div>" +
            "        <div class='col-md-6' style='border-left: solid 1px lavender;height: 500px'>" +
            "           <div class='row'>" +
            "               <video id='localVideoMedia' muted autoPlay playsInline class='local-video' ></video>" +
            "           </div>";
        html += me.getFormDom(item);
        html += "</div></div>";
        return html;
    },
    /**
     * 获得信息报警和快速报警的通用页面
     */
    getCommonFormDom: function (type, item) {
        var me = this;
        var html = "<div id='commonWIn' class='center-block row' style='margin: 0 10px;'>";
        html += me.getFormDom(item);
        html += "</div>";
        // 信息报警，查询附件信息
        if (type == 2) {
            $.ajax({
                url: "/alarm/findAlarmFileByNum/" + item.alarmNum,
                method: 'get',
                dataType: "JSON",
                contentType: "application/json",
                async: false
            }).success(function (response) {

                if (response.state != 1) {
                    return;
                }
                var soundArr = [];
                var picArr = [];
                $.each(response.data, function () {
                    if (this.fileType == 1) {
                        picArr.push(this);
                    } else {
                        soundArr.push(this);
                    }
                });

                if (picArr.length == 0 && soundArr.length == 0) {
                    return;
                }

                html = html.split("</form>")[0];
                if (soundArr.length > 0) {
                    html += " <div class='form-group' >";
                    html += " <div class='col-md-12'><label class='control-label'>音频附件：</label></div>";
                    $.each(soundArr, function () {
                        html += "<div class='col-md-4'>";
                        html += "<video controls='controls' style='width: 100%;height: 50px;' src='" + this.filePath + "'></video>";
                        html += "</div>";
                    });
                    html += '</div>';
                }
                if (picArr.length > 0) {
                    html += " <div class='form-group' >";
                    html += " <div class='col-md-12'><label class='control-label'>图片附件：</label></div>";
                    $.each(picArr, function () {
                        html += "<div class='col-md-4'>";
                        html += "   <img style='width: 135px;height: 135px;' onclick='monitor.openImg(event)' src='" + this.filePath + "' />";
                        html += "</div>";
                    });
                    html += '</div>';
                }
                html += '</form></div>';
            }).error(function () {
                console.log('查询附件新消息失败！')
            })
        }
        return html;
    },
    getFormDom: function (item) {
        var me = this, name = '', phone = '', officers = '';
        $.ajax({
            url: '/alarm/userInf/' + item.loginAccount,
            method: 'get',
            dataType: "JSON",
            contentType: "application/json",
            async: false // 同步执行
        }).success(function (data) {
            if (data) {
                name = data.name;
                phone = data.phone;
            }
        }).error(function (error) {
            console.log(error);
        });
        $.ajax({
            url: '/iemp/officer/nearest',
            method: 'get',
            data: {
                lat: item.latitude,
                lng: item.longitude,
                areacode: me.currentOrgCode
            },
            dataType: "JSON",
            contentType: "application/json",
            async: false // 同步执行
        }).success(function (data) {
            if (data.state == 1) {
                $.each(data.data, function () {
                    officers += ("<option value='" + this.id + "'>" + this.name + "</option>");
                })
            }
        }).error(function (error) {
            console.log(error);
        });


        var html = " <form  id='commonForm' class='form-horizontal form-bordered'>" +
            "       <input type='hidden' name='alarmNum' value='" + item.alarmNum + "'/>" +
            "       <input type='hidden' name='alarmPerson' value='" + name + "'/>" +
            "       <input type='hidden' name='alarmPhone' value='" + phone + "'/>" +
            "       <input type='hidden' name='receivePerson' value='" + me.currentUserCode + "'/>" +
            "       <div class='form-body'>" +
            "           <div class='form-group' style=' padding: 5px 0'>" +
            "               <label class='col-md-4 control-label'>报警时间</label>" +
            "               <div class='col-md-7'><span>" + item.alarmTime + "</span></div>" +
            "           </div>" +
            "           <div class='form-group' style=' padding: 5px 0'>" +
            "               <label class='col-md-4 control-label'></span>报警人姓名</label>" +
            "               <div class='col-md-7'><span>" + name + "</span></div>" +
            "           </div>" +
            "           <div class='form-group' style=' padding: 5px 0'>" +
            "               <label class='col-md-4 control-label'></span>报警人电话</label>" +
            "               <div class='col-md-7'><span>" + phone + "</span></div>" +
            "           </div>" +
            "           <div class='form-group' style=' padding: 5px 0'>" +
            "               <label class='col-md-4 control-label'>报警人身份号</label>" +
            "               <div class='col-md-7'>";
        if (item.alarmPersonId) {
            html += "       <span>" + item.alarmPersonId + "</span>";
            html += "       <input type='hidden' name='alarmPersonId' value='" + item.alarmPersonId + "'/>";
        } else {
            html += "       <input type='text' name='alarmPersonId'  placeholder='请输入报警人身份证号' class='form-control'>";
        }
        html += "       </div>" +
            "           </div>" +
            "           <div class='form-group' style=' padding: 5px 0'>" +
            "               <label class='col-md-4 control-label'>报警地点</label>" +
            "               <div class='col-md-7'><span>" + item.address + "</span></div>" +
            "           </div>" +
            "           <div class='form-group' style=' padding: 5px 0'>" +
            "               <label class='col-md-4 control-label'><span class='asterisk'>*</span>派遣警员</label>" +
            "               <div class='col-md-7'>" +
            "                   <select name='police' class='form-control'>" +
            "                   <option value=''> -- 请选择警员 --</option>";
        if (officers) {
            html += officers;
        }
        html += "           </select>" +
            "               </div>" +
            "           </div>";
        // 消息报警和快捷报警
        if (item.alarmType != 3) {
            html += "<div class='form-group' style=' padding: 5px 0'>" +
                "            <label class='col-md-4 control-label'>事件描述</label>" +
                "               <div class='col-md-7'>" +
                "                   <span>" + item.alarmText + "</span>" +
                "               </div>" +
                "           </div>" +
                "       </div>";
        } else {
            html += "<div class='form-group' style=' padding: 5px 0'>" +
                "            <label class='col-md-4 control-label'><span class='asterisk'>*</span>事件描述</label>" +
                "               <div class='col-md-7'>" +
                "                   <textarea type='text' name='alarmText' style='height: 72px'  placeholder='请输入事件描述' class='form-control' >" + (item.alarmText || '') + "</textarea>" +
                "               </div>" +
                "           </div>" +
                "       </div>";
        }
        html += "   </form>";

        return html;
    }
};


var monitor = new Monitor();

function CustomOverlay(position, item) {
    this.position = position;
    this.item = item;
}

CustomOverlay.prototype = new qq.maps.Overlay();
//定义construct,实现这个接口来初始化自定义的Dom元素
CustomOverlay.prototype.construct = function () {
    var self = this, icon;
    if (self.item.alarmType === '1') {
        icon = $('#fastUrl').attr('data-url');
    } else if (self.item.alarmType === '2') {
        icon = $('#messageUrl').attr('data-url');
    } else if (self.item.alarmType === '3') {
        icon = $('#videoUrl').attr('data-url');
    }
    var pastTime = formNow(self.item.alarmTime);
    var html = "<div style='position: absolute;height: 40px;background: #2f3a4c none repeat scroll 0% 0%; color: #fff; border: 1px #2bcaf3 solid; box-shadow: 8px 5px 5px #999;padding: 0 10px; opacity: 0.8;'>" +
        "        <span  class='timer'>" + pastTime + "</span>" +
        "        <span>" + (self.item.today || 0 ) + "/" + (self.item.all || 0) + "(次)</span>" +
        "        <div style='width:100%;padding-left: 12px;'><img src='" + icon + "' alt='' style='width: 32px;height: 32px;'></div>" +
        "    </div>";
    //将dom添加到覆盖物层
    var div = this.div = $(html)[0];
    var panes = this.getPanes();
    //设置panes的层级，overlayMouseTarget可接收点击事件
    panes.overlayMouseTarget.appendChild(div);
    this.div.onclick = function () {
        if (self.item.alarmType == 1) {
            monitor.clickFast(self.item);
        } else if (self.item.alarmType == 2) {
            monitor.clickMsg(self.item);
        } else if (self.item.alarmType == 3) {
            monitor.clickAudio(self.item);
        }
    }
    this.timerSpan = $(this.div).find('span.timer');
    this.timer = window.setInterval(refreshCount, 1000);

    function refreshCount() {
        self.timerSpan.html(formNow(self.item.alarmTime));
    }

}
//实现draw接口来绘制和更新自定义的dom元素
CustomOverlay.prototype.draw = function () {
    var overlayProjection = this.getProjection();
    //返回覆盖物容器的相对像素坐标
    var pixel = overlayProjection.fromLatLngToDivPixel(this.position);
    var divStyle = this.div.style;
    divStyle.left = pixel.x - 12 + "px";
    divStyle.top = pixel.y - 12 + "px";
}
//实现destroy接口来删除自定义的Dom元素，此方法会在setMap(null)后被调用
CustomOverlay.prototype.destroy = function () {
    var self = this;
    this.div.onclick = null;
    this.div.parentNode.removeChild(this.div);
    this.div = null;
    //去掉定时器的方法
    window.clearInterval(self.timer);
}

function formNow(d1) {//di作为一个变量传进来
    //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
    var dateBegin = new Date(d1.replace(/-/g, "/"));//将-转化为/，使用new Date
    var dateEnd = new Date();//获取当前时间
    var dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
    var leave1 = dateDiff % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000))//计算出小时数
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000)    //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000))//计算相差分钟数
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000)
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours + ":" + minutes + ":" + seconds;

}


function policeOverlay(position, item, infoWin) {
    this.position = position;
    this.item = item;
    this.infoWin = infoWin;
}

policeOverlay.prototype = new qq.maps.Overlay();
//定义construct,实现这个接口来初始化自定义的Dom元素
policeOverlay.prototype.construct = function () {
    var self = this, icon;
    if (self.item.status === '2' || self.item.status === '3' || self.item.status === '4') {
        icon = $('#policeHandle').attr('data-url');
    } else {
        icon = $('#policeUnHandle').attr('data-url');
    }
    var pastTime = getTimeRegion(self.item);
    var titleContent = "";
    if (self.item.status === '2' || self.item.status === '3' || self.item.status === '4') {
        titleContent = "接警耗时";
    } else {
        titleContent = "未接警";
    }
    var html = "<div style='position: absolute;width:80px;height: 40px;background: #2f3a4c none repeat scroll 0% 0%; color: #fff; border: 1px #2bcaf3 solid; box-shadow: 8px 5px 5px #999;padding: 0 10px; opacity: 0.8;'>" +titleContent+
    "        <br/><span  class='timer'>" + pastTime + "</span>" +
    "        <div style='width:100%;padding-left: 12px;'><img src='" + icon + "' alt='' style='width: 32px;height: 32px;'></div>" +
    "    </div>";
    //将dom添加到覆盖物层
    var div = this.div = $(html)[0];
    var panes = this.getPanes();
    //设置panes的层级，overlayMouseTarget可接收点击事件
    panes.overlayMouseTarget.appendChild(div);
    /*this.div.onclick = function () {
        var title = "";
        if(self.item.status === '2' || self.item.status === '3' || self.item.status === '4'){
            title = "接警耗时: ";
        }else{
            title = "未接警: ";
        }
        var divContent = '<div id = "infoWinContent" style="text-align:center;white-space:nowrap;margin:10px;"> '+ title +
            "<span class='timer'>" +pastTime+ "</span>"+
            '</div>';
        self.infoWin.open();
        self.infoWin.setContent(divContent);
        self.infoWin.setPosition(self.position);

        this.timer = window.setInterval(refreshPoliceTime, 1000);
        function refreshPoliceTime() {
            $("#infoWinContent").find('span.timer').html(getTimeRegion(self.item));
        }

    }*/
    this.timerSpan = $(this.div).find('span.timer');
    this.timer = window.setInterval(refreshCount, 1000);

    function refreshCount() {
        self.timerSpan.html(getTimeRegion(self.item));
    }

}
//实现draw接口来绘制和更新自定义的dom元素
policeOverlay.prototype.draw = function () {
    var overlayProjection = this.getProjection();
    //返回覆盖物容器的相对像素坐标
    var pixel = overlayProjection.fromLatLngToDivPixel(this.position);
    var divStyle = this.div.style;
    divStyle.left = pixel.x - 12 + "px";
    divStyle.top = pixel.y - 12 + "px";
}
//实现destroy接口来删除自定义的Dom元素，此方法会在setMap(null)后被调用
policeOverlay.prototype.destroy = function () {
    var self = this;
    this.div.onclick = null;
    this.div.parentNode.removeChild(this.div);
    this.div = null;
    //去掉定时器的方法
    window.clearInterval(self.timer);
}

function getTimeRegion(item) {//item作为一个变量传进来
    var timeRegion = "";
    if (item.status === '2' || item.status === '3' || item.status === '4') {
        // 时间差的毫秒数
        timeRegion = Date.parse(new Date(item.receiveTime)) - Date.parse(new Date(item.alarmTime));
    } else {
        timeRegion = Date.parse(new Date()) - Date.parse(new Date(item.alarmTime));//时间差的毫秒数
    }
    var leave1 = timeRegion % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000))//计算出小时数
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000)    //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000))//计算相差分钟数
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000)
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours + ":" + minutes + ":" + seconds;
}