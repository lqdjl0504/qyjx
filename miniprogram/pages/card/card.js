const db = wx.cloud.database() 
const app = getApp()

Page({  
  data: {  
    myCards: [] // 卡包数据  
  },  

  getCards() {  
    wx.cloud.callFunction({
      name: 'cards',
      data: {
          type: 'get',
      },
      success: res => { 
        this.setData({
          myCards: res.result.data
        })
      },
      fail: err => {
        console.log("获取myCards失败", err)
      }
    })
  },  

  useCard: function(e) {  
    // 使用卡片的逻辑  
    const cardId = e.currentTarget.dataset.id;  
    // 这里应该是对应的调用接口或逻辑  
  },

  onLoad: function() {  
      this.getCards();  
  },  

    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCards();  
  },

});