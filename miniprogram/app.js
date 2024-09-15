// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'lq0504-3g69h7zi82b6f6b2',
        traceUser: false,
      });
    }

     wx.cloud.callFunction({
       name: 'get_openId',
       success: res => {
        console.log("-------进入小程序 get_openId----------")
        console.log('_openid: ', res.result.openid)
        console.log("-------res end----------")
         this.globalData.user_openid = res.result.openid
         
          //在数据库中查找用户是否已经登录过了
          wx.cloud.database().collection('userInfo').where({
            _openid: res.result.openid
          }).get({
            success: res => {
                if (res.data.length == 0){
                  console.log('没有数据唉~')  
                }else{
                  this.globalData.userInfo = res.data[0]
                  console.log(this.globalData.userInfo)
                  var tag = res.data[0].tag

                  if (tag === '老公') {
                    this.globalData.Lover_openid = 'obflu7YdOUtH2qbOrgcKGcCcH-C4'   //老婆的openid
                   }else{
                    this.globalData.Lover_openid = 'obflu7Z32gpeHE3oXZ5dwUZvvRDs'   //老公的openid
                   }
                   console.log("this.globalData.Lover_openid: ", this.globalData.Lover_openid)
                }
            }
          })
        },
        fail: err => {
            console.log("调用云函数失败，请查看是否选择云环境或者安装依赖wx-server-sdk")
        }
     })
     
    this.globalData = {
      user_openid:'',
      Lover_openid: '',
      userInfo: null
    }

  },
  
});

