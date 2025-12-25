const app = getApp()
const db = wx.cloud.database()
const userdata = db.collection('userdata')
Page({
  data:{
    theme:0,//页面主题
    method: "goToError",//点击个人信息板后执行的方法
    hasUserInfo: false,//是否有用户信息
    userInfo: {},//用户信息
    isCollectorHide: true,//collector组件是否隐藏
    isPhoneHide:true,//phone组件是否隐藏
    isThemeHide:true,//theme组件是否隐藏
    //核心功能菜单
    centerList:['草稿箱','历史消息'],
    centerImg:['/resources/mine/box.png','/resources/mine/history.png'],
    centerMethod:['openbox','openhistory'],
    //其他功能菜单
    otherList:['服务中心','手机号改绑','修改个人资料'],
    otherImg:['/resources/mine/service.png','/resources/mine/phone.png','/resources/mine/info.png'],
    otherMethod:['service','modifyPhone','modifyUser'],
    //全局功能菜单
    globalList:['退出登录'],
    globalImg:['/resources/mine/exit.png'],
    globalMethod:['logout']
  },
  onShow(){
    this.initTheme()
    this.initMethod()
  },
  //初始化页面主题函数
  initTheme(){
    this.setData({
      theme:app.globalData.global_theme,
      backLogin_theme:['#B1CADF','#BF966B']
    })
  },
  //修改主题函数第一步，开启主题信息收集
  modifyTheme(){
    this.modal(
      '您要修改小程序主题吗',
        function yes(self){
          self.setData({isThemeHide:false})
        }
      )
  },
  //隐藏theme组件函数
  hideTheme(){
    this.setData({isThemeHide:true})
  },
  //接收主题信息函数
  getTheme(e){
    this.modifyTheme2(e.detail.theme)
  },
  //修改主题函数第二步，切换主题
  modifyTheme2(theme){
    wx.setStorageSync('theme', theme)
    app.globalData.global_theme = theme
    this.setData({
      theme:theme,
      isThemeHide:true
    })
  },
  //初始化登陆界面方法函数
  initMethod(){
    switch(app.globalData.global_userStatus){
      case 0:this.setData({method:'register'});break
      case 1:this.setData({method:'login'});break
      case 2:this.showUser();break
      default:this.setData({method:'goToError'})
    }
  },
  //使登录页面显示用户函数
  showUser(){
    app.globalData.global_userStatus = 2
    this.setData({
      hasUserInfo:true,
      userInfo:app.globalData.global_userInfo,
      method:'modifyTheme'})
  },
  //登录函数第一步，开启手机号验证
  login(){
    wx.vibrateShort()
    this.modal(
      '您要微信授权登录吗',
        function yes(self){
          self.setData({isPhoneHide:false})
        })
  },
  //注册函数第一步，开启手机号收集
  register(){
    wx.vibrateShort()
    this.setData({isPhoneHide:false})
  },
  //phone组件隐藏函数
  hidePhone(){
    this.setData({isPhoneHide:true})
  },
  //phone组件值接收函数
  getPhone(e){
    this.setData({tmp_phone:e.detail.phone})
    if(this.data.method==='login')
      this.login2()
    else if(this.data.method==='register')
      this.register2()
    else if(this.data.method==='modifyTheme'/*表示现在为登录状态*/)
      this.modifyPhone2()
  },
//collector组件隐藏函数
  hideCollector(e){
    this.setData({isCollectorHide:true})
  },
  //collector组件值接收函数
  getCollector(e){
    if(!this.data.hasUserInfo)
      this.register3(e)
    else 
      this.modifyUser2(e)
  },
  //注册函数第二步，结束手机号收集，开启头像昵称收集
  register2(){
    this.setData({
      isPhoneHide:true,
      isCollectorHide:false
    })
  },
  //注册函数第三步，将所有信息添加数据库，完成注册
  register3(e){
    let user = e.detail.userInfo
    let self = this
    user['_openid']=app.globalData.global_openid
    user['createtime']=new Date()
    user['kennels']=[]
    user['honest']=100
    user['phone']= this.data.tmp_phone
    user['online']=true
      userdata.add({
        data: {
          avatarUrl: user.avatarUrl,
          phone:user.phone,
          nickName: user.nickName,
          createtime:user.createtime,
          kennels:user.kennels,
          honest:user.honest,
          online:user.online
        },
        success(res){
          app.globalData.global_userInfo = user
          self.showUser()
          self.tell('注册成功')
        },fail(res){
          self.tell('注册失败')
          self.goToError()
        },
        complete(){self.setData({isCollectorHide:true})}
    })
  },
  //登录函数第二步，验证手机号正确性，完成登录
  login2(){
    if(this.data.tmp_phone===app.globalData.global_userInfo.phone){
    let self = this
    userdata.where({
      _openid:app.globalData.global_userInfo._openid
    }).update({
      data:{online:true},
      success(){
        self.showUser()
        self.tell('登录成功')
      },fail(){
        self.tell('登录失败')
        self.goToError()
      },complete(){
        self.setData({isPhoneHide:true})
      }
    })
  }else{
    this.setData({isPhoneHide:true})
    this.tell('手机号错误')
  }
  },
  //退出登录函数
  logout(){
    this.modal(
      '您确定要退出登录吗',
      function yes(self){
        userdata.where({_openid:self.data.userInfo._openid}).update({
          data:{online:false},
          success(){
            app.globalData.global_userStatus = 1
            self.setData({
              method: "login",
              hasUserInfo: false,
              userInfo: {},
            })
          },fail(){
            self.tell('退出失败')
            self.goToError()
          }
        })
      })
  },
  //打开草稿箱函数
  openbox(){
    wx.navigateTo({
      url: '/pages/mine/func/tempfilebox/tempfilebox',
    })
  },
  //打开历史交易函数
  openhistory(){
    wx.navigateTo({
      url: '/pages/mine/func/history/history',
    })
  },
  //进入服务中心函数
  service(){
    wx.navigateTo({
      url: '/pages/mine/func/serviceCenter/serviceCenter',
    })
  },
  //修改用户信息函数执行步骤1，开启collector组件
  modifyUser(){
    this.setData({isCollectorHide:false})
  },
  //修改用户信息函数执行步骤2，接收数据并修改数据库
  modifyUser2(e){
    let user = this.data.userInfo
    let self = this
    user['avatarUrl'] = e.detail.userInfo.avatarUrl
    user['nickName'] = e.detail.userInfo.nickName
    userdata.where({_openid:user._openid}).update({
        data:{
          avatarUrl:user.avatarUrl,
          nickName:user.nickName
        },
        success(){
          app.globalData.global_userInfo = user
          self.setData({userInfo:user})
          self.tell('修改成功')
        },fail(){
          self.tell('修改失败')
          self.goToError()
        },
        complete(){self.setData({isCollectorHide:true})}
      })
  },
  //手机号改绑函数步骤1，打开phone组件
  modifyPhone(){
    this.setData({isPhoneHide:false})
  },
  //手机号改绑步骤2，接收信息并修改数据库
  modifyPhone2(){
    if(this.data.tmp_phone!==app.globalData.global_userInfo.phone){
      let self = this
      userdata.where({
        _openid:app.globalData.global_userInfo._openid
      }).update({
        data:{phone:self.data.tmp_phone},
        success(){
          app.globalData.global_userInfo['phone']=self.data.tmp_phone
          console.log(app.globalData.global_userInfo.phone)
          self.setData({userInfo:app.globalData.global_userInfo})
          self.tell('改绑成功')
        },fail(){
          self.tell('改绑失败')
          self.goToError()
        },complete(){
          self.setData({isPhoneHide:true})
        }
      })
    }else{
      this.setData({isPhoneHide:true})
      this.tell('改绑前后手机号相同')
    }
  },
  //工具函数，选择框产生
  modal(title,yes){
    let self = this
    wx.showModal({
      title: title,
      content: '',
      confirmColor:"#FF8888",
      cancelColor:"#AAAAAA",
      cancelText:'取消',
      confirmText:'确定',
      success(res){if(res.confirm)yes(self)}})
  },
  //工具函数，告知框产生
  tell(title){
    wx.showToast({
      title: title,
      icon:'none',
      duration:600
    })
  },
  //跳到错误页面
  goToError(){
    wx.navigateTo({
      url: '/pages/error/error',
    })
  },  
})