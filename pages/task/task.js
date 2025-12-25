const app = getApp()
const db = wx.cloud.database()
const outputdata = db.collection('outputdata')
Page({
  data: {
    myArr:[],////我发布的数据数组
    otArr:[],/////我接单的数据数组
    myOrOther:true,/////////显示接单或发布界面
    hasLogin:false,//是否登录
    theme:0//主题
  },
  onShow(){
    this.initLogin()
    this.initTheme()
    this.initData()
  },
  //初始化登录状态
  initLogin(){
      this.setData({hasLogin:(app.globalData.global_userStatus===2)?true:false})
  },
  //初始化页面主题函数
  initTheme(){
    this.setData({
      theme:app.globalData.global_theme,
      back_color:['#B1CADF','#BF966B'],
      tk_color:['#4682B4;','#BF966B']
    })
  },
  //初始化数据函数
  async initData(){
    await this.getData()
  },
  //获取数据函数
  getData(){
    let self = this
    return new Promise(function(resolve){
      if(self.data.hasLogin){
        if(self.data.myOrOther)
          outputdata.where({_openid:app.globalData.global_openid}).get({
            success(res){self.setData({myArr:res.data})},
            complete(){resolve()}
          })
        else  
          outputdata.where({_openid2:app.globalData.global_openid}).get({
            success(res){self.setData({otArr:res.data})},
            complete(){resolve()}
          })
      }
      else resolve()
    })
  },
  //查看接收或发布改变
  async change(e){
    var self =this
    var k =e.currentTarget.id
    if(k==='r'&&this.data.myOrOther||k==='l'&&!this.data.myOrOther){
      this.setData({myOrOther:!this.data.myOrOther})
      await self.getData()
    }
  },
  //进入lookTask查看细节
  showDetail(e){
    let index = Number(e.currentTarget.id)
    app.globalData.global_looktask = (this.data.myOrOther)?this.data.myArr[index]:this.data.otArr[index]
    wx.navigateTo({url: '/pages/lookTask/lookTask'})
  },
  //新增任务函数
  addTask(){
    wx.navigateTo({url: '/pages/addTask/addTask'})
  },
  //前往登陆页面函数
  toLogin(){
    wx.switchTab({url:'/pages/mine/mine'})
    this.tell('请先登录')
  },
  //下拉刷新
  async onPullDownRefresh() {
    wx.showLoading({})
    await this.getData()
    wx.hideLoading({})
    wx.stopPullDownRefresh()
  },
  //工具函数，告知框产生
  tell(title){
    wx.showToast({
      title: title,
      icon:'none',
      duration:600
    })
  },
})