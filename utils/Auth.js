const service = require('./service');
var app = getApp();
var extConfig = wx.getExtConfigSync() || {};

const Auth = {
    login: (callback) => {
        wx.login({
			success: res => {
				service.login({
					wxCode: res.code,
					templateCode: extConfig.tempCode
				}).then(res => {
					if (res.resultCode && res.resultCode !== '200001') {
						return;
					}
					getApp().globalData.sessionId = res.sessionId;
					getApp().globalData.userInfo = res.user;

					callback && callback({});

					// wx.getUserInfo({
					// 	success: res => {
					// 		// 可以将 res 发送给后台解码出 unionId
					// 		service.setInfo({
					// 			wechatName: res.userInfo.nickName,
					// 			headImgUrl: res.userInfo.avatarUrl
					// 		}).then(res => {
					// 			callback && callback({});
					// 		});
					// 	},
					// 	fail: res => {
					// 		callback && callback({});
					// 	}
					// });
				}).catch(res => {
					callback && callback(res);
				});
			},
			fail: res => {
				wx.showToast({
					title: res.errMsg,
					icon: "none",
					duration: 2000
				});
			}
		});
	},
	// 校验用户是否授权获取用户信息
	checkUserInfo: (callback) => {
		wx.getSetting({
		    success: function(res){
		        if(!res.authSetting['scope.userInfo']){
		            wx.showModal({
		                title: '提示',
		                content: '此功能需要获取您的用户信息,请授权',
		                cancelText: '暂不授权',
		                confirmText: '前往授权',
		                success: function(res){
		                    if (res.confirm) {
		                        wx.openSetting({
		                            success: (res) => {
		                                if(res.authSetting['scope.userInfo']){
											wx.getUserInfo({
												success: res => {
													// 可以将 res 发送给后台解码出 unionId
													service.setInfo({
														wechatName: res.userInfo.nickName,
														headImgUrl: res.userInfo.avatarUrl
													}).then(res => {
														callback && callback();
													});
												},
												fail: res => {
													callback && callback();
												}
											});
		                                }
		                            }
		                        });
		                    }
		                }
					});
				}else{
					callback && callback();
				}
		    }
		});
	},
	// 
	getUserInfo: () => {
		return new Promise(function (resolve, reject) {
			wx.getUserInfo({
				success: res => {
					resolve(res.userInfo);
				},
				fail: res => {
					resolve(res);
				}
			});
		});
	},
}

module.exports = Auth;