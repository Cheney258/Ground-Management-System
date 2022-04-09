import * as api from '@/api'
import moment from 'moment'

const state = {}

const getters ={}

const actions = {
  // 获取场地申请数据
  async getVenueapp(){
    return await new Promise((resolve,reject)=>{
      api.reqGetVenueapp().then(res => {
        let arr1 = []
        let arr2 = []
        if(res.code==200){
          res.data.forEach(item => {
            item.gametime = moment(item.gametime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            item.apptime = moment(item.apptime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            item.usetime = moment(item.day).format("YYYY-MM-DD") +' '+item.period;
            if(item.status==0){
              arr1.push(item)
            }else{
              arr2.push(item)
            }
          });
        }
        resolve([arr1,arr2])
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 处理场地申请
  async handlerVenueapp({commit},data){
    return await new Promise((resolve,reject) => {
      api.reqHandlerVenApply(data).then(res => {
        resolve(res)
      }).catch(err =>{
        reject(err)
      })
    })
  },
  // 获取场地信息
  async getAllVenueInfo(){
    return await new Promise((resolve,reject) =>{
      api.reqGetAllVenueInfo().then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取场地相关信息
  async getAboutVenInfo({commit},data){
    return await new Promise((resolve,reject) =>{
      api.reqGetAboutVenInfo(data).then(res => {
        if(res.code ==200){
          resolve(res.data)
        }else{
          this.$message.error(res.message)
        }
      }).catch(err =>{
        reject(err)
      })
    })
  },
  // 更改场地信息
  async updateVenueInfo({commit},data){
    return await new Promise((resolve,reject) =>{
      api.reqUpdateVenueInfo(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 新增场地信息
  async addVenue({commit},data){
    return await new Promise((resolve,reject)=>{
      api.reqAddVenueInfo(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 删除场地
  async deleteVenue({commit},data){
    return await new Promise((resolve,reject) => {
      api.reqDeleteVenueInfo(data).then(res =>{
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取特殊场地信息
  async getSpecialVenueInfo(){
    return await new Promise((resolve,reject) => {
      api.reqGetSpecialVenueInfo().then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取周日期和天时间段
  async getWeekAndPeriod(){
    return await new Promise((resolve,reject) => {
      api.reqGetWeekAndPeriod().then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 新增特殊场地
  async addSpecialVenue({commit},data){
    return await new Promise((resolve,reject) =>{
      api.reqAddSpecialVenue(data).then(res =>{
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
    
  },
  // 删除特殊场地信息
  async deleteSpeciaVenueInfo({commit},data){
    return await new Promise((resolve,reject) => {
      api.reqDeleteSpeciaVenueInfo(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 更新特殊场地信息
  async updateSpeciaVenueInfo({commit},data){
    return await new Promise((resolve,reject) => {
      api.reqUpdateSpeciaVenueInfo(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {}

export default{
  state,
  getters,
  mutations,
  actions
}