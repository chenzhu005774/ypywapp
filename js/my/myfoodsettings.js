var inpt_search = document.getElementById("inpt_search");
var keyword = "";
mui.init();
mui.plusReady(function() {
	loadData();
	storage.init();
	//输入框变化
	document.getElementById("inpt_search").addEventListener("input", function(e) {
		if (this.value == "") {
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

// 	document.getElementById("alltodo").addEventListener("tap", function() {
// 		mui.toast("点击了批量");
// 		document.getElementById("checkbox").classList.remove('mui-hidden');
// 
// 	});





 mui("#list_warp_foodsettings").on("tap", ".littlelist", function() {


		// 获取复选框的值
		// var ele = document.getElementsByName("checkbox");
		// for (var i = 0; i < ele.length; i++) {
		// 	mui.alert(ele[i].value + ": " + ele[i].checked)
		// }
		   var infoarr=this.dataset.id.split("||");
		   var id = infoarr[0]
		   var restaurantId=infoarr[1];
		   var status = infoarr[2];
		   if(status==1){
			   status=0;
			  }else{
			   status=1; 
			  }
		   // var ids = new Array();
		   // ids.push(id);
		   var url = APP_DOMAIN + "foodUpOrDown";
		   var param = {
			 status:status,
			 foodIds:id,
		  	 restaurantId: localStorage.getItem("id"), //
		  }
		  
		  request(url, param, function(json) {
		  	var nomore = true;
		  	if (json.code == 0) {
				 mui.alert('操作菜品成功', '处理结果', function() {});
		  		 loadData();
		  	} else {
		  		 
		  	}
		  }, false, function() {
		  	// 错误回调
		  	mui.alert('操作菜品失败', '处理结果', function() {});
		  });

	});

});

function loadData() {
	var url = APP_DOMAIN + "queryFood";
	var param = {
		restaurantId: localStorage.getItem("id"), //
	}

	request(url, param, function(json) {
		var nomore = true;
		if (json.code == 0) {
			render("#list_warp_foodsettings", "list_view_foodsettings", json.data, false);
		} else {
			render("#list_warp_foodsettings", "list_view_foodsettings", null, false);
		}
	}, false, function() {
		// 错误回调
		mui.alert('操作获取菜品列表失败', '处理结果', function() {});
	});


}

function initEvent() {

}
