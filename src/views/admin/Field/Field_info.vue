<template>
  <div>
    <el-card>
      <div slot="header">
        <el-button type="primary" style="margin-left: 50px" @click="addVenue"
          >+ 新增</el-button
        >
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
        <el-table :data="fieldInfo" style="width: 100%" stripe>
          <el-table-column
            prop="pid"
            label="场地ID"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="type"
            label="场地类型"
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
          <!-- <el-table-column
            prop="usetime"
            label="可预约时间"
            width="width"
            align="center"
          >
          </el-table-column> -->
          <el-table-column
            prop="name"
            label="场地管理员"
            width="width"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-button type="text" @click="Peopledetails(row)">{{
                row.name
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="运行状态"
            width="width"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-tag type="success" v-if="row.status == 0">运行中</el-tag>
              <el-tag type="warning" v-if="row.status == 1">暂停运行</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="300" align="center">
            <template slot-scope="{ row }">
              <el-button type="primary" @click="edit(row)">修改</el-button>
              <el-button type="danger" @click="deletes(row)">删除</el-button>
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
        @handleSizeChange="handleSizeChange"/>
    </el-card>

    <!-- 点击负责人姓名显示信息 -->
    <el-dialog title="负责人信息" :visible.sync="details" class="chargeShow">
      <!-- <span>负责人信息</span> -->
      <!-- 内容主体区域 -->
      <el-form
        ref="addFormRef"
        :model="ChargePersonInfo"
        label-width="200px"
        class="chargeForm"
      >
        <!-- 负责人 -->
        <el-form-item label="负责人:" style="margin-top: 20px">
          {{ ChargePersonInfo.name }}
        </el-form-item>
        <!-- 负责场地 -->
        <el-form-item label="负责场地:">
          {{ ChargePersonInfo.position }}
        </el-form-item>
        <!-- 所属单位 -->
        <el-form-item label="所属单位:">
          {{ ChargePersonInfo.unit }}
        </el-form-item>
        <!-- 工作时间 -->
        <el-form-item label="工作时间:">
          {{ ChargePersonInfo.worktime }}
        </el-form-item>
        <!-- 联系电话 -->
        <el-form-item label="联系电话:">
          {{ ChargePersonInfo.phone }}
        </el-form-item>
        <el-button
          type="primary"
          @click="details = false"
          style="margin-left: 40%"
          >确 定</el-button
        >
      </el-form>
    </el-dialog>

    <!-- 新建场地对话框 -->
    <el-dialog
      :title="newVenue.pid == '' ? '新增场地' : '修改场地信息'"
      ref="dialog"
      :visible.sync="isShow"
      width="30%"
      class="addVenueShow"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="newVenue"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="120px"
        class="addVenueForm"
      >
        <!-- 选择场地类别 -->
        <el-form-item label="场地ID" prop="pid" style="margin-top: 20px">
          <el-input
            v-model="newVenue.pid"
            placeholder=""
            style="width: 348px"
          ></el-input>
        </el-form-item>

        <el-form-item label="新增类型" v-if="newVenue.add">
          <el-switch v-model="newtype" style="margin-left: -290px"></el-switch>
        </el-form-item>

        <el-form-item
          label="场地类别"
          v-if="newtype == false"
          prop="tid"
          style="margin-top: 20px"
        >
          <el-select
            v-model="newVenue.tid"
            v-if="newtype == false"
            placeholder="请选择场地类型"
            style="width: 85%"
          >
            <el-option
              v-for="(item, index) in venueTypeList"
              :key="index"
              :label="item.type"
              :value="item.tid"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="场地类别"
          v-else
          prop="type"
          style="margin-top: 20px"
        >
          <el-input
            v-model="newVenue.type"
            placeholder="请输入新增类型名称"
            style="width: 348px"
          ></el-input>
        </el-form-item>

        <!-- 选择场地位置 -->
        <el-form-item label="场地位置" prop="position">
          <el-input
            v-model="newVenue.position"
            placeholder=""
            style="width: 348px"
          ></el-input>
        </el-form-item>

        <!-- 选择场地负责人 -->
        <el-form-item label="场地负责人" prop="cid">
          <el-select
            v-model="newVenue.cid"
            placeholder="请指定负责人"
            style="width: 85%"
          >
            <el-option
              v-for="(item, index) in venueChargeList"
              :key="index"
              :label="item.name + '-' + item.phone"
              :value="item.cid"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="场地状态" prop="status">
          <el-radio-group v-model="newVenue.status">
            <el-radio :label="0">运行中</el-radio>
            <el-radio :label="1">暂停运行</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!-- 内容底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShow = false" style="margin-left: 30px"
          >取 消</el-button
        >
        <el-button type="primary" v-if="this.newVenue.add" @click="submit"
          >提交</el-button
        >
        <el-button type="primary" v-else @click="update">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "FieldInfo",

  data() {
    return {
      search: "",
      fieldInfo: [],
      newtype: false,
      isShow: false,
      flag:true,
      data:[],
      details: false,
      result1: [],
      currentPage: 1,
      limit: 5,
      total: 0,
      pageSizes:[5,10,15,20],
      ChargePersonInfo: {},
      venueTypeList: [],
      positionList: [],
      venueChargeList: [],
      newVenue: {
        pid: "",
        type: "",
        tid: "",
        position: "",
        cid: "",
        status: 0,
      },

      addFormRules: {
        type: [{ required: true, message: "请输入场地类型", trigger: "blur" }],
        pid: [{ required: true, message: "请输入场地ID", trigger: "blur" }],
        position: [{ required: true, message: "请选择场地位置", trigger: "blur" }],
        cid: [{ required: true, message: "请指定负责人", trigger: "blur" }],
        tid: [{ required: true, message: "请选择场地类型", trigger: "blur" }],
      },
    };
  },

  mounted() {
    this.getAllVenueInfo();
  },

  methods: {
    // 获取场地信息
    async getAllVenueInfo() {
      let result = await this.$store.dispatch("getAllVenueInfo");
      if (result.code == 200) {
        this.fieldInfo = []
        this.data = result.data
        this.fieldInfo = result.data.slice((this.currentPage-1)*this.limit,this.limit*this.currentPage);
          this.total = result.data.length
      } else this.$message.error(result.message);
      this.result1 = await this.$store.dispatch("getAboutVenInfo");
      this.venueTypeList = this.result1[0];
      this.positionList = this.result1[1];
      this.venueChargeList = this.result1[2];
    },
    Peopledetails(row) {
      this.details = true;
      this.ChargePersonInfo = row;
    },
    edit(row) {
      this.isShow = true;
      // console.log(row,this.newVenue)
      Object.assign(this.newVenue, row);
      // console.log(this.newVenue)
    },
    update() {
      delete this.newVenue.add;
      this.$comfirm("确认更改该场地信息？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        // console.log(this.newVenue)
        let result = await this.$store.dispatch(
          "updateVenueInfo",
          this.newVenue
        );
        if (result.code == 200) {
          this.$notify.success({ title: "信息更新成功" });
          this.getAllVenueInfo();
          this.isShow = false;
        } else {
          this.$notify.error({ title: "信息更新失败" });
          this.isShow = false;
        }
      });
    },
    // 新增
    addVenue() {
      this.isShow = true;
      // 对象属性值置空
      Object.keys(this.newVenue).forEach((key) => (this.newVenue[key] = ""));
      this.newVenue.add = true;
    },
    // 提交
    submit() {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {;
          // console.log(this.newVenue)
          this.$comfirm("请确认提交", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(async () => {
            let result = await this.$store.dispatch("addVenue", this.newVenue);
            if(result.code==200){
              this.$notify.success({title:'添加成功'})
              this.getAllVenueInfo()
              this.isShow = false
            }else{
              this.$notify.error({title:'添加失败'})
            }
          });
        }
      });
    },
    // 删除
    async deletes(row){
      this.$comfirm('确认删除该场地信息？','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(async ()=>{
        const result = await this.$store.dispatch('deleteVenue',{id:row.id})
        if(result.code==200){
          this.$notify.success({title:'删除成功'})
          this.getAllVenueInfo()
        }else{
          this.$message.error(result.message)
        }
      })
    },
    // 分页器
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getAllVenueInfo();
        },
        handleSizeChange(val) {
            this.limit = val
            this.currentPage = 1;
            this.getAllVenueInfo();
        },
    
    // 搜索
    toSearch() {
      if (this.search) {
        let that = this
        this.flag = false
        this.fieldInfo = []
        this.fieldInfo = this.data.filter(item => {
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
        this.getAllVenueInfo();
      }
    },
    SearchList(){
      if(!this.search){
        this.getAllVenueInfo()
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
.chargeShow {
  margin-left: 25%;
  width: 50%;
  text-align: center;
  // font-size:20px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 0px;
}
.chargeForm {
  text-align: left;
  //   font-size:17px;
  font-weight: normal;
  border-top-width: 4px;
  border-top-style: solid;
  border-top-color: #409eff;
}
.addVenueShow {
  text-align: center;
  font-weight: bold;
  margin-bottom: 0px;
}
</style>
