<template>
  <div>
    <el-card shadow="never">
      <!-- hearder -->
      <div slot="header" class="title">个人信息</div>
      <!-- body -->
      <div>
        <div class="demo-basic--circle">
          <div class="block">
            <el-avatar :size="100" :src="this.avatar" />
            <h3>头像</h3>
          </div>
        </div>
        <el-form ref="FORM" label-position="rigth" label-width="80px" :model="userinfo" class="form" disabled prop="userinfo">
          <el-form-item label="用户名:" prop="username">
            <el-input v-model="userinfo.username" />
          </el-form-item>
          <el-form-item label="学号:" prop="xuehao">
            <el-input v-model="userinfo.xuehao" />
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="userinfo.sex">
              <el-radio label="男" />
              <el-radio label="女" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="email:" prop="email">
            <el-input v-model="userinfo.email" />
          </el-form-item>
          <el-form-item label="phone:" prop="phone">
            <el-input v-model="userinfo.phone" />
          </el-form-item>
        </el-form>
        <el-button type="warning" style="display:block;margin:0px auto" icon="el-icon-edit" @click="isShow = true">编辑</el-button>
      </div>

      <el-dialog title="修改信息" :visible.sync="isShow" style="top:-100px">
        <div class="demo-basic--circle">
          <div class="block">
            <el-avatar :size="100" :src="this.avatar"/>
            <el-button type="text" @click="upload=true">更换</el-button>
          </div>
        </div>
        <el-form ref="userinfo" label-position="rigth" label-width="100px" :rules="rules" :model="userinfo" class="form" prop="userinfo">
          <el-form-item label="用户名:" prop="username">
            <el-input v-model="userinfo.username" />
          </el-form-item>
          <el-form-item label="学号:" prop="xuehao">
            <el-input v-model="userinfo.xuehao" />
          </el-form-item>
          <el-form-item label="原密码:" prop="password">
            <el-input v-model="userinfo.password" show-password />
          </el-form-item>
          <el-form-item label="确认密码:" prop="password1">
            <el-input v-model="userinfo.password1" show-password />
          </el-form-item>
          <el-form-item label="新密码:" prop="password2">
            <el-input v-model="userinfo.password2" show-password />
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="userinfo.sex">
              <el-radio label="男" />
              <el-radio label="女" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="email:" prop="email">
            <el-input v-model="userinfo.email" />
          </el-form-item>
          <el-form-item label="phone:" prop="phone">
            <el-input v-model="userinfo.phone" />
          </el-form-item>
        </el-form>
        <el-button type="warning" class="btn" icon="el-icon-edit" @click="update">保存</el-button>
        <el-button type="primary" class="btn" icon="el-icon-error" @click="isShow = false">取消</el-button>
      </el-dialog>
    </el-card>
    <el-dialog
      title=""
      :visible.sync="upload"
      width="width"
      style="width:400px;margin:0 auto;">
      <div>
        <Upload :fileList="fileList" :limit="limit"  ref="uploadImg" name="avater"></Upload>
      </div>
      <div slot="footer">
        <el-button @click="upload = false">取 消</el-button>
        <el-button type="primary" @click="uploads">上传</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Myinfo',

  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.userinfo.password1 !== '') {
          this.$refs.userinfo.validateField('password1')
        }
        callback()
      }
    }
    var validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.userinfo.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value == this.userinfo.password) {
        callback(new Error('新密码不能与原密码相同'))
      } else {
        callback()
      }
    }
    return {
      userinfo: {
        username: '',
        xuehao: '',
        password: '',
        password1: '',
        password2: '',
        sex: '',
        email: '',
        phone: '',
        uid: '',
      },
      fileList: [],
      limit:1,
      upload:false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        xuehao: [
          { required: true, message: '请输入学号', trigger: 'blur' },
          { pattern: /^[0-9]{10}$/, message: '长度为10位数字', trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePass },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        password1: [
          { required: true, trigger: 'blur', validator: validatePass1 },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        password2: [
          { required: true, trigger: 'blur', validator: validatePass2 },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '必填项' }
        ],
        email: [
          { required: true, pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, trigger: 'blur' }
        ],
        phone: [
          { required: true, pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/, trigger: 'blur' }
        ]
      },
      isShow: false

    }
  },

  computed: {
    ...mapGetters(['avatar'])
  },
  beforeMount () {
    this.getUserinfo()
  },
  mounted() {
    
  },

  methods: {
    // 修改信息
    update() {
      console.log(this.userinfo)
      this.$refs.userinfo.validate(async(valid) => {
        if (valid) {
          const reslut = await this.$store.dispatch('user/updateInfo', this.userinfo)
          reslut.code == 200 ? this.$message.success(reslut.message) : this.$message.error(reslut.message)
          // 数据成功更新 1 秒后重新登录
          setTimeout(() => {
            this.$store.dispatch('user/logout')
            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          }, 1000)

          this.isShow = false
        } else {
          this.isShow = true
          this.$message.error('输入有误')
        }
      })
    },
    // 获取用户信息
    async getUserinfo() {
      const reslut = await this.$store.dispatch('user/getInfo')
      // console.log(reslut)
      this.userinfo.username = reslut.name
      this.userinfo.xuehao = reslut.xuehao
      this.userinfo.sex = reslut.sex
      this.userinfo.email = reslut.email
      this.userinfo.phone = reslut.phone
      this.userinfo.uid = this.$store.state.user.uid
      this.userinfo.avatar = reslut.avatar
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
        formData.append("avatar", item.raw);
      });
      let reslut = await this.$store.dispatch('user/uploadAvatar',formData)
      if(reslut.code==200){
        this.$notify.success({title:'更换成功！'})
        this.getUserinfo()
        this.upload = false
      }else{
        this.$message.error(reslut.message)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.myinfo-container{
    width: 100%;
    height: 100%;
}
.title{
    text-align: center;
    font-size: 28px;
    font-weight: bold;
}
.block{
    text-align: center;
}
.fromBody{
    margin:0 auto;
}
.form{
    width: 450px;
    position: relative;
    left: 50%;
    margin-left: -225px;
    top:60%;
}
.btn{
    position: relative;
    left: 35%;
    margin: 10px 40px;
}
</style>
