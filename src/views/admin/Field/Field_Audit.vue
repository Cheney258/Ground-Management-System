<template>
  <div>
    <el-card>
      <div slot="header">
        <el-radio-group
          v-model="select"
          @change="change"
          style="margin-left: 100px"
        >
          <el-radio-button label="1">未审核</el-radio-button>
          <el-radio-button label="2">已审核</el-radio-button>
        </el-radio-group>
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
        <el-table :data="showList" style="width: 100%">
          <el-table-column type="index" label="序号" width="60">
          </el-table-column>
          <el-table-column
            prop="pid"
            label="场地ID"
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
          >
          </el-table-column>
          <el-table-column
            prop="username"
            label="申请人"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="apptime"
            label="申请时间"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="status"
            label="申请状态"
            width="width"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-tag type="info" v-if="row.status == 0">未审核</el-tag>
              <el-tag type="success" v-if="row.status == 1">通过</el-tag>
              <el-tag type="danger" v-if="row.status == 2">驳回</el-tag>
              <el-tag type="warning" v-if="row.status == 3">取消申请</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="width"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-button
                type="success"
                v-if="row.status == 0"
                @click="handle(row, 'accept')"
                >通 过</el-button
              >
              <el-button
                type="warning"
                v-if="row.status == 0"
                @click="handle(row, 'refuse')"
                >驳 回</el-button
              >
              <el-button
                type="primary"
                v-if="row.status != 0"
                @click="details(row)"
                >查看详情</el-button
              >
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

    <el-dialog title="" :visible.sync="dialogVisible" width="width">
      <div>
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="申请编号：">
            <span>{{ showDetails.gid }}</span>
          </el-form-item>
          <el-form-item label="场地ID：">
            <span>{{ showDetails.pid }}</span>
          </el-form-item>
          <el-form-item label="场地类型：">
            <span>{{ showDetails.type }}</span>
          </el-form-item>
          <el-form-item label="场地位置：">
            <span>{{ showDetails.position }}</span>
          </el-form-item>
          <el-form-item label="申请人：">
            <span>{{ showDetails.username }}</span>
          </el-form-item>
          <el-form-item label="预约时间：">
            <span>{{ showDetails.gametime }}</span>
          </el-form-item>
          <el-form-item label="申请时间：">
            <span>{{ showDetails.apptime }}</span>
          </el-form-item>
          <el-form-item label="申请状态：">
            <span v-if="showDetails.status == 0">未审核</span>
            <span v-if="showDetails.status == 1">通过</span>
            <span v-if="showDetails.status == 2">驳回</span>
            <span v-if="showDetails.status == 3">取消申请</span>
          </el-form-item>
          <el-form-item
            v-if="showDetails.status == 1 || showDetails.status == 2"
            :label="showDetails.status == 1 ? '通过理由:' : '驳回理由:'"
          >
            <span>{{ showDetails.description }}</span>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "FieldAudit",

  data() {
    return {
      select: 1,
      search: "",
      flag:true,
      applyList: [],
      showList: [],
      dialogVisible: false,
      showDetails: {},
      currentPage: 1,
      limit: 5,
      total: 0,
      pageSizes:[5,10,15,20]
    };
  },

  mounted() {
    this.getVenueList();
  },

  methods: {
    // 获取场地申请数据
    async getVenueList() {
      const result = await this.$store.dispatch("getVenueapp");
      this.showList = [];
      this.applyList = result;
      this.showList = this.applyList[0].slice(
        (this.currentPage - 1) * this.limit,
        this.limit * this.currentPage
      );
      this.total = this.applyList[0].length;
    },
    // 切换
    change() {
      this.currentPage=1
      this.flag = true
      this.zidingyi()
    },
    // 查看详情
    details(row) {
      this.dialogVisible = true;
      this.showDetails = row;
    },
    // 审核处理
    handle(row, type) {
      let params = {};
      if (type == "accept") {
        this.$prompt("通过理由", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }).then(async ({ value }) => {
          params = {
            description: value,
            status: 1,
            gid: row.gid,
            dayid:row.dayid,
            timeid:row.timeid,
            pid:row.pid
          };
          const result = await this.$store.dispatch("handlerVenueapp", params);
          if (result.code == 200) {
            this.$notify.success({ title: "已通过" });
            this.getVenueList();
          } else {
            this.$notify.error({ title: "操作失败" });
          }
          this.getVenueList();
        });
      } else {
        this.$prompt("驳回理由", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }).then(async ({ value }) => {
          params = {
            description: value,
            status: 2,
            gid: row.gid,
          };
          const result = await this.$store.dispatch("handlerVenueapp", params);
          if (result.code == 200) {
            this.$notify.success({ title: "已驳回" });
            this.getVenueList();
          } else {
            this.$notify.error({ title: "操作失败" });
          }
          this.getVenueList();
        });
      }
    },
    // 分页器
    handleCurrentChange(val) {
      this.currentPage = val;
      this.zidingyi()
    },
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
      this.getVenueList();
    },
    // 跳转新页的封装方法
    zidingyi(){
      this.showList = [];
      if(this.select==1){
        this.showList =this.applyList[0].slice(
              (this.currentPage - 1) * this.limit,
              this.limit * this.currentPage
            )
        this.total = this.applyList[0].length
      }else{
        this.showList =this.applyList[1].slice(
              (this.currentPage - 1) * this.limit,
              this.limit * this.currentPage
            );
        this.total = this.applyList[1].length
      }
    },
     // 搜索
    toSearch() {
      if (this.search) {
        let that = this
        this.flag = false
        this.showList = []
        if(this.select==1){
          this.showList = this.applyList[0].filter(item => {
            return Object.keys(item).some(function (key) {
              //搜索所有的内容
              return String(item[key]).toLowerCase().indexOf(that.search) > -1;
            });
          });
        }else{
          this.showList = this.applyList[1].filter(item => {
            return Object.keys(item).some(function (key) {
              //搜索所有的内容
              return String(item[key]).toLowerCase().indexOf(that.search) > -1;
            });
          });
        }
      } else {
        this.flag = true
        this.zidingyi();
      }
    },
    // input chagne改变事件
    SearchList(){
      if(!this.search){
        this.zidingyi()
        this.flag = true
      }
    }
  },
};
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
</style>
<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
