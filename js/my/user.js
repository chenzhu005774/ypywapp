mui.init({
		// mui("#pullrefresh").pullRefresh().setStopped(true);
		pullRefresh: {
			stop: true,
			container: '#pullrefresh',
			down: { //下拉刷新
				callback: pulldownRefresh,
				style: mui.os.android ? "circle" : "default"
				//auto: true
			}
		},
		beforeback: function() {
			appPage.closeLogin();
		},


	}

);

mui.plusReady(function() {

	storage.init();
	$("#resname").text(localStorage.getItem("resname"));
	$("#phone").text(localStorage.getItem("phone"));


	//initPage();
	//	document.getElementById("test").addEventListener("tap", function() {
	//		openNew("test.html");
	//	});
	//监听退出,重新绑定检查登录事件
	window.addEventListener("loginOut", function(r) {
		setData();
	});
	window.addEventListener('initPage', function(event) {
		var pwc = plus.webview.currentWebview();
		log(pwc.id + "不是新开的");
		setData();
	});
	window.addEventListener('refreshPage', function(event) {
		var pwc = plus.webview.currentWebview();
		log(pwc.id + "刷新页面");
		initPage();
	});
	checkMsg();
	setInterval(function() {
		checkMsg();
	}, 5000);
});
//下拉刷新具体业务实现
function pulldownRefresh() {
	loadData();
}

function initPage() {
	setData();
	//appPage.closeLogin();
}

function setData() {
	storageUser = kidstorageuser.getInstance();
	var json = {};
	json.data = {
		UId: storageUser.UId,
		NickName: storageUser.NickName || "点我写昵称",
		ImgUrl: storageUser.ImgUrl,
		Signature: storageUser.Signature || "点我写签名",
		IsLogin: storageUser.IsLogin
	};

	render("#user_warp", "user_view", json);
	//注册通用事件
	appPage.registerCheckLoginEvent();
}

document.getElementById("opentime").addEventListener("tap", function() {
	openNew("opentime.html", {
		backid: "user.html"
	});
});

document.getElementById("dishsupply").addEventListener("tap", function() {
	openNew("myfoodsettings.html", {
		backid: "myfoodsettings.html"
	});
});

document.getElementById("packfee").addEventListener("tap", function() {
	openNew("packfee.html", {
		backid: "packfee.html"
	});
});

document.getElementById("autoaccept").addEventListener("tap", function() {
	openNew("autoaccept.html", {
		backid: "autoaccept.html"
	});
});
document.getElementById("feedback").addEventListener("tap", function() {
	openNew("feedback.html", {
		backid: "feedback.html"
	});
});
document.getElementById("exitapp").addEventListener("tap", function() {

	var btn = ["确定", "取消"];
	mui.confirm('确认退出登录并关闭应用不在接受推单消息？请保证网络畅通,否则无法下线接受推单消息', '退出', btn, function(e) {
		if (e.index == 0) {
			
			var clientid = "";
			var param = {
				    id: localStorage.getItem("id"),
					clientId: clientid,
			 };
			var  url = APP_DOMAIN+'setRestaurant';
			request(url, param, function(json) {
				  localStorage.setItem("islogin","no");
				  plus.runtime.quit();
			}, false, function() {
				 mui.toast("退出登录失败 您还能收到消息 请检查网络"); 
			});
			
			
		}
	});
});
document.getElementById("updatemap").addEventListener("tap", function() {

	var btn = ["确定", "取消"];
	mui.confirm('是否上报最新的位置信息', '更新位置', btn, function(e) {
		if (e.index == 0) {
			//  获取定位 上报 顺便上报个推ID
			plus.geolocation.getCurrentPosition(MapPoint, function(e) { mui.toast("获取位置信息失败请设置开启权限否则无法接单");});
		}
	});
});

function MapPoint(position) {
    var Lon = position.coords.longitude;   //获取经度
    var Lat = position.coords.latitude;  //获取纬度
    var address = "当前地址：" + position.address.province + "," + position.address.city + "," + position.address.district + "," + position.address.street + "," + position.address.streetNum;
	 	// 获取个推id
	 var clientid = plus.push.getClientInfo().clientid;
	 alert(clientid);
	 var param = {
	 	    id: localStorage.getItem("id"),
	 		lng: Lon,
	 		lat: Lat,
	 		clientId: clientid,
	  };
	 var  url = APP_DOMAIN+'setRestaurant';
	 request(url, param, function(json) {
	 	 mui.toast("上报您的位置信息成功,准备开始接单吧");  
	 }, false, function() {
	 	 alert("上报您的位置信息失败,请在我的界面手动上报"); 
	 });
	 
}
function loadData() {

	if (!storageUser.IsLogin) {
		appPage.endPullRefresh(true);
		return;
	}
	request("/Player/getPlayerIndexInfo", {
		playerid: storageUser.UId
	}, function(json) {
		if (json.code == 0) {
			if (json.data.ImgUrl != "") { //判断头像是否路径相同
				storageUser = kidstorageuser.getInstance();
				var arr = json.data.ImgUrl.split('/');
				var imgname = arr[arr.length - 1];
				var storageimgnamearr = storageUser.ImgUrl.split('/');
				var storageimgname = storageimgnamearr[storageimgnamearr.length - 1];
				log(imgname + "|" + storageimgname)
				if (imgname != storageimgname) { //本地图片名和网络图片名不同，显示为网络图，并下载
					//storageUser.refreshImgUrl(json.data.ImgUrl);//路径刷新为网络图片
					//下载网络图
					storageUser.downloadImg(json.data.ImgUrl);
				}
			}
			storageUser.login(json.data);
		}
		appPage.endPullRefresh();
		setData();
	}, false, function() {
		appPage.endPullRefresh();
	});

}
// var loginEvent = {
// 	editSignature: function() {
// 		storageUser = kidstorageuser.getInstance();
// 		openNew("myEdit.html", {
// 			field: "signature",
// 			value: storageUser.Signature,
// 			backid: "my/user.html"
// 		});
// 	},
// 	editNickName: function() {
// 		storageUser = kidstorageuser.getInstance();
// 		openNew("myEdit.html", {
// 			field: "nickname",
// 			value: storageUser.NickName,
// 			backid: "my/user.html"
// 		});
// 	},
// 	myMsg: function() {
// 		openNew("myMsg.html");
// 	},
// 	myMatch: function() {
// 		openNew("myMatch.html");
// 
// 	},
// 	myFriends: function() {
// 		openNew("myFriends.html");
// 	},
// 	myInfo: function() {
// 		openNew("myInfo.html");
// 	},
// 	mySetting: function() {
// 		openNew("mySetting.html");
// 	},
// 	upload_headimg: function() {
// 		openNew("uploadImg.html");
// 	}
// }

function checkMsg() {
	if (storageUser.UId > 0) {
		//		request('/Player/getPlayerNoReadNotify', {
		//			playerid: storageUser.UId
		//		}, function(r) {
		//			r.code == 0 ? document.getElementById("msgStatus").setAttribute('class', 'redbadge') : document.getElementById("msgStatus").setAttribute('class', '')
		//		}, false, function() {}, false);
	}
}

//波浪线
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

requestAnimFrame = (function() {
	return function(callback) {
		setTimeout(callback, 18);
	};
})();

//初始角度为0  
var step = 90;
//定义三条不同波浪的颜色  
var lines = ["112,153,249, 0.7)",
	"rgba(112,153,249, 0.5)",
	"rgba(112,153,249, 0.7)",
	"rgba(112,153,249, 0.5)"
];

function loop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	step++;
	//画3个不同颜色的矩形  
	for (var j = lines.length - 1; j >= 0; j--) {
		ctx.fillStyle = lines[j];
		//每个矩形的角度都不同，每个之间相差45度  
		var angle = (step + j * 90) * Math.PI / 180;
		var deltaHeight = Math.sin(angle) * 50 + 30;
		var deltaHeightRight = Math.cos(angle) * 50 + 30;
		ctx.beginPath();
		ctx.moveTo(0, canvas.height / 2 + deltaHeight);
		ctx.bezierCurveTo(canvas.width / 2, canvas.height / 2 + deltaHeight, canvas.width / 2, canvas.height / 2 +
			deltaHeightRight, canvas.width, canvas.height / 2 + deltaHeightRight);
		ctx.lineTo(canvas.width, canvas.height);
		ctx.lineTo(0, canvas.height);
		ctx.lineTo(0, canvas.height / 2 + deltaHeight);
		ctx.closePath();
		ctx.fill();
	}
	requestAnimFrame(loop);
}
loop();
