var inpt_search = document.getElementById("inpt_search");
var keyword = "";
mui.init();
mui.plusReady(function() {
	loadData();
	storage.init();
	//输入框变化
	document.getElementById("inpt_search").addEventListener("input", function(e) {
		if (this.value == "") {
			// document.getElementById("backBtn").style.display = "block";
			document.getElementById("searchBtn").style.display = "none";
			return;
		}
		// document.getElementById("backBtn").style.display = "none";
		document.getElementById("searchBtn").style.display = "block";
	})
	//清空
	mui(".searchbar").on("tap", "span.mui-icon-clear", function() {
		if(inpt_search.value == "") {
			// document.getElementById("backBtn").style.display = "block";
			document.getElementById("searchBtn").style.display = "none";
			return;
		}
	})
	
	var inpt_search = document.getElementById("inpt_search");
	
	
	document.getElementById("searchBtn").addEventListener("tap", function() {
		if( inpt_search.value.trim() == ""){
			var	url = APP_DOMAIN + "queryFood";
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
			}, true, function() {
				// 错误回调
				mui.alert('操作获取菜品列表失败', '处理结果', function() {});
			});
			
		}else{
			var	 url = APP_DOMAIN + "queryFoodbyname";
			var param = {
				 
				restaurantId: localStorage.getItem("id"), //
				name:inpt_search.value
			}
			request(url, param, function(json) {
				var nomore = true;
				if (json.code == 0) {
					render("#list_warp_foodsettings", "list_view_foodsettings", json.data, false);
				} else {
					render("#list_warp_foodsettings", "list_view_foodsettings", null, false);
				}
			}, true, function() {
				// 错误回调
				mui.alert('操作获取菜品列表失败', '处理结果', function() {});
			});
		}
	
		
		
		
	});
	


	document.getElementById("alltodo").addEventListener("tap", function() {

		var ele = document.getElementsByName("checkbox");
		for (var i = 0; i < ele.length; i++) {
			// mui.alert(ele[i].value + ": " + ele[i].checked)
			if (!ele[0].checked) {
				ele[i].checked = true;
			} else {
				ele[i].checked = false;
			}

		}


	});


	document.getElementById("pltodo").addEventListener("tap", function() {
              // alert("点击了pltodo");
		//获取两个div
		var view = document.getElementById("view");
		var ele = document.getElementsByName("checkbox");
		//判断view是显示或者隐藏(block---显示,none--隐藏)
		if (view.style.display == "block") {
			view.style.display = "none";
			for (var i = 0; i < ele.length; i++) {
				// ele[i].style.display = "none";
				
				document.getElementById("checkbox").classList.add("mui-hidden");
				
				
				
			}
		} else {
			view.style.display = "block";
			
			for (var i = 0; i < ele.length; i++) {
				// ele[i].style.display = "block";
				document.getElementById("checkbox").classList.add("mui-visibility");
				document.getElementById("checkbox").classList.remove("mui-hidden");
			}
			
		}


	});


	document.getElementById("online").addEventListener("tap", function() {
		// alert("点击了批量上架");


		var ids = [];
		var ele = document.getElementsByName("checkbox");
		for (var i = 0; i < ele.length; i++) {
			// mui.alert(ele[i].value + ": " + ele[i].checked)
			if (ele[i].checked) {
				var infoarr = ele[i].value.split("||");
				var id = infoarr[0]
				ids.push(id);
			}
		}
		if (ids.length == 0) {
			mui.alert('请选择操作菜品');
			return;
		}

		var url = APP_DOMAIN + "foodUpOrDown";
		var param = {
			status: 1,
			foodIds: ids.join(','),
			restaurantId: localStorage.getItem("id"), //
		}


		request(url, param, function(json) {
			var nomore = true;
			if (json.code == 0) {
				mui.alert('操作菜品成功', '批量上架', function() {});
				loadData();
				ids = [];
			} else {

			}
		}, true, function() {
			// 错误回调
			mui.alert('操作菜品失败', '处理结果', function() {});
			ids = [];
		});

	});


	document.getElementById("loseline").addEventListener("tap", function() {
		// alert("点击了批量下架");

		var ids = [];
		var ele = document.getElementsByName("checkbox");
		for (var i = 0; i < ele.length; i++) {
			// mui.alert(ele[i].value + ": " + ele[i].checked)
			if (ele[i].checked) {
				var infoarr = ele[i].value.split("||");
				var id = infoarr[0]
				ids.push(id);
			}
		}

		if (ids.length == 0) {
			mui.alert('请选择操作菜品');
			return;
		}

		var url = APP_DOMAIN + "foodUpOrDown";
		var param = {
			status: 0,
			foodIds: ids.join(','),
			restaurantId: localStorage.getItem("id"), //
		}

		request(url, param, function(json) {
			var nomore = true;
			if (json.code == 0) {
				mui.alert('操作菜品成功', '批量下架', function() {});
				loadData();
				ids = [];
			} else {

			}
		}, true, function() {
			// 错误回调
			mui.alert('操作菜品失败', '处理结果', function() {});
			ids = [];
		});


	});






	mui("#list_warp_foodsettings").on("tap", ".littlelist", function() {


		// 获取复选框的值
		// var ele = document.getElementsByName("checkbox");
		// for (var i = 0; i < ele.length; i++) {
		// 	mui.alert(ele[i].value + ": " + ele[i].checked)
		// }
		var infoarr = this.dataset.id.split("||");
		var id = infoarr[0]
		var restaurantId = infoarr[1];
		var status = infoarr[2];
		if (status == 1) {
			status = 0;
		} else {
			status = 1;
		}
		// var ids = new Array();
		// ids.push(id);
		var url = APP_DOMAIN + "foodUpOrDown";
		var param = {
			status: status,
			foodIds: id,
			restaurantId: localStorage.getItem("id"), //
		}

		request(url, param, function(json) {
			var nomore = true;
			if (json.code == 0) {
				mui.alert('操作菜品成功', '处理结果', function() {});
				loadData();
			} else {

			}
		}, true, function() {
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
	}, true, function() {
		// 错误回调
		mui.alert('操作获取菜品列表失败', '处理结果', function() {});
	});


}

function initEvent() {

}
