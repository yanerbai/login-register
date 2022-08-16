<template>
  <div
    class="slider"
    ref="slider"
    :style="`transform: rotateZ(${direction}deg);`"
    @mouseover="onStop"
    @mouseleave="onStart"
  >
    <div
      :class="{ slider__transition: transition }"
      :style="`width: ${width}px;  transform: translateX(${-left}px);`"
    >
      <!-- img容器 -->
      <div
        class="slider__img--pack"
        v-for="(item, index) in imageData"
        :key="index"
      >
        <img
          class="slider__img"
          v-lazy="getDefault(item && item.imgUrl)"
          :key="item.imgUrl"
        />
      </div>
      <div class="slider__img--pack">
        <img
          class="slider__img"
          v-lazy="getDefault(imageData[0].imgUrl)"
          :key="imageData[0].imgUrl"
        />
      </div>
    </div>
    <!-- 插槽 -->
    <div
      class="arrow-left"
      @click="goSlide(((activeSwitcher + 1) % len) * imageWidth, 'right')"
      v-show="!leftActArrow"
    >
      <slot name="arrow-left"></slot>
    </div>
    <div
      class="arrow-right"
      @click="goSlide((activeSwitcher % (len + 1)) * imageWidth, 'left')"
      v-show="!rightActArrow"
    >
      <slot name="arrow-right"></slot>
    </div>

    <div class="slider__switch">
      <div
        @click="onSwitch(n)"
        :class="['slider__rect', { active: activeSwitcher === n }]"
        v-for="n in len"
        :key="n"
      ></div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueLazyLoad from "vue-lazyload";
Vue.use(VueLazyLoad); // 图片懒加载插件

export default {
  name: "ImageSlider",

  props: {
    imageData: {
      // 轮播图片数组
      type: Array,
      default: () => {
        return [];
      },
    },
    // 方向
    direction: {
      type: Number,
      default: 0,
    },
    interval: {
      // 自动滑动轮播间隔
      type: Number,
      default: 3000,
    },
    imageWidth: {
      // 图片宽度
      type: Number,
      default: 400,
    },
    imageHeight: {
      // 图片高度
      type: Number,
      default: 300,
    },
  },

  data() {
    return {
      leftActArrow: false, // 左箭头激活标志
      toLeft: true, // 左滑标志，默认左滑
      rightActArrow: false, // 右箭头激活标志
      left: 0, // 滑动偏移值
      transition: false, // 暂停时为完成滑动的过渡标志
      slideTimer: null, // 轮播切换定时器
      moveTimer: null, // 向左滑动效果定时器
      autoTimer: null, // 首次自动滑动定时器
      switch: false, // 是否在进行跳转切换，用于区别箭头或自动切换（false）和跳转切换（true）
    };
  },

  computed: {
    width() {
      // 容器宽度：(图片数组长度+1) * 图片宽度
      return (this.imageData.length + 1) * this.imageWidth;
    },
    len() {
      // 数组长度
      return this.imageData.length || 0;
    },
    activeSwitcher() {
      // 当前展示图片标志
      return (
        (this.toLeft
          ? Math.ceil(this.left / this.imageWidth) % this.len
          : Math.floor(this.left / this.imageWidth) % this.len) + 1
      );
    },
  },

  mounted() {
    window.onfocus = () => {
      // 页面激活状态
      this.onStart();
    };
    window.onblur = () => {
      // 页面未激活状态
      this.onStop();
    };
    this.onStart();
  },

  methods: {
    getDefault(src) {
      // 获取懒加载默认图
      return {
        src: src,
        error: require("../assets/img/defaultNews.gif"),
        loading: require("../assets/img/defaultNews.gif"),
      };
    },

    onSwitch(n) {
      // 切换图片
      this.switch = true; // 跳转切换标志
      const target = (n - 1) * this.imageWidth;
      if (n < this.activeSwitcher) {
        // 往右滑动
        this.goSlide(target, "right");
      }
      if (n > this.activeSwitcher) {
        // 往左滑动
        this.goSlide(target, "left");
      }
    },

    onStart() {
      if (this.len > 1) {
        // 超过一条时滑动
        this.toLeft = true; // 重置左滑标志
        this.transition = false;
        this.onAutoSlide(); // 自动滑动轮播
      }
    },

    onStop() {
      clearTimeout(this.autoTimer);
      clearTimeout(this.slideTimer);
      this.autoTimer = null;
      this.slideTimer = null;
      if (this.toLeft) {
        // 左滑箭头移出时
        this.onStopHorizontal("left");
      } else {
        this.onStopHorizontal("right");
      }
    },

    onStopHorizontal(direction) {
      // 停止轮播图水平滑动
      clearInterval(this.moveTimer);
      this.moveTimer = null;
      this.transition = true;
      // 停止左滑向上取整,停止右滑向下取整
      if (direction == "left") {
        this.left = Math.ceil(this.left / this.imageWidth) * this.imageWidth;
      } else {
        this.left = Math.floor(this.left / this.imageWidth) * this.imageWidth;
      }
    },

    onAutoSlide() {
      this.slideTimer = setTimeout(() => {
        const target =
          (this.left % (this.len * this.imageWidth)) + this.imageWidth;
        this.autoMoveLeft(target);
      }, this.interval);
    },

    //水平滑动
    goSlide(target, direction) {
      this.transition = false;
      if (direction == "left") {
        // 点击右箭头，往左滑动
        this.toLeft = true; // 向左滑动
        this.onStopHorizontal("left");
        this.moveHorizontal(target, "left");
      } else {
        // 点击左箭头，往右滑动
        this.toLeft = false; // 非向左滑动
        this.onStopHorizontal("right");
        this.moveHorizontal(target, "right");
      }
    },

    autoMoveLeft(target) {
      // 自动切换，向左滑动效果
      if (this.left === this.len * this.imageWidth) {
        // 最后一张时，重置left
        this.left = 0;
      }
      this.moveTimer = setInterval(() => {
        if (this.left >= target) {
          clearInterval(this.moveTimer);
          this.moveTimer = null;
          this.onAutoSlide(); // 自动间隔切换下一张
        } else {
          var step = Math.ceil((target - this.left) / 10); // 越来越慢的滑动过程
          this.left += step;
        }
      }, 25);
    },

    moveHorizontal(target, direction) {
      // 左停止
      if (direction === "left" && this.left === this.len * this.imageWidth)
        this.left = 0;
      // 右停止
      if (direction === "right" && this.left === 0)
        this.left = this.len * this.imageWidth;

      this.moveTimer = setInterval(() => {
        if (
          (direction === "left" && this.left >= target) ||
          (direction === "right" && this.left <= target)
        ) {
          clearInterval(this.moveTimer);
          this.moveTimer = null;
          if (this.switch) {
            // 跳转切换，完成后自动滑动
            this.switch = false;
            this.onStart();
          }
        } else {
          var step;
          // 左右向上下取整，停止滑动
          if (direction === "right") {
            step = Math.floor((target - this.left) / 10); // 越来越慢的滑动过程
          } else {
            step = Math.floor((target - this.left) / 10); // 越来越慢的滑动过程
          }
          this.left += step;
        }
      }, 25);
    },

    beforeDestroy() {
      clearTimeout(this.slideTimer);
      clearInterval(this.moveTimer);
      clearInterval(this.autoTimer);
      this.slideTimer = null;
      this.moveTimer = null;
      this.autoTimer = null;
    },
  },
};
</script>

<style lang="less" scoped>
@themeColor: #1890ff;
@width: 520px;
@height: 346px;
.slider {
  width: @width;
  position: relative;
  overflow: hidden;
  transform: translateX();
  &__transition {
    will-change: transform;
    transition: transform 0.3s ease-out;
  }
  &__img--pack {
    width: @width;
    display: inline-block;
    .slider__img {
      width: @width;
      height: @height;
      vertical-align: bottom; // 消除img标签底部的5px
      cursor: pointer;
    }
    .slider__title {
      height: 54px;
      font-size: 18px;
      font-weight: 500;
      color: #333333;
      line-height: 27px;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      &:hover {
        color: @themeColor;
      }
    }
    .slider__date {
      margin-top: 30px;
      text-align: right;
      height: 20px;
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 20px;
    }
  }
  &:hover {
    .arrow-left {
      display: inline-block;
    }
    .arrow-right {
      display: inline-block;
    }
  }
  .arrow-left {
    display: none;
    width: 24px;
    height: 44px;
    position: absolute;
    top: 151px;
    left: 10px;
    cursor: pointer;
    vertical-align: bottom;
  }
  .arrow-right {
    display: none;
    width: 24px;
    height: 44px;
    position: absolute;
    top: 151px;
    right: 10px;
    cursor: pointer;
    vertical-align: bottom;
  }
  &__switch {
    position: absolute;
    bottom: 16px;
    left: 20px;
    .slider__rect {
      display: inline-block;
      cursor: pointer;
      margin-right: 7px;
      width: 30px;
      height: 4px;
      background: #e3e3e3;
      border-radius: 1px;
      transition: background-color 0.3s;
    }
    .active {
      background: @themeColor;
    }
  }
}
</style>