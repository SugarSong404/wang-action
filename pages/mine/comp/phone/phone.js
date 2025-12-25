// pages/mine/phone/phone.js
Component({
  properties: {
    phoneTypes:{
      type:String,
      value:'获取',
    }
  },
  data: {
    phone:"点击此处获取",
    btn_disabled:true,
    phoneType:'获取'
  },
  observers: {
    'phoneTypes': function (val) {
        this.setData({
          phoneType:val
        })
      }},
  methods: {
    async getPhoneNumber(e){
      if (e.detail.errMsg === "getPhoneNumber:ok"){
          const result = await wx.cloud.callFunction({
              name: 'getPhoneNumber',
              data: {
                  type:'getPhoneNumber',
                  id:wx.cloud.CloudID(e.detail.cloudID)
              }
          })
          this.setData({phone:result.id.data.phoneNumber})
        }
          else 
            this.tell('获取失败')
    },
    submitPhone(){
      this.setData({phone:'xxxxxxxxxxx'})//由于没有认证，所以只能直接写死赋值调试
      if(this.data.btn_disabled){
        if(this.data.phone===""||this.data.phone==="点击此处获取")
          this.tell('还未获取手机号')
        else{
          this.setData({btn_disabled:false})
          this.triggerEvent('get_phone',{phone:this.data.phone})
        }
      }
    },
    hide(){
      if(this.data.btn_disabled){
        this.setData({btn_disabled:false})
        this.triggerEvent('hide');
      }
    },
    tell(title){
      wx.showToast({
        title,
        icon:"none",
        duration:600
      })
    }
  }
})
