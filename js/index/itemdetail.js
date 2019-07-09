mui.init({
	
	 beforeback: function(){
        //获得列表界面的webview
         var list = plus.webview.currentWebview().opener();//这种方式也可以
         //目标页面
		  // var ws = plus.webview.currentWebview();
         //   var page = plus.webview.getWebviewById(ws.pageId);
         // var list = plus.webview.getWebviewById('home.html');  
         //触发列表界面的自定义事件（refresh）,从而进行数据刷新  
         mui.fire(list, 'refresh'); 
		  mui.toast("返回来");
        //返回true，继续页面关闭逻辑
        return true;
    }
});



mui.plusReady(function() {
	
     var self = plus.webview.currentWebview();
	//  获取定位
       plus.geolocation.getCurrentPosition(MapPoint, function(e) {
         mui.toast("error:" + e.message);
         })
	
	
	url = APP_DOMAIN+ "receiptOrder";
	var param = {
		 restaurantId : self.info.restaurantId,
		 id : self.info.id,
	};
	request(url, param, function(json) {
		// 最后一个参数是 是否为追加
		render("#food_list_warp", "food_list_view", json.data.foodList,false );
	}, false, function() {
		mui.toast("request error");
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
 