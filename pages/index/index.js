const Auth = require('../../utils/Auth');
const service = require('../../utils/service');
var WxParse = require('../../utils/wxParse/wxParse.js');
var extConfig = wx.getExtConfigSync() || {};

var app = getApp();

Page({
	data: {
		appPhotoPath: '',
		photoPath: '',
		title: '洪大服饰',
		showAuthorize: false,
		bannerData: {
			images: [{
				url: 'yf/sy-1.jpg'
			}, {
				url: 'yf/sy-2.jpg'
			}, {
				url: 'yf/sy-3.jpg'
			}],
			currBanner: '',
			showDialog: false
		},
		tabData: {
			'kz': {
				key: 'kz',
				name: '裤子',
				list: [{
					goodsName: '裤子',
					subTitle: '童装裤子',
					goodsUrl: 'yf/kz-1.jpg',
					costPrice: '15.00',
					discountPrice: '10.00',
					introduction: '<p>潮流服饰</p>'
				}, {
					goodsName: '裤子',
					subTitle: '童装裤子',
					goodsUrl: 'yf/kz-2.jpg',
					costPrice: '15.00',
					discountPrice: '10.00',
					introduction: '<p>潮流服饰</p>'
				}, {
					goodsName: '裤子',
					subTitle: '童装裤子',
					goodsUrl: 'yf/kz-3.jpg',
					costPrice: '15.00',
					discountPrice: '10.00',
					introduction: '<p>潮流服饰</p>'
				}, {
					goodsName: '裤子',
					subTitle: '童装裤子',
					goodsUrl: 'yf/kz-4.jpg',
					costPrice: '15.00',
					discountPrice: '10.00',
					introduction: '<p>潮流服饰</p>'
				}]
			}, 
			'sy': {
				key: 'sy',
				name: '上衣',
				list: [{
					goodsName: '上衣',
					subTitle: '童装上衣',
					goodsUrl: 'yf/sy-1.jpg',
					costPrice: '20.00',
					discountPrice: '10.00',
					introduction: '<p>潮流服饰</p>'
				}, {
					goodsName: '上衣',
					subTitle: '童装上衣',
					goodsUrl: 'yf/sy-2.jpg',
					costPrice: '20.00',
					discountPrice: '10.00',
					introduction: '<p>潮流服饰</p>'
				}, {
					goodsName: '上衣',
					subTitle: '童装上衣',
					goodsUrl: 'yf/sy-3.jpg',
					costPrice: '20.00',
					discountPrice: '10.00',
					introduction: '<p>潮流服饰</p>'
				}]
			},
			'wt': {
				key: 'wt',
				name: '外套',
				list: [{
					goodsName: '外套',
					subTitle: '童装外套',
					goodsUrl: 'yf/wt-1.jpg',
					costPrice: '35.00',
					discountPrice: '25.00',
					introduction: '<p>潮流服饰</p>'
				}]
			}
		},
		firstTab: '',
		tabInfo: {
			currentTab: 'kz',
			curIndex: 0,
			tabLength: 1,
			tabLeft: 0,
			tabTop: 99999,
			tabHeight: '',
			tabTransition: '',
			tranDua: 250,
			border: {
				left: 10,
				width: 0
			},
			fixed: false
		},
		sWidth: 0,
		sHeight: 0,
		phoneScale: 1,
		userLocation: {},
		targetLocation: {
			lat: 22.680903,
			long: 114.152241
		},
		scrollTimer: null,
		isAutoScroll: false,
		dataTop: 0,
		pageScrollTop: 0,
		isOverData: false,
		topData: {},
		shopInfo: {
			name: '洪大服饰',
			openDay: 1,
			closeDay: 0,
			openTime: '',
			closeTime: '',
			openText: '营业中',
			address: '广东省中山市板芙镇',
			mobile: '18689386101',
			logoUrl: 'wt-1.jpg',
			label: '最全的童装'
		},
		weekDay: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
		tipsData: {
			list: [],
			currIndex: 0,
			animation: null
		},
		crossData: {
			images: [],
			currBanner: '',
			showDialog: false
		},
		goodsDetailDialog: {
			show: false,
			data: {}
		},
		goodsHtml: '',
		goodsSwipter: {
			indicatorDots: true,
			autoplay: true,
			interval: 3000,
			duration: 300,
			circular: true
		},
		crossJson: {},
		titleBar: {
			fixed: false,
			top: 58
		},
		goodsSwipter: {
			indicatorDots: true,
			autoplay: true,
			interval: 3000,
			duration: 300,
			circular: true
		},
	},
	onLoad: function (obj) {
		Auth.getUserInfo().then(res => {
			if (res.errMsg && res.errMsg.indexOf('getUserInfo:fail') == 0 && res.errMsg.indexOf('scope unauthorized') >= 0) {
				this.setData({
					showAuthorize: true
				});
			} else {
				app.globalData.userInfo = res.userInfo;
			}
		});

		var phoneInfo = wx.getSystemInfoSync();
		var phoneScale = phoneInfo.windowWidth / 750;
		this.setData({
			appPhotoPath: app.globalData.appPhotoPath,
			sWidth: phoneInfo.windowWidth,
			sHeight: phoneInfo.windowHeight,
			phoneScale: phoneScale
		});
		
		this.initGoodsInfo();
		this.getProductCategory();
		this.getTabRect();
	},
	onShow: function () {

	},
	onReady: function () {
		
	},
	initGoodsInfo(){
		var dataInfo = this.data.tabData;
		for (const key in dataInfo) {
			let goodsInfo = dataInfo[key];
			goodsInfo.list.forEach(goods => {
				goods.photoList = [{
					photoUrl: goods.goodsUrl
				}];
			});
		}
		this.setData({
			tabData: dataInfo
		});
	},
	handleGetAuthInfo: function (e) {
		this.setData({
			'showAuthorize': false
		});
	},
	getProductCategory: function () {
		var that = this;
		var firstKey = Object.keys(this.data.tabData)[0];
		this.setData({
			'tabInfo.currentTab': firstKey,
			firstTab: firstKey,
			'tabInfo.tabLength': this.data.tabData.length
		}, function () {
			const query = wx.createSelectorQuery();
				query.select('#nav-' + firstKey).boundingClientRect(function (rect) {
				that.setData({
					'tabInfo.border.left': rect.left,
					'tabInfo.border.width': rect.width
				});
			}).exec();
		});
	},
	getTabRect(){
		var that = this;
		const query = wx.createSelectorQuery();
		query.select('#tab-wrap').boundingClientRect(function (rect) {
			that.setData({
				'tabInfo.tabTop': rect.top
			});
		}).exec();
	},

	handleTabClick(e) {
		var that = this;
		var key = e.currentTarget.dataset.key;
		var id = e.currentTarget.dataset.id;
		const query = wx.createSelectorQuery();
		query.select('#' + id).boundingClientRect(function (rect) {
			that.setData({
				'tabInfo.border.left': rect.left,
				'tabInfo.border.width': rect.width
			});
		}).exec();

		this.setData({
			'tabInfo.currentTab': key
		});
	},

	onPageScroll(e) {
		var top = e.scrollTop;
		if (this.data.scrollTimer) {
			clearTimeout(this.data.scrollTimer);
			this.data.scrollTimer = null;
		}

		this.setData({
			pageScrollTop: top
		});

		if (top >= this.data.titleBar.top) {
			this.setData({
				'titleBar.fixed': true
			});
		} else {
			this.setData({
				'titleBar.fixed': false
			});
		}

		if (top >= this.data.tabInfo.tabTop - (this.data.phoneScale * 96)){
			this.setData({
				'tabInfo.fixed': true
			});
		}else{
			this.setData({
				'tabInfo.fixed': false
			});
		}
	},
	handleGoodsClick(e) {
		var key = e.currentTarget.dataset.key;
		var index = e.currentTarget.dataset.index;
		var goods = this.data.tabData[key].list[index];
		
		WxParse.wxParse('goodsHtml', 'html', goods.introduction, this, 5);
		this.setData({
			'goodsDetailDialog.show': true,
			'goodsDetailDialog.data': goods
		});
	},
	closeGoodsDialog: function () {
		this.setData({
			'goodsDetailDialog.show': false
		}, () => {
			setTimeout(() => {
				this.setData({
					'goodsDetailDialog.data': {}
				});
			}, 300);
		});
	},
});
