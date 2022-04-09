<template>
  <div>
    <el-table :data="myApply" style="width: 100%; margin: 10px" stripe :default-sort = "{prop: 'usetime', order: 'descending'}">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column
        prop="gid"
        label="活动ID"
        width="width"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="type"
        label="场地类型"
        width="width"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="position"
        label="场地位置"
        width="width"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="usetime"
        label="预约时间"
        width="width"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="审批状态"
        width="width"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.status == '审核中'">审核中</el-tag>
          <el-tag type="success" v-if="scope.row.status == '通过'">通过</el-tag>
          <el-tag type="danger" v-if="scope.row.status == '驳回'">驳回</el-tag>
          <el-tag type="warning" v-if="scope.row.status == '取消申请'">取消申请</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button @click="exhibition(row)">详情</el-button>
          <el-button type="warning" v-if="row.status == '审核中'" @click="cancel(row)">取消申请</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <pagination 
        :currentPage="currentPage" 
        :total="total" 
        :limit="limit" 
        :page-sizes='pageSizes'
        @handleCurrentChange="handleCurrentChange" 
        @handleSizeChange="handleSizeChange"/>
    <el-dialog
      title="详情页"
      :model="showlist"
      :visible.sync="isShow"
      class="dialog"
    >
      <el-form label-position="rigth" label-width="180px" class="form">
        <el-form-item label="活动ID:">
          <span > <b><h3>{{showlist.gid}}</h3></b> </span>
        </el-form-item>
        <el-form-item label="场地类型:">
          <span ><b><h3>{{showlist.type}}</h3></b></span>
        </el-form-item>
        <el-form-item label="场地位置:">
          <span ><b><h3>{{showlist.position}}</h3></b></span>
        </el-form-item>
        <el-form-item label="申请时间:">
          <span ><b><h3>{{showlist.apptime}}</h3></b></span>
        </el-form-item>
        <el-form-item label="预约时间:">
          <span ><b><h3>{{showlist.usetime}}</h3></b></span>
        </el-form-item>
        <el-form-item label="申请状态">
          <el-radio-group v-model="showlist.status" disabled>
            <el-radio label="通过" size="small" ></el-radio>
            <el-radio label="审核中" size="small" ></el-radio>
            <el-radio label="取消申请" size="small" ></el-radio>
            <el-radio label="驳回" size="small" ></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="isShow = false">返 回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Field",

  data() {
    return {
      isShow: false,
      myApply: [],
      showlist: {},
      currentPage: 1,
      limit: 5,
      total: 0,
      pageSizes:[5,10,15,20]
    };
  },

  mounted() {
    this.getFieldApplyInfo();
  },

  methods: {
    // 获取用户申请数据
    async getFieldApplyInfo() {
      // console.log(this.$store)
      const uid = this.$store.state.user.uid;
      // console.log(uid)
      let result = await this.$store.dispatch("getVenueApply", uid);
      // console.log(result)
      if (result.message) {
        this.$message.error(result.message);
      } else {
        this.myApply = result.slice((this.currentPage-1)*this.limit,this.limit*this.currentPage);
        this.total = result.length
        // console.log(this.myApply.time)
        this.myApply.forEach((item) => {
          item.gametime = this.$moment(item.gametime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          item.apptime = this.$moment(item.apptime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          item.usetime = this.$moment(item.day).format("YYYY-MM-DD") +' '+item.period;
          switch (item.status) {
            case "0":
              item.status = "审核中";
              break;
            case "1":
              item.status = "通过";
              break;
            case "2":
              item.status = "驳回";
              break;
            case "3":
              item.status = "取消申请";
              break;
          }
        });
      }
    },
    // 展示指定申请的详情
    exhibition(row) {
      this.showlist = row;
      this.isShow = true;
      // console.log(row)
    },

    // 取消申请
    cancel(row){
      this.$comfirm('请确认取消该条申请','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(async () =>{
          const result = await this.$store.dispatch('cancel',{vid:row.vid,gid:row.gid})
          if(result.code = 200){
            this.getFieldApplyInfo();
            this.$notify.success({
              title:'成功',
              message:'取消成功'
            })
            this.getFieldApplyInfo()
          }else{
            this.$notify.error({
              title:'失败',
              message:'取消失败'
            })
          }
        })
      
    },

    // 分页器
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getFieldApplyInfo();
        },
        handleSizeChange(val) {
            this.limit = val
            this.currentPage = 1;
            this.getFieldApplyInfo();
        }
  },
};
</script>

<style lang="scss" scoped>
.form {
  width: 480px;
  position: relative;
  left: 50%;
  margin-left: -225px;
  top: 40%;
}
h3{
  margin: 0;
  color: rgb(4, 28, 248);
}
</style>
<style scoped>
.form /deep/ .el-radio {
    /* color: #574e4e!important; */
    margin-right: 5px!important;
}
.form /deep/ .el-radio__input.is-disabled+span.el-radio__label {
  /* color: #574e4e!important; */
  /* font-size: 16px!important; */
  font-weight: bold!important;
}
.form /deep/ .el-radio__input.is-checked+.el-radio__label {
  color: rgb(55, 0, 255)!important;
}
</style>
