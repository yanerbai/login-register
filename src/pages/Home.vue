<template>
  <div>
    <div>
      <p><span>你好呀，</span>{{ username }}!</p>
      <button class="button" @click.prevent="logout">退出</button>
      <button class="button" @click.prevent="handleRegister">去注册</button>
      <ImageSlider
        :imageData="imageData"
        :imageWidth="520"
        :imageHeight="346"
        :interval="2000"
        :direction="0"
      >
        <template v-slot:arrow-left>
          <img src="@/assets/img/go_left.png" />
        </template>
        <template v-slot:arrow-right>
          <img src="@/assets/img/go_right.png" />
        </template>
      </ImageSlider>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import ImageSlider from "@/components/ImageSlider";

export default {
  name: "Home",

  components: {
    ImageSlider,
  },

  data() {
    return {
      //获取用户信息到主页
      username: store.state.username,
      token: localStorage.getItem("token"), //是否保持登录状态
      imageData: [
        {
          imgUrl: require("../assets/img/f1.webp"),
        },
        {
          imgUrl: require("../assets/img/f2.webp"),
        },
        {
          imgUrl: require("../assets/img/f3.webp"),
        },
      ],
    };
  },

  methods: {
    //当点击退出按钮，将不保存登录状态
    logout() {
      this.token = "false"; //修改登录状态
      this.$store.dispatch("UserLogout", this.token);
      this.$router.replace("/login"); //页面跳转至登录页面
    },

    handleRegister: function () {
      this.$router.push("/register"); //点击注册按钮，跳转至注册页面
    },
  },
};
</script>

<style>
.button {
  margin-right: 10px;
  margin-top: 10px;
  background-color: #f6a8c8;
  border-color: #f6a8c8;
}
</style>
