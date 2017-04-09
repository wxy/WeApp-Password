var helper = require("../../utils/helper");
Page({
  data: {},
  onLoad: function (options) {

  },
  onReady: function () {
    var that = this;
    wx.scanCode({
      success: function (res) {
        wx.showToast({
          title: '恢复中',
          icon: 'success',
          duration: 10000
        })
        var ignore_numbers = 0;
        var data = JSON.parse(res.result);
        var server = data.s;
        var raw_data = wx.getStorageSync('servers');
        var old_servers = JSON.parse(raw_data);
        var old_length = old_servers.length;
        server.forEach(function (value, index, array) {
          if (old_length == 0) {
            old_servers.push({ "secret": value.s, "name": decodeURI(value.b), "username": decodeURI(value.b), "desc": decodeURI(value.b), "latitude": value.la, "longitude": value.lo, "signedBy": decodeURI(value.b), "key": value.s })
          } else {
            var is_exist = helper.inArray(value.s, old_servers)
            if (is_exist == false) {
              old_servers.push({ "secret": value.s, "name": decodeURI(value.b), "username": decodeURI(value.b), "desc": decodeURI(value.b), "latitude": value.la, "longitude": value.lo, "signedBy": decodeURI(value.b), "key": value.s })
            }else{
              ignore_numbers ++;
            }
          }

        });
        wx.setStorage({
          key: 'servers',
          data: JSON.stringify(old_servers),
          success: function (res) {
            wx.hideToast();
            wx.showModal({
              title:"恭喜！场景恢复成功！",
              content:"您的场景已经恢复成功，共"+server.length+"个场景，跳过"+ignore_numbers+"个重复场景。",
              showCancel:false,
              success:function(res){
                
                  wx.switchTab({
                    url: '../servers/servers'
                  })
                
              }
            })
          },
        })

      },
      fail: function () {
        wx.showModal({
          "title": "扫描失败",
          "content": "请重新扫描",
          "showCancel": false,
          "success": function (e) {
            wx.navigateBack();
          }
        })
      },

    })
  }
})