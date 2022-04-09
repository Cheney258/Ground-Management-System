<template>
  <div class="div">
    <el-card>
      <div slot="header">
        <el-button
          type="primary"
          style="margin-left: 100px"
          @click="
            isShow = true;
            newAdd = true;
          "
          >+ 新建</el-button
        >
        <el-radio-group
          v-model="select"
          @change="change"
          style="margin-left: 100px"
        >
          <el-radio-button label="学校课程">学校课程</el-radio-button>
          <el-radio-button label="比赛训练">比赛训练</el-radio-button>
        </el-radio-group>
      </div>
      <div>
        <el-table :data="showList" style="width: 100%">
          <el-table-column type="index" label="序号" width="width">
          </el-table-column>
          <el-table-column
            prop="use_type"
            label="使用性质"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="type"
            label="场地类别"
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
            prop="class"
            label="每周使用日期"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="period"
            label="使用时段"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="use_class"
            label="使用单位"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="width"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-button type="warning" @click="edit(row)">修改</el-button>
              <el-button type="danger" @click="deletes(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        :currentPage="currentPage"
        :total="total"
        :limit="limit"
        :page-sizes='pageSizes'
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </el-card>

    <el-dialog
      :title="newList.use_type == '' ? '新增' : '修改'"
      :visible.sync="isShow"
      class="dialog"
      width="width"
    >
      <el-form
        ref="form"
        :rules="rules"
        :model="newList"
        label-width="120px"
        style="margin-left: 110px"
      >
        <el-form-item label="使用性质：" prop="use_type">
          <el-select v-model="newList.use_type" placeholder="请选择使用属性">
            <el-option label="学校课程" value="学校课程"></el-option>
            <el-option label="比赛训练" value="比赛训练"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="场地类别：" prop="tid">
          <el-select
            v-model="newList.tid"
            @change="changetType"
            placeholder="请选择场地类别"
          >
            <el-option
              v-for="item in venueTypeList"
              :key="item.tid"
              :label="item.type"
              :value="item.tid"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="场地位置：" prop="pid">
          <el-select v-model="newList.pid" placeholder="请输入选择场地">
            <el-option
              v-for="item in positionList"
              :key="item.pid"
              :label="item.position"
              :value="item.pid"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="每周使用日期：" prop="wid">
          <el-select v-model="newList.wid" placeholder="请选择每周使用日期">
            <el-option
              v-for="item in weekList"
              :key="item.id"
              :label="item.class"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用时段：" prop="per_id">
          <el-select v-model="newList.per_id" placeholder="请选择使用时段">
            <el-option
              v-for="item in periodList"
              :key="item.id"
              :label="item.period"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用单位：" prop="use_class">
          <el-input
            v-model="newList.use_class"
            placeholder="请输入使用单位"
            style="width: 202px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" v-if="newAdd" @click="submit"
          >提 交</el-button
        >
        <el-button type="primary" v-else @click="updates">保存修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SpecialField",

  data() {
    return {
      isShow: false,
      select: "学校课程",
      venueInfo: [],
      newAdd: true,
      newList: {
        use_type: "",
        tid: "",
        pid: "",
        wid: "",
        per_id: "",
        use_class: "",
      },
      showList: [],
      weekList: [],
      periodList: [],
      venueTypeList: [],
      positionList: [],
      tem_positionList: [],
      currentPage: 1,
      limit: 5,
      total: 0,
      pageSizes:[5,10,15,20],
      rules: {
        tid: [{ required: true, message: "请选择场地类型", trigger: "blur" }],
        use_type: [
          { required: true, message: "请选择场地类型", trigger: "blur" },
        ],
        pid: [{ required: true, message: "请选择场地类型", trigger: "blur" }],
        wid: [{ required: true, message: "请选择场地类型", trigger: "blur" }],
        per_id: [
          { required: true, message: "请选择场地类型", trigger: "blur" },
        ],
        use_class: [
          { required: true, message: "请选择场地类型", trigger: "blur" },
        ],
      },
    };
  },

  mounted() {
    this.getAllAboutSpecialVenueInfo();
  },

  methods: {
    async getAllAboutSpecialVenueInfo() {
      let result = await this.$store.dispatch("getSpecialVenueInfo");
      let results = await this.$store.dispatch("getWeekAndPeriod");
      if (result.code == 200 && results.code == 200) {
        this.venueInfo = result.data;
        this.showList = [];
        let temarr = [];
        this.venueInfo.forEach((item) => {
          if (item.use_type == this.select) {
            temarr.push(item);
          }
        });
        this.showList = temarr.slice(
          (this.currentPage - 1) * this.limit,
          this.limit * this.currentPage
        );
        this.total = temarr.length;
        // console.log(results.data)
        this.weekList = results.data[0];
        this.periodList = results.data[1];
      } else {
        this.$message.error("数据获取失败");
      }
      this.result1 = await this.$store.dispatch("getAboutVenInfo");
      this.venueTypeList = this.result1[0];
      this.positionList = this.result1[1];
      this.tem_positionList = this.positionList;
    },
    change() {
      this.showList = [];
      let temArr = [];
      this.currentPage = 1;
      this.venueInfo.forEach((item) => {
        if (item.use_type == this.select) {
          temArr.push(item);
        }
      });
      this.showList = temArr.slice(
        (this.currentPage - 1) * this.limit,
        this.limit * this.currentPage
      );
      this.total = temArr.length;
    },
    changetType() {
      this.positionList = [];
      this.newList.pid = "";
      this.tem_positionList.forEach((item) => {
        if (item.tid == this.newList.tid) {
          this.positionList.push(item);
        }
      });
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$comfirm("确认提交？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(async () => {
            // console.log(this.newList)
            let result = await this.$store.dispatch(
              "addSpecialVenue",
              this.newList
            );
            if (result.code == 200) {
              this.$notify.success({ title: "添加成功" });
              this.isShow = false;
              this.getAllAboutSpecialVenueInfo();
              // console.log(this.venueInfo)
            } else {
              this.$message({
                message: result.message,
                type: "error",
              });
            }
          });
        }
      });
    },
    // 删除
    async deletes(row) {
      this.$comfirm("请确认删除该条数据", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let result = await this.$store.dispatch("deleteSpeciaVenueInfo", {
          id: row.id,
        });
        if (result.code == 200) {
          this.$notify({
            title: "成功",
            message: "数据删除成功",
            type: "success",
          });
          this.getAllAboutSpecialVenueInfo();
        } else {
          this.$message.error(result.message);
        }
      });
    },
    // 修改
    edit(row) {
      this.isShow = true;
      this.newAdd = false;
      this.newList = row;
    },
    updates() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm("请确认保存修改?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(async () => {
              let result = await this.$store.dispatch(
                "updateSpeciaVenueInfo",
                this.newList
              );
              if (result.code == 200) {
                this.$message({
                  type: "success",
                  message: "更新成功!",
                });
                this.getAllAboutSpecialVenueInfo();
                this.isShow = false;
                this.newAdd = true;
              } else {
                this.$message({
                  type: "error",
                  message: result.message,
                });
                this.isShow = false;
                this.newAdd = true;
              }
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消修改",
              });
            });
        }
      });
    },
    // 分页器
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAllAboutSpecialVenueInfo();
      // this.change();
    },
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
      // this.getAllAboutSpecialVenueInfo()
      this.change();
    },
  },
};
</script>

<style scoped>
.div /deep/.el-dialog {
  width: 620px !important;
  /* text-align: center; */
}
</style>
