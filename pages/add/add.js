var helper = require("../../utils/helper");
Page({
  data: {},
  /*
  * 页面加载时执行的函数
  */
  onLoad: function (options) {
    /*
    * 定义that 用于后续使用setData方法来进行页面数据同步
    */
    var that = this;
    var servers_str = wx.getStorageSync('servers');
    var servers = JSON.parse(servers_str);
    servers.forEach(function (value, index, array) {
      if (value.secret == options.secret) {
        wx.showModal({
          title: '该场景已经添加过！',
          content: '当前场景已经添加过！请返回重新扫描！',
          showCancel:false,
          success: function (res) {
              /*
              * 使用switchTab方法切换到场景管理页面
              */
              wx.switchTab({
                url: '../servers/servers'
              })
          }
        })
      }
    });
    /*
    * 使用getLocation方法来获取用户数据
    */
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        /*
        * 获取到GPS信息后，连带传入的options参数中的值都同步到视图中，用于页面展示和后续数据存储时使用。
        */
        that.setData({
          name: options.name,
          secret: options.secret,
          username: options.username,
          latitude: res.latitude,
          longitude: res.longitude
        });
      },
      fail:function(res){
         /*
        * 获取到GPS信息后，连带传入的options参数中的值都同步到视图中，用于页面展示和后续数据存储时使用。
        */
        that.setData({
          name: decodeURI(options.name),
          secret: options.secret,
          username: decodeURI(options.username),
          latitude: res.latitude,
          longitude: res.longitude
        });
      }
    })


  },
  submitData: function (e) {
    var that = this
    var old_data = wx.getStorageSync('servers');
    if (old_data == '') {
      old_data = '[]'
    }
    var servers = JSON.parse(old_data);
    console.log(servers);
    var old_length = servers.length;
    servers.push({
      secret: that.data.secret,
      name: e.detail.value.name, // 此处为表单数据，
      username: e.detail.value.username,
      desc: e.detail.value.desc,
      latitude: that.data.latitude, //此处为页面的data
      longitude: that.data.longitude,
      signedBy: that.data.name,
      key: that.data.secret,
    });
    var new_length = servers.length;

    if (new_length == old_length) {
      wx.showModal({
        title: '数据存储出错！',
        content: '数据存储出错！请联系管理员！',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../servers/servers'
            })
          }
        }
      })
    } else {
      var servers_str = JSON.stringify(servers);
      wx.setStorageSync('servers', servers_str);
      /*
      * 成功后跳转到addSuccess页面，传递参数id，用于该页面跳转success。
      */
      wx.redirectTo({
        url: '../addSucc/addSucc?id=' + that.data.secret
      })
    }
  },
})