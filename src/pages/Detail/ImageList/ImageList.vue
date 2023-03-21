<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div
        class="swiper-slide"
        v-for="(skuImage, index) of skuImageList"
        :key="skuImage.id"
      >
        <img :src="skuImage.imgUrl" @click="changeCurrentIndex(index)" :class="{active:currentIndex == index}"/>
      </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</template>

<script>
import Swiper from "swiper";
export default {
  name: "ImageList",
  data() {
    return {
      currentIndex:0
    }
  },
  // 接受父组件传递的图片信息
  props: ["skuImageList"],
  watch: {
    // 只能监视图片数据是否已经存在，不能确定v-for遍历是否结束模板是否已经完全跟新完
    skuImageList() {
      // 调用nextTick方法，等待dom完全解析完成，再创建swiper实例
      this.$nextTick(() => {
       new Swiper(".swiper-container", {
          // 一行展示3个图片
          slidesPerView: 3,
          //每次滚动2个图片
          slidesPerGroup : 1,
          // 如果需要前进后退按钮
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
        });
      });
    },
  },
  methods:{
    changeCurrentIndex(index){
       // 鼠标点击时改变当前索引值为鼠标点击对象的索引
      this.currentIndex = index
       // 将当前索引传递给兄弟组件通过全局事件总线
      this.$bus.$emit('getCurrentIndex',index) 
    }
  }
};
</script>

<style lang="less" scoped>
.swiper-container {
  height: 56px;
  width: 412px;
  box-sizing: border-box;
  padding: 0 12px;

  .swiper-slide {
    width: 56px;
    height: 56px;

    img {
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      padding: 2px;
      width: 50px;
      height: 50px;
      display: block;

      &.active {
        border: 2px solid #f60;
        padding: 1px;
      }

      // &:hover {
      //   border: 2px solid #f60;
      //   padding: 1px;
      // }
    }
  }

  .swiper-button-next {
    left: auto;
    right: 0;
  }

  .swiper-button-prev {
    left: 0;
    right: auto;
  }

  .swiper-button-next,
  .swiper-button-prev {
    box-sizing: border-box;
    width: 12px;
    height: 56px;
    background: rgb(235, 235, 235);
    border: 1px solid rgb(204, 204, 204);
    top: 0;
    margin-top: 0;
    &::after {
      font-size: 12px;
    }
  }
}
</style>