var util= require('../../utils/util.js')
const app = getApp()

Page({

  data: {
      currentWordNumber:0,
      // 渲染输入框
      dayNameList: {
          'id': 'dayName',
          'title': '命名:',
          'placeholder': '请填写日子名',
          'type': 'text',
          'maxlength': 10,
      },

      // 表单数据
      dayName: '',
      dayTag: '',
      dayTime: '',
      
      dayTagList: [
        {
          name: '纪念日',
          value: 0,
        },{
          name: '倒数日',
          value: 1,
        }
      ]
  },

  bandleChange(e){
    // 2 把值赋值给 data 中的数据
    this.setData({
      // gender:gender
      dayTag: e.detail.value
      
    })
  },

  onPickerChange(e) {//返回回调函数
    console.log("onPickerChange", e)
    let timeStr = e.detail.value
    console.log(timeStr)
    this.setData({
      dayTime: timeStr
    })
  },

  onLoad: function (e) {

  },

  // 获取输入框数据
  InputData: function (e) {
    // console.log("input",e.detail.value)
      this.setData({
        dayName: e.detail.value
      })
  },

 
  Submit() {
      wx.showLoading({
          title: '添加纪念日中...',
          mask: true
      })
      var _bg_color = util.getRandomColor()
      wx.cloud.callFunction({
          name: 'anniversary',
          data: {
              type: 'add',
              dayName: this.data.dayName,
              dayTag: this.data.dayTag,
              dayTime: this.data.dayTime,
              bg_color: _bg_color
          },
          success: res => {
              wx.hideLoading()
              console.log(res)
              wx.showToast({
                title: '添加成功', // 提示的内容
                icon: 'success', // 图标，有效值 "success", "loading", "none"
                duration: 2000, // 提示的延迟时间，单位毫秒，默认：1500
                mask: true // 是否显示透明蒙层，防止触摸穿透，默认：false
              });
              // wx.switchTab({
              //   url: '../publish/publish',
              // })
          },
          fail: err => {
              wx.hideLoading()
              console.log(err)
              wx.showToast({
                  title: '添加纪念日失败',
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