<template>
  <transition name="slide">
    <div class="regset">
      <div class="title">
        <h1>Reset</h1>
      </div>
      <van-cell-group class="regset-from">
        <van-field v-model="userName" clearable border label-width="4.0em" label="邮箱" placeholder="请输入邮箱" :error-message="userNameErr" />
        <van-row>
            <van-col span="15">
              <van-field style="vertical-align: bottom" label-width="4.0em" label="验证码"  v-model="verificationCode" clearable border placeholder="请输入验证码" :error-message="verificationCodeErr" />
            </van-col>
            <van-col span="9"> 
              <van-button style="vertical-align: bottom"  label-width="4.0em" @click="getCode()" type="primary" size="small" :loading="loading">{{codeContent}}</van-button>
            </van-col>
        </van-row>
        <van-field v-model="password" clearable border label-width="4.0em" type="password" label="密码" placeholder="请输入密码" :error-message="passwordErr" />
        <van-field v-model="passwordRep" clearable border label-width="4.0em" type="password" label="重复密码" placeholder="请再次输入密码" :error-message="passwordRepErr" />
        <van-cell>
          <van-row>
            <van-col span="10" class="btn">
              <van-button type="primary" size="small" @click="regset" :loading="loading">重置</van-button>
            </van-col>
            <van-col span="10" offset="4" class="btn">
              <van-button size="small" @click="cancel" :loading="loading">取消</van-button>
            </van-col>
          </van-row>
        </van-cell>
      </van-cell-group>
    </div>
  </transition>
</template>

<script>
import MD5 from 'js-md5';
import { emailCheck, pwdCheck } from '../../utils/util';
import {regset } from '../../apis/index.js';
export default {
  data() {
    return {
      userName: '',
      password: '',
      passwordRep: '',
      userNameErr: '',
      passwordErr: '',
      passwordRepErr: '',
      verificationCodeErr: '',
      loading: false,
      verificationCode: '',
      codeContent: '获取验证码',
      totalTime: 60,
      canClick: true
    };
  },
  computed: {
     
   
  },
  methods: {
    cancel() {
      this.$router.push('/login');
    },
    getCode() {
      if (!emailCheck(this.userName)) {
        this.userNameErr = '邮箱格式不正确';
        this.loading = false;
        return;
      }
      if (!this.canClick) return
      this.canClick = false
      this.codeContent = this.totalTime + 's后重新发送' //这里解决60秒不见了的问题
      let clock = window.setInterval(() => {
      this.totalTime--
      this.codeContent = this.totalTime + 's后重新发送'
      if (this.totalTime < 0) {     //当倒计时小于0时清除定时器
        window.clearInterval(clock)
        this.codeContent = '重新发送验证码'
        this.totalTime = 60
        this.canClick = true
      }
    },1000)

},
    regset() {
      this.userNameErr = '';
      this.passwordErr = '';
      this.passwordRepErr = '';
      this.loading = true;
      if (!emailCheck(this.userName)) {
        this.userNameErr = '邮箱格式不正确';
        this.loading = false;
        return;
      }
      if (!pwdCheck(this.password)) {
        this.passwordErr = '密码格式不正确';
        this.loading = false;
        return;
      }
      if (this.password !== this.passwordRep) {
        this.passwordRepErr = '两次密码不一致';
        this.loading = false;
        return;
      }
      regset({ email: this.userName, password: MD5(this.password).toString() })
        .then(res => {
          if (res.status === 200) {
            this.loading = false;
            Toast.success('跳转登陆界面');
            setTimeout(() => {
              Toast.clear();
              this.$router.push('/login');
            }, 1000);
          } else {
            this.loading = false;
            Toast.fail(res.msg);
          }
        })
        .catch(error => {
          Toast.fail(error);
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.regset{
    width: 100%;
    height: 100%;
    text-align: center;
    background: url("../../image/bg.jpeg");
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;
    position: absolute;
}
  

  .title {
    width: 65%;
    font-size: 28px;
    margin: 25% auto 11%;
    font-weight: 300;
    color: #f6f7fc9a;
  }
    

.regset-from {
    width: 75%;
    padding: 10px;
    margin: 0 auto;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 8px 0 rgba(0, 0, 0, 0.19);
    border-radius: 1rem;
}
  

.btn {
    text-align: center;
    margin-top: 10px;
}
   

.slide-enter-active, .slide-leave-active {
    transition: all 0.5s;
}
  

.slide-enter, .slide-leave-to {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
}


</style>
