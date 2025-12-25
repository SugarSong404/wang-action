App({
  globalData:{
    global_userStatus: -1,
    global_userInfo: {},
    global_theme: 0,
    global_openid:'',
    global_tempfile:{},
    global_looktask:{},
  },
  onLaunch(){
    wx.cloud.init({
      env: 'cloud1-4g0l9ohsd7c3aad1',
      traceUser: true,
  })  
    this.initTheme()
    this.initUserStatus()
  },
  initTheme(){
    let themeList = [0,1]
    let temp = wx.getStorageSync('theme')
    if(temp&&themeList.indexOf(temp)!==-1)
      this.globalData.global_theme = temp
  },
  initUserStatus(){
    this.getOpenId(function TODO(openid,self){
      self.getUserInfo(openid,function TODO2(res,self2){
        console.log(res)
        if(res.data.length===0)
          self2.globalData.global_userStatus = 0 // wait_register
        else{
          self2.globalData.global_userInfo = res.data[0]
          if(res.data[0].online)
            self2.globalData.global_userStatus = 2 // online
          else
            self2.globalData.global_userStatus = 1 // wait_login
        }
      console.log("... the status is "+self2.globalData.global_userStatus+" ...")
      wx.switchTab({url:'/pages/square/square'})
      })
    })
  },
  getOpenId(TODO){
    let self = this
    wx.cloud.callFunction({
      name: 'getOpenID',
      complete: res => {
        let openid = res.result.event.userInfo.openId
        self.globalData.global_openid = openid
        TODO(openid,self)
      }
    })
  },
  getUserInfo(openid,TODO2){
    let self = this
    let userdata = wx.cloud.database().collection('userdata')
    userdata.where({_openid:openid}).get({
      success(res){TODO2(res,self)},
      fail(){self.goToError()}
    })
  }
})
