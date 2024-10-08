const db = wx.cloud.database() 
const app = getApp()

Page({  
  data: {  
    unusedCards: [], // 未使用
    usedCards: [], // 已使用
    // 横向导航栏数据
    navData: [{
      id: 0,
      cat_name: '未使用'
    }, {
      id: 1,
      cat_name: '已使用'
    }],
    currentTab: 0,
    navScrollLeft: 0,
  },  

  // 横向导航栏选择事件
  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
    let tag = event.currentTarget.dataset.name // 导航标签名
    // 根据tag的值调用不同的函数
    switch (tag) {
      case '未使用':
        this.unusedCards();
        break;
      case '已使用':
        this.usedCards();
        break;
    }
  },

  unusedCards() {  
    wx.cloud.callFunction({
      name: 'cards',
      data: {
          type: 'getUnusedCards',
      },
      success: res => { 
        console.log("getUnusedCards: ",res)
        this.setData({
          unusedCards: res.result.data
        })
      },
      fail: err => {
        console.log("获取myCards失败", err)
      }
    })
  },  

  usedCards() {  
    // const cardId = e.currentTarget.dataset.id;  
    wx.cloud.callFunction({
      name: 'cards',
      data: {
          type: 'getUsedCards',
      },
      success: res => { 
        console.log("getUsedCards: ",res)
        this.setData({
          usedCards: res.result.data
        })
      },
      fail: err => {
        console.log("获取myCards失败", err)
      }
    })
  },

  useCard(event) {
    const id = event.currentTarget.dataset.id
    wx.showModal({
      title: '确认使用', // 标题
      showCancel: true, // 是否显示取消按钮，默认为 true
      cancelText: '取消', // 取消按钮的文字，默认为"取消"
      confirmText: '确定', // 确定按钮的文字，默认为"确定"
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          wx.cloud.callFunction({
            name: 'cards',
            data: {
                type: 'updateUseCard',
                _id: id
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
   

  },

  onLoad: function() {  

  },  

    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.unusedCards();  
  },

});