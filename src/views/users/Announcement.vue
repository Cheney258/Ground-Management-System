<template>
  <div style="width: 100%">
    <el-card>
      <div slot="header">
        <h1 style="text-align: center">公告通知</h1>
      </div>
      <div style="margin-bottom: 30px">
        <el-input
          v-model="search"
          placeholder="请输入关键字..."
          class="search"
          @change="SearchList"
          clearable
        ></el-input>
        <el-button type="primary" class="btn" @click="toSearch">搜索</el-button>
      </div>
      <hr />
      <div>
        <el-table
          :data="announList"
          :default-sort="{ prop: 'time', order: 'descending' }"
          stripe
        >
          <el-table-column
            type="index"
            label="序号"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="title"
            label="公告标题"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="department"
            label="发布部门"
            width="300"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="time"
            label="发布时间"
            sortable
            width="300"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="readStatus"
            label="状态"
            sortable
            width="300"
            align="center"
          >
          <template slot-scope="{row}">
            <el-tag type="info" v-if="row.readStatus==0">未读</el-tag>
            <el-tag type="warning" v-else>已读</el-tag>
          </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="300" align="center">
            <template slot-scope="{ row }">
              <el-button type="primary" @click="details(row)">查看</el-button>
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

    <el-dialog :visible.sync="isShow" width="width">
      <h2 style="text-align: center">{{ detailsShow.title }}</h2>
      <div style="text-align: center; margin-top: 50px">
        <span v-html="detailsShow.content">{{ detailsShow.content }}</span>
      </div>
      <div style="margin-top: 50px; font-size: 20px; color: #3399ff">
        <span style="margin-left: 50px"
          >发布部门：&nbsp;&nbsp;{{ detailsShow.department }}</span
        >
        <span style="margin-left: 250px">
          发布日期：&nbsp;&nbsp; {{ detailsShow.time }}</span
        >
      </div>

      <div slot="footer">
        <el-button type="primary"  @click="Readed">已读返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "userAnnouncement",

  data() {
    return {
      search: "",
      flag:true,
      data:[],
      noRead:[],
      announList: [],
      detailsShow: [],
      isShow: false,
      currentPage: 1,
      limit: 5,
      total: 0,
      pageSizes:[5,10,15,20]
    };
  },
  computed: {
    
  },

  mounted() {
    this.getNoReadedAnnoun()
  },

  methods: {
    // 获取未读公告
    async getNoReadedAnnoun(){
      let uid = this.$store.getters.uid
      let result  = await this.$store.dispatch('user/getNoReadedAnnoun',{uid})
      if(result.code==200){
        this.noRead = result.data
        
        this.getAnnouncement();
        // console.log(this.noRead)
      }else{
        // console.log(result)
        this.$message({
          message: '数据加载失败',
          type: 'error'
        })
      }
    },
    // 获取公告
    async getAnnouncement() {
      let aidList = []
      this.noRead.forEach(item =>{
        aidList.push(item.aid)
      })
      // console.log(111,aidList)
      const results = await this.$store.dispatch("user/getAnnouncement");
      if (results.code == 200) {
        if (results.data.length >= 1) {
          this.data = results.data
          results.data.forEach((item) => {
            item.time = this.$moment(item.time).format("YYYY-MM-DD HH:mm:ss");
            item.readStatus = aidList.includes(item.aid)?0:1
          });
          // console.log(22,results.data)
          results.data.sort(function(a,b) {
          return a.readStatus-b.readStatus
        })
          this.announList = [];
          this.announList = results.data.slice(
            (this.currentPage - 1) * this.limit,
            this.limit * this.currentPage
          );
          this.total = results.data.length;
        } else {
          this.$notify.warning({ title: "数据为空" });
        }
      } else {
        this.$notify.error({ title: "数据获取失败" });
      }
    },
    details(row) {
      this.isShow = true;
      // row.time = this.$memont(row.time).format('YYYY-MM-DD HH:mm:ss')
      this.detailsShow = row;
      // console.log(row)
      // console.log(this.detailsShow)
    },

    // 已读返回
    async Readed(){
      let params = {uid:this.$store.getters.uid,aid:this.detailsShow.aid}
      let result = await this.$store.dispatch('user/readedAnnouncement',params)
      if(result.code==200){
        this.getNoReadedAnnoun()
        this.detailsShow = {}
        this.isShow = false
      }else{
        console.log(result.message)
      }
    },

    // 分页器
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAnnouncement();
    },
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
      this.getAnnouncement();
    },
    // 搜索
    toSearch() {
      if (this.search) {
        let that = this
        this.flag = false
        this.announList = []
        this.announList = this.data.filter(item => {
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
        this.getAnnouncement();
      }
    },
    SearchList(){
      if(!this.search){
        this.getAnnouncement()
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
