const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    phone: '',
    password: '',
    nickName: ''
  },

  // 点击登录事件
  login() {
    var that = this  
    db.collection('userInfo').where({
      phone: that.data.phone,
      password: that.data.password
    }).get({
      success: res => {
        if (res.data.length == 0) {
          wx.showToast({
            title: '手机号或密码错误',
            icon: 'none'
          })
        }else{
            let userInfo = res.data[0]
            this.setData({
              userInfo: userInfo
            })
            wx.showToast({
              title: '登录成功',
              icon: 'none'
            })
        }
      },
      fail: err => {
        console.log("登录失败")
    }
    })
  },

  inputMsg(event){
    let type = event.currentTarget.id;
    this.setData({
      [type]: event.detail.value   //实时更新 data 对应的数据
    })
    if (type == 'nickName'){
      this.setData({
        userInfo:{
          nickName: event.detail.value 
        }
      })
    }
  },


  // 头像点击监听
  chooseAvatar(e) {
    // 修改云数据库avatarUrl
    let _id = this.data.userInfo._id
    db.collection('userInfo').doc(_id).update({
      data: {
        avatarUrl: e.detail.avatarUrl
      },
      success: function(res) {
        wx.showToast({
          title: '修改成功',
          icon: 'none'
        })
      }
    })
    this.setData({
      userInfo: {
        avatarUrl: e.detail.avatarUrl
      }
    })
  },
  
  // 我的卡包
  myCardsClick() {
    console.log('我的卡包监听');
    wx.navigateTo({
      url: '../card/card',
    })
  },
  
  // 我的任务
  myTasksClick() {
    console.log('我的任务监听');
    wx.navigateTo({
      url: '../myTasks/myTasks',
    })
  },
  // 审核任务
  auditTasksClick() {
    console.log('审核任务监听');
    wx.navigateTo({
      url: '../auditTasks/auditTasks',
    })
  },

  exitClick() {
    this.setData({
      userInfo: null
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userInfo: app.globalData.userInfo,
    })
    // 数据库没有该用户openid数据就注册，app.globalData.userInfo为null时就是无此用户需要注册
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const openid = app.globalData.user_openid;
    // 浏览文章发布文章等会更新coins币
    wx.cloud.database().collection('userInfo').where({
      _openid: openid
    }).get({
      success: res => {
            app.globalData.userInfo = res.data[0]
            this.setData({
              userInfo: app.globalData.userInfo,
            })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})