const totp = require('../../utils/totp.js');
var update = require("../../utils/update");
Page({
  data: {
    timer: 0
  },
  onLoad: function (options) {
    var that = this;
    update.checkUpdate();
    /**
     * 获取数据
     */
    var servers = wx.getStorageSync('servers');
    /**
     * str to obj
     */
    servers = JSON.parse(servers);
    /**
     * forEach 处理
     */
    servers.forEach(function (value, index, key) {
      /**
       * 找到目标数据
       */
      if (value.secret == options.id) {
        that.setData({
          keys: options.id,
          name: value.name,
          username: value.username,
          desc: value.desc,
          secret: value.secret,
          code: totp.getCode(options.id),
          signedBy:value.signedBy
        })
      }
    })
    /**
     *  如果用户名 或 secret拿不到，认为场景无效。返回权限报错问题。
     */
    if (that.data.username == '' || that.data.secret == '') {
      wx.showModal({
        title: "权限不足！",
        content: "您无权查看当前场景！",
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../servers/servers'
            })
          } else {
            wx.switchTab({
              url: '../servers/servers'
            })
          }
        }
      })
    }
  },
  onReady: function () {
    var that = this;
    /**
     * 进行时间判断，如果时间在30的整除点上，计算一次code，如果不是在时间点上，则只是变更进度条数据
     */
    setInterval(function () {
      var timestamp = new Date().getTime().toString().substr(0, 10);
      var timeHook = timestamp % 30;
      if (timeHook != 0) {
        that.setData({
          timer: timeHook * 3.4
        })
      } else {
        that.setData({
          timer: 0
        })
        that.updateCode();
      }

    }, 1000)

  },
  deleteOne: function (e) {
    var that = this;
    wx.showModal({
      title: "注意！",
      content: "你是否要删除由“"+that.data.signedBy+"”颁发的，用户名为 "+that.data.username+" 的密码吗？此操作不可恢复。",
      success: function (res) {
        if (res.confirm) {

          var servers = wx.getStorageSync('servers');
          servers = JSON.parse(servers);
          var server = [];
          servers.forEach(function (value, index, array) {
            if (value.key != that.data.keys) {
              server.push(value);
            }
          });
          server = JSON.stringify(server);
          wx.setStorage({
            key: 'servers',
            data: server,
            success: function (res) {
              wx.showToast({
                title: '删除场景成功',
                icon: 'success',
                duration: 2000,
                success: function () {
                  wx.switchTab({
                    url: '../servers/servers'
                  })
                }
              })
            }
          })
        } else {

        }
      }
    })

  },
  updateCode: function () {
    var that = this;
    /**
     * secret存放在页面的data中，直接调用totp.js方法即可生成新的code
     */
    var newToken = totp.getCode(this.data.secret);
    that.setData({
      code: newToken
    })
  },
  onPullDownRefresh: function () {
    /**
     * 下拉强制刷新更新数据。
     */
    this.updateCode();
  },
  navigateBack: function () {
    /**
     * 调用switch方法来响应右下角的返回按钮。
     */
    wx.switchTab({
      url: '../servers/servers'
    })
  },
  onShareAppMessage: function () {
    /**
     * 分享对象的设置。path可以是含参的。
     */
    return {
      title: '运维密码',
      desc: '每一位运维人员都需要的 OTP 管理工具',
      path: '/pages/servers/servers'
    }
  }
})