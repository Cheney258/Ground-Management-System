import * as api from '@/api'

const state ={}

const getters = {}

const mutations = {}

const actions = {
  // 器材保修或报废
  async handleEquip({commit},data){
    return await new Promise((resolve,reject) => {
      api.reqHandleEquip(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 添加器材
  async addEquip({commit},data){
    return await new Promise((resolve,reject)=>{
      api.reqAddEquipment(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 删除器材
  async deleteEquip({commit},data){
    return await new Promise((resolve,reject) => {
      api.reqDeleteEquipment(data).then(res =>{
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 获取器材申请
  async getEquipRent(){
    return await new Promise((resolve,reject) => {
      api.reqEquipRent().then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 获取未出借的器材信息
  async getEquipInfo(){
    return await new Promise((resolve,reject) => {
      api.reqGetEquipInfo().then(res =>{
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 派发器材给申请人
  async payoutEquip({commit},data){
    return await new Promise((resolve,reject) => {
      api.reqPayoutEquip(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 驳回器材申请
  async disEquipRent({commit},data){
    return await new Promise((resolve,reject) => {
      api.reqDisEquipRent(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 获取器材出借数据
  async getRecyclingEquiplist(){
    return await new Promise((resolve,reject) => {
      api.reqGetRecyclingEquipList().then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 失信处理
  async dealNocredit({commit},data){
    return await new Promise((resolve,reject)=>{
      api.reqDealNoCredit(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 器材回收处理
  async recyclingEquip({commit},data){
    return await new Promise((resolve,reject) => {
      api.reqRecyclingEquip(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 获取器材赔偿列表
  async getCompensation({commit},data){
    return await new Promise((resolve,reject) => {
      api.reqGetCompensation().then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 处理赔偿完成
  async compensationover({commit},data){
    return await new Promise((resolve,reject) => {
      api.reqCompensationOver(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default{
  state,
  getters,
  mutations,
  actions
}