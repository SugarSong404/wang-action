const app = getApp()
const db = wx.cloud.database()
const moneyArr = [["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64","65","66","67","68","69","70","71","72","73","74","75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100","101","102","103","104","105","106","107","108","109","110","111","112","113","114","115","116","117","118","119","120","121","122","123","124","125","126","127","128","129","130","131","132","133","134","135","136","137","138","139","140","141","142","143","144","145","146","147","148","149","150","151","152","153","154","155","156","157","158","159","160","161","162","163","164","165","166","167","168","169","170","171","172","173","174","175","176","177","178","179","180","181","182","183","184","185","186","187","188","189","190","191","192","193","194","195","196","197","198","199","200"],[".00",".01",".02",".03",".04",".05",".06",".07",".08",".09",".10",".11",".12",".13",".14",".15",".16",".17",".18",".19",".20",".21",".22",".23",".24",".25",".26",".27",".28",".29",".30",".31",".32",".33",".34",".35",".36",".37",".38",".39",".40",".41",".42",".43",".44",".45",".46",".47",".48",".49",".50",".51",".52",".53",".54",".55",".56",".57",".58",".59",".60",".61",".62",".63",".64",".65",".66",".67",".68",".69",".70",".71",".72",".73",".74",".75",".76",".77",".78",".79",".80",".81",".82",".83",".84",".85",".86",".87",".88",".89",".90",".91",".92",".93",".94",".95",".96",".97",".98",".99"]]
Page({
  data: {
    file:[],
    theme:0,
    isHelp:false
  },
  onShow(){
    this.initStatus()
    this.initTheme()
    this.setData({files:wx.getStorageSync('tempFileList')})
  },
  initTheme(){
    this.setData({
      theme:app.globalData.global_theme,
      backcolor_theme:['#B1CADF','#BF966B']
    })
  },
  initStatus(){
    if(app.globalData.global_userStatus!==2){
      wx.switchTab({url:'/pages/mine/mine'})
      this.tell('请先登录')
    }
  },
  async chooseFile(e){
    let temp = this.data.files[Number(e.currentTarget.id)]
    if(await this.checkFile(temp)){
      app.globalData.global_tempfile = temp
      wx.navigateTo({url: '/pages/addTask/addTask'})
    }else{
      let tempfile_list = wx.getStorageSync('tempFileList')
      tempfile_list.splice(Number(e.currentTarget.id),1)
      wx.setStorageSync('tempFileList', tempfile_list)
      this.setData({files:tempfile_list})
      this.tell('已删除不合理的草稿')
    }
  },
  checkFile(temp){
    return new Promise(async function(resolve){
      let flag = true
      if(typeof(temp.up_text)!=='string'||temp.up_text.length>900)
        flag=false
      else if(typeof(temp.up_moneyB)!=='string'||moneyArr[0].indexOf(temp.up_moneyB)===-1)
        flag = false
      else if(typeof(temp.up_moneyS)!=='string'||moneyArr[1].indexOf(temp.up_moneyS)===-1)
        flag = false
      else if(typeof(temp.up_quick)!=='boolean')
        flag = false
      else if(typeof(temp.remain)!=='number'||temp.remain>90300000||temp.remain<0)
        flag = false
      resolve(flag)
    })
  },
  back(){
    wx.navigateBack()
  },
  delFile(e){
    this.modal('确定要删除吗',
    function yes(self){
      let index = Number(e.currentTarget.id)
      let tempfile_list = wx.getStorageSync('tempFileList')
      tempfile_list.splice(index,1)
      wx.setStorageSync('tempFileList', tempfile_list)
      self.setData({files:tempfile_list})
    })
  },
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
  tell(title){
    wx.showToast({
      title: title,
      icon:'none',
      duration:600
    })
  },
  showHelp(){
    this.setData({isHelp:!this.data.isHelp})
  }
})