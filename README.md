# 原生态微信语言+微信云开发 => 情侣记录互动小程序开发文档

# 云开发三大基础功能

- 云数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 云存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

- 云开发参考文档：[云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)



# 小程序介绍



## 倩影江行小程序框架图
![image](https://github.com/user-attachments/assets/f74e2967-4412-4597-b9fa-1b6c5e9a8f06)


## 功能介绍

- ### 记录功能

描述：情侣可发布文章用于记录生活中的小点滴，可以随时浏览已发布文章，每篇文章可上传4张图片。

- ### 纪念日倒数日功能

描述：情侣可以添加重要的纪念日和生日倒数日等，随时打开小程序即可查看，方便快捷。

- ### 互动功能

描述：小程序添加了金币玩法，情侣间可发布悬赏任务并标注报酬金币，例如：做饭/打扫/按摩等，对方可领取任务赚取金币；金币可用于购买卡片，卡片功能丰富有趣情侣可以自定义，每一张卡片标注有编号和浪费诗句独一无二，例如：免生气卡/我最大卡等。

- ### 憧憬计划功能

描述：情侣可以添加自定义对于长期未来、短期未来、旅游、娱乐、购物等生活中方方面面的计划，例如：憧憬什么时候去一趟新疆之旅、憧憬什么时候吃一顿火锅、憧憬什么时候看一次电影等。



## 小程序展示
![image](https://github.com/user-attachments/assets/d6727a08-e249-4401-9012-a0f6e16a38d6)
![image](https://github.com/user-attachments/assets/fcfb764f-7b31-4f4b-84a0-5178418f7c36)
![image](https://github.com/user-attachments/assets/da910679-a32b-496b-9949-961b9df42bbf)
![image](https://github.com/user-attachments/assets/08e6610f-f937-44b1-9f76-8d4e6a752602)

![image](https://github.com/user-attachments/assets/5211fa3d-a841-4cbe-a7e5-af419487be37)
![image](https://github.com/user-attachments/assets/f5f42fe4-c152-4590-bc4d-98e5b26c9285)

![image](https://github.com/user-attachments/assets/5d8e19e6-8895-46ee-bcec-8a4650a4dfb9)

![image](https://github.com/user-attachments/assets/07c7fd2a-6295-4a8d-a33d-3233b8aca82a)

![image](https://github.com/user-attachments/assets/fc091f3e-ac70-4354-97f4-2e29003af5b6)

## 云数据库集合

共6个集合，分别是：userInfo、cards、tasks、myTasks、article、anniversary

### userInfo

```json
{
  "_id": "",
  "password": "",
  "phone": "",
  "nickName": "",
  "avatarUrl": "",
  "_openid": "",
  "coins": 0.0,
  "tag": "老公"
}

{
  "_id": "",
  "tag": "老婆",
  "phone": "",
  "password": "",
  "coins": 0.0,
  "nickName": "",
  "_openid": "",
  "avatarUrl": ""
}
```



### cards

```json
{
  "_id": "",
  "cardAmount": 888,
  "cardColor": "to bottom right, #cd4100, #f8937f",
  "cardID": "",
  "cardLogo": "",
  "cardName": "家务卡",
  "cardType": "只愿君心似我心 | 定不负相思意",
  "cardTag": true,
  "createTime": {
    "$date": "2024-09-14T02:57:51.095Z"
  },
  "_openid": "",
  "cardUse": false
}
```



### tasks

```json
{
  "_id": "",
  "bg_color": "45deg, #9EFBD3 0%, #57E9F2 48%, #45D4FB 17%",
  "taskDesc": "唱一首情歌",
  "taskReward": 100.0,
  "_openid": "",
  "createTime": {
    "$date": "2024-09-05T16:41:26.218Z"
  }
}
```



### myTasks

```json
{
  "_id": "",
  "_openid": "",
  "createTime": {
    "$date": "2024-09-13T15:24:23.264Z"
  },
  "taskDesc": "按摩十分钟",
  "taskReward": 200.0,
  "bg_color": "259deg,#FFC796 9%,#FF6B95 67%,#6c5ce7 5%",
  "taskTag": 1.0
}
```



### article

```json
{
  "_id": "",
  "_openid": "",
  "image": [
    ""
  ],
  "createTime": {
    "$date": "2024-09-05T11:59:56.726Z"
  },
  "title": "每日一照",
  "content": "今日美照"
}
```



### anniversary

```json
{
  "_id": "",
  "dayName": "恋爱纪念日",
  "dayTime": {
    "$date": "2024-05-04T10:00:00Z"
  },
  "dayColor": "45deg, #FFC0CB 0%, #FFB6C1 48%, #FF8C94 53%",
  "dayTag": 0.0
}
```

------



# 本小程序开发文档

【金山文档 | WPS云文档】 wx.uniapp云开发 -《倩影江行记》小程序开发记录文档链接：
https://kdocs.cn/l/cu2h3bQB9Vau



# 扩展功能

如果您有更多更好有趣丰富的功能请务必给我留言，众人拾柴火焰高！



# 联系方式

邮箱：lqdjl0504@163.com









