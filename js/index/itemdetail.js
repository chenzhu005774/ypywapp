mui.init();



mui.plusReady(function() {
	
  plus.geolocation.getCurrentPosition(MapPoint, function(e) {
         mui.toast("error:" + e.message);
         })
	
	
	url = "http://v.juhe.cn/toutiao/index?type=&key=9b4b584108efd7008439f899d9dc2593";
	var param = {};
	request(url, param, function(json) {
		// 最后一个参数是 是否为追加
		render("#food_list_warp", "food_list_view", json.result.data,false );
	}, false, function() {
		mui.toast("------------------>>>");
	});

});

function commitInput(){
	var a = mui.prompt('','拒绝理由','评论',['确认','取消'],function(e){
		if(e.index==1){
			mui.toast('取消');
		}else{
			var text = document.querySelector('.mui-popup-input textarea').value.trim();
	      mui.toast(text);
		}
	},'div');
	var tt = document.querySelector('.mui-popup-input');
	tt.innerHTML="<textarea></textarea>";
}

mui("#food_list_warp").on("tap", ".refuse", function() {
	  // mui.toast("点击了拒绝" );
     commitInput();
	  
	});
mui("#food_list_warp").on("tap", ".appcet", function() {
	  mui.toast("点击了接餐" );
	  
	});

function MapPoint(position) {
    var Lon = position.coords.longitude;   //获取经度
    var Lat = position.coords.latitude;  //获取纬度
    var address = "当前地址：" + position.address.province + "," + position.address.city + "," + position.address.district + "," + position.address.street + "," + position.address.streetNum;
    alert(Lon + "," + Lat);
    alert(address);  
}
 