var util= require('../../utils/util.js')
const app = getApp()

Page({

  data: {
      currentWordNumber:0,
      // 渲染输入框
      InputList: [{
          'id': 'taskDesc',
          'title': '任务:',
          'placeholder': '请填写任务',
          'type': 'text',
          'maxlength': 20,
      },
      {
          'id': 'taskReward',
          'title': '报酬:',
          'placeholder': '请填写报酬',
          'type': 'text',
          'maxlength': 10,
      }],

      // 表单数据
      FormData: {
          'taskDesc': '',
          'taskReward': '',
      },
  },

  onLoad: function (e) {

  },

  // 获取输入框数据
  InputData: function (e) {
      // console.log(e, e.currentTarget.id, e.detail.value)
      let FormData = this.data.FormData
      let id = e.currentTarget.id   
      let value = e.detail.value   
      FormData[id] = value
      this.setData({
          FormData,
          currentWordNumber: parseInt(value.length)  
      })
  },

 
  Submit() {
      wx.showLoading({
          title: '发布悬赏中...',
          mask: true
      })
      let FormData = this.data.FormData
      let that = this
      var _openid = app.globalData.user_openid
      var _publisUser = app.globalData.userInfo.nickName
      var _bg_color = util.getRandomColor()
      wx.cloud.callFunction({
          name: 'tasks',
          data: {
              type: 'add',
              openid: _openid,
              FormData: FormData,
              bg_color: _bg_color
          },
          success: res => {
              wx.hideLoading()
              console.log(res)
              wx.showToast({
                title: '发布成功',
                icon: 'success', 
                duration: 2000, 
                mask: true 
              });
          },
          fail: err => {
              wx.hideLoading()
              console.log(err)
              wx.showToast({
                  title: '发布悬赏失败',
                  icon: 'success',
                  duration: 2000
              })
          },
          complete: res => {
              // console.log(res)
          }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})