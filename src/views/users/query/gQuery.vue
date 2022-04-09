<template>
  <div class="div">
    <el-card>
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
      <div>
        <el-table
          :data="showList"
          style="width: 100%">
          <el-table-column prop="" type="index"  label="序号" width="width" align='center'>
          </el-table-column>
          <el-table-column prop="activityName"  label="活动名称" width="width" align='center'>
          </el-table-column>
          <el-table-column prop="activityType"  label="活动类型" width="width" align='center'>
          </el-table-column>
          <el-table-column prop="department"  label="举办单位" width="width" align='center'>
          </el-table-column>
          <el-table-column prop="dateTime"  label="举办时间" width="width" align='center'>
          </el-table-column>
          <el-table-column prop="des"  label="活动描述" width="width" align='center'>
          </el-table-column>
          <el-table-column prop="status"  label="活动状态" width="width" align='center'>
            <template slot-scope="{row}">
              <el-tag type="success" v-if="row.status==0">进行中</el-tag>
              <el-tag type="danger" v-else-if="row.status==1">已结束</el-tag>
              <el-tag type="warning" v-else-if="row.status==2">暂停进行</el-tag>
              <el-tag type="warning" v-else-if="row.status==3">活动取消</el-tag>
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
        @handleSizeChange="handleSizeChange"
      />

    </el-card>
  </div>
</template>

<script>
export default {
  name: 'gQurey',

  data() {
    return {
      isshow:false,
      newAdd:false,
      search:'',
      flag:true,
      data:[],
      showList:[],
      currentPage: 1,
      limit: 5,
      total: 0,
      pageSizes:[5,10,15,20],
      activityInfo:{
        value:'',
        activityName:'',
        activityType:'',
        department:'',
        dateTime:'',
        des:'',
        status:0,
      },
      rules:{
          activityName: [{ required: true, message: "必填项", trigger: "blur" }],
          activityType: [{ required: true, message: "必填项", trigger: "blur" }],
          department: [{ required: true, message: "必填项", trigger: "blur" }],
          value: [{ required: true, message: "必填项", trigger: "blur" }],
          des: [{ required: true, message: "必填项", trigger: "blur" }],
          status: [{ required: true, message: "必填项", trigger: "blur" }],
      }

    }
  },

  mounted() {
    this.getAllActivity()
  },

  methods: {
    // 获取全部活动信息
    async getAllActivity(){
      let result = await this.$store.dispatch('getAllActivityList')
      if(result.code==200){
        this.data = result.data
        this.showList = this.data
        this.showList = [];
          this.showList = result.data.slice(
            (this.currentPage - 1) * this.limit,
            this.limit * this.currentPage
          );
          this.total = result.data.length;
      }else{
        this.$message({
          message: '数据获取失败',
          type: 'error'
        })
      }
    },

    // 分页器
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAllActivity()
    },
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
      this.getAllActivity();
    },
     // 搜索
    toSearch() {
      if (this.search) {
        let that = this
        this.flag = false
        this.showList = []
        this.showList = this.data.filter(item => {
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
        this.getAllActivity();
      }
    },
    SearchList(){
      if(!this.search){
        this.getAllActivity()
        this.flag = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
  width: 250px;
}
.form_item{
  margin-left: 80px;
}
</style>
<style>
.el-table__row{
  height: 90px!important;
}
</style>
