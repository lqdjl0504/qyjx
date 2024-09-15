const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  const dbname = 'userInfo';
  const wxContext = cloud.getWXContext();

  if (event.type === 'update_taskTag_coins') {
    let taskTag = event.taskTag;
    let taskReward = event.taskReward;
    let Lover_openid = event.Lover_openid;
    let myTaskID = event.myTaskID;
    console.log('^^^^^^^^^^^cloudfunction user update coins taskTag^^^^^^^^6');
    console.log('taskTag: ', taskTag);
    console.log('taskReward: ', taskReward);
    console.log('Lover_openid: ', Lover_openid);
    console.log('myTaskID: ', myTaskID);

    try {
      // 获取爱人的coins
      const res = await db.collection('userInfo').where({
        _openid: Lover_openid
      }).get();

      console.log("res: ", res);
      if (res.data.length > 0) {
        let coins = res.data[0].coins;
        console.log('lover coins: ', coins);

        // 更新爱人的coins
        await db.collection('userInfo').where({
          _openid: Lover_openid
        }).update({
          data: {
            coins: coins + taskReward
          }
        });

        // 更新myTasks的taskTag: 2
        await db.collection('myTasks').doc(myTaskID).update({
          data: {
            taskTag: taskTag
          }
        });
      } else {
        console.log('No user found with the given openid');
      }
    } catch (err) {
      console.log("添加失败", err);
    }
  }
};