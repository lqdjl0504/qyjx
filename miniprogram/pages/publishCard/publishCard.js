var util= require('../../utils/util.js')
const app = getApp()

Page({

  data: {
      // 渲染输入框
      InputList: [{
          'id': 'cardName',
          'title': '卡片名:',
          'placeholder': '请填写卡片名',
          'type': 'text',
          'maxlength': 20,
      },
      {
          'id': 'cardAmount',
          'title': '面值:',
          'placeholder': '请填写面值',
          'type': 'text',
          'maxlength': 10,
      },
      {
        'id': 'cardType',
        'title': '卡片诗句:',
        'placeholder': '请填写卡片诗句',
        'type': 'text',
        'maxlength': 30,
       }],

      // 表单数据
      FormData: {
          'cardName': '',
          'cardAmount': '',
          'cardType': ''
      },
      // 卡片Logo
      cardLogo: ''
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
      })
  },

  ChooseImage() {
    let that = this
    wx.chooseImage({
        count: 1, 
        sizeType: ['original', 'compressed'], 
        sourceType: ['album'], //从相册选择
        success: async (res) => {
            console.log(res)
            this.setData({
              cardLogo: res.tempFilePaths[0]
            })
            console.log('cardLogo',this.data.cardLogo)
        }
    });
  },

    // 预览照片
  ViewImage(e) {
      wx.previewImage({
          urls: this.data.cardLogo,
          current: e.currentTarget.dataset.url
      });
  },

  // 删除照片
  DelImg(e) {
    wx.showModal({
        title: '提示',
        content: '确定要删除这张照片吗？',
        cancelText: '取消',
        confirmText: '确定',
        success: res => {
            if (res.confirm) {
                this.setData({
                  cardLogo: ''
                })
            }
        }
    })
  },

  // 提交信息前进行数据校验后， 运行UploadImages得到图片http-url，  最后调用 SubmitEntrust(photoInfo) 运行云函数上传card所有数据
  Submit(e) {
    let cardLogo = this.data.cardLogo
    let FormData = this.data.FormData

    for (let key in FormData) {
        if (FormData[key] == '') {
            wx.showToast({
                title: '请把所有数据填写完整',
                icon: 'none',
                mask: true,
                duration: 2000
            })
            return;
        }
    }
    
    // 图片的校验: 为空时报错
    if (cardLogo == '') {
        wx.hideLoading()
        wx.showToast({
            title: '请选择卡片Logo图标上传',
            icon: 'none',
            mask: true,
            duration: 2000
        })
        return;
    }

    this.UploadImages()
  },

  
 // 上传图片
  UploadImages() {
    wx.showLoading({
        title: '保存图片中...',
        mask: true
    })
    let that = this
    // 保存照片
    const fileName = that.data.cardLogo;
    const dotPosition = fileName.lastIndexOf('.');    
    const extension = fileName.slice(dotPosition);  // 截取文件名的后缀，即图片格式
    const cloudPath = 'lovePic/' + `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}${extension}`;

    wx.cloud.uploadFile({
       cloudPath,
       filePath: fileName,
       success(res) {
         wx.hideLoading()
         console.log("上传图片成功")
         // console.log(res)
            // 保存信息
         that.SubmitEntrust(res.fileID)    // 调用云数据库保存卡片数据
       },
       fail: err => {
           wx.hideLoading()
           wx.showToast({
               title: '图片保存失败',
               icon: "none",
               duration: 1500
           })
       },
       complete: res => { }
      })
  },

  SubmitEntrust(cardLogo) {
    wx.showLoading({
        title: '生成卡片中...',
        mask: true
    })
    let FormData = this.data.FormData
    let that = this
    var _bg_color = util.getRandomColor_v2()
    console.log('------保存card中--------')

    wx.cloud.callFunction({
        name: 'cards',
        data: {
            type: 'add',
            FormData: FormData,
            bg_color: _bg_color,
            cardID: util.generateCardNumber(),
            cardLogo: cardLogo
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
                title: '生成卡片失败',
                icon: 'success',
                duration: 2000
            })
        },
        complete: res => {
            // wx.switchTab({
            //   url: '../publish/publish',
            // })
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