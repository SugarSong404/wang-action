const app = getApp()
Component({
  properties: {},
  data: {
    themeList:['#B1CADF','#BF966B'],
    theme:0,
    btn_disabled:true
  },
  methods: {
    chooseIt(e){
      this.setData({theme:Number(e.currentTarget.id)})
    },
    hide(){
      if(this.data.btn_disabled){
        this.setData({btn_disabled:false})
        this.triggerEvent('hide');
      }
    },
    submitTheme(){
      if(this.data.btn_disabled){
        this.setData({btn_disabled:false})
        this.triggerEvent('get_theme',{theme:this.data.theme})
      }
    }
  }
})
