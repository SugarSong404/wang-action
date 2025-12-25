const app = getApp()
const db = wx.cloud.database()
const userdata = db.collection('userdata')
const outputdata = db.collection('outputdata')
const cloudPath = 'cloud://cloud1-4g0l9ohsd7c3aad1.636c-cloud1-4g0l9ohsd7c3aad1-1314225073/'
const default_user = {avatarUrl:'/resources/mine/defalut_head2.png',nickName:'汪汪用户'}
Page({
  data: {
    down_id:'',//该单号的id
    down_quick:false,//是否加急
    down_path:[],//媒体路径
    down_path_cover:[],//媒体封面路径
    down_text:'',//任务内容
    down_tags:[],//标签
    down_kennels:[],//犬舍
    down_deadline:0,//截止时间
    down_date:0,//发布时间
    down_date2:0,//接收时间
    down_openid:'',//发送者openid
    down_openid2:'',//接收者openid
    down_moneyB:'',//赏金的整数部分
    down_moneyS:'',//赏金的小数部分
    format_deadline:'',//截止时间标准化时间戳
    current_openid:'',//当前openid
    userGet1:{},//发布用户
    userGet2:{},//接收用户
    task_img:'',//执行任务图样
    task_txt:'',//执行任务文本
    task_method:'',//执行任务函数
    isChoiceHide:true//choice组件是否显示
  },
  onShow(){
    this.initStatus()
    this.initTheme()
    this.initData()
  },
  //初始化页面主题函数
  initTheme(){
    this.setData({
      theme:app.globalData.global_theme,
      tk_theme:['#4682B4;','#BF966B']
    })
  },
  //初始化页面访问函数
  initStatus(){
    if(app.globalData.global_userStatus!==2){
      wx.switchTab({url:'/pages/mine/mine'})
      this.tell('请先登录')
    }
  },
  //初始化页面展示数据
  async initData(){
    let temp = app.globalData.global_looktask
    app.globalData.global_looktask = {}
    if(JSON.stringify(temp)!=='{}'){
      let f_deadline= this.getTime(new Date(temp.deadline))
      this.setData({
        down_id:temp._id,
        down_quick:temp.quick,
        down_path:temp.path,
        down_path_cover:temp.path_cover,
        down_text:temp.text,
        down_tags:temp.tags,
        down_kennels:temp.kennels,
        down_deadline:temp.deadline,
        down_date:temp.date,
        down_date2:temp.date2,
        down_openid:temp._openid,
        down_openid2:temp._openid2,
        down_moneyB:temp.moneyB,
        down_moneyS:temp.moneyS,
        format_deadline:f_deadline,
        current_openid:app.globalData.global_openid
      })
      this.setData({
        userGet1:await this.getUser(this.data.down_openid),
        userGet2:await this.getUser(this.data.down_openid2),
      })
    }
  },
  //根据openid获取用户信息
  getUser(openid){
    return new Promise(function(resolve,reject){
      if(!openid||openid==='')
        resolve(default_user)
      else
        userdata.where({_openid:openid}).get({
          success(res){resolve(res.data[0])},
          fail(res){resolve(default_user)}
        })
    })
  },
  //大图预览此媒体
  showBig(e){
    let source = [{url:cloudPath+this.data.down_path[0],poster:cloudPath+this.data.down_path_cover[0],type:(this.data.down_path_cover[0]==='')?'image':'video'}]
    if(this.data.down_path.length===2)
      source.push({url:cloudPath+this.data.down_path[1],poster:cloudPath+this.data.down_path_cover[1],type:(this.data.down_path_cover[1]==='')?'image':'video'})
    wx.previewMedia({
      current:Number(e.currentTarget.id),
      sources:source
    })
  },
  //返回函数
  back(){
    wx.navigateBack()
  },
  //打开或关闭任务组件
  openChoice(){
    this.setData({isChoiceHide:!this.data.isChoiceHide})
  },
  //获取需要执行的任务并前往执行
  async getChoice(e){
    let self = this
    let method = e.detail.method
    switch(method){
      case 1:{self.out_confirm();break;}
      case 2:{await self.out_withdrew();break;}
      case 3:{self.get_confirm();break;}
      case 4:{await self.get_withdrew();break;}
    }
    this.setData({isChoiceHide:false})
  },
  //发布者确认完成
  out_confirm(){
    console.log(1)
  },
  //发布者撤回
  out_withdrew(){
    let self = this
    return new Promise(resolve=>{
      self.modal(
        '你确定要撤回吗',
        function yes(self){
          outputdata.doc(self.data.down_id).remove({
            success(){
              wx.navigateBack()
              self.tell('撤回成功')
            },fail(){self.tell('撤回失败')},
            complete(){resolve()}
          })
        }
      )
    })
  },
  //接收者确认完成
  get_confirm(){
    console.log(3)
  },
  //接收者逃跑
  get_withdrew(){
    let self = this
    return new Promise(resolve=>{
      self.modal('你确定要逃跑吗',
      function yes(self){
          wx.cloud.callFunction({
            name:"updateOut",
            data:{
              _id:self.data.down_id,
              choice:2//清空该id的_openid2与date2
            },success(){
              wx.navigateBack()
              self.tell('逃跑成功')
            },fail(){'逃跑失败'},
            complete(){resolve()}
          })
      })
    })
  },
  //接单函数
  getTask(){
    let self = this
    outputdata.where({
      _id:self.data.down_id,
      _openid2:''
    }).get({
      success(res){
        if(res.data.length!==0){
          outputdata.where({_openid2:self.data.current_openid}).get({
            success(res){
              if(res.data.length<5){
                wx.cloud.callFunction({
                  name:"updateOut",
                  data:{
                    _id:self.data.down_id,//修改openid2与date2
                    choice:1
                  },
                  success(){
                    wx.navigateBack()
                    self.tell('接单成功')
                  },fail(){self.tell('接单失败')}
              })
              }else self.tell('接单数量不能超过5')
            },fail(){self.tell('接单失败')}
          })
        }else self.tell('这单已经有人接了')
      },fail(){self.tell('接单失败')}
    })
  },
  //工具函数，格式化时间戳
  getTime:function(n){
    var time = n
    var Mday=new Date(time.getFullYear(),time.getMonth()+1,0).getDate();
    let y = time.getFullYear() 
    let m = time.getMonth() + 1 
    let d = time.getDate()
    let h = time.getHours() 
    let mm = time.getMinutes() 
    if(h>23){h=h-24;d=d+1;if(d>Mday){d=1;m=m+1;if(m==13){m=1;y+1}}}
    m = m < 10 ? ('0' + m) : m;d = d < 10 ? ('0' + d) : d;h=h < 10 ? ('0' + h) : h;mm = mm < 10 ? ('0' + mm) : mm;
    return (y+'/'+m+'/'+d+'  '+h+':'+mm)
  },
  //工具函数，告知框产生
  tell(title){
    wx.showToast({
      title: title,
      icon:'none',
      duration:600
    })
  },
  //工具函数，选择框产生
  modal(title,yes){
    let self = this
    let no = arguments[2]
    wx.showModal({
      title: title,
      content: '',
      confirmColor:"#FF8888",
      cancelColor:"#AAAAAA",
      cancelText:'取消',
      confirmText:'确定',
      success(res){
        if(res.confirm)yes(self)
        else if(no)no()}})
  },
})