mui.init({

	//  这里就是处理上下拉刷新的
	pullRefresh: {
		container: '#pullrefresh',
		down: { //下拉刷新
			callback: pulldownRefresh,
			style: mui.os.android ? "circle" : "default"
		},
		up: {
			contentinit: '',
			contentrefresh: '正在加载...',
			contentnomore: '没有更多了',
			//auto: true,//iPhone4s 可能还没读出storage
			callback: pullupRefresh
		}
	},
	 
})


var limit = 5 ;

var pageno = 1; //初始页码
var total = 0; //总个数
var type = 0 //当前状态，0为全部
var nomore = false;
var  isappend =true;


var lon = ""; //经度
var lat = ""; //纬度
var showwaitting = false;

var data =null;

mui.plusReady(function() {
	
    window.addEventListener('refresh', function(e) {
         //在父页面中添加监听事件，刷新页面
     // mui.toast("刷新了----"); 
	 // getList();
	 // 子页面啥都不能做了 所以就不刷新了
     });

	storage.init();
	//注册登录事件
	// appPage.registerCheckLoginEvent();

	//切换
	mui(".kidNav").on("tap", "a", function() {
		if ((type+1) == this.dataset.type) {
			mui.toast("点击自己干嘛呢？");
			return;
		}
	
		//切换tab重新加载数据
		pageno = 1;
		total = 0;
		showwaitting = true;
		nomore = false;
		type = (this.dataset.type-1);
		isappend =false;
		getList();
	})



	//搜索
	document.getElementById("search").addEventListener("tap", function() {

		mui.toast("亲 点我干嘛？？？？");
		return;
		mui.openWindow({
			url: "searchFight.html",
			id: "searchFight.html",
			show: {
				autoShow: true, //页面loaded事件发生后自动显示，默认为true
				aniShow: "none", //页面显示动画，默认为”slide-in-right“；
				event: 'titleUpdate', //页面显示时机，默认为titleUpdate事件时显示
				extras: {} //窗口动画是否使用图片加速
			},
			waiting: {
				autoShow: false, //自动显示等待框，默认为true
			}
		})
	})

	// 第一次加载数据
	initPage();
});


mui("#list_warp").on("tap", ".littlelist", function() {
	var infoarr=this.dataset.id.split("||");
	var id = infoarr[0]
	var restaurantId=infoarr[1];
	var status = infoarr[2];
	updateOrder(id,status);
});
mui("#list_warp").on("tap", ".biglist", function() {
	//  点击了详情 
	var infoarr=this.dataset.id.split("||");
	openNew("itemdetail.html", {
		id: infoarr[0],
		restaurantId:infoarr[1],
		status:infoarr[2],
		getMatchDetail: 'getMatchDetail',
		
	});
});


//刷新页面
window.addEventListener('refreshPage', function(event) {
	storage.init();
	var pwc = plus.webview.currentWebview();
	log(pwc.id + "刷新页面");
	initPage();

});



function initPage() {
	storageUser = kidstorageuser.getInstance();
	storageLocation = kidstoragelocation.getInstance();
	lon = storageLocation.Lon;
	lat = storageLocation.Lat;
	getList(); //第一次加载
	
	 
}

// 更新状态
function updateOrder(id,status){
	var message = '';
	if(status==8){
		message='确认拒绝该订单么？';
	}else if(status=4){
		message='确认接单么？';
	}else if(status=5){
		message='确认出餐么？';
	}
	   var btnArray = ['取消', '确定'];
       mui.confirm(message,'订单确认',new Array('否','是'),function(e){
       if(e.index == 1){
		  url = APP_DOMAIN+ "updateOrder";
		  var param = {
		  	 status : status,
		  	 id : id,
		  };
		  request(url, param, function(json) {
		  	// 更新成功
			mui.alert('操作成功', '处理结果', function(){});
			getList();
		  }, true, function() {
		  	mui.alert('操作失败', '处理结果', function() {});
		  });
	   }else{
		   // mui.toast('点击了否');
		}
    });
	
	

}

//渲染列表
function getList() {
 // <!--1待支付
 // 2已支付
 // 3待餐厅接单*
 // 4正在备餐*
 // 5待骑手取餐
 // 6骑手正在向你飞奔
 // 7已签收*
 // 8已取消*
 // 9退款审核 
 // 10已退款 -->
    var realtype=""; //真实的type 给后台对应状态的
	if(type==0){
		realtype="";
	}else if(type==1){
		realtype=3;
	}else if(type==2){
		realtype=4;
	}else if(type==3){
		realtype=7;
	}else if(type==4){
		realtype=8;
	}else{
		realtype="";
	}
	var param = {
		    restaurantId: localStorage.getItem("id"),
			limit: limit,
			page: pageno,
			status: realtype,
			};
	
    var  url = APP_DOMAIN+'queryOrderList';
	request(url, param, function(json) {
		data = json.page.list;
		if (json.code == 0&&json.page.totalPage!=0) {
			total = json.page.totalCount || 0; //总页码
			pageno = json.page.currPage||0
			render("#list_warp", "list_view", json.page.list, isappend);
			if(limit*pageno>=total){
				nomore =true;
			}
			
		} else {
			// var arr = document.getElementsByClassName("nodata");
			// for (var i = 0; i < arr.length; i++) {
			// 	arr[i].innerText = "暂无内容";
			// }
			 render("#list_warp", "list_view", json.page.list, isappend);
		}
		mui("#pullrefresh").pullRefresh().endPullupToRefresh(true);//这个就是停止动画的
		mui("#pullrefresh").pullRefresh().endPulldownToRefresh();//这个就是停止动画的
		
		appPage.endPullRefresh(nomore);
	}, showwaitting, function() {
		appPage.endPullRefresh(true);
	});


}


//下拉刷新具体业务实现
function pulldownRefresh() {
	//结束动画暂时啥都不做
	// mui.toast("不要拉我...");
	isappend =false;
	pageno = 1; //初始页码
	vartotal = 0; //总个数
	 nomore = false;
	getList();
	//mui("#pullrefresh").pullRefresh().endPulldownToRefresh();//这个就是停止动画的
}

// 上拉加载具体业务实现
function pullupRefresh() {
	
	if(nomore){
		// 上拉无数据  直接中断
		mui("#pullrefresh").pullRefresh().endPullupToRefresh(true);
		return;
	}
	isappend =true;
    pageno+=1;
	showwaitting = false;
	getList();
	//mui("#pullrefresh").pullRefresh().endPullupToRefresh(true);//这个就是停止动画的
	
}

//刷新单条详情
function refreshDetail(matchid) {
	request("/Match/getMatchOne", {
		playerid: storageUser.UId,
		matchid: matchid,
		lon: lon,
		lat: lat
	}, function(json) {
		if (json.code == 0) {
			json.item = json.data;
			render("#match_" + matchid, "detail_view", json);
			appPage.imgInit();
		} else {
			appUI.showTopTip(json.msg);
		}
	});
}


var pkEvent = {
	goDetail: function() {
		openNew("citySelect.html");
	},
	goInvitation: function() {
		openNew("invitation.html");
	},
	joinPK: function(matchid) {
		mui.confirm('确定加入这场PK？', '', ['否', '是'], function(e) {
			if (e.index == 1) {
				request("/Match/joinMatch", {
					playerid: storageUser.UId,
					matchid: matchid,
					lon: lon,
					lat: lat
				}, function(json) {
					appUI.showTopTip(json.msg);
					if (json.code == 0) {
						//刷新单条状态
						refreshDetail(matchid);
						//进入详情页
						openNew("../match/detail.html", {
							id: matchid,
							getMatchDetail: 'getMatchDetail' //说明从战帖列表页来的
						});
					}

				})
			}
		})
	},
	acceptPK: function(matchid) {
		mui.confirm('确定接受这场PK？', '', ['否', '是'], function(e) {
			if (e.index == 1) {
				request("/Match/inviteMatchYorN", {
					playerid: storageUser.UId,
					matchid: matchid,
					type: 'Y',
					lon: storageLocation.Lon,
					lat: storageLocation.Lat
				}, function(json) {
					appUI.showTopTip(json.msg);
					//刷新单条状态
					refreshDetail(matchid);
					//进入详情页
					openNew("../match/detail.html", {
						id: matchid,
						getMatchDetail: 'getMatchDetail' //说明从战帖列表页来的
					});
				})
			}
		})
	},
	refusePK: function(matchid) {
		mui.confirm('确定拒绝这场PK？', '', ['否', '是'], function(e) {
			if (e.index == 1) {
				request("/Match/inviteMatchYorN", {
					playerid: storageUser.UId,
					matchid: matchid,
					type: 'N',
					lon: storageLocation.Lon,
					lat: storageLocation.Lat
				}, function(json) {
					appUI.showTopTip(json.msg);
					//刷新单条状态
					refreshDetail(matchid);
				})
			}
		})
	}
}
