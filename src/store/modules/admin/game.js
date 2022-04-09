import * as api from '@/api'

const state = {}

const mutations ={}

const actions ={
  // 获取全部活动申请
  async getAllGameApply({commit}){
    return await new Promise((resolve,reject) => {
      api.reqGetAllGameApply().then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 通过或驳回活动申请
  async acceptOrRefuseGameApply({commit},data){
    return await new Promise((resolve,reject) => {
      api.reqAcceptOrRefuseGameApply(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 删除某条申请
  async deleteGameApply({commit},data){
    return await new Promise((resolve,reject) => {
      api.reqDeleteGameApply(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 新增活动
  async addActivity({commit},data){
    return await new Promise((resolve,reject) => {
      api.reqAddActivity(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 获取全部活动
  async getAllActivityList(){
    return await new Promise((resolve,reject) => {
      api.reqGetAllActivityList().then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  async updateActivityInfo({commit},data){
    return await new Promise((resolve,reject) => {
      api.reqUpdateActivityInfo(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  async deleteActivity({commit},data){
    return await new Promise((resolve,reject) => {
      api.reqDeleteActivity(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const getters = {}

export default {
  state,
  actions,
  mutations,
  getters
}