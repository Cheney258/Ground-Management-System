<template>
  <div class="div">
    <el-card>
      <div slot="header">
        <el-button type="primary" style="margin-left: 100px" @click="open">+ 新建</el-button>
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
          <el-table-column  label="操作" width="width" align='center'>
            <template slot-scope="{row}">
              <el-button type="warning"  @click="edit(row)">修改</el-button>
              <el-button type="danger"  @click="deletes(row)">删除</el-button>
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
    <el-dialog
      :visible.sync="isshow"
      center
      width="700px">
      <template slot="title">
        <h3><b>{{activityInfo.activityName==''?'新建':'修改'}}</b></h3>
      </template>
      <el-form ref="form" :rules="rules" :model="activityInfo" label-width="180" style="width:500px;margin:0 auto">
        
        <el-form-item label="活动名称" class="form_item" prop="activityName">
          <el-input v-model="activityInfo.activityName" class="input"></el-input>
        </el-form-item>
      
        <el-form-item label="活动类型" class="form_item" prop="activityType">
          <el-input v-model="activityInfo.activityType" class="input"></el-input>
        </el-form-item>
      
        <el-form-item label="举办单位" class="form_item" prop="department">
          <el-input v-model="activityInfo.department" class="input"></el-input>
        </el-form-item>
      
        <el-form-item label="活动时间" class="form_item" prop="value">
          <el-date-picker
            v-model="activityInfo.value"
            type="daterange"
            style="width:250px"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      
        <el-form-item label="活动描述" class="form_item" prop="des">
          <el-input v-model="activityInfo.des" class="input"></el-input>
        </el-form-item>
      
        <el-form-item label="活动状态"  prop="status">
          <template slot-scope="">
            <el-radio-group v-model="activityInfo.status" style="width:400px">
              <el-radio :label="0">进行中</el-radio>
              <el-radio :label="1">已结束</el-radio>
              <el-radio :label="2">暂停进行</el-radio>
              <el-radio :label="3">活动取消</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="newAdd=false;isshow = false">取 消</el-button>
        <el-button type="primary" v-if="newAdd" @click="addActivity">确 定</el-button>
        <el-button type="primary" v-else @click="submit">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'GameProject',

  data() {
    return {
      isshow:false,
      newAdd:false,
      search:'',
      flag:true,
      showList:[],
      data:[],
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
        this.showList = result.data
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
    open(){
      Object.keys(this.activityInfo).map(key => this.activityInfo[key] = '')
      this.newAdd=true;
      this.isshow = true;
    },
    // 新增活动
    addActivity(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$confirm('请确认提交表单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            this.activityInfo.dateTime= this.$moment(this.activityInfo.value[0]).format("YYYY-MM-DD")+'~'+this.$moment(this.activityInfo.value[1]).format('YYYY-MM-DD')
            let result = await this.$store.dispatch('addActivity', this.activityInfo)
            if(result.code==200){
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success'
              })
              this.getAllActivity()
              this.isshow = false
              this.newAdd = false
            }else{
              this.$message({
                type: 'error',
                message: '添加失败！'
              })
              this.isshow = false
            }
          })
          
        }
      }) 
    },
    edit(row){
      this.activityInfo = row
      this.activityInfo.value = row.dateTime.split('~')
      // console.log(this.activityInfo)
      this.isshow = true
    },
    submit(){
      this.$confirm('请确认提交修改', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await this.$store.dispatch('updateActivityInfo',this.activityInfo)
        if(result.code==200){
          this.$notify({
            title: '成功',
            message: '活动修改成功！',
            type: 'success'
          })
          this.getAllActivity()
          this.isshow = false
        }else{
          this.$message({
            type: 'error',
            message: '活动修改失败!'
          })
        }
      })
    },
    // 删除活动
    deletes(row){
      this.$confirm('是否确认删除该条数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await this.$store.dispatch('deleteActivity',{id:row.id})
        if(result.code==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          })
          this.getAllActivity()
        }else{
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
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
