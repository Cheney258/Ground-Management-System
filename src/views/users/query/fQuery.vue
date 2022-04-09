<template>
  <div>
    <el-card>
      <div slot="header">
        <el-select
          v-model="select"
          @change="change"
          clearable
          placeholder="场地类型"
          style="margin: 0 50px"
        >
          <el-option
            v-for="(item, index) in filedType"
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
        <el-table
          :data="showList"
          style="width: 100%"
          :row-style="{ height: '57px' }"
          :cell-style="{ padding: '0' }"
          stripe
        >
          <el-table-column
            prop="pid"
            label="场地编号"
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
            prop="status"
            label="运营状态"
            width="width"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-tag type="success" v-if="row.status == 0">运行中</el-tag>
              <el-tag type="success" v-else>暂停运行</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="usetime"
            label="可预约时间"
            width="width"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-popover placement="top" width="360">
                <div style="display:inline;width:150px;float:left;">
                  <el-select v-model="s_day" @change="selectDay(row)" style="display:inline-block" placeholder="日期">
                  <el-option
                    v-for="item in s_Day"
                    :key="item.id"
                    :label="item.day + '-' + item.week"
                    :value="item.id"
                    >
                  </el-option>
                </el-select>
                </div>
                <div style="display:inline;width:150px;float:left;margin-left:20px;">
                  <el-select v-model="s_time" style="display:inline-block" placeholder="时间段">
                  <el-option
                    v-for="item in s_Time"
                    :key="item.id"
                    :label="item.period"
                    :value="item.id">
                  </el-option>
                </el-select>
                </div>
                <el-button slot="reference" @click="open">查看</el-button>
              </el-popover>
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
  </div>
</template>

<script>
export default {
  name: "Fquery",

  data() {
    return {
      select: "",
      search: "",
      flag:true,
      usetime: [],
      filedType: [],
      filedList: [],
      showList: [],
      tem_dayList:[],
      s_day: "",
      s_time: "",
      s_Day: [{ s_day: "" }],
      s_Time: [],
      currentPage: 1,
      limit: 5,
      total: 0,
      pageSizes:[5,10,15,20]
    };
  },

  mounted() {
    this.getVenueInfo();
    this.getUseDay();
  },

  methods: {
    // 获取场地信息
    async getVenueInfo() {
      let results = await this.$store.dispatch("getvenueinfo");
      const that = this;
      this.filedList = [];
      this.filedList = results;
      this.filedList.forEach((item) => {
        that.filedType.push(item.type);
      });
      // 去重
      this.filedType = [...new Set(this.filedType)];
      this.showList = [];
      this.showList = this.filedList.slice(
        (this.currentPage - 1) * this.limit,
        this.limit * this.currentPage
      );
      this.total = this.filedList.length;
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
      this.getVenueInfo();
    },
    zidingyi() {
      this.showList = [];
      let temArr = [];
      if (this.select == "") {
        this.showList = this.filedList.slice(
          (this.currentPage - 1) * this.limit,
          this.currentPage * this.limit
        );
        this.total = this.filedList.length;
      } else {
        this.filedList.forEach((item) => {
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
    // 获取可预约日期
    async getUseDay() {
      let results = await this.$store.dispatch("getDateDay");
      if (results.code == 200) {
        results.data.forEach((item) => {
          item.day = this.$moment(item.day).format("YYYY-MM-DD");
          switch (item.week) {
            case 1:
              item.week = "周一";
              break;
            case 2:
              item.week = "周二";
              break;
            case 3:
              item.week = "周三";
              break;
            case 4:
              item.week = "周四";
              break;
            case 5:
              item.week = "周五";
              break;
            case 6:
              item.week = "周六";
              break;
            case 7:
              item.week = "周日";
              break;
            default:
              break;
          }
        });
        results.data.reverse()
        this.tem_dayList = results.data
        this.s_Day = results.data;
      }else{
        this.$message.error(results.message)
      }
    },
    async selectDay(row) {
      this.s_time=''
      let params = {pid:row.pid,did:this.s_day}
      let results = await this.$store.dispatch('getTimePeriod',params)
      if(results.code ==200){
        this.s_Time = results.data
        // console.log(params)
      }else{
        this.$message.error(results.message)
      }
      // console.log(1111)
    },
    open(){
      this.s_day='';
      this.s_tiem='';
      this.s_Day=this.tem_dayList
    },
    // 搜索
    toSearch() {
      if (this.search) {
        let that = this
        this.flag = false
        this.showList = []
        this.showList = this.filedList.filter(item => {
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
        this.getVenueInfo();
      }
    },
    SearchList(){
      if(!this.search){
        this.getVenueInfo()
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
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
