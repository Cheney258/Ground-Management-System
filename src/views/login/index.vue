<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">校园运动场地管理系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

        <el-radio-group v-model="loginForm.role" class="radio">
          <el-radio label="1" style="color:#2d3a4b;font-size:22px;font-weight: bold;">用户</el-radio>
          <el-radio label="2" style="color:#222;font-size:22px;font-weight: bold;">管理员</el-radio>
        </el-radio-group>

      <el-button :loading="loading" type="primary" @click.native.prevent="handleLogin"><label v-html="'登&nbsp;&nbsp;&nbsp;&nbsp;陆'"></label></el-button>

    </el-form>
  </div>
</template>

<script>
// import {parseTime,formatTime} from '@/utils/index.js'
export default {
  
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '111111',
        role: '1'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        role: [{ required: true }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        // console.log(this.loginForm)
        if (valid) {
          // console.log('11')
          this.loading = true
          // console.log(this.loginForm)
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$message({
              message: '登录成功',
              type: 'success'
            })
            this.$router.push('/')
            this.loading = false
          }).catch((err) => {
            this.loading = false
            return Promise.reject(new Error(err))
          })
        } else {
          console.log('输入有误！')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgb(252, 251, 251);
    border-radius: 5px;
    color: #f70606;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  background: url(~@/assets/bg1.png) no-repeat center center;
  display: flex;
  background-size:cover;
  justify-content: center;
  overflow: hidden;

  // width: 100vw;
  // height: 100vh;
  // display: flex;
  align-items: center;
  // justify-content: center;
  // background: url("/bg.png") fixed no-repeat;
  // background-size: cover;

  .login-form {
    position: relative;
    width: 460px;
    height: 400px;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px;
    // left:6.5%;
    // margin-left: 360px;
    // margin-top: 230px;
    border-radius: 25px;
    background: inherit;
    // background:rgba($color: rgb(136, 154, 164), $alpha: 0.5);
    // backdrop-filter: blur(7px) !important;
    box-shadow: 20px #889aa4;
    overflow: hidden;
  }

  .login-form::before {
    content: "";
    width: calc(100% + 20px);
    height: calc(100% + 20px);
    position: absolute;
    top: -10px;
    left: -10px;
    overflow: hidden;
    background: inherit;
    // background:rgba($color: rgb(136, 154, 164), $alpha: 0.2);
    box-shadow: inset 0 0 0 200px rgba(255, 255, 255, 0.25);
    filter: blur(6px);
  }

  


  .tips {
    font-size: 14px;
    color:$dark_gray;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #2d3a4b;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
<style scoped>
.login-container /deep/ .radio{
  background-color:rgba(136, 154, 164, 0) ;
  border: 0;
  text-align: center !important;
  font-size: 24px!important;
}
.login-container /deep/ .el-input input{
  color:#343030!important;
  caret-color:rgb(15, 15, 15)!important;
  }
.login-container /deep/ .el-form-item__content{
    width: 300px;
    margin: auto;
    border: none!important;
    background-color: rgba(255, 255, 255, 0.3)!important;
    border-radius: 18px!important;
    color: #3d5245!important;
  }
  .login-container /deep/ .el-button{
    width: 300px;
    margin: auto;
    font-size: 20px!important;
    background-color: #66b1ff!important;
    border-radius: 18px!important;
    z-index: 100000;
  }
</style>
