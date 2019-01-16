Component({

    behaviors: [],

    properties: {
        show: {
            type: Boolean,
            value: false,
            observer: function (newVal, oldVal) { 

            }
        },
        appPhotoPath: String
    },

    data: {
        
    },

    lifetimes: {
        // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
        attached: function () {
            
        },
        moved: function () { },
        detached: function () { },
    },

    methods: {
        handleGetUserInfo: function (e) {
            if (e.detail.errMsg == 'getUserInfo:ok') {
                this.triggerEvent('getuserinfo', e.detail);
            }
        }
    }
});