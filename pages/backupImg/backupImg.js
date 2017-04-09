var QR = require("../../utils/qrcode.js");
Page({
  data: {
    /*
    官网说hidden只是简单的控制显示与隐藏，组件始终会被渲染，
    但是将canvas转化成图片走的居然是fail，hidden为false就是成功的
    所以这里手动控制显示隐藏canvas
    */
    maskHidden: true,
    openid: '',
    imagePath: '',
    placeholder: 'GetCode'
  },
  onLoad: function (options) {
    var that = this;
    var date = new Date();
    var lengths = JSON.parse(wx.getStorageSync('servers')).length;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          model: res.model,
          info:res,
          time:date.toLocaleDateString(),
          length:lengths
        })
        wx.login({
          success: function (res) {

            wx.request({
              url: 'https://linux.cn/weixin/api/otp.php?login&code=' + res.code,
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              success: function (res) {
                that.setData({
                  openid: res.data.openid
                })
                var servers = wx.getStorageSync('servers');
                servers = JSON.parse(servers);
                var server = [];
                servers.forEach(function(value,index,array){
                    var obj = new Object();
                    obj.s = value.secret;
                    obj.b = encodeURI(value.signedBy);
                    obj.u = value.username;
                    obj.la = value.latitude;
                    obj.lo = value.longitude;
                    server.push(obj);
                });
                var strObj = new Object();
                var date = new Date();
                strObj.v = 0.2;
                strObj.i = that.data.openid;
                strObj.t = date.toLocaleDateString();
                strObj.s = server;
                strObj.e = that.data.model;
                var text = JSON.stringify(strObj);  
                var size = that.setCanvasSize();    
                that.createQrCode(text, "mycanvas", size.w-10, size.h-10);
              }
            })
          },
          fail: function (res) {
           var servers = wx.getStorageSync('servers');
                servers = JSON.parse(servers);
                var server = [];
                servers.forEach(function(value,index,array){
                    var obj = new Object();
                    obj.s = value.secret;
                    obj.b = encodeURI(value.signedBy);
                    obj.u = value.username;
                    obj.la = value.latitude;
                    obj.lo = value.longitude;
                    obj.n =encodeURI(value.name);
                    obj.d =encodeURI(value.desc);
                    server.push(obj);
                });
            var strObj = new Object();
            var date = new Date();
            strObj.v = 0.2;
            strObj.i = 'none';
            strObj.t = date.toLocaleDateString();
            strObj.s = servers;
            strObj.e = that.data.model;
            var text = JSON.stringify(strObj);
            var size = that.setCanvasSize();
            that.createQrCode(text, "mycanvas", size.w, size.h);
          }
        })
      }
    })

    
    // this.createQrCode(text, "mycanvas", size.w, size.h);

  },

  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 600;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.qrApi.draw(url, canvasId, cavW, cavH);
    var that = this;
    //二维码生成之后调用canvasToTempImage();延迟3s，否则获取图片路径为空
    var st = setTimeout(function () {
      that.canvasToTempImage();
      clearTimeout(st);
    }, 3000);

  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({
          imagePath: tempFilePath,
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  //点击图片进行预览，长按保存分享图片
  previewImg: function (e) {
    var img = this.data.imagePath
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },
  formSubmit: function (e) {
    wx.switchTab({
      url: '../options/options',
    })
  }

})