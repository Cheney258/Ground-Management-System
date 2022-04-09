import { reqGetEquipTypeAndName,reqSubEquipApp,reqGetEquipApply,reqGetAllEquipInfo } from "@/api"

const state = {}

const actions = {
  // 获取器材类型和名称
  async getEquip({commit}){
    return await new Promise((resolve,reject) => {
      reqGetEquipTypeAndName().then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 提交器材申请
  async subEquipApp({commit},appinfo){
    console.log(appinfo)
    return await new Promise((resolve,reject) => {
      reqSubEquipApp(appinfo).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 获取用户器材申请记录
  async getEquipApply({commit},uid){
    return await new Promise((resolve,reject) => {
      reqGetEquipApply({ uid: uid }).then(res => {
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

  // 获取全部器材信息
  async getAllEquipInfo({commit}){
    return await new Promise((resolve,reject) => {
      reqGetAllEquipInfo().then(res => {
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