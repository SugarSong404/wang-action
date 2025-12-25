// mine/contact/contact.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    nickNames:['雨臣の戏','lgyyyyyyy','江祁'],
    vx:['Yvchen_xi0220','lgychee','zhengxiaoyizuishuai']
  },

  /**
   * 组件的方法列表
   */
  methods: {
    back(){
      wx.navigateBack()
    },
    copy(e){
      var self=this
      var i =Number(e.currentTarget.id)
      wx.setClipboardData({
        data: self.data.vx[i],
        success(res){
          wx.showToast({
            title: '复制微信号成功',
            icon:'none',
            duration:600
          })
        },fail(res){
          wx.showToast({
            title: '复制微信号失败',
            icon:'none',
            duration:600
          })
        }
      })
    }
  }
})
