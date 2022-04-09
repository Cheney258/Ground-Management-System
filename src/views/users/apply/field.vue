<template>
  <div>
    <el-card>
      <div slot="header">
        <!-- 步骤条 -->
        <el-steps :active="active"   finish-status="success" align-center >
          <el-step title="填写申请" ></el-step>
          <el-step title="等待审核" ></el-step>
          <el-step title="等待结果" ></el-step>
        </el-steps>
      </div>
      <div v-if="active == 1" style="width:500px;margin:50px auto">
        <!-- 表单 -->
    <el-form ref="form" label-width="200" :model="appinfo" :rules="rules" size="medium">
      <!-- 审批号 -->
      <el-form-item label="审批号："  prop="code">
        <el-input v-model="appinfo.code" style="width:150px" placeholder="请输入活动审批号"></el-input>
        <el-button type="primary"  style="margin-left:10px" @click="check">Check</el-button>
        <h5 v-show="!ifCheckCode" v-if="isShow" style="margin:0 0 0 65px;color:red;">（请先输入审批号以继续场地申请）</h5>
        <h5 v-show="ifCheckCode" style="margin:0 0 0 65px;color:green;">验证通过，请继续输入信息</h5>
      </el-form-item>

      <!-- <el-form-item label="活动时间：" style="margin-top:5px">
        <span v-show="ifCheckCode" class="appInfo">{{appinfo.gametime}}</span>
      </el-form-item> -->

      <el-form-item label="申请人姓名：">
        <span v-show="ifCheckCode" class="appInfo">{{appinfo.username}}</span>
      </el-form-item>

      <el-form-item label="申请活动类型：">
        <span v-show="ifCheckCode" class="appInfo">{{appinfo.activityType}}</span>
      </el-form-item>

      <el-form-item label="场地类型：" prop="fieldClass">
        <el-select v-model="appinfo.filedType"  v-show="ifCheckCode" @change="getPositionList"  placeholder="请选择场地类型" style="width:400px">
          <el-option
            v-for="(item,index) in appinfo.fieldClass"
            :key="index"
            :label="item.type"
            :value="item.tid">         
          </el-option>
        </el-select>
      </el-form-item> 
      <el-form-item label="选择场地：" prop="field">
        <el-select v-model="appinfo.filedname"  v-show="ifCheckCode"  placeholder="请选择场地" style="width:400px">
        <el-option
          v-for="(item,index) in appinfo.field"
          :key="index"
          :label="item.position"
          :value="item.pid">
          
        </el-option>
      </el-select>
      </el-form-item>

      <el-form-item label="使用时间段：" prop="time">
        <template slot-scope="">
          <div v-show="ifCheckCode" style="display:inline;width:150px;float:left;">
            <el-select v-model="appinfo.day" @change="selectDay" style="display:inline-block" placeholder="日期">
              <el-option
                v-for="item in s_Day"
                :key="item.id"
                :label="item.day + '-' + item.week"
                :value="item.id"
                >
              </el-option>
            </el-select>
          </div>
          <div v-show="ifCheckCode" style="display:inline;width:150px;float:left;margin-left:20px;">
            <el-select v-model="appinfo.time" style="display:inline-block" placeholder="时间段">
              <el-option
                v-for="item in s_Time"
                :key="item.id"
                :label="item.period"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <!-- {{row.status}} -->
        </template>
      </el-form-item>
      
      <el-form-item >
          <el-button type="primary" @click="submit('from')">下一步</el-button>
          <el-button type="warning" @click="resetting">重置</el-button>
      </el-form-item>

    </el-form>
      </div>

      <!-- 提交成功u页面 -->
      <div v-if="active == 2">
            <div class="success">
                <img src=".//success.png" class="successIcon"/><br>
                <div style="font-size:20px;margin-top:5px">提交成功</div>
                <div style="margin-top:25px;">审批号为：<span class="titleInfo" >{{this.appinfo.code}}</span>的场地申请已提交，待场地管理员审批后即可完成场地申请</div>
            </div>
        </div>
        <div class="content" v-if="active == 2">
            <div class="content_header">
                <span class="title">审批号：</span><span class="titleInfo">{{appinfo.code}}</span>
                <span class="title">申请人：</span><span class="titleInfo">{{appinfo.username}}</span>
                <!-- <span>申请日期：</span> -->
            </div>
            <div style="height: 300px;"  class="step">
              <el-steps direction="vertical" :active="3">
                <el-step title="创建申请" :description="appinfo.apptime"></el-step>
                <el-step title="赛事审批" description=""></el-step>
                <el-step title="场地审批" description=""></el-step>
                <el-step title="完成申请" description=""></el-step>
              </el-steps>
            </div>
        </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Field',

  data() {
    return {
      isShow:true,
      ifCheckCode:false,
      active:1,
      s_Day:[],
      s_Time:[],
      appinfo:{
        code:'',
        field: [],
        fieldClass: [],
        filedType:'',
        filedname:'',
        apptime:'',
        day:'',
        time:'',
      },
      
      
      rules:{
        code:[{required:true,message:'必填项',trigger: 'blur'}],
        day:[{required:true,message:'必填项', trigger: 'blur'}],
        time:[{required:true,message:'必填项', trigger: 'blur'}],
        fieldClass:[{required:true,message:'必填项', trigger: 'blur'}],
        field:[{required:true,message:'必填项', trigger: 'blur'}]
      }

    }
  },

  mounted() {
    this.getVenueType();
    this.getUseDay();
  },

  methods: {
    // 审查审批号
    async check(){
      this.appinfo.day = ''
      this.appinfo.time = ''
      const result = await  this.$store.dispatch('checkcode', this.appinfo.code)
        if(result.code == 200 ){     
          this.ifCheckCode = true
          this.appinfo.gid = result.data.gid
          this.appinfo.code = result.data.code
          this.appinfo.gametime = this.$moment(result.data.gametime).format('YYYY-MM-DD HH:mm:ss')
          this.appinfo.username = this.$store.getters.name
          this.appinfo.activityType = result.data.activityType
          
        }else if(result.code == 201){
          this.$notify.warning({
            title:'该审批号已被使用'
          })
        }else if(result.code == 202){
          this.$notify.warning({
            title:'该审批号失效'
          })
        }else{
          this.$notify.error({title:'没有该审批号'})
        }
      
    },
    // 重置
    resetting(){
      this.$refs.form.resetFields()
      this.ifCheckCode = false
      this.isShow = true
    },
    // 获取场地类型和
    async getVenueType(){
      const data = await this.$store.dispatch('getVenueType')
      this.appinfo.fieldClass = data
    },
    // 获取对应类型的场地地点
    async getPositionList(){
      // console.log('11')
      // 每次重新选择欠先清除二级选择器
      this.appinfo.field = []
      this.appinfo.filedname = ''
      let result = await this.$store.dispatch('getFieldList',this.appinfo.filedType)
      if(result.code == 200) {
        this.appinfo.field = result.data
        // console.log(this.appinfo.field)
      }else{
        this.$message.error(result.message)
      }
    },
    // 获取可预约日期
    async getUseDay() {
      let results = await this.$store.dispatch("getDateDay");
      if (results.code == 200) {
        results.data.forEach((item) => {
          item.day = this.$moment(item.day).format("YYYY-MM-DD");
          switch (item.week) {
            case 1:
              item.week = "周一";
              break;
            case 2:
              item.week = "周二";
              break;
            case 3:
              item.week = "周三";
              break;
            case 4:
              item.week = "周四";
              break;
            case 5:
              item.week = "周五";
              break;
            case 6:
              item.week = "周六";
              break;
            case 7:
              item.week = "周日";
              break;
            default:
              break;
          }
        });
        results.data.reverse()
        this.tem_dayList = results.data
        this.s_Day = results.data;
      }else{
        this.$message.error(results.message)
      }
    },
    async selectDay() {
      this.s_time=''
      let params = {pid:this.appinfo.filedname,did:this.appinfo.day}
      // console.log(params)
      let results = await this.$store.dispatch('getTimePeriod',params)
      if(results.code ==200){
        this.s_Time = results.data
        // console.log(params)
      }else{
        this.$message.error(results.message)
      }
      // console.log(1111)
    },
    // 提交申请
    submit(form){
      // 验证账号是否正常
      if(this.$store.getters.status == 1){
          this.$refs.form.validate((valid) => {
          if(valid){
            this.$comfirm('请确认提交申请','提示',{
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () =>{
              const params ={
                uid:this.$store.getters.uid,
                gid:this.appinfo.gid,
                tid:this.appinfo.filedType,
                pid:this.appinfo.filedname,
                gametime:this.appinfo.gametime,
                apptime:this.appinfo.apptime = this.$moment().format('YYYY-MM-DD HH:mm:ss'),
                code:this.appinfo.code,
                day:this.appinfo.day,
                time:this.appinfo.time
              }
              try {
                let result = await this.$store.dispatch('submitApply',params)
                if(result.code == 200) {
                  this.$message.success('提交成功，等待审核')
                  this.active = 2
                  this.isShow = true
                }else{
                  this.$message.error('提交失败')
                }
              } catch (error) {
                this.$message.error(error)
              }
            })
          }else{
            this.message.error('请正确填写表格')
          }
        })
      }else{
        this.$notify.warning({
          title: '账号异常',
          message: '禁止申请，您有过期未归还器材！若有疑问请联系管理员！',
          offset: 100
        })
      }
      
      
    }
  },
  
}
</script>

<style lang="scss" scoped>
.active{
  color:red;
}
.appRecordCode {
  color:red;
  margin-left: 10px;
  font-size:23px;
  font-weight: bold;
}

.appInfo {
  font-size:16px;
  color:#606266;
  font-weight:bold;
  margin-top:2px;
  margin-left: 10px;
}

.arrow-text {
    font-size:14px;
}

.btn{
  position: relative;
  margin-top: 50px;
  right: inherit;
  
}
.success{ 
    text-align: center;
    // margin-right: 18%;
    margin: 25px auto 0px;
}

.successIcon {
    width: 70px;
    height:70px;

}

.content_header {
    text-align: center;
    position: relative;
    top: 20px;
    margin-top:50px;
}
.content{
    margin:10px auto;
    width: 50%;
    background-color: #F5F5F5;
}

.title{
    padding-top: 20px;
    font-size: 15px;
    font-weight: bold;
}

.titleInfo{
    color:rgb(245, 9, 9);
    font-size: 24px;
    font-weight: bold;
    margin-top: 20px;
    margin-right:30px;
    font-size:15px;
}
.step{
  margin: 80px 350px;
}
</style>
