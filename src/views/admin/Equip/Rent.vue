<template>
  <div>
    <el-card>
      <div slot="header">
        <el-radio-group v-model="select" @change="change" style="margin-left: 100px;">
          <el-radio-button label="1">未审核</el-radio-button>
          <el-radio-button label="2">其他</el-radio-button>
        </el-radio-group>
      </div>
      <div>
        <el-table :data="rentList" style="width: 100%">
          <el-table-column
            type="expand"
            header-align="center"
            prop="prop"
            label="" >
            <template slot-scope="{row}">
              <el-form label-position="left"  inline class="demo-table-expand">
                <el-form-item label="租用人">
                  <span>{{ row.username }}</span>
                </el-form-item>
                <el-form-item label="学号">
                  <span>{{ row.xuehao }}</span>
                </el-form-item>
                <el-form-item label="器材类型">
                  <span>{{ row.type }}</span>
                </el-form-item>
                <el-form-item label="数量">
                  <span>{{ row.amount }}</span>
                </el-form-item>
                <el-form-item label="申请时间">
                  <span>{{ row.renttime }}</span>
                </el-form-item>
                <el-form-item label="归还时间">
                  <span>{{ row.backtime }}</span>
                </el-form-item>
                <el-form-item label="联系电话">
                  <span>{{ row.phone }}</span>
                </el-form-item>
                <el-form-item label="申请状态">
                  <span v-if="row.status == 0">未审核</span>
                  <span v-if="row.status == 1">通过</span>
                  <span v-if="row.status == 2">驳回</span>
                  <span v-if="row.status == 3">取消申请</span>
                </el-form-item>
                <el-form-item v-if="row.code" label="审核号：">
                  <span>{{ row.code }}</span>
                </el-form-item>
                <el-form-item  v-if="row.message" label="审核备注：">
                  <span>{{ row.message }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="index" label="编号"  width="80" align="center">
          </el-table-column>
          <el-table-column prop="username" label="租用人"  width="width" align="center">
          </el-table-column>
          <el-table-column prop="type" label="器材类型"  width="width" align="center">
          </el-table-column>
          <el-table-column prop="amount" label="数量"  width="width" align="center">
          </el-table-column>
          <el-table-column prop="renttime" label="申请时间" sortable  width="width" align="center">
          </el-table-column>
          <el-table-column prop="backtime" label="计划归还时间" sortable  width="width" align="center">
          </el-table-column>
          <el-table-column prop="status" label="审核状态"  width="width" align="center">
            <template slot-scope="{row}">
              <el-tag type="info" v-if="row.status ==0">审核中</el-tag>
              <el-tag type="success" v-if="row.status ==1">通过</el-tag>
              <el-tag type="danger" v-if="row.status ==2">驳回</el-tag>
              <el-tag type="warning" v-if="row.status ==3">取消申请</el-tag>
            </template>
          </el-table-column>
          <el-table-column  label="操作"  width="width" align="center">
            <template slot-scope="{row}">
              <el-button type="primary" v-if="select == 1" @click="open(row)">通过</el-button>
              <el-button type="danger" v-if="select == 1" @click="disagreed(row)">驳回</el-button>
              <el-button type="danger" v-if="select == 2" @click="details(row)">查看详情</el-button>
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

    <!-- 派发器材 -->
    <el-dialog title="派发器材" :visible.sync="isShow" width="width"> 
      <div>
        <el-table :data="equipList" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column  prop="eid" label="器材ID" width="width">
          </el-table-column>
          <el-table-column  prop="type" label="器材类型" width="width">
          </el-table-column>
          <el-table-column  prop="equipname" label="器材名称" width="width">
          </el-table-column>
          <el-table-column  prop="status" label="器材状态" width="width">
            <template slot-scope="{row}">
              <el-tag type="success" v-if="row.status ==0">完好</el-tag>
              <el-tag type="success" v-if="row.status ==1">保修</el-tag>
              <el-tag type="success" v-if="row.status ==2">损失</el-tag>
              <el-tag type="success" v-if="row.status ==3">报废</el-tag>
            </template>
          </el-table-column>
          <el-table-column  prop="rentstatus" label="出租状态" width="width">
            <template slot-scope="{row}">
              <el-tag type="success" v-if="row.rentstatus == 0">未出借</el-tag>
              <el-tag type="success" v-if="row.rentstatus == 1">已出借</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="agreed">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 查看详情 -->
    <el-dialog title="" :visible.sync="dialogVisible" width="width" >
      <div>
          <el-form label-position="left"  inline class="demo-table-expand">
                <el-form-item label="租用人">
                  <span>{{ showDetails.username }}</span>
                </el-form-item>
                <el-form-item label="学号">
                  <span>{{ showDetails.xuehao }}</span>
                </el-form-item>
                <el-form-item label="器材类型">
                  <span>{{ showDetails.type }}</span>
                </el-form-item>
                <el-form-item label="数量">
                  <span>{{ showDetails.amount }}</span>
                </el-form-item>
                <el-form-item label="申请时间">
                  <span>{{ showDetails.renttime }}</span>
                </el-form-item>
                <el-form-item label="归还时间">
                  <span>{{ showDetails.backtime }}</span>
                </el-form-item>
                <el-form-item label="联系电话">
                  <span>{{ showDetails.phone }}</span>
                </el-form-item>
                <el-form-item label="申请状态">
                  <span v-if="showDetails.status == 0">未审核</span>
                  <span v-if="showDetails.status == 1">通过</span>
                  <span v-if="showDetails.status == 2">驳回</span>
                  <span v-if="showDetails.status == 3">取消申请</span>
                </el-form-item>
                <el-form-item v-if="showDetails.code" label="审核号：">
                  <span>{{ showDetails.code }}</span>
                  </el-form-item>
                <el-form-item v-if="showDetails.message" label="审核备注：">
                  <span>{{ showDetails.message }}</span>
                </el-form-item>
              </el-form>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Rent',

  data() {
    return {
      isShow:false,
      dialogVisible:false,
      select:1,
      search:'',
      data:[],
      equipInfo:[],
      rentList:[],
      equipList:[],
      showDetails:[],
      multipleSelection:[],
      currentPage: 1,
      limit: 5,
      total: 0,
      pageSizes:[5,10,15,20]
    }
  },

  mounted() {
    // 获取器材申请
    this.getAllEquipRent()
    // 获取未出借器材信息
    this.getEquipInfo()
  },

  methods: {
    // 选中器材的回调函数
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 获取器材申请
    async getAllEquipRent(){
      this.rentList = []
      let temArr = []
      const result = await this.$store.dispatch('getEquipRent')
      // console.log(result.data)
      if(result.code == 200){
        this.data = result.data
        result.data.forEach(item => {
          item.renttime = this.$moment(item.renttime).format('YYYY-MM-DD HH:mm:ss')
          item.backtime = this.$moment(item.backtime).format('YYYY-MM-DD HH:mm:ss')
          if(item.status == 0){
            temArr.push(item)
          }
        });
        this.rentList = temArr.slice(
          (this.currentPage - 1) * this.limit,
          this.limit * this.currentPage
        );
        this.total = temArr.length;
        // console.log(this.rentList)
      }else{
        this.$notify.error({
          title:'错误',
          message:'数据获取失败'
        })
      }
    },

    // 获取未出借器材信息
    async getEquipInfo(){
      const result = await this.$store.dispatch('getEquipInfo')
      if(result.code == 200){
        this.equipInfo = result.data
      }else{
        this.$message.error('数据获取失败')
      }
    }, 

  // 区分展示数据
    change(){
      this.currentPage=1
      this.zidingyi()
    },

    // 同意申请
    async open(row){
      this.isShow = true
      this.equipList = []
      // console.log(this.equipInfo)
      this.equipInfo.forEach(item => {
        if(item.type == row.type){
          item.rid = row.rid
          this.equipList.push(item)
        }
      })
      // this.equipList.push(row.rid)
      // console.log(this.equipList)
    },
    agreed(){
      this.$confirm('确认继续派发以下器材', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() =>{
          // console.log(this.multipleSelection)
          if(this.multipleSelection.length ==0){
            this.$message.error('请先选中数据！！！')
          }else{
            // console.log(11)
            this.$prompt('同意理由', '备注', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(({value}) => {
              try {
                this.multipleSelection.forEach(async (item) => {
                  item.message = value
                  item.code = 'Y'+(Math.round((Math.random()+1)*10000))
                  await this.$store.dispatch('payoutEquip',item)
                })
                this.getEquipInfo()
                  this.$notify.success({
                    title:'成功',
                    message:'派发成功'
                  })
                  then.getAllEquipRent()
                this.isShow = false
              } catch (error) {
                this.$notify.error({
                  title:'失败',
                  message:'派发失败'
                })
                this.isShow = false
              }
            })
            
          }
          
          
        })
    },

    // 驳回申请
    disagreed(row){
      this.$prompt('驳回理由', '备注', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(async ({ value }) =>{
          const result = await this.$store.dispatch('disEquipRent',{message:value,rid:row.rid})
          if(result.code ==200){
            this.$notify.success({
              title:'成功',
              message:'驳回成功'
            })
            this.getAllEquipRent()
          }else{
            this.$notify.error({
              title:'失败',
              message:'驳回失败'
            })
          }
        })
    },


    // 某条申请详情
    details(row){
      this.showDetails = row
      this.dialogVisible = true
    },
    // 分页器
    handleCurrentChange(val) {
      this.currentPage = val;
      this.zidingyi();
    },
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
      this.getAllEquipRent();
    },
    zidingyi(){
      this.rentList = []
      let temArr = []
      if(this.select == 1){
        this.data.forEach(item => {
          if(item.status == 0){
            temArr.push(item)
          }
        })
      }else{
        this.data.forEach(item => {
          if(item.status != 0){
            temArr.push(item)
          }
        })
      }
      this.rentList = temArr.slice(
          (this.currentPage - 1) * this.limit,
          this.limit * this.currentPage
        );
        this.total = temArr.length;
    }
  }
}
</script>

<style lang="scss" scoped>
.search{
  width: 200px;
  border-radius: 30px;
  position: relative;
  right: -1000px;

}
.btn{
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
