<template>
  <div>
    <el-card>
      <div slot="header">
        <el-radio-group
          v-model="select"
          @change="change"
          style="margin-left: 100px"
        >
          <el-radio-button label="1">未赔偿</el-radio-button>
          <el-radio-button label="2">已赔偿</el-radio-button>
        </el-radio-group>
        <!-- <el-button type="primary" style="margin-left: 50px" @click="isShow == true"> + 新增 </el-button> -->
        <!-- <el-input
          v-model="search"
          placeholder="输入关键字搜索"
          class="search"
        ></el-input>
        <el-button type="primary" class="btn">搜索</el-button> -->
      </div>
      <div>
        <el-table :data="showList" style="width: 100%" stripe>
          <el-table-column
            prop="eid"
            label="器材ID"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="type"
            label="器材类型"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="username"
            label="姓名"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="Cstatus"
            label="处理状态"
            width="width"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-tag type="danger" v-if="row.Cstatus == 0">未赔偿</el-tag>
              <el-tag type="success" v-if="row.Cstatus == 1">已赔偿</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="compensation"
            label="赔偿金额"
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
              <el-tag type="warning" v-if="row.status == 1">报修</el-tag>
              <el-tag type="danger" v-if="row.status == 2">损坏</el-tag>
              <el-tag type="info" v-if="row.status == 3">报废</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            v-if="select == 1"
            prop="prop"
            label="操作"
            width="width"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-button type="info" v-if="select == 1" @click="handle(row)"
                >已赔偿</el-button
              >
              <el-button
                type="warning"
                v-if="select == 1"
                @click="noCredit(row)"
                >失 信</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="select == 2"
            prop="time"
            label="赔偿时间"
            width="width"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{ row.time }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        :currentPage="currentPage"
        :total="total"
        :limit="limit"
        :page-sizes="pageSizes"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Damage",

  data() {
    return {
      search: "",
      select: 1,
      damageList: [],
      showList: [],
      newdDamage: {},
      currentPage: 1,
      limit: 5,
      total: 0,
      pageSizes:[5,10,15,20]
    };
  },

  mounted() {
    this.getCompensationList();
  },

  methods: {
    // 获取赔偿列表
    async getCompensationList() {
      const result = await this.$store.dispatch("getCompensation");
      if (result.code == 200) {
        this.damageList = result.data;
        this.showList = [];
        let temArr = [];
        this.damageList.forEach((item) => {
          item.time = this.$moment(item.time).format("YYYY-MM-DD");
          if (item.Cstatus == 0) {
            temArr.push(item);
          }
        });
        this.showList = temArr.slice(
          (this.currentPage - 1) * this.limit,
          this.limit * this.currentPage
        );
        this.total = temArr.length;
      } else {
        this.$message.error("数据获取异常");
      }
    },
    change() {
      this.currentPage = 1;
      this.zidingyi();
    },
    async handle(row) {
      let time = this.$moment().format("YYYY-MM-DD");
      const result = await this.$store.dispatch("compensationover", {
        id: row.id,
        time: time,
      });
      if (result.code == 200) {
        this.$notify.success({ title: "操作成功" });
        this.getCompensationList();
      } else {
        this.$notify.error({ title: "操作失败" });
      }
    },

    noCredit(row) {
      this.$comfirm("是否确认将用户列入失信名单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      }).then(async () => {
        const result = await this.$store.dispatch("dealNocredit", {
          uid: row.uid,
        });
        if (result.code == 200) {
          this.$notify.success({
            title: "已列入失信名单",
            message: "该用户将不能进行任何申请操作",
          });
          // this.getCompensationList()
        } else {
          this.$notify.error({ title: "操作失败" });
        }
      });
    },
    // 分页器
    handleCurrentChange(val) {
      this.currentPage = val;
      this.zidingyi();
    },
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
      this.getCompensationList();
    },

    zidingyi() {
      this.showList = [];
      let temArr = [];
      if (this.select == 1) {
        this.damageList.forEach((item) => {
          if (item.Cstatus == 0) {
            temArr.push(item);
          }
        });
      } else {
        this.damageList.forEach((item) => {
          if (item.Cstatus == 1) {
            temArr.push(item);
          }
        });
      }
      this.showList = temArr.slice(
        (this.currentPage - 1) * this.limit,
        this.limit * this.currentPage
      );
      this.total = temArr.length;
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  width: 200px;
  border-radius: 30px;
  position: relative;
  right: -900px;
}
.btn {
  position: relative;
  right: -920px;
}
</style>
