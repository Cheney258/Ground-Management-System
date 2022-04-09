<template>
  <div class="dashboard-container">
    <el-card>
      <div slot="header" class="title">运动场地管理系统</div>
      <div>
        <el-carousel :interval="4000" type="card" height="400px">
          <el-carousel-item v-for="item in imgUrlList" :key="item.id">
            <el-image
              :src="item.imgurl">
              <!-- 加载失败显示 -->
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
              </el-image>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-card>
    <el-badge v-if="roles=='editor'" :value="applyNews+replyNews+annouNews" :max="99" class="item dropdown">
      <el-dropdown  trigger="click" >
        <span class="el-dropdown-link">
          <i class="el-icon-more icon"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item class="clearfix">
            <el-button type="text" style="font-size:16px;font-weight:700;" @click="turnTo('toAnnou')">公告</el-button>
            <el-badge class="mark" :value="annouNews" />
          </el-dropdown-item>
          <el-dropdown-item class="clearfix">
            <el-button type="text" style="font-size:16px;font-weight:700;" >申请消息</el-button>
            <el-badge class="mark" :value="applyNews" />
          </el-dropdown-item>
          <el-dropdown-item class="clearfix">
            <el-button type="text"  style="font-size:16px;font-weight:700;" @click="turnTo('toMessage')">留言回复</el-button>
            <el-badge class="mark" :value="replyNews" />
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-badge>
    

  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name","roles"]),
  },
  data() {
    return {
      message: '',
      isShow:true,
      imgUrlList:[],
      applyNews:0,
      replyNews:0,
      annouNews:0,
      annouidList:[]
      
    };
  },
  mounted () {
    this.getImage()
    this.getNoReadedMessage()
    this.getNoReadedAnnoun()
  }, 
  methods: {
    // 获取图片地址
    async getImage(){
      let result =await this.$store.dispatch('user/getIndexImg')
      if(result.code==200){
        this.imgUrlList = result.data
      }else{
        this.$message({
          message: '数据获取失败',
          type: 'error'
        })
      }
      
    },
    // 获取用户留言未读数
    async getNoReadedMessage(){
      // console.log(this.$store.getters.uid)
      let uid = this.$store.getters.uid
      let result = await this.$store.dispatch('user/getNoReadedMessage',{uid})
      if(result.code==200){
        this.replyNews = result.data.length
      }else{
        this.$message({
          message: '数据加载失败',
          type: 'error'
        })
      }
    },
    //查看回复：跳转到留言页面
    turnTo(toPath){
      if(toPath == 'toMessage'){
        this.$router.push({name:'UserMessage'})
      }else if(toPath=='toAnnou'){
        this.$router.push({name:'userAnnouncement',query: {id:this.annouidList}})
      }
      
    },
    // 获取新公告
    async getNoReadedAnnoun(){
      let uid = this.$store.getters.uid
      let result  = await this.$store.dispatch('user/getNoReadedAnnoun',{uid})
      if(result.code==200){
        result.data.forEach(item => {
          this.annouidList.push(item.aid)
        });
        this.annouNews = result.data.length
      }else{
        // console.log(result)
        this.$message({
          message: '数据加载失败',
          type: 'error'
        })
      }
    }
  }
};
</script>

<style scoped>
.title {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}
.item {
  margin-top: 10px;
  margin-right: 40px;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.dropdown {
  width: 50px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  background-color: #99ccee67;
  position: absolute;
  top: 70%;
  right: 200px;
  border: #00060e 25px;
  border-radius: 25px;
  box-shadow:5px 5px 5px 0 rgb(48, 65, 86);
  backdrop-filter: 5px;
}
.icon{
  width: 50px;
  height: 50px;
  font-size: 20px;
  text-align: center;
  line-height: 50px;
  border-radius: 25px;
}
</style>
