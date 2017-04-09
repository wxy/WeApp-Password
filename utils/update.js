const VER = 0.2;
const VER_LIST = [
    "0.1","0.2"
]
/**
 * 获取当前的数据版本
 */
function getVersion() {
    var local = wx.getStorageSync('version');
    if (local == '') {
        return '0.1'
    } else {
        return local
    }
}
/**
 * 0.1 升级到 0.2
 */
function update20() {
    var serverArr = [];
    var info = wx.getStorageInfoSync();
    var o_length = 0;
    var compete = false;
    info.keys.forEach(function (value, index, array) {
        if (value.length == 16) {
            var data = wx.getStorageSync(value);
            console.log(data);
            serverArr.push(data);
            o_length++;
        }
    });
    if (o_length == serverArr.length) {
        wx.setStorageSync('servers', JSON.stringify(serverArr));
        wx.setStorageSync('version', '0.2');
        compete = true;
        
    } else {
       
    }
    if (compete == true) {
        info.keys.forEach(function (value, index, array) {
            if (value.length == 16) {
                wx.removeStorageSync(value);
            }
        });
    }
}
/**
 * 检查是否需要更新
 */
function checkUpdate(){
   /**
    *  由于小程序内 eval调用失败，暂时手动写升级函数。后续研究。
    */
    var localVer = getVersion();
    if (localVer < VER){
        update20();
    }
    
}
module.exports = {
    checkUpdate:checkUpdate
}