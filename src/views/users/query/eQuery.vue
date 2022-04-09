<template>
  <div>
    <el-card>
      <div slot="header">
        <el-select
          v-model="select"
          clearable
          @change="change"
          placeholder="请选择搜索类型"
        >
          <el-option
            v-for="(item, index) in equiptype"
            :key="index"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
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
        <el-table :data="showList" style="width: 100%; margin: 10px" :row-style="{height:'57px'}" :cell-style="{padding: '0'}" stripe>
          <el-table-column
            prop="eid"
            label="器材ID"
            width="80"
            fixed
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
            prop="equipname"
            label="器材名称"
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
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.status == 0">正常</el-tag>
              <el-tag type="warning" v-if="scope.row.status == 1">保修</el-tag>
              <el-tag type="danger" v-if="scope.row.status == 2">损坏</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="rentstatus"
            label="租用状态"
            width="width"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.rentstatus == 0"
                >未借出</el-tag
              >
              <el-tag type="warning" v-if="scope.row.rentstatus != 0"
                >已借出</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="compensation"
            label="损失赔偿/件"
            width="width"
            align="center"
          >
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
  </div>
</template>

<script>
export default {
  name: "Equery",

  data() {
    return {
      search: "",
      flag:true,
      equiptype: [],
      select: "",
      showList: [],
      equipList: [],
      currentPage: 1,
      limit: 5,
      total: 0,
      pageSizes:[5,10,15,20]
    };
  },

  mounted() {
    // 获取全部器材
    this.getAllEquipInfo();
  },

  methods: {
    // 获取全部器材信息
    async getAllEquipInfo() {
      const results = await this.$store.dispatch("getAllEquipInfo");
      if (results.code == 200) {
        this.equipList = [];
        results.data.forEach((item) => {
          if (item.status == 0) {
            this.equipList.push(item);
          }
        });
        this.showList = [];
        this.showList = this.equipList.slice(
          (this.currentPage - 1) * this.limit,
          this.limit * this.currentPage
        );
        this.total = this.equipList.length;
        // 类型去重
        this.equipList.forEach((item) => {
          this.equiptype.push(item.type);
        });
        this.equiptype = [...new Set(this.equiptype)];
      } else {
        this.$notify.errpr({
          title: "数据获取失败",
        });
      }
    },

    change() {
      this.currentPage = 1;
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
      this.getAllEquipInfo();
    },
    zidingyi() {
      this.showList = [];
      let temArr = [];
      if (this.select == "") {
        this.showList = this.equipList.slice(
          (this.currentPage - 1) * this.limit,
          this.currentPage * this.limit
        )
        this.total = this.equipList.length;
      } else {
        this.equipList.forEach((item) => {
          if (this.select == item.type) {
            temArr.push(item);
          }
        });
      this.showList = temArr.slice(
        (this.currentPage - 1) * this.limit,
        this.currentPage * this.limit
      );
      this.total = temArr.length;
      }
    },
     // 搜索
    toSearch() {
      if (this.search) {
        let that = this
        this.flag = false
        this.showList = []
        this.showList = this.equipList.filter(item => {
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
        this.getAllEquipInfo();
      }
    },
    SearchList(){
      if(!this.search){
        this.getAllEquipInfo()
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
