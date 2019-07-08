var inpt_search = document.getElementById("inpt_search");
var keyword = "";
mui.init();
mui.plusReady(function() {
	loadData();
	storage.init();
	//输入框变化
	document.getElementById("inpt_search").addEventListener("input", function(e) {
		if(this.value == "") {
			document.getElementById("backBtn").style.display = "block";
			document.getElementById("searchBtn").style.display = "none";
			return;
		}
		document.getElementById("backBtn").style.display = "none";
		document.getElementById("searchBtn").style.display = "block";
	})
	// //清空
	// mui(".searchbar").on("tap", "span.mui-icon-clear", function() {
	// 	if(inpt_search.value == "") {
	// 		document.getElementById("backBtn").style.display = "block";
	// 		document.getElementById("searchBtn").style.display = "none";
	// 		return;
	// 	}
	// })
	// document.getElementById("searchBtn").addEventListener("tap", function() {
	// 	var kw = inpt_search.value.trim();
	// 	if(kw == keyword) {
	// 		return;
	// 	}
	// 	keyword = kw;
	// 	loadData();
	// });
	// mui("#list_warp").on("tap", ".userinfo", function() {
	// 	//		for(var i in this){
	// 	//			log(i+"="+this[i])
	// 	//		}
	// 	var id = this.getAttribute("data-id");
	// 	openNew("userInfo.html", {
	// 		id: id
	// 	});
	// }); 
	
	mui("#list_warp_foodsettings").on("tap", ".littlelist", function() {
		mui.toast("点击了上架餐品" + this.dataset.id);
		 
	
	});
	
});

function loadData() {
	mui.toast("come here " );
	var url="http://v.juhe.cn/toutiao/index?type=&key=9b4b584108efd7008439f899d9dc2593";
	var param={
		playerid: 123, //
		keyword: 456
	}
	
	request(url, param, function(json) {
		var nomore = true;
		if (json.error_code == 0) {
			pagecount = json.pagecount || 0; //总页码
			render("#list_warp_foodsettings", "list_view_foodsettings", json.result.data, false);
		} else {
			render("#list_warp_foodsettings", "list_view_foodsettings", null, false);
		}
	}, false, function() {
		// 错误回调
	});
	
	
}

function initEvent() {

}
