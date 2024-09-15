const db = wx.cloud.database()  // 获取云端数据库引用
var util= require('../../utils/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataObj:[],  // 本地保存云端数据的容器
    page: 0,
    limit: 10,
    // 文章列表
    articleList:[],
    loading: false,   
    loaded: false,
    // 横向导航栏
    navData: [{
      id: 0,
      cat_name: '爱之路',
      pic: '/images/tabBar_article.png'
    }, {
        id: 1,
        cat_name: '纪念日',
        pic: '/images/tabBar_anniversary.png'
    }, {
      id: 2,
      cat_name: '悬赏',
      pic: '/images/tabBar_task.png'
    }, {
      id: 3,
      cat_name: '购卡',
      pic: '/images/tabBar_card.png'
    }, {
      id: 4,
      cat_name: '憧憬',
      pic: '/images/tabBar_plan.png'
    }],
    currentTab: 0,
    navScrollLeft: 0,
    // 纪念日
    anniversaryList: [],
    countDownList: [],
    daysList: [],
    // 悬赏
    tasks: [],
    // 购卡
    cards: []
  },

  // 同时计算倒数日纪念日的方法
  calculateDates: function() {
    console.log("-----------calculateDates--------------")
    const today = new Date();
    let anniversaryList = this.data.anniversaryList.map(item => {
      const targetDate = new Date(item.dayTime);
      const diff = (today - targetDate) / (1000 * 60 * 60 * 24);
      item.dayGap = Math.ceil(diff);
      return item;
    });
    let countDownList = this.data.countDownList.map(item => {
      const birthdayDate  = new Date(item.dayTime);
       // 将生日设置为今年的日期
      let nextBirthday = new Date(today.getFullYear(), birthdayDate.getMonth(), birthdayDate.getDate());
       // 如果今年的生日已经过了，那么计算明年的生日
      if (nextBirthday < today) {
        nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
      }
      const diff = (nextBirthday  - today) / (1000 * 60 * 60 * 24);
      item.dayGap = Math.ceil(diff);
      return item;
    });
    let combinedList = anniversaryList.concat(countDownList);
    this.setData({
      anniversaryList,
      countDownList,
      daysList: combinedList
    });
    console.log("-------days end--------")
    console.log(this.data.daysList)
  },

  // 获取文章
  async getArticles() {
    var that = this    // 把this对象复制到临时变量that
    that.setData({
          page:that.data.page + 1,
    })
    var articleList = that.data.articleList;
    // 云开发：获取数据段(i, i+limit) 
    db.collection('article').orderBy('createTime', 'desc').skip((that.data.page-1) * that.data.limit).limit(that.data.limit).get({
      success: function(res) {
        // if (res.data.length == 0)
        console.log("articles: ", res.data)
        articleList = articleList.concat(res.data)
        for (var index = 0; index < res.data.length; index++) {
          res.data[index].createTime = util.formatTime(res.data[index].createTime)
        }
        that.setData({
          articleList: articleList,
        })
        if (res.data.length < that.data.limit) {  //最后一页数据
            that.setData({
              loading: false,   // 隐藏
              loaded: true,     // 显示
            });
        }
      }
    })
  },

  // 获取纪念日
  getAnniversary() {
    var that = this
    db.collection('anniversary').get({
      success:res=> {
        var anniversary = [];
        var ountDown = [];
        for (var index = 0; index < res.data.length; index++) {
          res.data[index].dayTime = util.formatDate(res.data[index].dayTime)
          if(res.data[index].dayTag == 0) {
            anniversary = anniversary.concat(res.data[index])
          }else{
            ountDown = ountDown.concat(res.data[index])
          }
        }
        this.setData({
          anniversaryList: anniversary,
          countDownList: ountDown
        })
        // console.log(this.data.anniversaryList)
        // console.log(this.data.countDownList)
        that.calculateDates()
      }
    })
  },



  // 悬赏任务
  getTask() {
    db.collection('tasks').get({
      success:res=> {
        this.setData({
          tasks: res.data
        })
      }
    })
  },

   // 悬赏领取任务
   receiveTask(event) {
    console.log('领取任务',event.currentTarget.dataset.task);
    // 将任务信息保存到myTasks集合, openid自动填充到数据库
    let task = event.currentTarget.dataset.task
    let taskDesc = task.taskDesc
    let taskReward = task.taskReward
    let bg_color = task.bg_color
    let time = new Date()

    wx.showModal({
      title: '确认领取',
      showCancel: true, 
      cancelText: '取消',
      confirmText: '确定', 
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定');

          db.collection('myTasks').add({
            data: {
              taskDesc: taskDesc,
              taskReward: taskReward,
              createTime: new Date(time),
              bg_color: bg_color,
              taskTag: 0
            },
            success:res=> {
              wx.showToast({
                title: '领取成功', 
                icon: 'success', 
                duration: 2000, 
                mask: true 
              });
             }
          })

        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });

  },

  // 购物卡片
  getGoods() {
    db.collection('cards').where({
      cardTag: true
    }).get({
      success:res=> {
        console.log(res.data)
        this.setData({
          cards: res.data
        })
      }
    })
  },

  // 憧憬计划
  getPlans() {
    db.collection('plans').get({
      success:res=> {
        console.log(res.data)
        this.setData({
          anniversary: res.data
        })
      }
    })
  },

  // 横向导航栏选择事件
  switchNav(event) {
    var that = this
    var cur = event.currentTarget.dataset.current;
    if (this.data.currentTab == cur) {
        return false;
    } else {
        this.setData({
            currentTab: cur
        })
    }
    let tag = event.currentTarget.dataset.name  // 导航标签名
    console.log("choose tag to execute",tag)
    // 根据tag的值调用不同的函数
    switch (tag) {
      case '爱之路':
          that.setData({
            page: 0,
            articleList: []
          })
          this.getArticles();
          break;
      case '纪念日':
          this.getAnniversary();
          break;
      case '悬赏':
          this.getTask();
          break;
      case '购卡':
          this.getGoods();
          break;
      case '憧憬':
          this.getPlans();
          break;
    } 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getArticles();
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
    console.log("------------onShow-----------")
    switch (this.data.currentTab) {
      case 0:
          this.setData({
            page: 0,
            articleList: []
          })
          this.getArticles();
          break;
      case 1:
          this.getAnniversary();
          break;
      case 2:
          this.getTask();
          break;
      case 3:
          this.getGoods();
          break;
      case 4:
          this.getPlans();
          break;
    } 
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
    console.log("------------onpulldownrefresh-----------")
    console.log(this.data.currentTab)
    switch (this.data.currentTab) {
      case 0:
          this.setData({
            page: 0,
            articleList: []
          })
          this.getArticles();
          break;
      case 1:
          this.getAnniversary();
          break;
      case 2:
          this.getTask();
          break;
      case 3:
          this.getGoods();
          break;
      case 4:
          this.getPlans();
          break;
    } 
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if(!that.data.loaded){
      that.setData({
        loading: true,  // 显示
      });
      that.getArticles()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})