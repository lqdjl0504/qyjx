// pages/test/test.js
let canvas = null
Page({
 
    /**
     * 页面的初始数据
     */
    data: {
        bubbles : [], // 存储气泡信息的数组
        speedOffset: 1, //加速偏移量
        totalBubblesNum: 200, //设置气泡数量200个
    },
    canvansDraw(){
        const query = wx.createSelectorQuery();
        query.select('#bubbleCanvas').node().exec((res) => {
            // 获取设备窗口的宽高
            const sysInfo = wx.getSystemInfoSync();
            const screenWidth = sysInfo.windowWidth;
            const screenHeight = sysInfo.windowHeight;
 
            // 计算Canvas的实际宽高
            const canvasWidth = screenWidth;
            const canvasHeight = screenHeight;
 
            canvas = res[0].node;
            // 设置Canvas的宽高属性
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            
            const ctx = canvas.getContext('2d');
        
            var bubbles =[];
            let numBubbles = 3
 
            if(this.data.bubbles.length != 0){
                numBubbles = this.data.bubbles.length
            }
        
            // 初始化气泡信息
            for (let i = 0; i < numBubbles; i++) {
                bubbles.push({
                    x: Math.random() * canvas.width, // x坐标
                    y: Math.random() * canvas.height/5 + canvas.height, // y坐标
                    radius: canvasWidth * 0.1 , // 半径
                    speed: Math.random() * 0.2  + 0.3  * this.data.speedOffset , // 速度
                    color: `rgba(46, 204, 113, 0.3)` // 颜色，绿色透明
                });
            }
 
            this.setData({
                bubbles:bubbles,
                bubblesRadius:canvasWidth * 0.1,
            })
        
            // 绘制气泡
            const drawBubbles = () => {
                if(canvas){
                    ctx.clearRect(0, 0, canvasWidth, canvasHeight); // 清除画布
                    for (let i = 0; i < numBubbles; i++) {
                        if(this.data.bubbles[i]==null){
                            this.data.bubbles[i]={
                                x: Math.random() * canvas.width, // x坐标
                                y: canvas.height + canvasWidth * 0.1, // y坐标
                                radius: canvasWidth * 0.1 , // 半径
                                speed: Math.random() * 0.2 + 0.3 * this.data.speedOffset , // 速度
                                color: `rgba(46, 204, 113, 0.3)` // 颜色，绿色透明
                            };
                        }
                        ctx.beginPath();
                        ctx.arc(this.data.bubbles[i].x, this.data.bubbles[i].y, this.data.bubbles[i].radius, 0, Math.PI * 2);
                        ctx.fillStyle = this.data.bubbles[i].color;
                        ctx.fill();
                        ctx.strokeStyle = 'rgba(46, 204, 113, 0.8)'; // 设置描边颜色为黑色
                        ctx.lineWidth = 1; // 设置描边线宽
                        ctx.stroke(); // 绘制描边
                        ctx.closePath();
                        // 更新气泡位置
                        this.data.bubbles[i].y -= this.data.bubbles[i].speed;
                
                        // 如果气泡超出画布顶部，重新放置到底部
                        if (this.data.bubbles[i].y <- this.data.bubbles[i].radius) {
                            this.data.bubbles[i].x = Math.random() * canvas.width;
                            this.data.bubbles[i].y = canvas.height + this.data.bubbles[i].radius;
                        }
                    }
                    canvas.requestAnimationFrame(drawBubbles); // 使用requestAnimationFrame进行动画循环
                }
            };
            drawBubbles(); // 开始绘制气泡
        });
    },
    click(e){
            for(var i in this.data.bubbles){
                if(this.data.bubbles.length != 0){
                    const distance = Math.sqrt(Math.pow(e.detail.x - this.data.bubbles[i].x, 2) + Math.pow((e.detail.y - this.data.bubbles[i].speed*2) - this.data.bubbles[i].y, 2));
                    // 判断点击位置是否在圆范围内
                    if (distance <= this.data.bubblesRadius+this.data.speedOffset) {
                        // 在圆范围内的操作
                        this.data.bubbles[i] = null
                        // 每点破一个，则速度偏移量+0.5
                        this.setData({
                            speedOffset : this.data.speedOffset + 0.9,
                            totalBubblesNum: this.data.totalBubblesNum - 1
                        })
                        if(this.data.totalBubblesNum <= 0 ){
                            wx.showToast({
                            title: '已点完'
                            })
                            this.setData({
                                bubbles : [],
                                visible : true
                            })
                        }
                    } 
                }else{
                    canvas = null
                }
            }
    },
 
    again(){
        // 重制初始化设置
        this.setData({
            visible : false,
            totalBubblesNum: 200,
            speedOffset: 1
        })
        this.canvansDraw()
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
 
    },
 
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        this.canvansDraw()
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