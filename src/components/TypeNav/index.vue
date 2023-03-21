<template>
  <div class="type-nav">
    <div class="container">
      <div @mouseleave="clearIndex" @mouseenter="showList">
        <h2 class="all">全部商品分类</h2>
         <!-- 为三级联动设置动画属性 name属性再transition标签上，使用动画的元素需要有v-show或者v-if指令-->
        <transition name="categoryList">
          <div class="sort" v-show="show" @click="goSearch">
            <div class="all-sort-list2">
              <!-- 一级联动 -->
              <div
                class="item bo"
                v-for="(c1, index) of categoryList"
                :key="c1.categoryId"
              >
                <h3
                  :class="{ bg: currentIndex == index }"
                  @mouseenter="getIndex(index)"
                >
                  <a
                    :data-categoryName="c1.categoryName"
                    :data-category1Id="c1.categoryId"
                    >{{ c1.categoryName }}</a
                  >
                </h3>
                <!-- 二三级联动 -->
                <div
                  class="item-list clearfix"
                  :style="{ display: currentIndex == index ? 'block' : 'none' }"
                >
                  <div
                    class="subitem"
                    v-for="c2 of c1.categoryChild"
                    :key="c2.categoryId"
                  >
                    <dl class="fore">
                      <dt>
                        <a
                          :data-categoryName="c2.categoryName"
                          :data-category2Id="c2.categoryId"
                          >{{ c2.categoryName }}</a
                        >
                      </dt>
                      <dd>
                        <em v-for="c3 of c2.categoryChild" :key="c3.categoryId">
                          <a
                            :data-categoryName="c3.categoryName"
                            :data-category3Id="c3.categoryId"
                            >{{ c3.categoryName }}</a
                          >
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import throttle from "lodash/throttle.js";
// console.log(throttle);
export default {
  name: "TypeNav",
  data() {
    return {
      currentIndex: -1,
      // 控制三级联动是否展示
      show: true,
    };
  },
  computed: {
    // categoryList(){
    //   return this.$store.state.home.categoryList
    // }
    ...mapState("home", ["categoryList"]),
  },
  methods: {
    // 通过loadash实习节流，50ms执行一次回调
    getIndex: throttle(function (index) {
      this.currentIndex = index;
    }, 50),
    //当鼠标移出三级联动区域时使得当前元素的索引变为1
    clearIndex() {
      this.currentIndex = -1;
      // 如果路径是search,则隐藏列表
      if (this.$route.path !== "/home") {
        this.show = false;
      }
    },
    // 鼠标进入全部商品分类是如果路径不是home，则展示列表
    showList() {
      if (this.$route.path !== "/home") {
        this.show = true;
      }
    },
    //点击三级联动时候实现路由跳转
    goSearch(e) {
      //获取自定义属性的值
      let { categoryname, category1id, category2id, category3id } =
        e.target.dataset;
      let query = {};
      if (categoryname) {
        query.categoryName = categoryname;
        if (category1id) {
          query.category1Id = category1id;
        } else if (category2id) {
          query.category2Id = category2id;
        } else {
          query.category3Id = category3id;
        }
        // 整合参数传递路由参数
        this.$router.push({
          name: "search",
          query: query,
          params: this.$route.params,
        });
      }
    },
  },
  mounted() {
    if (this.$route.path !== "/home") {
      this.show = false;
    }
  },
};
</script>

<style lang="less" scoped>
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            // display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }
          // &:hover {
          //   .item-list {
          //     display: block;
          //   }
          // }
          .bg {
            background-color: skyblue;
          }
        }
      }
    }
    .categoryList-enter {
     height: 0;
    }
    .categoryList-enter-to {
      height: 461px;
    }
    .categoryList-enter-active {
      transition:  0.5s linear;
    }
  }
}
</style>>

