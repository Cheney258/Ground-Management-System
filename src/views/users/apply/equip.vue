<template>
  <div>
    <el-card>
      <div slot="header">
        <el-steps :active="active" finish-status="success" align-center >
          <el-step title="申请"></el-step>
          <el-step title="审核中"></el-step>
          <el-step title="通过/驳回"></el-step>
        </el-steps>
      </div>
      <div v-if="active == 1" style="width:520px;margin:50px auto">
        <el-form ref="appInfo" :model="appInfo" :rules="rules" label-width="80px" algin-center>
          <el-form-item label="器材" prop="type">
            <el-select v-model="appInfo.tid" @change="change" placeholder="选择器材类型">
              <el-option 
                v-for="(item,index) in equipType" 
                :key="index" 
                :label="item.type" 
                :value="item.tid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数量" prop="num">
            <el-input-number v-model="appInfo.num" :min="1" :max="maxnum"></el-input-number>
          </el-form-item>
          <el-form-item label="学号" prop="xuehao">
            <el-input v-model="appInfo.xuehao" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="realname">
            <el-input v-model="appInfo.realname" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="appInfo.phone" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="使用时间" required>
            <el-col :span="11">
              <el-date-picker type="datetime" placeholder="选择日期" v-model="appInfo.start" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" :span="1" style="font-weight:700">至</el-col>
            <el-col :span="11">
              <el-date-picker type="datetime" placeholder="选择日期" v-model="appInfo.end"  style="width: 100%;"></el-date-picker>
            </el-col>
          </el-form-item>
        </el-form>
        <el-button type="primary" class="btn" @click="submit">提交</el-button>
      </div>   
        <!-- 提交成功 -->
    <div v-if="active == 2" class="form-class progress-class">
      <el-progress type="circle" :percentage="75" :width="200"></el-progress>
        <div>
          <div class="succMsg-class">提交成功</div>
          <span>待管理员审批通过后即可申器材管理处提取器材</span>
        </div>
        <el-button type="primary"  @click="back" style="margin-top:50px">返回</el-button>
    </div> 
    </el-card>
    
  </div>
</template>

<script>
export default {
  name: 'Equip',

  data() {
    return {
      active:1,
      equipType:[],
      list:[],
      maxnum:1,
      appInfo:{
        tid:'',
        uid:this.$store.getters.uid,
        num:1,
        xuehao:'',
        realname:'',
        phone:'',
        start:'',
        end:''
      },
      rules:{
        tid:[{required:true,message:'请选择器材', trigger: 'blur'}],
        // equip:[{required:true,message:'请选择器材', trigger: 'blur'}],
        num:[{required:true,message:'请选择器材数量', trigger: 'blur'}],
        start:[{type: 'date',required:true,message:'必填项', trigger: 'blur'}],
        end:[{type: 'date',required:true,message:'必填项', trigger: 'blur'}],
        xuehao:[{required:true,message:'请输入10位学号', trigger: 'blur'},
                {min: 10, max: 10, message: '请输入10位学号', trigger: 'blur' }],
        realname:[{required:true,message:'请输入真实姓名', trigger: 'blur'},
                  {min: 2, max:6, message: '长度为 2 到 6 位', trigger: 'blur' }],
        phone:[{required:true,message:'请输入联系电话', trigger: 'blur'},
                {pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/, message: '请输入11位电话号', trigger: 'blur' }],
      }
      
    }
  },

  mounted() {
    this.getEquipTypeAndName()
  },

  methods: {
    // 获取器材类型
    async getEquipTypeAndName(){
      let results = await this.$store.dispatch('getEquip')
      
      if(results.code == 200){
        this.list = results.data
        this.list.forEach(item => {
          if(!this.equipType.some(res => res.tid ===item.tid)){
            this.equipType.push({tid:item.tid,type:item.type})
          }
        });
        // console.log(this.list)
        // console.log(this.equipType)
        // 过滤重复类型
        // this.equipType = [...new Set(this.equipType)]
      }else if(results.code == 400){
        this.$notify.warning({
          title:'警告',
          message:'没有数据或'+results.message
        })
      }else{
        this.$message.error(results.message)
      }
      
    },
    // 选择某类型器材后，获取最大可申请数
    change(){
      this.appInfo.num = 1
      this.maxnum = 0
      this.list.forEach(item => {
        if(item.type == this.appInfo.type){
          this.maxnum ++
        }
      })
    },
    // 提交申请
    submit(){
      console.log(this.appInfo)
      // 验证用户账号是否正常
      if(this.$store.getters.status == 1){
        this.$refs.appInfo.validate(valid => {
          if(valid){
            this.$confirm('是否确认提交?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(async () => {
              this.appInfo.end = this.$moment(this.appInfo.end).format('YYYY-MM-DD HH:mm:ss')
              this.appInfo.start = this.$moment(this.appInfo.start).format('YYYY-MM-DD HH:mm:ss')
              const results = await this.$store.dispatch('subEquipApp',this.appInfo)
              if(results.code == 200 ){
                this.$notify.success({
                  title:'成功',
                  message:results.message
                })
                this.active = 2
              }else{
                this.$message.error({
                  message:results.message
                })
              }
              
            })
          }else{
            this.$notify.warning({
              title:'提示',
              message:'请检查输入项是否符合规则'
            })
          }
        })
      }else{
        this.$notify.warning({
          title: '账号异常',
          message: '禁止申请，您有过期未归还器材！若有疑问请联系管理员！',
          offset: 100
        })
      }
      
    },
    // 成功返回按键
    back(){
      this.active = 1
      this.appInfo = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.btn{
  position: relative;
  right: -480px;
  margin-top: 50px;
}
.progress-class{
    text-align: center;
    size: 50px;
    padding-top: 10%;
}
.succMsg-class{
    padding-top: 20px;
    padding-bottom: 10px;
    font-size: 27px;
    
}
.block{
  display: inline;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 180px;
}
</style>
