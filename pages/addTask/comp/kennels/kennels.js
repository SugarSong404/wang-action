const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const kenneldata = db.collection('kenneldata')
Component({
  properties: {
    contents:{
      type:Array,
      value:[],
    }
  },
  data: {
    content:[],
    args:'',
    kennels:[]
  },
  observers: {
    'contents': function (val) {
        this.setData({content:val})}
  },
  methods: {
    select(){
      let kennels = app.globalData.global_userInfo.kennels
      let self = this
      kenneldata.where({
        _id:_.in(kennels)
      }).get({
        complete:res=>{
          self.setData({kennels:res.data})
        }})
    },
    delKennel(e){
      this.modal('您确定要删除吗',
      function yes(self){
        let temp = self.data.content
        temp.splice(Number(e.currentTarget.id),1)
        self.setData({content:temp})})
    },
    choose(e){
      if(this.data.content.length<2){
        let para = Number(e.currentTarget.id)
        let kennel = this.data.kennels[para]
        if(this.data.content.find(el=>el.context===kennel.context)===undefined){
        let temp=this.data.content
        temp.push(kennel)
        this.setData({
          content:temp,
        })}
        }else
          this.tell('犬舍数必须小于2')
    },
    finish(){
      this.triggerEvent('get_kennels',{kennels:this.data.content})
    },
    hide(){
      this.triggerEvent('hide')
    },
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
    tell(title){
      wx.showToast({
        title: title,
        icon:'none',
        duration:600
      })
    }
  },
  lifetimes:{
    ready:function init(){
      this.select()
    }
  }
})
