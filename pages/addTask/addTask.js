const app = getApp()
const db = wx.cloud.database()
const outputdata = db.collection('outputdata')
const cloudStPath = "cloud://wang-user-3g88vo8a67000017.7761-wang-user-3g88vo8a67000017-1314225073/"
Page({
  data: {
    up_path:[],//媒体文件路径
    up_path_cover:[],//媒体文件封面路径
    up_quick:false,//是否加急
    up_moneyB:'0',//赏金的大写部分
    up_moneyS:'.00',//赏金的小写部分
    up_text:'',//任务文本部分
    up_tags:[],//标签部分
    up_kennels:[],//犬舍部分
    up_date:[],//发布时间
    remain:0,//期限
    timeShow:"设置期限",//期限的中文显示
    moneyShow:"设置赏金",//赏金的中文显示
    isTagHide:true,//tag组件是否隐藏
    isKennelHide:true,//犬舍组件是否隐藏
    theme:0,//页面主题
    show_path:[],//显示的图片路径
    show_path_cover:[],//显示的图片路径封面
    btn_disabled:true,//发布函数防抖
    moneyArr:[["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64","65","66","67","68","69","70","71","72","73","74","75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100","101","102","103","104","105","106","107","108","109","110","111","112","113","114","115","116","117","118","119","120","121","122","123","124","125","126","127","128","129","130","131","132","133","134","135","136","137","138","139","140","141","142","143","144","145","146","147","148","149","150","151","152","153","154","155","156","157","158","159","160","161","162","163","164","165","166","167","168","169","170","171","172","173","174","175","176","177","178","179","180","181","182","183","184","185","186","187","188","189","190","191","192","193","194","195","196","197","198","199","200"],[".00",".01",".02",".03",".04",".05",".06",".07",".08",".09",".10",".11",".12",".13",".14",".15",".16",".17",".18",".19",".20",".21",".22",".23",".24",".25",".26",".27",".28",".29",".30",".31",".32",".33",".34",".35",".36",".37",".38",".39",".40",".41",".42",".43",".44",".45",".46",".47",".48",".49",".50",".51",".52",".53",".54",".55",".56",".57",".58",".59",".60",".61",".62",".63",".64",".65",".66",".67",".68",".69",".70",".71",".72",".73",".74",".75",".76",".77",".78",".79",".80",".81",".82",".83",".84",".85",".86",".87",".88",".89",".90",".91",".92",".93",".94",".95",".96",".97",".98",".99"]],//赏金列表
    timeArr:[["0天","1天","2天","3天","4天","5天","6天","7天","8天","9天","10天","11天","12天","13天","14天","15天","16天","17天","18天","19天","20天","21天","22天","23天","24天","25天","26天","27天","28天"],["0小时","1小时","2小时","3小时","4小时","5小时","6小时","7小时","8小时","9小时","10小时","11小时","12小时","13小时","14小时","15小时","16小时","17小时","18小时","19小时","20小时","21小时","22小时","23小时"],["0分钟","5分钟","10分钟","15分钟","20分钟","25分钟","30分钟","35分钟","40分钟","45分钟","50分钟","55分钟"]]//期限列表
  },
  onShow(){
    this.initStatus()
    this.initTheme()
    this.initTempFile()
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
  //载入草稿箱数据
  initTempFile(){
    let temp = app.globalData.global_tempfile
    app.globalData.global_tempfile = {}
    if(JSON.stringify(temp) !== "{}"){
      this.setData({
        up_quick:temp.up_quick,
        up_moneyB:temp.up_moneyB,
        up_moneyS:temp.up_moneyS,
        up_text:temp.up_text,
        remain:temp.remain,
        timeShow:temp.timeShow,
        moneyShow:temp.moneyShow,
        show_path:temp.show_path,
        show_path_cover:temp.show_path_cover
      })
    }
  },
  //选择图片文件并保存临时路径
  choosePhoto(){
    let self = this
    let temp_path = this.data.show_path
    let temp_pathCover = this.data.show_path_cover
    wx.chooseMedia({
      count: 2-temp_path.length,           
      sizeType: ['compressed'],  
      mediaType:['mix'],
      sourceType: ['album', 'camera'],   
      success: function (res) {
        temp_path.push(res.tempFiles[0].tempFilePath)
        temp_pathCover.push((res.tempFiles[0].fileType==='video')?res.tempFiles[0].thumbTempFilePath:'')
        if(res.tempFiles[1]){
          temp_path.push(res.tempFiles[1].tempFilePath)
          temp_pathCover.push((res.tempFiles[1].fileType==='video')?res.tempFiles[1].thumbTempFilePath:'')
        }
        self.setData({
          show_path:temp_path,
          show_path_cover:temp_pathCover
        })
      },fail(){
        self.tell('选取图片失败')
      }
    })
  },
  //分布上传临时路径图片至云存储
  upPhoto(pathname,path){
    let self = this
    return new Promise(function(resolve,reject){
      if(path&&path!==''){
        let cloudPath = "userPhoto/" +app.globalData.global_openid+"/"+self.data.up_date+"/"+pathname+"."+path.replace(/.+\./,"");
        wx.cloud.uploadFile({
          cloudPath:cloudPath,
          filePath: path,
          success:resolve(cloudPath),
          fail:resolve('')
       })
      }else resolve('')
    })
  },
 //整体云存储路径分配
  upAllPhoto(){
  let self = this
  return new Promise(async function(resolve){
    let paths = []
    let path_covers = []
    paths.push(await self.upPhoto('path1',self.data.show_path[0]))
    paths.push(await self.upPhoto('path2',self.data.show_path[1]))
    path_covers.push(await self.upPhoto('path_cover1',self.data.show_path_cover[0]))
    path_covers.push(await self.upPhoto('path_cover2',self.data.show_path_cover[1]))
    self.setData({
      up_path:paths,
      up_path_cover:path_covers
    })
    resolve()
  })
  },
  //大图预览此媒体
  showBig(e){
    let source = [{url:this.data.show_path[0],poster:this.data.show_path_cover[0],type:(this.data.show_path_cover[0]==='')?'image':'video'}]
    if(this.data.show_path.length===2)
      source.push({url:this.data.show_path[1],poster:this.data.show_path_cover[1],type:(this.data.show_path_cover[1]==='')?'image':'video'})
    wx.previewMedia({
      current:Number(e.currentTarget.id),
      sources:source
    })
  },
  //删除此媒体
  delPhoto(e){
    this.modal('您确定要删除吗',function yes(self){
      let temp_path = self.data.show_path
      let temp_path_cover = self.data.show_path_cover
      let index = Number(e.currentTarget.id)
      temp_path.splice(index,1)
      temp_path_cover.splice(index,1)
      self.setData({
        show_path:temp_path,
        show_path_cover:temp_path_cover
      })
    })
  },
  //是否加急信息获取
  quick(e){
    this.setData({
      up_quick:e.detail.value
    })
  },
  //任务文本信息获取
  inputText(e){
    this.setData({
      up_text:e.detail.value
    })
  },
  //赏金获取
  moneyCha(e){
    let moneyB = this.data.moneyArr[0][e.detail.value[0]]
    let moneyS = this.data.moneyArr[1][e.detail.value[1]]
    let moneyShow = (moneyB==='0'&&moneyS==='.00')?'设置赏金':('赏金:￥'+moneyB+moneyS)
    this.setData({
      up_moneyB:moneyB,
      up_moneyS:moneyS,
      moneyShow:moneyShow})
  },
  //期限获取
  timeCha(e){
    var t1=this.data.timeArr[0][e.detail.value[0]]
    var t2=this.data.timeArr[1][e.detail.value[1]]
    var t3=this.data.timeArr[2][e.detail.value[2]]
    let prefix = (t1==="0天"&&t2==="0小时"&&t3==="0分钟")?'':'期限:'
    let suffix = (prefix==='')?'设置期限':''
    this.setData({
      timeShow:prefix+(t1==="0天"?'':t1)+(t2==="0小时"?'':t2)+(t3==="0分钟"?'':t3)+suffix,
      remain:(e.detail.value[0]*24*60+e.detail.value[1]*60+(e.detail.value[2])*5)*60000
    })
  },
  //设置标签函数1，开启标签收集组件
  setTag(){
    this.setData({isTagHide:false})
  },
  //设置标签函数2，接收标签收集组件
  setTag2(e){
    this.setData({
      up_tags:e.detail.tags,
      isTagHide:true
    })
  },
  //隐藏标签收集组件
  hideTag(){
    this.setData({isTagHide:true})
  },
  //设置标签函数1，开启标签收集组件
  setTag(){
    this.setData({isTagHide:false})
  },
  //设置标签函数2，接收标签收集组件
  setTag2(e){
    this.setData({
      up_tags:e.detail.tags,
      isTagHide:true
    })
  },
  //隐藏犬舍收集组件
  hideKennel(){
    this.setData({isKennelHide:true})
  },
  //设置犬舍函数第1步，开启犬舍收集组件
  setKennel(){
    this.setData({isKennelHide:false})
  },
  //设置犬舍函数第2步，接收犬舍收集组件
  setKennel2(e){
    this.setData({
      up_kennels:e.detail.kennels,
      isKennelHide:true
    })
  },
  //删除此标签
  delTag(e){
    this.modal('您确定要删除吗',
    function yes(self){
      let temp = self.data.up_tags
      temp.splice(Number(e.currentTarget.id),1)
      self.setData({up_tags:temp})})
  },
  //删除此犬舍
  delKennel(e){
    this.modal('您确定要删除吗',
    function yes(self){
      let temp = self.data.up_kennels
      temp.splice(Number(e.currentTarget.id),1)
      self.setData({up_kennels:temp})})
  },
  //检查后发布任务
  outputTask(){
  if(this.data.btn_disabled){
    let self = this
    if(this.data.up_text==='')
      this.tell('文本不能为空')
    else
      if(this.data.remain<300000)
        this.tell('最短期限为5分钟')
      else{
        outputdata.where({_openid:app.globalData.global_openid}).get({
          success(res){
            if(res.data.length<5){
              self.output()
            }else{
              self.tell('最多发布五项任务')
            }
          }
        })
      }}
  },
  //发布任务执行函数
  async output(){
    let self = this
    this.setData({
      up_date:new Date().getTime(),
      btn_disabled:false
    })
    await this.upAllPhoto()
    outputdata.add({
      data:{
        _openid2:'',
        tags:self.data.up_tags,
        kennels:self.data.up_kennels,
        date:self.data.up_date,
        date2:0,
        deadline:self.data.up_date+self.data.remain,
        moneyB:self.data.up_moneyB,
        moneyS:self.data.up_moneyS,
        quick:self.data.up_quick,
        path:self.data.up_path,
        path_cover:self.data.up_path_cover,
        text:self.data.up_text,
      },success(){
        wx.navigateBack()
        self.tell('发布成功')
      },fail(){
        self.tell('发布成功')
        self.setData({btn_disabled:true})
      }
    })
  },
  //返回上一界面,判断是否存入草稿
  back(){
    this.modal('是否保存到草稿箱',
    function yes(self){
      let temp = self.data
      let data = {
        up_quick:temp.up_quick,
        up_moneyB:temp.up_moneyB,
        up_moneyS:temp.up_moneyS,
        up_text:temp.up_text,
        remain:temp.remain,
        timeShow:temp.timeShow,
        moneyShow:temp.moneyShow,
        show_path:temp.show_path,
        show_path_cover:temp.show_path_cover
      }
      data['saveTime'] = self.getTime(new Date())
      let tempfile_list = wx.getStorageSync('tempFileList')
      if(!tempfile_list)tempfile_list=[]
      tempfile_list.unshift(data)
      wx.setStorageSync('tempFileList',tempfile_list)
      wx.navigateBack()
    },function no(){wx.navigateBack()})
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
  //工具函数，告知框产生
  tell(title){
    wx.showToast({
      title: title,
      icon:'none',
      duration:600
    })
  },
  //工具函数，格式化时间戳
  getTime:function(n){
    var time = n
    let Mday=new Date(time.getFullYear(),time.getMonth()+1,0).getDate();
    let y = time.getFullYear() 
    let m = time.getMonth() + 1 
    let d = time.getDate()
    let h = time.getHours() 
    let mm = time.getMinutes() 
    if(h>23){h=h-24;d=d+1;if(d>Mday){d=1;m=m+1;if(m==13){m=1;y+1}}}
    m = m < 10 ? ('0' + m) : m;d = d < 10 ? ('0' + d) : d;h=h < 10 ? ('0' + h) : h;mm = mm < 10 ? ('0' + mm) : mm;
    return (y+'/'+m+'/'+d+'  '+h+':'+mm)
  },
})