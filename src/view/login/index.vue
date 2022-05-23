<template>
  <div class="container-login">
    <div class="login-box">
      <img class="logo" src="../../assets/toplogo.png" alt="">
      <div v-if="loginFlag">
        <a-tabs defaultActiveKey="1" @change="selectLoginType">
          <a-tab-pane tab="密码登录" key="1">
            <div class="loginInfo">
              <a-input placeholder="手机号" v-model="userName" ref="userNameInput">
                <a-icon slot="prefix" type="user" />
                <a-icon v-if="userName" slot="suffix" type="close-circle" @click="userNameEmpty"/>
              </a-input>
            </div>
            <div class="loginInfo">
              <a-input placeholder="密码" v-model="passWord" ref="passWordInput" type="password">
                <a-icon slot="prefix" type="lock" />
                <a-icon v-if="passWord" slot="suffix" type="close-circle" @click="passWordEmpty"/>
              </a-input>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="短信登录" key="2" forceRender>
            <div class="loginInfo">
              <a-input placeholder="手机号" v-model="phoneNumber" ref="phoneNumberInput">
                <a-icon slot="prefix" type="mobile" />
                <a-icon v-if="phoneNumber" slot="suffix" type="close-circle" @click="phoneNumberEmpty" />
              </a-input>
            </div>
            <div class="loginInfo">
              <a-input placeholder="验证码" v-model="authCode" ref="authCodeInput" style="width: 68%">
                <a-icon slot="prefix" type="mail" />
                <a-icon v-if="authCode" slot="suffix" type="close-circle" @click="authCodeEmpty" />
              </a-input>
              <a-button v-show="show" style="float: right;width: 27%" @click="getCode(1)">获取验证码</a-button>
              <a-button v-show="!show" style="float: right;width: 27%" >{{count}}秒后重发</a-button>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div v-show="registerFlag" >
        <a-tabs defaultActiveKey="1" class="register-user">
          <a-tab-pane tab="注册账户" key="1">
            <div class="loginInfo">
              <a-input placeholder="手机号" v-model="phoneNumber" ref="phoneNumberInput">
                <a-icon slot="prefix" type="mobile" />
                <a-icon v-if="phoneNumber" slot="suffix" type="close-circle" @click="phoneNumberEmpty" />
              </a-input>
            </div>
            <div class="loginInfo">
              <a-input placeholder="6-18位密码，区分大小写" v-model="passWord" ref="passWordInput" type="password">
                <a-icon slot="prefix" type="lock" />
                <a-icon v-if="passWord" slot="suffix" type="close-circle" @click="passWordEmpty"/>
              </a-input>
            </div>
            <div class="loginInfo">
              <a-input placeholder="确认密码" v-model="secondPassWord" ref="passWordInput" type="password"></a-input>
            </div>
            <div class="loginInfo">
              <a-input placeholder="验证码" v-model="authCode" ref="authCodeInput" style="width: 70%">
                <a-icon slot="prefix" type="mail" />
                <a-icon v-if="authCode" slot="suffix" type="close-circle" @click="authCodeEmpty" />
              </a-input>
              <a-button v-show="showCode" style="float: right;width: 27%" @click="getCode(2)">获取验证码</a-button>
              <a-button v-show="!showCode" style="float: right;width: 27%" >{{registCount}}秒后重发</a-button>
            </div>
            <div class="loginInfo">
              <a-button style="width: 176px;margin-bottom: 24px;float: left" type="primary" @click="submitRegister">注册</a-button>
              <a style="float: right;text-decoration: none;margin-top: 8px" href="javascript:void(0)" @click="accountLogin">使用已有账户登录</a>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div class="loginInfo" v-if="loginFlag">
        <a-button style="width: 100%;margin-top: 24px;margin-bottom: 24px" type="primary" @click="userLogin">登录</a-button>
        <div>
          <p style="float:left;font-size: 14px">其他登录方式</p>
          <a style="float: right;text-decoration: none" href="javascript:void(0)" @click="registerAccount">注册账户</a>
        </div>
      </div>
    </div>
    <div class="box-bottom">
      <div>
        <span>帮助</span>
        <span>隐私</span>
        <span>条款</span>
      </div>
      <p>copyright@2020 南京慧目信息技术有限公司</p>
    </div>
  </div>
</template>
<script>
import api from '../../api/interface'
import Cookies from 'js-cookie'

export default {
  data () {
    return {
      loginFlag: true,
      registerFlag: false,
      boundFlag: false,
      btnText: '获取验证码',
      show: true,
      showCode: true,
      count: '',
      registCount: '',
      timer: null,
      loginType: '1',
      userName: '',//账号
      passWord: '',//密码
      secondPassWord: '',//确认密码
      phoneNumber: '',//手机号
      authCode: '',//验证码
      userInfo: null
    }
  },

  methods: {
    //选择登录方式
    selectLoginType(val){
      if(val == 1){
        this.userName = '';
        this.passWord = '';
        this.loginType = '1'
      }else {
        this.phoneNumber = '';
        this.authCode = '';
        this.loginType = '2'
      }
    },
    //登录
    userLogin () {
      let params = {
        username: 'admin',
        password: '123456#peter',
      }
      this.$Utils
        .commonAjax({
          url: api.interfaceConfig.login,
          type: 'POST',
          data: params,
          flag: true
        }).then(res => {
          if (res.success) {
            window.localStorage.setItem("token", res.result);
            this.$router.push({name: 'preview'})
          } else {
            this.$message.warning(res.msg)
          }
        })
        .catch(err => {

        })
    },
    //清空账号
    userNameEmpty () {
      this.$refs.userNameInput.focus()
      this.userName = ''
    },
    //清空手机号
    phoneNumberEmpty () {
      this.$refs.phoneNumberInput.focus()
      this.phoneNumber = ''
    },
    //清空密码
    passWordEmpty () {
      this.$refs.passWordInput.focus()
      this.passWord = ''
    },
    //清空验证码
    authCodeEmpty () {
      this.$refs.authCodeInput.focus()
      this.authCode = ''
    },
    //获取验证码
    getCode(val){
      var regExp = /^((1[3,5,6,7,8,9][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
      if(!regExp.test(this.phoneNumber)) return this.$message.warning('手机号码格式不正确!')
      this.getCodeCount(val)
      let params = {
        phoneNumber: this.phoneNumber,
      }
      this.$Utils
        .commonAjax({
          url: api.interfaceConfig.getSmsCode,
          type: 'POST',
          data: params
        }).then(res => {
          if (res.status === 200) {
            this.$message.success(res.msg)
          } else {
            this.$message.warning(res.msg)
          }
        })
        .catch(err => {

        })
    },

    getCodeCount(type){
      const TIME_COUNT = 60;
      if (!this.timer) {
        if(type === 1){
          this.count = TIME_COUNT;
          this.show = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.show = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000)
        }else{
          this.registCount = TIME_COUNT;
          this.showCode = false;
          this.timer = setInterval(() => {
            if (this.registCount > 0 && this.registCount <= TIME_COUNT) {
              this.registCount--;
            } else {
              this.showCode = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000)
        }
      }
    },
    //注册账户
    registerAccount(){
      this.loginFlag = false;
      this.registerFlag = true;
      this.phoneNumber = '';
      this.passWord = '';
      this.authCode = '';
      this.secondPassWord = '';
    },
    //提交注册
    submitRegister(){
      var regExp = /^((1[3,5,6,7,8,9][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
      if(!regExp.test(this.phoneNumber)) return this.$message.warning('手机号码格式不正确!');
      let regex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/
      if(!regex.test(this.passWord)) return this.$message.warning('密码必须包含数字、字母，6-18位');
      if (this.authCode === '') return this.$message.warning('验证码不能为空')

      let params = {
        phoneNumber: this.phoneNumber,
        password: this.passWord,
        code: this.authCode,
      }
      this.$Utils
        .commonAjax({
          url: api.interfaceConfig.register,
          type: 'POST',
          data: params
        }).then(res => {
          if (res.status === 200) {
            this.loginFlag = true;
            this.registerFlag = false;
            this.userName = '';
            this.passWord = ''
            this.$message.success('注册成功')
          } else {
            this.$message.warning(res.msg)
          }
        })
        .catch(err => {

        })
    },
    //使用已有账户登录
    accountLogin(){
      this.loginFlag = true;
      this.registerFlag = false;
      this.phoneNumber = '';
      this.passWord = '';
      this.authCode = '';
    }

  },
  mounted () {
    let url = window.location.href;
    if(url.indexOf("lili") != -1 ){
      let token = Cookies.get('token');
      let userInfo = Cookies.get('userInfo');
      let roleId = Cookies.get('roleId');
      window.localStorage.setItem("token", token);
      window.localStorage.setItem("userInfo", userInfo);
      window.localStorage.setItem("roleId", roleId);
      if(token != undefined && roleId != undefined){
        this.$router.push({name: 'preview'})
      }else{
        this.$router.push({name: 'login'})
      }
    }else{
      window.localStorage.removeItem('userInfo');
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('roleId');
    }
  }
}
</script>

<style lang="less" scoped>
  .container-login {
    position: relative;
    background: url("../../assets/bg.png") no-repeat;
    background-size: cover;
    width: 100%;
    height: 100%;
    .login-box{
      padding-bottom: 48px;
      width:516px;
      /*height:550px;*/
      text-align: center;
      position: absolute;
      left: 50%;
      /*margin-left: -294px;*/
      top: 45%;
      -webkit-transform: translate(-50%,-50%);
      -moz-transform: translate(-50%,-50%);
      transform:translate(-50%,-50%);
      background:rgba(255,255,255,1);
      box-shadow:0px 6px 6px -5px rgba(0,0,0,0.28);
      .logo{
        margin-top: 40px;
        margin-bottom: 48px;
        width: 300px;
        height: 40px;
      }
      .loginInfo{
        padding: 0 70px 0 78px;
        margin-bottom: 24px;
        text-align: left;
      }
    }
    .box-bottom{
      width: 100%;
      position: absolute;
      bottom: 0px;
      text-align: center;

      p,span{
        font-size: 14px;
        padding: 5px 20px;
        color:rgba(255,255,255,0.8);
      }
    }
  }
</style>
<style>
  .ant-tabs-bar{
    border-bottom: none !important;
  }
  .ant-checkbox-group{
    width: 100%;
  }
  .ant-tabs-tab{
    font-size: 16px !important;
  }
  .register-user .ant-tabs-bar {
    padding: 0 70px 0 78px;
    text-align: left;
  }
</style>
