var map = new BMap.Map("container");
// 创建地图实例  108.95309828,34.2777999
var point = new BMap.Point(108.95815828, 34.2737999);
// var point = new BMap.Point(108.563260, 34.153959);
// 创建点坐标
map.centerAndZoom(point, 14);
// 初始化地图，设置中心点坐标和地图级别
// map.setMapStyle({style:'midnight'});
// 设置地图主题（蓝黑风格）
map.enableScrollWheelZoom(true);
//开启鼠标滚轮缩放
map.setMapStyle({
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

map.enableHighResolution = true;
// 使用高分辨率地图
// 地图背景色

//获取浏览器经纬度
/*var geolocation = new BMap.Geolocation();
geolocation.getCurrentPosition(function(r){
    if(this.getStatus() == BMAP_STATUS_SUCCESS){
        var mk = new BMap.Marker(r.point);
        map.addOverlay(mk);
        map.panTo(r.point);
        alert('您的位置：'+r.point.lng+','+r.point.lat);
    }
    else {
        alert('failed'+this.getStatus());
    }
});*/

function FullScreen() {

}

FullScreen.prototype = {

};

var fullscreen = new FullScreen();
