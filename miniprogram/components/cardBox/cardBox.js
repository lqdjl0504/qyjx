// components/cardBox/cardBox.js
const db = wx.cloud.database() 
const app = getApp()

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    cardName: {
      type: String,
      value: '家务卡'
    },
    //卡号
    cardID: {
      type: String,
      value: '1999 0127 1998 0726'
    },
    //卡的类型
    cardType: {
      type: String,
      value: '只愿君心似我心 | 定不负相思意'
    },
    //金额
    cardAmount: {
      type: Number,
      value: 500
    },
    cardColor: {
      type: String,
      value: 'to bottom right, #cd4100, #f8937f'
    },
    cardLogo: {
      type: String,
      value: 'https://6c71-lq0504-3g69h7zi82b6f6b2-1329103136.tcb.qcloud.la/defaultAvatarUrl.jfif?sign=97e0b38e6d3919fcee3a2d87af7cd4d7&t=1725549417'
    },
    _id: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

    buyCard: function(event) {
      console.log('event: ', event)
      const _id = event.currentTarget.dataset.id; // 卡片的id
      const openid = app.globalData.user_openid;
      const cardAmount = this.properties.cardAmount
      wx.showModal({
        title: '确认购买', // 标题
        // content: '这是一个模态对话框', // 内容
        showCancel: true, // 是否显示取消按钮，默认为 true
        cancelText: '取消', // 取消按钮的文字，默认为"取消"
        confirmText: '确定', // 确定按钮的文字，默认为"确定"
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定');
        
            // 必须是实时的币数据
            db.collection('userInfo').where({
              _openid: openid,
            }).get({
                success: res => {
                  app.globalData.userInfo = res.data[0]
                  console.log('app.globalData.userInfo', app.globalData.userInfo)
                  const coins = res.data[0].coins

                  console.log('_id: ', _id)
                  console.log('coins: ', coins)
                  console.log('cardAmount: ', cardAmount)
                  // 用户币是否足够购买
                  if(coins >= cardAmount) {
                      wx.cloud.callFunction({
                      name: 'cards',
                      data: {
                        type: 'update_openid',
                        _id: _id
                      }
                    }).then(res => {
                      console.log('购买成功', res);
                      // 扣除用户的币
                      db.collection('userInfo').where({
                          _openid: openid
                      }).update({
                        data: {
                          coins: coins - cardAmount
                        },
                        success:res=> {
                          wx.showToast({
                            title: '购买成功', 
                            icon: 'success', 
                            duration: 2000, 
                            mask: true 
                          });
                        }
                      })
                    }).catch(err => {
                      // handle error
                      console.log('购买失败', err);
                    })
            
                  }else{
                    wx.showToast({
                      title: '币不足请充值', 
                      icon: 'none', 
                      duration: 2000, 
                      mask: true 
                    });
                  }    
                }
            })


          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });



    }
  }
})