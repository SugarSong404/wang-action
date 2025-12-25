
const out = {    
  taskTxt:['确认','撤回'],
  taskImg:['/resources/lookTask/finish.png','/resources/lookTask/withdrew.png'],
  taskMethod:[1,2]
}
const get = {    
  taskTxt:['完成','逃跑'],
  taskImg:['/resources/lookTask/finish.png','/resources/lookTask/run.png'],
  taskMethod:[3,4]
}
Component({
  properties: {
    roles:{
      type:Boolean,
      value:true,
    }
  },
  data: {
    role:true,
    taskTxt:['确认','撤回'],
    taskImg:['/resources/lookTask/finish.png','/resources/lookTask/withdrew.png'],
    taskMethod:['out_confirm','out_withdrew']
  },
  observers: {
    'roles': function (val) {
        this.setData({role:val})
        if(val)this.setData(out)
        else this.setData(get)
      }    
},
  methods: {
    hide(){
      this.triggerEvent('hide')
    },
    getMethod(e){
      let func_index = Number(e.currentTarget.id)
      this.triggerEvent('get_choice',{method:func_index})
    }
  }
})
