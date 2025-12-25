const db = wx.cloud.database()
const tagdata = db.collection('tagdata')
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
    tags:[]
  },
  observers: {
    'contents': function (val) {
        this.setData({content:val})}
  },
  methods: {
    select(){
      let self = this
      tagdata.where({
          context: {
          $regex:'.*' + self.data.args + '.*',
          $options:'i'
        }
      }).get({
        complete:res=>{
          self.setData({tags:res.data})
        }})
    },
    input(e){
      this.setData({
        args:e.detail.value
      })
      this.select()
    },
    delTag(e){
      this.modal('您确定要删除吗',
      function yes(self){
        let temp = self.data.content
        temp.splice(Number(e.currentTarget.id),1)
        self.setData({content:temp})})
    },
    choose(e){
      if(this.data.content.length<3){
        let para = Number(e.currentTarget.id)
        let tag = this.data.tags[para]
        if(this.data.content.find(el=>el.context===tag.context)===undefined){
        let temp=this.data.content
        temp.push(tag)
        this.setData({
          content:temp,
        })}
        }else
          this.tell('标签数必须小于3')
    },
    finish(){
      this.triggerEvent('get_tags',{tags:this.data.content})
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
