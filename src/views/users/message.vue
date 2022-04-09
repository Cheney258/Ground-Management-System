<template>
  <div>
    <el-card>
      <div slot="header">
        <el-input type="textarea" v-model="message" :rows="5" required placeholder="请输入留言...(留言必须超过15个字数)" ></el-input>
        <el-button class="btn" type="primary" @click="submit">提交留言</el-button>
      </div>
      <div class="box">
        <el-card class="box-card" v-for="item in messageList" :key="item.id">
          <div style="margin-top:25px">
            <h3 class="inline" style="padding-bottom:150px;">内容：</h3>
              <el-input type="textarea" :rows="6" v-model="item.content" class="inline input" readonly></el-input>
          </div>
          <div>
            <h3 style="padding-bottom:70px;" class="inline">回复：</h3>
            <el-input type="textarea" :rows="3" v-model="item.reply" class="inline input" style="margin-top:40px;" readonly ></el-input >
          </div>
          <div style="float:left;margin:18px 0 0 50px" class="inline"><h3>{{item.time}}</h3></div>
          <el-button type="primary" v-show="item.status==0" style="float:left;margin:20px 0 0 50px" class="inline" @click="readed(item)">未读</el-button>
          <el-button type="info" v-show="item.status!=0" style="float:left;margin:20px 0 0 50px" class="inline">已读</el-button>
          <el-button type="danger" style="float:left;margin:20px 0 0 20px" class="inline" @click="deletes(item)">删除</el-button>
        </el-card>
      </div>

      <pagination
        :currentPage="currentPage"
        :total="total"
        :limit="limit"
        style="clear: both;"
        :page-sizes='pageSizes'
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
      
    </el-card>
  </div>
</template>

<script>
export default {
  name: "UserMessage",

  data() {
    return {
      message: "",
      messageList:[],
      currentPage: 1,
      limit: 3,
      total: 0,
      pageSizes:[3]
    };
  },

  mounted() {
    this.getMessage()
  },

  methods: {
    // 获取个人留言数据
    async getMessage(){
      let params ={
        uid:this.$store.getters.uid,
        limit:this.limit,
        curpage:this.currentPage
      }
      let result = await this.$store.dispatch('user/getMessageList',{uid:this.$store.getters.uid})
      if(result.code==200){
        this.messageList = [];
        // this.messageList = result.data
        result.data.forEach(item => {
          item.time = this.$moment(item.time).format('YYYY-MM-DD HH:mm:ss')
          
        });
        result.data.sort(function(a,b) {
          return Date.parse(b.time.replace(/-/g,"/"))-Date.parse(a.time.replace(/-/g,"/"));
        });
        result.data.sort(function(a,b) {
          return a.status-b.status
        })
          this.messageList = result.data.slice(
            (this.currentPage - 1) * this.limit,
            this.limit * this.currentPage
          );
          this.total = result.data.length;
          // console.log(this.messageList)
      }else{
        this.$message({
          message: result.message,
          type: 'error'
        })
      }
    },
    // 提交留言
    submit() {
      if(this.message.length>10){
        let params = {
          uid: this.$store.getters.uid,
          message: this.message,
          time: this.$moment().format("YYYY-MM-DD HH:mm:ss"),
        };
        this.$confirm("请确认提交留言", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(async () => {
          let result = await this.$store.dispatch("user/subMessage", params);
          if (result.code == 200) {
            this.$notify({
              title: "成功",
              message: "留言成功",
              type: "success",
            });
            this.message=''
            this.getMessage()
          } else {
            this.$message({
              type: "info",
              message: "留言失败",
            });
          }
        });
      }else{
        this.$notify({
          title: '提示',
          message: '留言必须超过15个字数',
          type:'warning'
        })
      }
      
    },
     // 分页器
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getMessage();
    },
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
      this.getMessage();
    },
    //撤销留言
    deletes(item){
      this.$confirm('是否撤销该条留言？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await this.$store.dispatch('user/deleteMessage',{id:item.id})
        if(result.code==200){
          this.getMessage()
          this.$notify({
            title: '成功',
            message: '撤销成功',
            type: 'success'
          })
          
        }else{
          this.$message({
            type: 'error',
            message: '撤销失败!'
          })
        }
        
      }).catch(() => {
        this.$notify({
          title: '提示',
          message:'已取消撤销',
          type:'info'
        })
      })
    },
    // 留言回复已读
    async readed(item){
      let result = await this.$store.dispatch('user/readedMessage',{id:item.id})
      if(result.code==200){
        item.status = 1
      }
    },
  },
};
</script>

<style scoped>
.btn {
  width: 100px;
  position: relative;
  right: -90%;
  margin-top: 20px;
}
.box >>> .box-card {
  width: 510px;
  height: 480px;
  float: left;
  margin: 20px 40px;
  border-radius: 30px;
  box-shadow: 15px 15px 15px 0 rgba(49, 49, 235, 0.452)!important;
}
.box {
  float: left;
}
.input{
  width: 400px;
  font-size: 20px;
  font-weight: 900;
}
.inline{
  display: inline-block;
  
}
</style>
