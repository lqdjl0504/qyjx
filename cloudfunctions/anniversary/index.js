// tasks云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const dbname = 'anniversary'

  if (event.type === 'add') {
    let dayName = event.dayName
    let dayTag = event.dayTag
    let dayTimeStr = event.dayTime
    let dayColor = event.bg_color
    let dayTime = new Date(dayTimeStr)
    return await db.collection(dbname).add({
        data: {
          dayName: dayName,
          dayTag:  parseInt(dayTag),
          dayTime: dayTime,
          dayColor: dayColor,
        },
        success:res=> { "添加成功" },
        fail: err=>{
          console.log("添加失败")
        }
    })
  }

}