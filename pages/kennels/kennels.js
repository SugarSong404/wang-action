const app = getApp()
Page({
  data: {
    choices:['发现犬舍','我的犬舍'],
    choiceOrder:0,
    kennels:[  {
      name: "浙江工业大学屏峰校区教学楼",
      task: 8965,
      complain: 234,
      condition: true,
      src: "/resources/kennels/test.jpg"
    },
    {
      name: "浙江工业大学朝晖尚德园",
      task: 8723,
      complain: 218,
      condition: false,
      src: "/resources/kennels/test.jpg"
    },
    {
      name: "浙江工业大学屏峰校区家和西苑",
      task: 7654,
      complain: 196,
      condition: false,
      src: "/resources/kennels/test.jpg"
    },
    {
      name: "浙江工业大学屏峰校区家和东苑",
      task: 7890,
      complain: 189,
      condition: true,
      src: "/resources/kennels/test.jpg"
    },
    {
      name: "浙江工业大学朝晖梦溪村",
      task: 8234,
      complain: 205,
      condition: true,
      src: "/resources/kennels/test.jpg"
    },
    {
      name: "浙江工业大学莫干山校区",
      task: 7567,
      complain: 176,
      condition: false,
      src: "/resources/kennels/test.jpg"
    },
    {
      name: "浙江工业大学之江学院",
      task: 6987,
      complain: 156,
      condition: true,
      src: "/resources/kennels/test.jpg"
    },
    {
      name: "浙江工业大学屏峰校区学院教学楼",
      task: 7234,
      complain: 168,
      condition: true,
      src: "/resources/kennels/test.jpg"
    },
    {
      name: "浙工大图书馆",
      task: 6890,
      complain: 145,
      condition: false,
      src: "/resources/kennels/test.jpg"
    }],
    theme:0
  },
  onShow(){
    this.initTheme()
  },
  //初始化页面主题函数
  initTheme(){
    this.setData({
      theme:app.globalData.global_theme,
      back_color:['#B1CADF','#BF966B'],
    })
  },
  //切换板块
  change(e){
    let index = Number(e.currentTarget.id)
    this.setData({choiceOrder:index})
  }
  //
})