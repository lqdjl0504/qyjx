// tasks云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  const dbname = 'cards'
  const wxContext = cloud.getWXContext()

  if (event.type === 'add') {
    let cardName = event.FormData.cardName
    let cardAmount = event.FormData.cardAmount
    let cardType = event.FormData.cardType
    let cardColor = event.bg_color
    let cardID = event.cardID
    let cardLogo = event.cardLogo
    return await db.collection(dbname).add({
        data: {
            cardID: cardID,
            cardName: cardName,
            cardAmount: parseInt(cardAmount),
            cardType: cardType,
            cardColor: cardColor,
            cardLogo: cardLogo,
            createTime: db.serverDate()
        },
        success:res=> { "添加成功" },
        fail: err=>{ console.log("添加失败") }
    })
  }

  if (event.type === 'get') {
    const myCards = await db.collection(dbname).where({
      _openid: wxContext.OPENID,
    }).get()
    return myCards
  }

  if (event.type === 'update_openid') {
    let _id = event._id
    return await db.collection(dbname).doc(_id).update({
      data: {
        _openid: wxContext.OPENID,
        cardTag: false
      },
    })
  }

}