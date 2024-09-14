const db = wx.cloud.database()  // 获取云端数据库引用
var util= require('../../utils/util.js')
const app = getApp()
var maxH = 0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: '',
    userInfo: '',
    Height: ''
  },

    // 预览照片
  ViewImage(e) {
    wx.previewImage({
        urls: this.data.detail.image,
        current: e.currentTarget.dataset.url  
    });
  },


  getData(_id){
    db.collection('article').doc(_id).get({
      success:res=> {
        res.data.createTime = util.formatDate(res.data.createTime)
        this.setData({
            detail: res.data,
        })
      }
    })
  },

  imgHeight: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    var imgh = e.detail.height; //图片高度
    var imgw = e.detail.width; //图片宽度
    let temH = winWid * imgh / imgw //当前加载的图片高度 等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    if (temH > maxH) {
        maxH = temH
    }
    var swiperH = maxH + 22 + "px"
    this.setData({
        Height: swiperH //设置高度
    })
    console.log(this.data.Height)
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userInfo: app.globalData.userInfo,
    })
    this.getData(options.data)  // 路径数据：options.data = _id 文章id

    const openid = app.globalData.user_openid;
    // 浏览文章10s后+5币
    // 必须是实时的币数据
    db.collection('userInfo').where({
      _openid: openid,
    }).get({
        success: res => {
          app.globalData.userInfo = res.data[0]
          const coins = res.data[0].coins

          setTimeout(() => {
            db.collection('userInfo').where({
              _openid: openid
            }).update({
              data: {
                coins: coins + 5
              },
              success:res=> {
                wx.showToast({
                  title: '浏览+5币',
                  icon: 'success',
                  duration: 2000, 
                  mask: true 
                });
               }
            })
          }, 10000);

        }
    })



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