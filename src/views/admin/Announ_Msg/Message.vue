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
          <el-radio-button label="2">已回复</el-radio-button>
        </el-radio-group>
        <el-input
          v-model="search"
          placeholder="请输入关键字..."
          @change="SearchList"
          class="search"
          clearable
        ></el-input>
        <el-button type="primary" class="btn" @click="toSearch">搜索</el-button>
      </div>
      <div>
        <el-table :data="showList" style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="username"
            label="留言人"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="xuehao"
            label="学号"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="content"
            label="内容"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="time"
            label="时间"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="width"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-tag v-if="row.status == 2" type="warning">未审核</el-tag>
              <el-tag v-else type="success">已回复</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="prop"
            width="width"
            label="操作"
          >
            <template slot-scope="{ row }">
              <el-button @click="replied(row)">回复</el-button>
              <el-button type="danger" @click="deletes(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :visible.sync="isShow" width="700px">
        <template slot="title">
          <h3 class="title">详情</h3>
        </template>
        <el-form :model="detail">
          <el-form-item label="留言内容">
            <el-input
              type="textarea"
              v-model="detail.content"
              :rows="5"
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item label="回复内容">
            <el-input
              type="textarea"
              v-model="detail.reply"
              :rows="3"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="isShow = false">取 消</el-button>
          <el-button type="primary" @click="submit">回复</el-button>
        </div>
      </el-dialog>

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
  </div>
</template>

<script>
export default {
  name: "Message",

  data() {
    return {
      messageList: [],
      showList: [],
      search: '',
      flag:true,
      select: 1,
      isShow: false,
      detail: {
        content: "",
        reply: "",
        time: "",
      },
      currentPage: 1,
      limit: 5,
      total: 0,
      pageSizes: [5, 10, 15, 20],
    };
  },

  mounted() {
    this.getAllMessage();
  },

  methods: {
    // 获取全部留言
    async getAllMessage() {
      let result = await this.$store.dispatch("getAllMessage");
      // console.log(result.data)
      if (result.code == 200) {
        result.data.forEach((item) => {
          item.time = this.$moment(item.time).format("YYYY-MM-DD HH:mm:ss");
        });
        this.messageList = result.data;
        this.showList = [];
        let temArr = [];
        this.messageList.forEach((item) => {
          if (item.status == 2) {
            temArr.push(item);
          }
        });
        this.total = temArr.length;
        this.showList = temArr.slice(
          (this.currentPage - 1) * this.limit,
          this.limit * this.currentPage
        );
      }else{{
        this.$message({
          message: '数据获取失败',
          type: 'error'
        })
      }}
    },
    // 回复留言
    replied(row) {
      this.detail = {};
      this.isShow = true;
      this.detail = row;
      console.log(this.detail);
    },
    submit() {
      this.$confirm("确定回复该条留言？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$store.dispatch("replyMessage", this.detail);
          if (result.code == 200) {
            this.$notify({
              title: "成功",
              message: "回复成功",
              type: "success",
            });
            this.getAllMessage();
            this.isShow = false;
          } else {
            this.$message({
              message: "回复失败",
              type: "error",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消回复",
          });
        });
    },
    // 删除留言
    deletes(row) {
      // console.log(row)
      this.$confirm("此操作将永久删除该留言, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$store.dispatch("deleteMessage", {
            id: row.id,
          });
          if (result.code == 200) {
            this.getAllMessage();
            this.$notify({
              title: "成功",
              message: "删除成功！",
              type: "success",
            });
          } else {
            this.$notify({
              title: "失败",
              message: "删除失败！",
              type: "error",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 切换
    change() {
      this.currentPage = 1;
      this.search = ''
      this.zidingyi();
    },
    // 分页器
    handleCurrentChange(val) {
      this.currentPage = val;
      this.zidingyi();
    },
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
      this.change();
    },
    zidingyi() {
      this.showList = [];
      let temArr = [];
      if (this.select == 1) {
        // console.log(this.select)
        this.messageList.forEach((item) => {
          if (item.status == 2) {
            temArr.push(item);
          }
        });
      } else {
        this.messageList.forEach((item) => {
          if (item.status != 2) {
            temArr.push(item);
          }
        });
      }
      this.total = temArr.length;
      this.showList = temArr.slice(
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
        this.showList = this.messageList.filter(item => {
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
        console.log(this.showList)
      } else {
        this.flag = true
        this.getAllMessage();
      }
    },
    SearchList(){
      if(!this.search){
        this.getAllMessage()
        this.flag = true
      }
    }
  },
};
</script>

<style scoped>
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
.title {
  font-size: 24px !important;
  text-align: center !important;
  font-weight: 800 !important;
  padding: 0;
  margin: 0;
}
.el-form-item /deep/ .el-form-item__label {
  font-size: 18px !important;
  font-weight: bold !important;
}
</style>
