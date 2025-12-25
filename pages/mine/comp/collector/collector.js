const app = getApp()
const default_nickname = "汪汪用户"
const default_avatarUrl = "/resources/mine/defalut_head2.png"
const cloudStPath = "cloud://cloud1-4g0l9ohsd7c3aad1.636c-cloud1-4g0l9ohsd7c3aad1-1314225073/"
Component({
  properties: {},
  data: {
    nickName:default_nickname,
    avatarUrl:default_avatarUrl,
    btn_disabled:true
  },
  methods: {
    formSubmit(e){
      if(this.data.btn_disabled){
        let nick = e.detail.value['nick']
        this.setData({nickName:nick,btn_disabled:false})
        this.checkArgs(function TODO(self){
          let tmpuser = {}
          tmpuser['nickName'] = self.data.nickName
          tmpuser['avatarUrl'] = self.data.avatarUrl
          self.triggerEvent('get_user',{userInfo:tmpuser});
        })
      }
    },
    onChooseAvatar(e){
      wx.vibrateShort()
      const { avatarUrl } = e.detail 
      this.setData({avatarUrl})
    },
    hide(){
      if(this.data.btn_disabled){
        this.setData({btn_disabled:false})
        this.triggerEvent('hide');
      }
    },
    tell(title){
      wx.showToast({
        title: title,
        icon:'none',
        duration:600
      })
    },
  upPhoto(tempPath,TODO,self){
    let path="avatars/"+app.globalData.global_openid+".jpg"
    wx.cloud.uploadFile({
      cloudPath:path,
      filePath: tempPath,
      success(){
        path=cloudStPath+path
        self.setData({avatarUrl:path})
      },fail(){
        self.tell('图片上传失败')
        self.setData({avatarUrl:default_avatarUrl})
      },complete(){
        TODO(self)
      }
    })
  },
  checkArgs(TODO){
    let self = this
    console.log(this.data.avatarUrl)
    if(!this.data.nickName||this.data.nickName==="")
      this.setData({nickName:default_nickname})
    if(!this.data.avatarUrl||this.data.avatarUrl==="")
      this.setData({avatarUrl:default_avatarUrl})
    else
      if(this.data.avatarUrl!==default_avatarUrl)
        this.upPhoto(this.data.avatarUrl,TODO,self)
      else 
        TODO(this)
  }
}
})
