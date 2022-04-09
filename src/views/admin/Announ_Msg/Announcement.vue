<template>
  <div style="width:100%;" >
    <el-card>
      <div slot="header">
        <h1 style=" text-align:center">公告管理</h1>
      </div>
      <!-- 新增公告 || 修改公告-->
      <div>
        <el-button type="primary" style="margin-left:100px" @click="open">新&ensp;增+</el-button>

        <el-input
          v-model="search"
          placeholder="请输入关键字..."
          class="search"
          @change="SearchList"
          clearable
        ></el-input>
        <el-button type="primary" class="btn" @click="toSearch">搜索</el-button>

        <el-button type="primary" style="margin-left:50%" @click="upload=true">更新首页轮播图</el-button>
        
        <!-- 图片上传 -->
        <el-dialog
          title=""
          :visible.sync="upload"
          width="width"
          style="width:1200px;margin:0 auto;">
          <div>
            <Upload :fileList="fileList" :limit='limit' ref="uploadImg" name="activity"></Upload>
          </div>
          <div slot="footer">
            <el-button @click="upload = false">取 消</el-button>
            <el-button type="primary" @click="uploads">上传</el-button>
          </div>
        </el-dialog>



        
        <el-dialog :title="detailsShow.content == ''?'添加公告':'修改公告'" :visible.sync="show" width="width" style="margin-top: -10vh;">
          <div>
            <el-form ref="form" :model="detailsShow" label-width="80px">
              <el-form-item label="标题：">
                <el-input v-model="detailsShow.title"></el-input>
              </el-form-item>
              <el-form-item label="发布部门">
                <el-input v-model="detailsShow.department"></el-input>
              </el-form-item>
              <el-form-item label="发布时间">
                <el-date-picker
                  v-model="detailsShow.time"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="内容：">
                  <!-- @blur="onEditorBlur($event)"
                  @focus="onEditorFocus($event)"
                  @ready="onEditorReady($event)" -->
                <quill-editor
                  class="editor"
                  ref="myQuillEditor"
                  v-model="detailsShow.content"
                  :options="editorOption"
                /> 
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer">
            <el-button type="primary" v-if="detailsShow.aid" @click="update">保存</el-button>
            <el-button type="primary" v-else @click="add">添 加</el-button>
            <el-button @click="show=false">取 消</el-button>
          </div>
        </el-dialog>
      </div>
      <hr>
      <div>
        <el-table :data="announList" :default-sort = "{prop: 'time', order: 'descending'}">
          <el-table-column type="index" label="序号" width="width" align="center">
          </el-table-column>
          <el-table-column prop="title" label="公告标题" width="width" align="center">
          </el-table-column>
          <el-table-column prop="department" label="发布部门" align="center">
          </el-table-column>
          <el-table-column prop="department" label="发布状态" align="center">
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.status == 0 ">未发布</el-tag>
              <el-tag type="success" v-if="scope.row.status == 1 ">已发布</el-tag>
              <el-tag type="danger" v-if="scope.row.status == 2 ">撤销</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="发布时间" sortable align="center"> 
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="500" align="center">
            <template slot-scope="{row}">
              <el-button type="primary" @click="details(row)">查看</el-button>
              <el-button type="success" v-if="row.status == 0 || row.status == 2" @click="uploadOrUndo(row,'upload')">发布</el-button>
              <el-button type="warning" v-if="row.status == 1" @click="uploadOrUndo(row,'undo')">撤销</el-button>
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


    <!-- 查看公告 -->
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
        <el-button type="primary" @click="isShow = false;show=true">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'Announcement',

  data() {
    return {
      search:'',
      show:false,
      isShow:false,
      flag:true,
      data:[],
      showList:[],
      upload:false,
      fileList:[],
      limit:6,
      title:'',
      content:'',
      announList:[],
      detailsShow:{
        title:'',
        content:'',
        time:'',
        department:''
      },
      editorOption: {
              placeholder: "请在这里输入",
              modules:{
                toolbar:[
                          ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
                          ['blockquote', 'code-block'],     //引用，代码块
                          [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
                          [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
                          [{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进
                          [{ 'direction': 'rtl' }],             // 文本方向
                          [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
                          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题
                          [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
                          [{ 'font': [] }],     //字体
                          [{ 'align': [] }],    //对齐方式
                          ['clean'],    //清除字体样式
                          ['image','video']    //上传图片、上传视频
                          ]
                      }
      },
      currentPage: 1,
      total: 0,
      pageSizes:[5,10,15,20]
    };
  },

  mounted() {
    this.getAllAnnouncement()
  },

  methods: {
    // 获取公告
    async getAllAnnouncement(){
      const results = await this.$store.dispatch('getAllAnnouncement')
      // console.log(results.data)
      if(results.code == 200){
        results.data.forEach(item => {
          item.time = this.$moment(item.time).format('YYYY-MM-DD HH:mm:ss')
        });
        this.data = results.data
        this.announList = []
        this.announList = results.data.slice((this.currentPage-1)*this.limit,this.limit*this.currentPage);
        this.total = results.data.length
      }else{
        this.$notify.error({title:'数据获取失败'})
      }
    },
    // 展示公告详情
    details(row){
      this.isShow = true
      this.detailsShow = row
      // console.log(this.detailsShow)
    },
    // 删除公告
    async deletes(row){
      const result = await this.$store.dispatch('deleteAnnoun',row.aid)
      if(result.code == 200){
        this.$notify.success({title:"删除成功"})
        this.getAnnouncement()
      }else{
        this.$notify.error({title:'删除失败'})
      }
    },
    // 显示编辑页面
    open(){
      this.detailsShow = {}
      this.show = true 
    },
    // 提交到服务器
    add(){
      this.$confirm('确认提交公告?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(async () =>{
          this.detailsShow.time = this.$moment(this.detailsShow.time).format('YYYY-MM-DD HH:mm:ss')
          let result = await this.$store.dispatch('addAnnouncement',this.detailsShow)
          if(result.code == 200){
            this.$notify.success({title:"公告添加成功"})
            // 刷新数据
            this.getAllAnnouncement()
            this.show = false
            // this.onlyRead = true
            this.$refs.myQuillEditor.quill.enable(false)
          }else{
            this.$notify.error({title:'公告添加失败'})
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
      
    },
    // 提交保存的修改
    async update(){
      if(this.detailsShow.status == 1){
        this.$message.warning("该条公告已发布，不能修改！")
      }else{
        const result = await this.$store.dispatch('updateAnnouncement',this.detailsShow)
        if(result.code == 200){
          this.getAllAnnouncement
          this.show = false
          this.$notify.success({title:'修改成功'})
          // this.onlyRead = true
          this.$refs.myQuillEditor.quill.enable(false)
        }else{
          this.$notify.error({title:'修改失败'})
        }
      }
    },
    // 发布或撤销公告
    async uploadOrUndo(row,type){
      let params = {}
      type == 'upload' ? params = {
          status:1,
          aid:row.aid
        } : params = {
          status:2,
          aid:row.aid
        }
      
      console.log(params)
      let result = await this.$store.dispatch('uploadOrUndoAnnounce',params)
      if(result.code == 200){
        this.$notify.success({title:type == 'upload'?'发布成功':'撤销成功'})
        this.getAllAnnouncement()
      }else{
        this.$notify.error({title:type =='upload'?'发布失败':'撤销失败'})
      }

    },
    // 分页器
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getAllAnnouncement();
        },
        handleSizeChange(val) {
            this.limit = val
            this.currentPage = 1;
            this.getAllAnnouncement();
        },

    // 上传图片回调
    async uploads() {
    	// 使用的是multer中间件，所以需要传递formdata格式的数据
      const formData = new FormData();
      // 找到需要传递的文件
      const file = this.$refs.uploadImg.$refs.upload.uploadFiles;
      // 遍历 添加文件信息
      // 注意：添加的字段名，需要与后端一样 "file"
      file.forEach(item => {
        // item.raw= item.raw.push({uid:this.userinfo.uid})
        formData.append("activity", item.raw);
      });
      let reslut = await this.$store.dispatch('uploadActivityImg',formData)
      if(reslut.code==200){
        this.$notify.success({title:'上传成功！'})
        this.fileList = []
        this.upload = false
        this.$router.push('/')
      }else{
        this.$message.error(reslut.message)
      }
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
        this.getAllAnnouncement();
      }
    },
    SearchList(){
      if(!this.search){
        this.getAllAnnouncement()
        this.flag = true
      }
    }
  },
  
};
</script>

<style scoped>
.el-dialog__body {
  padding: 0px 20px !important;
}
</style>


<style lang="scss">
.search {
  width: 200px;
  border-radius: 30px;
  position: relative;
  right: -80px;
}
.btn {
  position: relative;
  right: -100px;
}
.editor {
  line-height: normal !important;
  height: 250px;
  margin-bottom:30px ;
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
</style>