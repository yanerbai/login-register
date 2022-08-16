<template>
  <form>
    <div class="control">
      <p class="control__title">登录</p>
      <!-- 用户名输入 -->
      <div>
        用户名：<input
          class="control__username"
          placeholder="请输入账号"
          v-model.trim="username"
          required
        />
      </div>
      <!-- 密码输入 -->
      <div>
        密&nbsp;&nbsp;&nbsp;码：<input
          class="control__password"
          type="password"
          placeholder="请输入密码"
          v-model.trim="password"
          required
        />
      </div>
      <!-- 保持登录状态 -->
      <div class="control__keep">
        <!-- 点击选中 -->
        <input
          @click="handlesave"
          class="control__yes"
          type="radio"
          value="0"
        />
        <label for="yes">记住登录状态</label>
      </div>
      <!-- v-on点击按钮触发handlelogin方法 -->
      <button type="submit" @click.prevent="handleLogin">登录</button
      >&nbsp;&nbsp;&nbsp;
      <router-link to="/Register" class="control__reg"
        >暂无账号，立即注册</router-link
      >
    </div>
  </form>
</template>

<script>
import store from "@/store";
import { Message } from "element-ui";

export default {
  data() {
    return {
      username: "", //用户名，用v-model绑定监听，将输入的字符串赋值给username变量
      password: "", //密码
      token: "", //false为不保存登录
    };
  },

  methods: {
    handleLogin() {
      if (
        this.username === store.state.username &&
        this.password === store.state.password
      ) {
        this.token = "true"; //修改登录状态token
        localStorage.setItem("token", "true");
        this.$store.dispatch("UserLogin", this.token);
        this.$router.replace("/home"); //如果输入的名字以及密码正确路由跳转至个人页面
      } else if (this.username === "" || this.password === "") {
        //名字为空
        Message.warning("用户名或密码为空");
      } else {
        Message.warning("账号不存在，请注册后登录");
      }
    },

    //点击保持登录状态触发handlesave
    handlesave: function () {
      this.token = "true"; //修改登录状态为true
      this.$store.dispatch("UserLogin", this.token);
    },
  },
};
</script>

<style>
label {
  margin-left: 10px;
}
.control__yes {
  margin-left: -30px;
}
</style>


