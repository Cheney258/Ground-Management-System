<template>
  <div>
    <el-card class="card">
      <div slot="header">
        <el-input
          v-model="search"
          placeholder="请输入关键字..."
          class="search"
          @change="SearchList"
          clearable
        ></el-input>
        <el-button type="primary" class="btn" @click="toSearch">搜索</el-button>
      </div>
      <div class="container">
      <el-table :data="usersList" style="width: 100%" align="center">
        <el-table-column prop="name" label="用户ID" width="width" align="center">
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="width" align="center">
        </el-table-column>
        <el-table-column prop="xuehao" label="学号" width="width" align="center">
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="width" align="center">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="width" align="center">
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" width="width" align="center">
        </el-table-column>
        <el-table-column prop="role" label="用户角色" width="width" align="center">
          <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.role == 1" >用户</el-tag>
          <el-tag type="danger" v-if="scope.row.role == 2" >管理员</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="账号状态" width="width" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status == 1" >正常</el-tag>
            <el-tag type="warning" v-if="scope.row.status == 2">失信</el-tag>
            <el-tag type="danger" v-if="scope.row.status == 3">注销</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-button type="warning" icon="el-icon-edit" @click="edit(scope.row)">修 改</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="logoff(scope.row)">注 销</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination 
        v-show="flag"
        :currentPage="currentPage" 
        :total="total" 
        :limit="limit" 
        :page-sizes='pageSizes'
        @handleCurrentChange="handleCurrentChange" 
        @handleSizeChange="handleSizeChange"/>
    </el-card>
    <!-- 修改 -->
    <el-dialog title="用户信息更新" :visible.sync="isShow" width="width">
      <div style="width:350px; margin:0px auto">
        <el-form ref="form" :model="userinfo" label-width="100px" >
          <el-form-item label="用户ID：">
          <span style="font-size:16px;font-weight:700;"> {{userinfo.name}} </span>
          </el-form-item>
          <el-form-item label="用户姓名：">
            <span style="font-size:16px;font-weight:700;"> {{userinfo.username}} </span>
          </el-form-item>
          <el-form-item label="学  号：">
            <span style="font-size:16px;font-weight:700;"> {{userinfo.xuehao}} </span>
            
          </el-form-item>
          <el-form-item label="性  别：">
            <span style="font-size:16px;font-weight:700;"> {{userinfo.sex}} </span>
            
          </el-form-item>
          <el-form-item label="邮  箱：">
            <span style="font-size:16px;font-weight:700;"> {{userinfo.email}} </span>
          
          </el-form-item>
          <el-form-item label="联系电话：">
            <span style="font-size:16px;font-weight:700;"> {{userinfo.phone}} </span>
            
          </el-form-item>
          <el-form-item label="用户角色：">
            <el-radio-group v-model="userinfo.role">
              <el-radio :label="1">用户</el-radio>
              <el-radio :label="2">管理员</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="账号状态：">
            <el-radio-group v-model="userinfo.status">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
              <el-radio :label="3">已注销</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" style="text-align:center">
        <el-button style="margin:0px 25px" @click="isShow = false">取 消</el-button>
        <el-button style="margin:0px 25px" type="primary" @click="submit">提交修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',

  data() {
    return {
      usersList:[],
      flag:true,
      userinfo:{role:'',status:''},
      search:'',
      isShow:false,
      data:[],
      currentPage: 1,
            limit: 5,
            total: 0,
            pageSizes:[5,10,15,20]
    }
  },

  mounted() {
    this.getAllUsers()
  },

  methods: {
    // 获取所有的用户
    async getAllUsers(){
      const results = await this.$store.dispatch('getAllUsers')
      if(results.code == 200 ){
        this.data = results.data
        this.usersList = []
        this.usersList = results.data.slice((this.currentPage-1)*this.limit,this.limit*this.currentPage);
        this.total = results.data.length
      }else{
        this.$notify.error({title:'获取数据失败'})
      }
    },

    // 编辑
    edit(row){
      this.isShow = true
      this.userinfo = row
      this.userinfo.role = row.role
      this.userinfo.status = row.status
      // console.log(this.userinfo)
      // console.log(row)
    },

    // 提交修改
    async submit(){
      let params = {
        uid:this.userinfo.uid,
        role:this.userinfo.role,
        status:this.userinfo.status
      }
      // console.log(params)
      const result = await this.$store.dispatch('updateRoleAndStatus',params)
      if(result.code == 200){
        this.$notify.success({title:'更新成功'})
        this.isShow = false
      }else{
        this.$notify.error({title:'更新失败'})
      }
    },

    // 注销账户
    async logoff(row){
      const params1 ={uid:row.uid,role:row.role,status:3}
      const result = await this.$store.dispatch('updateRoleAndStatus',params1)
      if(result.code ==200){
        this.$notify.success({title:'注销成功'})
        // 刷新用户信息
        this.getAllUsers()
      }else{
        this.$notify.error({title:'注销失败'})
      }
    },

    // 分页器
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getAllUsers();
        },
        handleSizeChange(val) {
            this.limit = val
            this.currentPage = 1;
            this.getAllUsers();
        },
    // 搜索
    toSearch() {
      if (this.search) {
        let that = this
        this.flag = false
        this.usersList = []
        this.usersList = this.data.filter(item => {
          return Object.keys(item).some(function (key) {
            //搜索所有的内容
            return String(item[key]).toLowerCase().indexOf(that.search) > -1;
            //只搜索问题内容（某一个key）
            // return (
            //   String(product["questions"]).toLowerCase().indexOf(search) > -1
            // );
          });
        });
        // return searchVal;
        // console.log(this.showList)
      } else {
        this.flag = true
        this.getAllUsers();
      }
    },
    SearchList(){
      if(!this.search){
        this.getAllUsers()
        this.flag = true
      }
    }
  }
}
</script>

<style scoped>
.search {
  width: 200px;
  border-radius: 30px;
  position: relative;
  right: -1000px;
}
.btn {
  position: relative;
  right: -1020px;
}
.input{
  width: 180px;
}
</style>
<style>
.el-table__row{
  height: 90px!important;
}
</style>
