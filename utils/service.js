var appId = getApp().globalData.extAppid;

function interceptor(url, method, args, interceptorBySelf){
    return new Promise(function (resolve, reject) {
        var sessionId = getApp().globalData.sessionId;
        var params = {};
        params = args ? JSON.parse(JSON.stringify(args)) : {};
        
        wx.request({
            url: getApp().globalData.baseUrl + url,
            method: method,
            data: params,
            header:{
                'Cookie': 'JSESSIONID=' + sessionId
            },
            success: function (res) {
                var data = res.data;
                
                if (interceptorBySelf){
                    resolve(data);
                }else{
                    if (data.resultCode && data.resultCode !== '200001') {
                        if(data.resultCode == '404009'){
                            // 未登陆
                            doLogin(() => {
                                resolve(data);
                            });
                        }else{
                            wx.showToast({
                                title: data.resultDesc || '网络繁忙，请重新尝试',
                                icon: "none",
                                duration: 2000
                            });
                            resolve(data);
                        }
                        
                    } else {
                        resolve(data);
                    }
                }
                
            },
            fail: function (res) {
                wx.showToast({
                    title: '网络繁忙，请重新尝试',
                    icon: "none",
                    duration: 2000
                });
                reject(res);
            }
        });
    });
}

function doLogin(callback) {
    wx.login({
        success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            service
                .login({wxCode: res.code})
                .then(res => {
                    if (res.resultCode && res.resultCode !== '200001') {
                        return;
                    }
                    getApp().globalData.sessionId = res.sessionId;
					getApp().globalData.userInfo = res.user;
                    callback && callback();
                });
        }
    });
}

const service = {
    // 小程序访客用户登录
    login(args, interceptorBySelf) {
        return interceptor(`user/${appId}/login`, 'POST', args, interceptorBySelf);
    },
    // 获取模板菜单栏目列表
    getTemplateMenuColumnsList(args, interceptorBySelf) {
        return interceptor(`user/auth/${appId}/getTemplateMenuColumnsList`, 'POST', args, interceptorBySelf);
    },
    // 获取模板菜单列表
    getTemplateMenuList(args, interceptorBySelf) {
        return interceptor(`user/auth/${appId}/getTemplateMenuList`, 'POST', args, interceptorBySelf);
    },
    // 小程序获取静态资源访问路径接口
    // photoAccessPath:图片访问地址,
    // appAccessPath:APP文件访问地址,
    // musicAccessPath:音乐文件访问地址,
    // fileAccessPath:其它静态资源访问地址
    getPathStatic(args, interceptorBySelf) {
        return interceptor(`getPathStatic`, 'POST', args, interceptorBySelf);
    },
    // 公共接口,根据编码获取数据字典列表
    getBasDictList(args, interceptorBySelf) {
        return interceptor(`basConfig/auth/getBasDictList`, 'POST', args, interceptorBySelf);
    },
    // 公共获取开关数据
    getSwithValue(args, interceptorBySelf) {
        return interceptor(`basConfig/auth/getSwithValue`, 'POST', args, interceptorBySelf);
    },
    // 公共上传图片接口(form-data方式)
    // 上传文件流的名称传:photoFile;
    // 上传图片类型(如果不需要生成缩略图不需要上传此字段):imageType(0.商品主图,1.前台会员头像图)
    uploadFileImager(args, interceptorBySelf) {
        return interceptor(`basConfig/uploadFileImager`, 'POST', args, interceptorBySelf);
    },
    // 小程序产品接口
    getGoods(args, interceptorBySelf) {
        return interceptor(`goods/auth/${appId}/getGoods`, 'POST', args, interceptorBySelf);
    },
    // 小程序产品类别接口
    getGoodsCategory(args, interceptorBySelf) {
        return interceptor(`goods/auth/${appId}/getGoodsCategory`, 'POST', args, interceptorBySelf);
    },
    // 小程序产品详情接口
    getGoodsDetail(args, interceptorBySelf) {
        return interceptor(`goods/auth/${appId}/getGoodsDetail`, 'POST', args, interceptorBySelf);
    }
}

module.exports = service;