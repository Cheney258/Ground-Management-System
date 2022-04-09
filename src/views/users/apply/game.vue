<template>
  <div>
    <el-card>
      <div slot="header">
        <el-steps :active="active"  finish-status="success" align-center >
          <el-step title="申请" ></el-step>
          <el-step title="审核中" ></el-step>
          <el-step title="通过" ></el-step>
        </el-steps>
      </div>
      <div v-if="active == 1">
        <el-form label-position="rigth" label-width="100px" :model="gameInfo" ref="game" :rules="rules"  class="form" >
          <el-form-item label="申请编号:" style="color:red;font-size:30px;font-weigth:700" prop="gameId">
            {{gameInfo.gameId}}
          </el-form-item>
          <el-form-item label="用户账号:" prop="username" style="width:100px">
            {{gameInfo.username}}
          </el-form-item>
          <el-form-item label="活动名称:" prop="gameName">
            <el-input v-model="gameInfo.gameName" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="活动类型:" prop="activityType">
            <el-select v-model="gameInfo.activityType" value-key placeholder="请选择">
              <el-option label="上课" value="上课"></el-option>
              <el-option label="比赛" value="比赛"></el-option>
            </el-select>
          </el-form-item>          
          <el-form-item v-if="gameInfo.activityType == '比赛'" label="比赛类型:" prop="gametype">
            <el-input v-model="gameInfo.gametype" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="活动团体:" prop="class">
            <el-input v-model="gameInfo.class" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="活动时间:" prop="gameTime">
            <div class="block">
              <el-date-picker
                v-model="gameInfo.gameTime"
                type="datetime"
                placeholder="选择日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                >
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="活动描述:" prop="description" >
            <el-input type="textarea" v-model="gameInfo.description"></el-input>
          </el-form-item>
      </el-form>
      <el-button-group class="btn">
          <el-button type="wraning" style="margin:0px 25px;border-radius: 5px;" @click="back">重置</el-button>
          <el-button type="primary" style="margin:0px 25px;border-radius: 5px;" @click="addGame">提交</el-button>
        </el-button-group>
    </div>
    <!-- 提交成功 -->
    <div v-if="active == 2" class="form-class progress-class">
      <el-progress type="circle" :percentage="75" :width="200"></el-progress>
        <div>
          <div class="succMsg-class">提交成功</div>
          <span>申请编号为{{gameInfo.gameId}}的赛事申请已提交，待赛事管理员审批通过后即可申请场地和器材</span>
        </div>
        <el-button type="primary"  @click="back" style="margin-top:50px">返回</el-button>
    </div>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'Game',

  data() {
    return {
      active:1,
      gameInfo:{
        uid :this.$store.getters.uid,
        gameId: 'GS' + (Math.round((Math.random()+1)*1000)),
        username:this.$store.getters.name,
        gameName:'',
        activityType:'',
        gametype:'',
        gameTime:'',
        class:'',
        description:'',
        apptime:''
      },
      rules:{
        gameId:[{ required: true, message: '必填项', trigger: 'blur' },],
        username:[{ required: true, message: '请输入用户名', trigger: 'blur' },],
        gameName:[{ required: true, message: '请输入活动名', trigger: 'blur' },],
        activityType:[{ required: true, message: '请输入活动类型', trigger: 'blur' },],
        gametype:[{ required: true, message: '请输入比赛类型', trigger: 'blur' },],
        gameTime:[{ required: true, message: '请输入活动时间', trigger: 'blur' },],
        class:[{ required: true, message: '请输入活动团体', trigger: 'blur' },],

      }
    }
  },

  mounted() {

  },

  methods: {
    addGame(){
      if(this.$store.getters.status == 1){
        this.$refs.game.validate(valid => {
        if(valid) {
          this.$confirm('是否确认提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(async () =>{
          this.gameInfo.apptime = moment().format('YYYY-MM-DD HH:mm:ss')
          const result = await this.$store.dispatch('addgame', this.gameInfo)
          if(result.code == 200){
            this.$message.success(result.message)
            this.gameInfo = {}
          }else{
            this.$message.error(result.message)
          }
          this.active = 2
        })
          
        }
      })
    }else{
      this.$notify.warning({
        title:'账号异常',
        message: '禁止申请，您有未如期归还器材！若有疑问请联系管理员！',
        offset: 100
      })
    }
      
    },
    back(){
      this.active = 1
      this.gameInfo.gameName = ''
      this.gameInfo.gameType = ''
      this.gameInfo.activityType = ''
      this.gameInfo.gameTime = ''
      this.gameInfo.class = ''
      this.gameInfo.description = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.form{
    width: 450px;
    position: relative;
    left: 50%;
    margin-left: -225px;
    top:60%;
    font-size: 50px;
    font-weight: bold;
    
}
.btn{
  position: relative;
  right: -690px;
  margin-top: 40px;
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
</style>
