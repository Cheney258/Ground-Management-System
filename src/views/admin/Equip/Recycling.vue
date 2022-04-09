<template>
  <div>
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
        <el-table :data="rentList" style="width: 100%">
          <el-table-column
            prop="eid"
            label="器材ID"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="type"
            label="类型"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="renttime"
            label="租用时间"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="backtime"
            label="计划归还时间"
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
            prop="status"
            label="器材状态"
            width="width"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-tag type="success" v-if="row.status == 0">完好</el-tag>
              <el-tag type="info" v-if="row.status == 1">保修</el-tag>
              <el-tag type="warning" v-if="row.status == 2">损坏</el-tag>
              <el-tag type="danger" v-if="row.status == 3">报废</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="phone"
            label="联系电话"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop=""
            label="借用状态"
            width="width"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-if="Date.parse(row.backtime) > new Date()"
                >正在使用</el-tag
              >
              <el-tag type="danger" v-if="Date.parse(row.backtime) < new Date()"
                >过期未还</el-tag
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
                type="info"
                @click="
                  rows = row;
                  isShow = true;
                "
                >回收</el-button
              >
              <el-button type="danger" @click="noCredit(row)">失信</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="flag"
        :currentPage="currentPage"
        :total="total"
        :limit="limit"
        :page-sizes="pageSizes"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </el-card>
    <el-dialog title="提示" :visible.sync="isShow" width="400px">
      <div style="text-align: center; margin-top: -50px">
        <h3>请确认器材状态</h3>
        <el-button type="success" @click="handle(0)">完好</el-button>
        <el-button type="danger" @click="handle(2)">损坏</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Recycling",

  data() {
    return {
      isShow: false,
      search: "",
      flag:true,
      data:[],
      rows: {},
      rentList: [],
      currentPage: 1,
      limit: 5,
      total: 0,
      pageSizes:[5,10,15,20]
    };
  },

  mounted() {
    this.getRecyclingEquipList();
  },

  methods: {
    // 器材回收列表数据
    async getRecyclingEquipList() {
      const result = await this.$store.dispatch("getRecyclingEquiplist");
      if (result.code == 200) {
        this.data = result.data
        result.data.forEach((item) => {
          item.renttime = this.$moment(item.renttime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          item.backtime = this.$moment(item.backtime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        });
        this.rentList = [];
        this.rentList = result.data.slice(
            (this.currentPage - 1) * this.limit,
            this.limit * this.currentPage
          );
          this.total = result.data.length;
      } else {
        this.$message.error("数据获取异常");
      }
    },

    // 回收处理
    async handle(status) {
      let params = {
        eid: this.rows.eid,
        status: status,
        rid: this.rows.rid,
      };
      const result = await this.$store.dispatch("recyclingEquip", params);
      if (result.code == 200) {
        this.$notify.success({ title: "回收成功" });
        this.getRecyclingEquipList();
        this.isShow = false;
      } else {
        this.$notify.error({ title: "回收失败" });
        this.isShow = false;
      }
    },

    // 失信处理
    // 先更新该笔借用租用状态未4，过期未归还，在设置用户账号status=2异常
    noCredit(row) {
      if (Date.parse(row.backtime) < new Date()) {
        this.$comfirm("是否确认将用户列入失信名单？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        }).then(async () => {
          const result = await this.$store.dispatch("dealNocredit", {
            uid: row.uid,
            eid: row.eid,
          });
          if (result.code == 200) {
            this.$notify.success({
              title: "已列入失信名单",
              message: "该用户将不能进行申请操作",
            });
            this.getRecyclingEquipList();
          } else {
            this.$notify.error({ title: "操作失败" });
          }
        });
      } else {
        this.$message.error("使用期限内，不能进行该操作");
      }
    },
    // 分页器
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getRecyclingEquipList();
    },
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
      this.getRecyclingEquipList();
    },
    // 搜索
    toSearch() {
      if (this.search) {
        let that = this
        this.flag = false
        this.rentList = []
        this.rentList = this.data.filter(item => {
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
        this.getRecyclingEquipList();
      }
    },
    SearchList(){
      if(!this.search){
        this.getRecyclingEquipList()
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
