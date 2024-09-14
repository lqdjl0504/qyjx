var util= require('../../utils/util.js')
const db = wx.cloud.database()
const app = getApp()
let imginfo = []
let delimgList =[]  //要删除的图片列表
let temimgList =[]  //临时的图片列表

Page({

  data: {
      currentWordNumber:0,
      // 渲染输入框
      InputList: [{
          'id': 'title',
          'title': '标题:',
          'placeholder': '请填写标题',
          'type': 'text',
          'maxlength': 20,
          'tag':'input'
      },
      {
          'id': 'content',
          'title': '正文:',
          'placeholder': '请填写正文',
          'type': 'text',
          'maxlength': 200,
          'tag':'textarea'
      }],

      // 表单数据
      FormData: {
          'title': '',
          'content': '',
      },
      imgList: [],  // 记录已选图片
      // 显示窗口数据
      showToast: false,
      toastText: ''
  },

  onLoad: function (e) {

  },

  // 自定义提示组件
  showCustomToast: function() {
    this.setData({
      showToast: true,
      toastText: '发布成功，获得10币'
    });
    setTimeout(() => {
      this.setData({
        showToast: false
      });
    }, 2000); // 两秒后隐藏提示
  },

  // 获取输入框数据
  InputData: function (e) {
      // console.log(e, e.currentTarget.id, e.detail.value)
      let FormData = this.data.FormData
      let id = e.currentTarget.id   // title、content
      let value = e.detail.value    // 输入的值
      FormData[id] = value
      this.setData({
          FormData,
          currentWordNumber: parseInt(value.length)  
      })
  },


  // 选择照片
  ChooseImage() {
      let that = this
      wx.chooseImage({
          count: 4, //默认9
          sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album'], //从相册选择
          success: async (res) => {
              console.log(res)
              // 判断是不是上传的第一张照片
              if (this.data.imgList.length != 0) {  // not first
                  this.setData({
                      imgList: this.data.imgList.concat(res.tempFilePaths)
                  })
              } else { // first
                  this.setData({
                      imgList: res.tempFilePaths
                  })
              }
              for (let i = 0; i < res.tempFilePaths.length; i++) {
                  let resinfo = await that.getimginfo(res.tempFilePaths[i])
                  imginfo = imginfo.concat(resinfo)
              }
              console.log('imgList',this.data.imgList)
              console.log('imginfo',imginfo)
          }
      });
  },

// 获取图片信息
  getimginfo(sor){
      return new Promise((resolve, errs) => {
          wx.getImageInfo({
              src: sor,
              success (resinfo) {
                  resolve(resinfo);
              }
            })
          })
    },
    
  // 预览照片
  ViewImage(e) {
      wx.previewImage({
          urls: this.data.imgList,
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
                  let index = e.currentTarget.dataset.index
                  if(this.data.imgList[index].indexOf('cloud') != -1){
                      delimgList.push(this.data.imgList[index])
                  }
                  this.data.imgList.splice(index, 1);
                  // 记录图片信息 尺寸：宽高
                  imginfo.splice(index, 1);
                  this.setData({
                      imgList: this.data.imgList
                  })

                  console.log('imgList',this.data.imgList)
                  console.log('imginfo',imginfo)
                  console.log('delimgList',delimgList)
              }
          }
      })
  },


  // 提交信息前进行数据校验
  Submit(e) {
      let ImgList = this.data.imgList
      let FormData = this.data.FormData
      // FormData.imginfo = imginfo

      // 表单数据的校验,此时FormData包含：title、content、imginfo 三个信息
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

      console.log("imgList.length:",ImgList.length)

      // 图片的校验
      // 图片为空时报错
      if (ImgList.length == 0) {
          wx.hideLoading()
          wx.showToast({
              title: '图片不能为空,最少需要一张',
              icon: 'none',
              mask: true,
              duration: 2000
          })
          return;
      }
      // 图片超过4张保错
      if (ImgList.length >4) {
          wx.hideLoading()
          wx.showToast({
              title: '图片不能超过4张',
              icon: 'none',
              mask: true,
              duration: 2000
          })
          return;
      }

      this.setData({
          FormData: FormData
      })

      // 上传图片到云数据库保存返回图片的http-url并保存到article集合中的image
      this.UploadImages()
  },


  // 上传图片
  UploadImages() {
      wx.showLoading({
          title: '保存图片...',
          mask: true
      })
      let that = this
      let imgPathList = []
    
      // 保存照片
      for (let i = 0; i < that.data.imgList.length; i++) {
          if(that.data.imgList[i].indexOf('cloud') != -1){
              imgPathList.push(that.data.imgList[i])
              if (imgPathList.length == that.data.imgList.length) {
                  wx.hideLoading()
                  // 保存信息
                  that.SubmitEntrust(imgPathList)
              }
          }else{
              console.log(that.data.imgList)
              const fileName = that.data.imgList[i];
              const dotPosition = fileName.lastIndexOf('.');
              const extension = fileName.slice(dotPosition);
              const cloudPath = 'lovePic/' + `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}${extension}`;
              wx.cloud.uploadFile({
                  cloudPath,
                  filePath: fileName,
                  success(res) {
                      console.log('imgs', res, imgPathList.length, that.data.imgList.length)
                      imgPathList.push(res.fileID)  // 云存储返回的图片 http-url
                      temimgList.push(res.fileID)
                      if (imgPathList.length == that.data.imgList.length) {
                          wx.hideLoading()
                          // 保存信息
                          that.SubmitEntrust(imgPathList)
                      }
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
          }
        
      }
  },

  // 使用wx.cloud.uploadFile后返回图片的http-url，此时把article的所有数据{_openid,title,content,time,image}
  SubmitEntrust(photoInfo) {
      wx.showLoading({
          title: '上传文章中...',
          mask: true
      })
      let FormData = this.data.FormData
      let that = this
      // var userInfo = wx.getStorageSync('userInfo')
      var _openid = app.globalData.user_openid
      var coins = app.globalData.userInfo.coins
      console.log("publish articles: ", _openid, coins)
      wx.cloud.callFunction({
          name: 'article',
          data: {
              type: 'add',
              openid: _openid,
              FormData: FormData,
              photoInfo: photoInfo,
          },
          success: res => {
              wx.hideLoading()
              // 发布文章一篇用户获得10币
              db.collection('userInfo').where({
                _openid: _openid
              }).update({
                data: {
                  coins: coins + 10
                },
                success:res=> {
                  this.showCustomToast()
                 }
              })
          },
          fail: err => {
              wx.hideLoading()
              console.log(err)
              wx.showToast({
                  title: '发布文章失败',
                  icon: 'success',
                  duration: 2000,
                  mask: true 
              })
              // 文章发布失败时，把已经上传到云存储的图片删除
              wx.cloud.deleteFile({
                  fileList: photoInfo,
                  success: res => {
                      // handle success
                      console.log('delimages', res.fileList)
                  },
                  fail: console.error
              })
          },
          complete: res => {
              console.log(res)
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
      delimgList =[]
      temimgList =[]
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