import request from '@/utils/request'

// ----------------------------------------------------------------------//
// -------------------------------  用户端  ------------------------------//
// ----------------------------------------------------------------------//

// 登录
export const login = (data) => request({url:'/login',method:'post',data})
// 获取用户信息
export const getInfo = (params) => request({url:'/getInfo',method:'get',params})
// 更新用户信息
export const reqUpdateInfo = (data) => request({ url: '/updateinfo', method: 'post', data })
// 获取用户信息
export const reqGetUserinfo = (data) => request({ url: '/getUserinfo', method: 'post', data })
// 上传用户头像
export const reqUploadAvatar = (data) => request({url:'/uploadAvatar',method:'post',data})
// 获取用户活动申请记录
export const reqGetGameApply = (data) => request({ url: '/myapply', method: 'post', data })
// 添加活动申请
export const reqAddGame = (data) => request({url:'/addgame', method:'post', data})
// 获取场地信息
export const reqGetVenueInfo = () => request({url:'/getvenueinfo',method:'get'})
// 获取可申请日期
export const reqGetDateDay = () =>request({url:'/getDateDay',method:'get'})
// 获取某一地点某一天的可预约时间段
export const reqGetTimePeriod =(data) => request({url:'/getTimePeriod',method:'post',data})
// 审查审批号
export const reqCheckCode = (data) => request({url:'/checkcode',method:'post',data})
// 获取场地类型和
export const reqGetVenueType = () => request({url:'/getvenuetypeandname',method:'get'})
// 获取对应场地类型的位置表
export const reqGetPosition = (data) => request({url:'/getpositionlist',method:'post',data})
// 提交场地申请
export const reqSubVenueApply = (data) => request({url:'/subvenueapply',method:'post',data})
// 获取用户场地申请记录
export const reqGetVenueApply = (data) => request({ url: '/getfieldapply', method: 'post', data })
// 获取器材类型和名字
export const reqGetEquipTypeAndName = () => request({url:'/getequip',method:'get'})
// 调教器材申请
export const reqSubEquipApp = (data) => request({url:'/subequipapply',method:'post',data})
// 获取用户器材申请记录
export const reqGetEquipApply = (data) => request({ url: '/getequipapply', method: 'post', data })
// 取消用户申请
export const reqCancelApply = (data) => request({url:'/cancelapply',method:'post',data})
// 获取全部比赛类型的赛事信息
export const reqGetAllGameInfo = () => request({url:'/getgamelist',method:'get'})
// 获取全部器材信息
export const reqGetAllEquipInfo = () => request({url:'/getequiplist',method:'get'})
// 获取公告
export const reqGetAnnouncement = () => request({url:'/getannouncement',method:'get'})
// 留言提交
export const reqSubMessage = (data) => request({url:'/subMessage',method:'post',data})
// 获取个人留言数据
export const reqGetMessageList =(data) => request({url:'/getMessageList',method:'post',data})
// 撤销留言
export const reqDeletesMessage = (data) => request({url:'/deletesMessage',method:'post',data})
// 回复已读
export const reqReadedMessage = (data) => request({url:'/readedMessage',method:'post',data})
// 获取用户未读留言回复的条数
export const reqGetNoReadedNum = (data) => request({url:'/getNoReadedNum',method:'post',data})
// 获取未读新公告
export const reqGetNoReadedAnnoun =(data) => request({url:'/getNoReadedAnnoun',method:'post',data})
// 公告已读
export const reqReadedAnnouncement =(data) =>request({url:'/readedAnnouncement',method:'post',data})

// ----------------------------------------------------------------------//
// -------------------------------  管理端  ------------------------------//
// ----------------------------------------------------------------------//

// 获取全部用户
export const reqGetAllUsers = () => request({url:'/getallusers',method:'post'})
// 更改用户角色和状态
export const reqUpdateRoleAndStatus = (data) => request({url:'/updateroleAndstatus',method:'post',data})
// 获取公告
export const reqGetAllAnnouncement = () => request({url:'/getallannouncement',method:'get'})
// 删除公告
export const reqDeleteAnnounce =(data) => request({url:'/deleteannounce',method:'post',data})
// 添加公告
export const reqAddAnnouncement = (data) => request({url:'/addannouncement',method:'post',data})
// 修改公告
export const reqUpdateAnnouncement = (data) => request({url:'/updateannouncement',method:'post',data})
// 发布或撤销公告
export const reqUploadOrUndoAnnounce = (data) => request({url:'/uploadOrUndoAnnounce',method:'post',data})
// 获取全部活动申请 
export const reqGetAllGameApply = () => request({url:'/getallgameapply',method:'get'})
// 通过或驳回申请
export const reqAcceptOrRefuseGameApply = (data) => request({url:'/acceptOrRefuseGameApply',method:'post',data})
// 删除某条申请
export const reqDeleteGameApply = (data) => request({url:'/deletegameapply',method:'post',data})
// 器材保修或报废
export const reqHandleEquip = (data) => request({url:'/handleequip',method:'post',data})
// 添加器材
export const reqAddEquipment = (data) =>  request({url:'/addequipment',method:'post',data})
// 删除器材
export const reqDeleteEquipment = (data) => request({url:'/deleteequipment',method:'post',data})
// 获取器材申请
export const reqEquipRent = () => request({url:'/getequiprent',method:'get'})
// 获取未出借的器材信息
export const reqGetEquipInfo = () => request({url:'/getequipinfo',method:'get'})
// 派发器材给申请人
export const reqPayoutEquip = (data) => request({url:'/payoutequip',method:'post',data})
// 驳回器材申请
export const reqDisEquipRent= (data) => request({url:'/disEquipRent',method:'post',data})
// 器材回收列表
export const reqGetRecyclingEquipList = () => request({url:'/getrecyclingEquiplist',method:'get'})
// 失信处理
export const reqDealNoCredit = (data) => request({url:'/dealNoCredit',method:'post',data})
// 回收处理
export const reqRecyclingEquip = (data) =>request({url:'/recyclingequip',method:'post',data})
// 赔偿列表数据
export const reqGetCompensation = () => request({url:'/getcompensation',method:'get'})
// 处理赔偿完成
export const reqCompensationOver = (data) => request({url:'/compensationover',method:'post',data})
// 获取场地申请数据
export const reqGetVenueapp = () => request({url:'/getVenueapp',method:'get'})
// 处理场地申请
export const reqHandlerVenApply = (data) => request({url:'/handlerVenApply',method:'post',data})
// 获取场地信息
export const reqGetAllVenueInfo = () => request({url:'/getAllVenueInfo',method:'get'})
// 获取场地相关信息
export const reqGetAboutVenInfo = (data) => request({url:'/getAboutVenInfo',method:'get',data})
// 更改场地信息
export const reqUpdateVenueInfo = (data) => request({url:'/updateVenueInfo',method:'post',data})
//新增场地
export const reqAddVenueInfo = (data) => request({url:'/addVenueInfo',method:'post',data})
// 删除场地
export const reqDeleteVenueInfo = (data) => request({url:'/deleteVenueInfo',method:'post',data})
// 获取特殊场地信息
export const reqGetSpecialVenueInfo = () => request({url:'/getSpecialVenueInfo',method:'get'})
// 获取周日期和天时间段
export const reqGetWeekAndPeriod = () => request({url:'/getWeekAndPeriod',method:'get'})
// 新增特殊场地
export const reqAddSpecialVenue = (data) => request({url:'/addSpecialVenue',method:'post',data})
// 删除特殊场地信息
export const reqDeleteSpeciaVenueInfo =(data) => request({url:'/deleteSpeciaVenueInfo',method:'post',data})
// 更新特殊场地信息
export const reqUpdateSpeciaVenueInfo = (data) => request({url:'/updateSpeciaVenueInfo',method:'post',data})
// 新增活动
export const reqAddActivity =(data) => request({url:'/addActivity',method:'post',data})
// 获取全部活动
export const reqGetAllActivityList = () => request({url:'/getAllActivityList',method:'get'}) 
// 更新活动信息
export const reqUpdateActivityInfo = (data) => request({url:'/updateActivityInfo',method:'post',data})
// 删除活动
export const reqDeleteActivity = (data) => request({url:'/deleteActivity',method:'post',data})
// 获取全部留言数据
export const reqGetAllMessage = () => request({url:'/getAllMessage',method:'get'})
// 回复留言
export const reqReplyMessage =(data) => request({url:'/replyMessage',method:'post',data})
// 上传首页图片
export const reqUploadActivityImg =(data) => request({url:'/uploadActivityImg',method:'post',data})
// 获取首页图片地址
export const reqGetIndexImg = () => request({url:'/getIndexImgUrl',method:'get'})