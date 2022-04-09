import  * as api from "@/api"



const state = {}

const actions = {
  // 获取场地信息
  async getvenueinfo({commit}){
    let result =await api.reqGetVenueInfo()
    const venueInfo = result.data
    return venueInfo
  },

  // 获取可预约日期
  async getDateDay(){
    return await new Promise((resolve,reject)=>{
      api.reqGetDateDay().then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 获取某一地点某一天可预约时间段
  async getTimePeriod({commit},data){
    // console.log(222)
    return await new Promise((resolve,reject) => {
      api.reqGetTimePeriod(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 审查审批号，获取活动申请信息去申请场地
  async checkcode({commit},code){
    return new Promise((resolve, reject) => {
      api.reqCheckCode({code:code}).then(res => {        
          resolve(res)        
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取场地类型
  async getVenueType({commit}){
    return await new Promise((resolve,reject) => {
      // console.log(11)
      api.reqGetVenueType().then(res => {
        resolve(res.data)
      }).catch(error => {{
        reject(error)
      }})
    })
  },

  // 获取对应类型场地位置
  async getFieldList({commit},tid){
    return await new Promise((resolve,reject) => {
      api.reqGetPosition({tid:tid}).then(res => {
        // console.log(res)
        resolve(res)
      }).catch(err =>{
        reject(err)
      })
    })
  },

  // 提交用户场地申请
  async submitApply({commit},params){
    return await new Promise((resolve,reject) => {
      // console.log(params)
      api.reqSubVenueApply(params).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  
  // 获取用户场地申请记录
  async getVenueApply({commit},uid){
    return await new Promise((resolve,reject) => {
      api.reqGetVenueApply({ uid: uid }).then(res => {
        if(res.code == 200){
          resolve(res.data)
        } else {
          resolve(res.message)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 取消用户申请
  async cancel({commit},param){
    return await new Promise((resolve,reject) => {
      api.reqCancelApply(param).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {}

const getters = {}

export default {
  state,
  actions,
  mutations,
  getters
}