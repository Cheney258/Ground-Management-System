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
        <el-table
          :data="showList"
          :default-sort="{ prop: 'apptime', order: 'descending' }"
          stripe
          style="width: 100%"
        >
          <el-table-column
            type="expand"
            header-align="center"
            prop="prop"
            label=""
          >
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="活动编号">
                  <span>{{ props.row.gid }}</span>
                </el-form-item>
                <el-form-item label="活动类型">
                  <span>{{ props.row.activityType }}</span>
                </el-form-item>
                <el-form-item label="活动名称">
                  <span>{{ props.row.gamename }}</span>
                </el-form-item>
                <el-form-item label="申请人">
                  <span>{{ props.row.username }}</span>
                </el-form-item>
                <el-form-item label="活动人群">
                  <span>{{ props.row.class }}</span>
                </el-form-item>
                <el-form-item label="申请时间">
                  <span>{{ props.row.apptime }}</span>
                </el-form-item>
                <el-form-item label="活动时间">
                  <span>{{ props.row.gametime }}</span>
                </el-form-item>
                <el-form-item label="申请描述">
                  <span>{{ props.row.description }}</span>
                </el-form-item>
                <el-form-item label="申请状态">
                  <span v-if="props.row.status == 0">未审核</span>
                  <span v-if="props.row.status == 1">通过</span>
                  <span v-if="props.row.status == 2">驳回</span>
                  <span v-if="props.row.status == 3">取消申请</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            prop="gid"
            label="活动编号"
            sortable
            width="150"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="gamename"
            label="活动名称"
            width="200"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="username"
            label="申请人"
            width="150"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="apptime"
            label="申请时间"
            sortable
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="gametime"
            label="活动时间"
            sortable
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="status"
            label="申请状态"
            width="250"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.status == 0">未审核</el-tag>
              <el-tag type="success" v-if="scope.row.status == 1">通过</el-tag>
              <el-tag type="danger" v-if="scope.row.status == 2"> 驳回</el-tag>
              <el-tag type="warning" v-if="scope.row.status == 3"
                >已取消申请</el-tag
              >
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
          <el-form-item label="活动编号：">
            <span>{{ showDetails.gid }}</span>
          </el-form-item>
          <el-form-item label="活动类型：">
            <span>{{ showDetails.activityType }}</span>
          </el-form-item>
          <el-form-item label="活动名称：">
            <span>{{ showDetails.gamename }}</span>
          </el-form-item>
          <el-form-item label="申请人：">
            <span>{{ showDetails.username }}</span>
          </el-form-item>
          <el-form-item label="活动人群：">
            <span>{{ showDetails.class }}</span>
          </el-form-item>
          <el-form-item label="申请时间：">
            <span>{{ showDetails.apptime }}</span>
          </el-form-item>
          <el-form-item label="活动时间：">
            <span>{{ showDetails.gametime }}</span>
          </el-form-item>
          <el-form-item label="申请描述：">
            <span>{{ showDetails.description }}</span>
          </el-form-item>
          <el-form-item label="申请状态：">
            <span v-if="showDetails.status == 0">未审核</span>
            <span v-if="showDetails.status == 1">通过</span>
            <span v-if="showDetails.status == 2">驳回</span>
            <span v-if="showDetails.status == 3">取消申请</span>
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
  name: "GameAudit",

  data() {
    return {
      search: "",
      select: 1,
      flag:true,
      dialogVisible: false,
      data: [],
      gameList: [],
      showList: [],
      showDetails: {},
      currentPage: 1,
      limit: 5,
      total: 0,
      pageSizes:[5,10,15,20]
    };
  },

  mounted() {
    this.getAllGameApply();
  },

  methods: {
    // 获取全部活动申请
    async getAllGameApply() {
      this.gameList = [];
      const results = await this.$store.dispatch("getAllGameApply");

      if (results.code == 200) {
        this.data = results.data;
        results.data.forEach((item) => {
          item.gametime = this.$moment(item.gametime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          item.apptime = this.$moment(item.apptime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          if (item.status == 0) {
            this.gameList.push(item);
          }
          this.showList = [];
          this.showList = this.gameList.slice(
            (this.currentPage - 1) * this.limit,
            this.limit * this.currentPage
          );
          this.total = this.gameList.length;
        });
      } else {
        this.$notify.error({
          title: "错误",
          message: "数据获取失败！",
        });
      }
    },

    // 控制展示的数据
    change() {
      this.currentPage = 1;
      this.flag = true
      this.zidingyi()
    },

    // 通过或驳回申请
    async handle(row, type) {
      if (row.status == 0) {
        let params = {};
        type == "accept"
          ? (params = {
              code: "WY" + Math.round((Math.random() + 1) * 100000),
              gid: row.gid,
              status: 1,
            })
          : (params = {
              code: "",
              gid: row.gid,
              status: 2,
            });
        const result = await this.$store.dispatch(
          "acceptOrRefuseGameApply",
          params
        );
        if (result.code == 200) {
          this.getAllGameApply();
          this.$notify.success({
            title: "成功提示",
            message: "操作成功",
          });
        } else {
          this.$notify.error({
            title: "失败提醒",
            message: "操作失败",
          });
        }
      } else {
        this.$notify.warning({ message: "该记录已审核！" });
      }
    },

    // 某条申请详情
    details(row) {
      this.showDetails = row;
      this.dialogVisible = true;
    },
    // 分页器
    handleCurrentChange(val) {
      this.currentPage = val;
      this.zidingyi()
    },
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
      this.change();
    },
    // 跳转新页的封装方法
    zidingyi(){
      this.showList = [];
      this.gameList = [];
      if (this.select == 1) {
        // console.log(11)
        this.data.forEach((item) => {
          if (item.status == 0) {
            this.gameList.push(item);
          }
        });
      } else {
        this.data.forEach((item) => {
          if (item.status != 0) {
            this.gameList.push(item);
          }
        });
      }
      this.total = this.gameList.length;
      this.showList = this.gameList.slice(
        (this.currentPage - 1) * this.limit,
        this.limit * this.currentPage
      );
    },
     // 搜索
    toSearch() {
      if (this.search) {
        let that = this
        this.flag = false
        this.showList = []
          this.showList = this.gameList.filter(item => {
            return Object.keys(item).some(function (key) {
              //搜索所有的内容
              return String(item[key]).toLowerCase().indexOf(that.search) > -1;
            });
          });
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
