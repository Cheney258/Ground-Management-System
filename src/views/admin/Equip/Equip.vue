<template>
  <div>
    <el-card>
      <div slot="header">
        <el-button type="primary" class="btn">切换</el-button>
        <el-select
          v-model="select"
          @change="change"
          clearable
          placeholder="选择器材类型"
          class="select"
        >
          <el-option
            v-for="(item, index) in equiptype"
            :key="index"
            :label="item.type"
            :value="item.tid"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          style="margin-left: 100px"
          @click="isShow = true"
        >
          + 新增
        </el-button>
        <el-button type="warning" style="margin-left: 30px" @click="deletes"
          >批量删除</el-button
        >
      </div>
      <div>
        <el-table
          :data="showList"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          stripe
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="eid" label="器材ID" width="120" align="center">
          </el-table-column>
          <el-table-column
            prop="type"
            label="器材类型"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="equipname"
            label="器材名称"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="rentstatus"
            label="借用状态"
            width="width"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-tag type="success" v-if="row.rentstatus == 0">未借出</el-tag>
              <el-tag type="danger" v-if="row.rentstatus == 1">已借出</el-tag>
              <el-tag type="danger" v-if="row.rentstatus == 2">未归还</el-tag>
            </template>
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
            prop="prop"
            label="操作"
            width="width"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-button type="success" @click="handle(row, 0)"
                >已修复</el-button
              >
              <el-button type="info" @click="handle(row, 1)">报修</el-button>
              <el-button type="warning" @click="handle(row, 2)">报废</el-button>
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

    <el-dialog title="新增器材" :visible.sync="isShow" width="500px">
      <div style="width: 520px; margin: 50px auto">
        <el-form
          :model="equipinfo"
          label-width="202px"
          :rules="rules"
          ref="form"
          class="form"
        >
          <el-form-item label="器材类型：" prop="type">
            <el-input v-model="equipinfo.type" style="width: 202px"></el-input>
          </el-form-item>
          <el-form-item label="器材ID：" prop="eid">
            <el-input v-model="equipinfo.eid" style="width: 202px"></el-input>
          </el-form-item>
          <el-form-item label="器材名称：" prop="equipname">
            <el-input
              v-model="equipinfo.equipname"
              style="width: 202px"
            ></el-input>
          </el-form-item>
          <el-form-item label="损坏赔偿：">
            <el-input
              v-model="equipinfo.compensation"
              style="width: 202px"
              placeholder="如：20元/件"
            ></el-input>
          </el-form-item>
          <el-form-item label="*注意：" prop="equipname">
            <span style="color: red; font-weight: 700"
              >已经存在的器材类型不需要填损失赔偿</span
            >
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
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
      select: "",
      equipList: [],
      showList: [],
      equiptype: [],
      equipinfo: {
        eid: "",
        type: "",
        equipname: "",
        compensation: "",
      },
      currentPage: 1,
      limit: 5,
      total: 0,
      pageSizes:[5,10,15,20],
      rules: {
        eid: [
          { required: true, message: "必填项", trigger: "blur" },
          { pattern: /^\d{4}$/, message: "请输入4位数字", trigger: "blur" },
        ],
        type: [{ required: true, message: "必填项", trigger: "blur" }],
        equipname: [{ required: true, message: "必填项", trigger: "blur" }],
        compensation: [{ required: false }],
      },
    };
  },

  mounted() {
    this.getAllEquipInfo();
  },

  methods: {
    // 获取全部器材信息
    async getAllEquipInfo() {
      this.showList = [];
      const results = await this.$store.dispatch("getAllEquipInfo");
      if (results.code == 200) {
        results.data.forEach((item) => {
          // this.equiptype.push({tid:item.tid,type:item.type});
          if (!this.equiptype.some((res) => res.tid === item.tid)) {
            this.equiptype.push({ tid: item.tid, type: item.type });
          }
        });
        this.equipList = results.data;
        this.showList = this.equipList.slice(
          (this.currentPage - 1) * this.limit,
          this.limit * this.currentPage
        );
        this.total = this.equipList.length;
        // 类型去重
        // this.equiptype = Array.from(new Set(this.equiptype))
        // this.equiptype = [...new Set(this.equiptype)];

        // console.log(this.equiptype)
      }
    },

    // 展示相应器材数据
    change() {
      this.currentPage = 1;
      this.zidingyi();
    },

    // 保修或者报废
    async handle(row, type) {
      // console.log(row.status, type);
      let params = {};
      type == 0
        ? (params = { eid: row.eid, status: 0 })
        : type == 1
        ? (params = { eid: row.eid, status: 1 })
        : (params = { eid: row.eid, status: 3 });
      if (row.rentstatus == 0) {
        if (type == 1) {
          // console.log('a')
          if (row.status == 0 || row.status == 2) {
            // console.log('b')
            const results = await this.$store.dispatch("handleEquip", params);
            if (results.code == 200) {
              this.$notify.success({
                title: "成功",
                message: "报修成功",
              });
              this.getAllEquipInfo();
            } else {
              this.$notify.error({
                title: "失败",
                message: "报修失败",
              });
            }
          } else if (row.status == 1) {
            // console.log('c')
            this.$notify.warning({
              title: "提示",
              message: "器材已报修，不可重复操作",
            });
          } else {
            // console.log('d')
            this.$notify.error({
              title: "提示",
              message: "器材已报废，不能进行该操作",
            });
          }
        } else if (type == 0) {
          console.log("a");
          if (row.status == 3) {
            this.$notify.warning({
              title: "提示",
              message: "该器材已报废",
            });
          } else {
            const results = await this.$store.dispatch("handleEquip", params);
            if (results.code == 200) {
              this.$notify.success({
                title: "成功",
                message: "状态更改成功",
              });
              this.getAllEquipInfo();
            } else {
              this.$notify.error({
                title: "失败",
                message: "状态更改失败",
              });
            }
          }
        } else {
          if (row.status != 3) {
            const results = await this.$store.dispatch("handleEquip", params);
            if (results.code == 200) {
              this.$notify.success({
                title: "成功",
                message: "报废成功",
              });
              this.getAllEquipInfo();
            } else {
              this.$notify.error({
                title: "失败",
                message: "报废失败",
              });
            }
          } else {
            this.$notify.error({
              title: "提示",
              message: "器材已报废，不能进行该操作",
            });
          }
        }
      } else {
        this.$notify.warning({
          title: "提示",
          message: "器材被借用，不能进行操作",
        });
      }
    },

    // 新增器材
    add() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.equipinfo.eid = "EQ" + this.equipinfo.eid;
          const results = await this.$store.dispatch(
            "addEquip",
            this.equipinfo
          );
          if (results.code == 200) {
            this.$notify.success({
              title: "成功",
              message: "添加成功",
            });
            this.getAllEquipInfo();
            this.isShow = false;
          } else {
            this.$notify.error({
              title: "失败",
              message: "添加失败",
            });
          }
        }
      });
    },
    // 批量选中
    handleSelectionChange(val) {
      this.selectList = val;
      console.log(val);
    },
    // 批量删除
    deletes() {
      let deleteList = [];
      try {
        this.selectList.forEach((item) => {
          this.$store.dispatch("deleteEquip", item);
        });
        this.getAllEquipInfo();
        this.$notify.success({
          title: "成功",
          message: "删除成功",
        });
      } catch (error) {
        this.$notify.error({
          title: "失败",
          message: "删除失败",
        });
      }
    },
    // 分页器
    handleCurrentChange(val) {
      this.currentPage = val;
      this.zidingyi();
    },
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
      this.getAllEquipInfo();
    },
    zidingyi() {
      this.showList = [];
      if (this.select == "") {
        this.showList = this.equipList.slice(
          (this.currentPage - 1) * this.limit,
          this.limit * this.currentPage
        );
        this.total = this.equipList.length;
      } else {
        let temArr = [];
        // console.log(this.select)
        this.equipList.forEach((item) => {
          if (this.select == item.tid) {
            temArr.push(item);
          }
        this.showList = temArr.slice(
          (this.currentPage - 1) * this.limit,
          this.limit * this.currentPage
        );
        this.total = temArr.length;
        });
      }
    },
  },
};
</script>

<style scoped>
.form {
  width: 450px;
  position: relative;
  left: 50%;
  margin-left: -300px;
  top: 60%;
}
.select{
    display: inline-block;
    width:120px;
    
}
.select /deep/ .el-input__inner{
    border-radius: 0 5px 5px 0!important; 
}
.btn{
    margin-left: 15%;
    border-radius: 5px 0 0 5px;
}
</style>
