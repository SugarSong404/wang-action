const app = getApp()
const db = wx.cloud.database()
const outputdata = db.collection('outputdata')
Page({
  data: {
    arr:[],//显示的任务列表
    userInfo:{},//当前用户信息
    hasUserInfo:false,//有无用户信息
    args:{},//搜索参数
    theme:0,//主题
  },
  onShow(){
    this.initLogin()
    this.initTheme()
    this.initData()
  },
  //初始化页面主题函数
  initTheme(){
    this.setData({
      theme:app.globalData.global_theme,
      back_color:['#B1CADF','#BF966B'],
      tk_color:['#4682B4;','#BF966B']
    })
  },
  //初始化登录状态
  initLogin(){
    if(app.globalData.global_userStatus===2)
      this.setData({
        userInfo:app.globalData.global_userInfo,
        hasUserInfo:true
      })
    else
      this.setData({
        userInfo:{},
        hasUserInfo:false
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
      outputdata.where({_openid2:''}).where(self.data.args).get({
        success(res){
          self.setData({arr:res.data})
        },
        complete(){resolve()}
      })
    })
  },
  //进入lookTask查看细节
  showDetail(e){
    let index = Number(e.currentTarget.id)
    app.globalData.global_looktask = this.data.arr[index]
    wx.navigateTo({url: '/pages/lookTask/lookTask'})
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