// tasks云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const dbname = 'tasks'
  const wxContext = cloud.getWXContext()

  if (event.type === 'add') {
    let taskDesc = event.FormData.taskDesc
    let taskReward = event.FormData.taskReward
    let bg_color = event.bg_color
    let openid = event.openid
    return await db.collection(dbname).add({
        data: {
            _openid: openid,
            taskDesc: taskDesc,
            taskReward: parseInt(taskReward),
            createTime: db.serverDate(),
            bg_color: bg_color
        },
        success:res=> { "添加成功" },
        fail: err=>{
          console.log("添加失败")
        }
    })
  }

  if (event.type === 'get') {
    const myTasks = await db.collection(dbname).where({
      _openid: wxContext.OPENID,
    }).get()
    return myTasks
  }


}