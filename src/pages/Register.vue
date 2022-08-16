<template>
  <form>
    <div class="control">
      <p class="control__title">注册</p>
      <div>
        用户名：<input
          class="control__username"
          placeholder="请输入账号"
          v-model.trim="username"
          required
        />
      </div>
      <div>
        密&nbsp;&nbsp;&nbsp;码：<input
          class="control__password"
          placeholder="请输入密码"
          type="password"
          v-model.trim="password"
          required
        />
      </div>
      <div class="control__pwdagain">
        确认密码：<input
          class="control__password"
          placeholder="请再次输入密码"
          type="password"
          v-model.trim="pwdagain"
          required
        />
      </div>
      <!--注册按钮-->
      <button class="control__register-btn" @click="handleFinish">注册</button>
      <!--这里我们用路由跳转到登陆组件-->
      <router-link to="/Login" class="control__reg"
        >已有账号，去登陆</router-link
      >
    </div>
  </form>
</template>

<script>
import store from "@/store";
import { Message } from "element-ui";
export default {
  name: "Register",

  props: {
    msg: String,
  },

  data() {
    return {
      username: "",
      password: "",
      pwdagain: "",
    };
  },

  methods: {
    //点击完成按钮触发handlefinish
    handleFinish() {
      // 校验
      if (store.state.username === this.username) {
        Message.warning("该用户已存在");
      } else if (this.username === "" || this.password == "") {
        Message.warning("请输入用户名或密码");
      } else if (this.password !== this.pwdagain) {
        Message.warning("密码不一致，请重新输入");
      } else if (
        this.username.length < 5 ||
        this.username.length > 20 ||
        this.password.length < 5 ||
        this.password.length > 20
      ) {
        Message.warning("用户名或密码必须为5~20位");
      } else {
        // 校验成功，存储用户信息
        this.$store.dispatch("UserName", this.username);
        this.$store.dispatch("PassWord", this.password);
        Message.success("注册成功");
        //完成注册后跳转至登录页面
        this.$router.replace("/login");
      }
    },
  },
};
</script>

<style >
.control__pwdagain {
  margin-left: -20px;
}
.control__reg {
  margin-top: 15px;
}
</style>


