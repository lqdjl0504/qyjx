// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const dbname = 'article'

  if (event.type === 'add') {
    let title = event.FormData.title
    let content = event.FormData.content
    let photoInfo = event.photoInfo
    let openid = event.openid
    return await db.collection(dbname).add({
        data: {
            _openid: openid,
            image: photoInfo,
            createTime: db.serverDate(),
            title: title,
            content: content,
        },
        success:res=> { }
    })
  }


}