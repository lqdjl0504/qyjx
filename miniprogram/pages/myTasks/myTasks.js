const util = require("../../utils/util")

// pages/myTasks/myTasks.js
const db = wx.cloud.database() 
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data : {
        myTasks: [],  // 未完成的任务
        auditindTasks: [], //已完成，正在审核中的任务
        loverTasks: [], // 爱人完成提交给我审核的任务
        // 横向导航栏数据
        navData: [{
          id: 0,
          cat_name: '未完成'
        }, {
            id: 1,
            cat_name: '审核中'
        }, {
          id: 2,
          cat_name: '爱人任务'
        }],
        currentTab: 0,
        navScrollLeft: 0,
    },
    
    auditing() {
      db.collection('myTasks').where({
        _openid: app.globalData.user_openid,
        taskTag: 1
      }).get({
        success: res => { 
          console.log(res)
          for(let i=0;i<res.data.length;i++){
            res.data[i].createTime = util.formatTime(res.data[i].createTime)
          }
          this.setData({
            auditindTasks: res.data
          })
        },
      })
    },

    // 审核爱人已完成的任务，一票否决权
    waitAudit() {
      const tag = app.globalData.userInfo.tag
      const Lover_openid = app.globalData.Lover_openid

      db.collection('myTasks').where({
        _openid: Lover_openid,    // 爱人的openid
        taskTag: 1
      }).get({
        success: res => { 
          console.log(res)
          for(let i=0;i<res.data.length;i++){
            res.data[i].createTime = util.formatTime(res.data[i].createTime)
          }
          this.setData({
            loverTasks: res.data
          })
        },
      })
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
        let tag = event.currentTarget.dataset.name  // 导航标签名
        // 根据tag的值调用不同的函数
        switch (tag) {
          case '未完成':
              this.getMyTasks();
              break;
          case '审核中':
              this.auditing();
              break;
          case '爱人任务':
              this.waitAudit();
              break;
        } 
      },



  getMyTasks() {  
    db.collection('myTasks').where({
      _openid: app.globalData.user_openid,
      taskTag: 0 
    }).get({
      success: res => { 
        console.log(res)
        for(let i=0;i<res.data.length;i++){
          res.data[i].createTime = util.formatTime(res.data[i].createTime)
        }
        this.setData({
          myTasks: res.data
        })
      },
      fail: err => {
        console.log("获取myTasks失败", err)
      }
    })
  },  

  deleteTask(event) {
    const _id = event.currentTarget.dataset.id
    console.log("delete-task-id: ", _id)
    console.log("deleteTask")
    wx.showModal({
      title: '确定取消任务', 
      showCancel: true, 
      cancelText: '取消', 
      confirmText: '确定', 
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          db.collection('myTasks').doc(_id).remove({
            success: function(res) {
              wx.showToast({
                title: '取消成功', // 提示的内容
                icon: 'success', // 图标，有效值 "success", "loading", "none"
                duration: 2000, // 提示的延迟时间，单位毫秒，默认：1500
                mask: true // 是否显示透明蒙层，防止触摸穿透，默认：false
              });
              
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },

  // 完成任务-提交审核-将taskTag 0变为1
  completeTask(event) {
    console.log("completeTask")
    const _id = event.currentTarget.dataset.id
    wx.showModal({
      title: '提交审核', 
      showCancel: true, 
      cancelText: '取消', 
      confirmText: '确定',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          db.collection('myTasks').doc(_id).update({
            data: {
              taskTag: 1
            },
            success:res=> { }
          })

        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },

  // 审核通过,taskTag: 0-未完成  1-已完成审核中  2-已完成审核通过获得金币 
  // 修改的不是自己的task，而是爱人的task的taskTag为2
  passAudit(event) {
    console.log("passAudit")
    const _id = event.currentTarget.dataset.id
    const taskReward = event.currentTarget.dataset.taskReward
    const coins = app.globalData.userInfo.coins
    const Lover_openid = app.globalData.Lover_openid

    wx.showModal({
      title: '审核通过', 
      showCancel: true, 
      cancelText: '取消',
      confirmText: '确定', 
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          // 审核通过，爱人的金币+卡片的taskReward，爱人的myTasks-tag变为2即可
          db.collection('myTasks').doc(_id).update({
            data: {
              taskTag: 2
            },
            success:res=> { }
          })
          // 用户金币增加任务报酬
          db.collection('userInfo').where({
            _openid: Lover_openid
          }).update({
            data: {
              coins: coins + taskReward
            },
            success:res=> { }
          })


        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },

  refuseAudit() {
    wx.showModal({
      title: '驳回申请', 
      showCancel: true, 
      cancelText: '取消',
      confirmText: '确定', 
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定');
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      },
    })
  },
    


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getMyTasks()
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
    this.getMyTasks()
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