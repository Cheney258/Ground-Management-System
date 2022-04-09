<template>
  <div>
    <el-table :data="myApply" style="width: 100%; margin: 10px" stripe>
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column
        prop="type"
        label="器材类型"
        width="width"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="amount" label="数量" width="width" align="center">
      </el-table-column>
      <el-table-column
        prop="renttime"
        label="使用时间"
        width="width"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="审批状态"
        width="width"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.status == '审核中'"
            >审核中</el-tag
          >
          <el-tag type="success" v-if="scope.row.status == '通过'">通过</el-tag>
          <el-tag type="danger" v-if="scope.row.status == '驳回'">驳回</el-tag>
          <el-tag type="warning" v-if="scope.row.status == '取消申请'"
            >取消申请</el-tag
          >
          <el-tag type="danger" v-if="scope.row.status == '未如期归还'"
            >未如期归还</el-tag
          >
        </template>

      </el-table-column>

      <el-table-column
        prop="status"
        label="归还状态"
        width="width"
        align="center" >
      </el-table-column>

      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{ row }">
          <el-button @click="exhibition(row)">详情</el-button>
          <el-button
            type="warning"
            v-if="row.status == '审核中'"
            @click="cancel(row)"
            >取消申请</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :currentPage="currentPage"
      :total="total"
      :limit="limit"
      :page-sizes='pageSizes'
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
    <el-dialog
      title="详情页"
      :model="showlist"
      :visible.sync="isShow"
      class="dialog"
    >
      <el-form label-position="rigth" label-width="100px" class="form">
        <el-form-item label="租用人:">
          <span
            ><b
              ><h3>{{ showlist.username }}</h3></b
            ></span
          >
        </el-form-item>
        <el-form-item label="学号:">
          <span
            ><b
              ><h3>{{ showlist.xuehao }}</h3></b
            ></span
          >
        </el-form-item>
        <el-form-item label="联系电话:">
          <span
            ><b
              ><h3>{{ showlist.phone }}</h3></b
            ></span
          >
        </el-form-item>
        <el-form-item label="器材:">
          <span
            ><b
              ><h3>{{ showlist.type }}</h3></b
            ></span
          >
        </el-form-item>
        <el-form-item label="租用数量:">
          <span
            ><b
              ><h3>{{ showlist.amount }}</h3></b
            ></span
          >
        </el-form-item>
        <el-form-item label="申请时间:" class="input">
          <span
            ><b
              ><h3>{{ showlist.renttime }}</h3></b
            ></span
          >
        </el-form-item>
        <el-form-item label="归还时间:" class="input">
          <span
            ><b
              ><h3>{{ showlist.backtime }}</h3></b
            ></span
          >
        </el-form-item>
        <el-form-item label="申请状态">
          <el-radio-group v-model="showlist.status" size="medium" disabled>
            <el-radio label="通过" size="medium"></el-radio>
            <el-radio label="审核中" size="medium"></el-radio>
            <el-radio label="驳回" size="medium"></el-radio>
            <el-radio label="取消申请" size="medium"></el-radio>
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
  name: "Equip",

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
    this.getEquipApplyInfo();
  },

  methods: {
    // 获取用户申请数据
    async getEquipApplyInfo() {
      // console.log(this.$store)
      const uid = this.$store.state.user.uid;
      // console.log(uid)
      let result = await this.$store.dispatch("getEquipApply", uid);
      console.log(result)
      if (result.message) {
        this.$message.error(result.message);
      } else {
        this.myApply = result.slice(
          (this.currentPage - 1) * this.limit,
          this.limit * this.currentPage
        );
        this.total = result.length;
        // console.log(this.myApply)
        this.myApply.forEach((item) => {
          item.renttime = this.$moment(item.renttime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          item.backtime = this.$moment(item.backtime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          switch (item.status) {
            case 0:
              // console.log('11')
              item.status = "审核中";
              break;
            case 1:
              item.status = "通过";
              break;
            case 2:
              item.status = "驳回";
              break;
            case 3:
              item.status = "取消申请";
              break;
            case 4:
              item.status = "未如期归还";
              break;
          }
          // console.log(item.status)
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
    async cancel(row) {
      this.$comfirm("请确认取消该条申请", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const result = await this.$store.dispatch("cancel", { rid: row.rid });
        if ((result.code = 200)) {
          this.getEquipApplyInfo();
          this.$notify.success({
            title: "成功",
            message: "取消成功",
          });
          this.getEquipApplyInfo()
        } else {
          this.$notify.error({
            title: "失败",
            message: "取消失败",
          });
        }
      });
    },

    // 分页器
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getEquipApplyInfo();
    },
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
      this.getEquipApplyInfo();
    },
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
.el-radio {
  color: #000000;
  margin-right: 0px;
}
h3 {
  margin: 0;
  color: rgb(4, 28, 248);
}
</style>
<style scoped>
.form /deep/ .el-radio {
  /* color: #574e4e!important; */
  margin-right: 5px !important;
}
.form /deep/ .el-radio__input.is-disabled + span.el-radio__label {
  /* color: #574e4e!important; */
  /* font-size: 16px!important; */
  font-weight: bold !important;
}
.form /deep/ .el-radio__input.is-checked + .el-radio__label {
  color: rgb(55, 0, 255) !important;
}
</style>
