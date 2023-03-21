<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul
          class="cart-list"
          v-for="(cart) in cartInfoList"
          :key="cart.id"
        >
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="cart.isChecked"
              @change="changeChecked(cart.skuId, $event)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl" />
            <div class="item-msg">
              {{ cart.skuName }}
            </div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cart.cartPrice }}</span>
          </li>
          <li class="cart-list-con5">
            <a @click="changeNum(cart, 'minus')" class="mins">-</a>
            <!-- dom里鼠标事件要加$ -->
            <input
              autocomplete="off"
              type="text"
              :value="cart.skuNum"
              minnum="1"
              class="itxt"
              @change="changeNum(cart, 'modify', $event.target.value * 1)"
            />
            <a @click="changeNum(cart, 'plus')" class="plus">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cart.cartPrice * cart.skuNum }}</span>
          </li>
          <li class="cart-list-con7">
            <a @click="deleteGoods(cart.skuId)" class="sindelet">删除</a>
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input
          class="chooseAll"
          type="checkbox"
          :checked="isAllChecked && cartInfoList.length > 0"
          @click="changeAllChecked"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteAllChecked">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>{{sumPrice.i}}</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ sumPrice.sum }}</i>
        </div>
        <div class="sumbtn">
          <a class="sum-btn" @click="trade">结算</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// 引入节流函数
import throttle from "lodash/throttle.js";
export default {
  name: "ShopCart",
  mounted() {
    // 挂载后向服务器发请求获取购物车列表
    this.getData();
  },
  computed: {
    //映射购物车列表信息
    ...mapGetters(["cartList"]),
    //购物车数据
    cartInfoList() {
      return this.cartList.cartInfoList || [];
    },
    //计算总的价格
    sumPrice() {
      let sum = 0;
      //计算几个被勾选
      let i = 0
      this.cartInfoList.forEach((item) => {
        if (item.isChecked) {
          i++
          sum += item.cartPrice * item.skuNum;
        }
      });
      return {sum,i};
    },

    //计算是否每一个商品都被选中
    isAllChecked() {
      return this.cartInfoList.every((item) => item.isChecked == 1);
    },
  },
  methods: {
    // 获取购物车列表函数
    getData() {
      this.$store.dispatch("getCartList");
    },
    //修改商品数量
    changeNum: throttle(async function (elem, type, disNum) {
      switch (type) {
        case "minus":
          //如果点击得是减则让商品数量减1，如果商品数量小于1了就让数量为1
          // if (elem.skuNum <= 1) {
          //   elem.skuNum = 1;
          //   disNum = 0;
          // }else disNum = -1
          disNum = elem.skuNum <= 1 ? 0 : -1;
          break;
        case "modify":
          //如果点击得是input框
          //如果传入的最终是非法或者小于1的数，则让变化量为0
          if (isNaN(disNum) || disNum < 1) {
            disNum = 0;
          } else {
            //变化量为，传入量取整减去初始的数量
            disNum = parseInt(disNum) - elem.skuNum;
          }
          //  简化写法
          // disNum = (isNaN(disNum) || disNum < 1)?0:parseInt(disNum) - elem.skuNum
          break;
        case "plus":
          //如果点击得是减则让商品数量减1
          disNum = 1;
          break;
      }
      // 向服务器发请求更新购物车数据
      try {
        await this.$store.dispatch("addOrUpdateShopCar", {
          id: elem.skuId,
          skuNumber: disNum,
        });
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    }, 500),

    //删除商品
    async deleteGoods(skuId) {
      try {
        await this.$store.dispatch("deleteCartGoods", skuId);
        //删除成功，向服务器发请求更新购物车列表
        this.getData();
      } catch (error) {
        //失败，弹出警告
        alert(error.message);
      }
    },
    //修改商品状态的
    async changeChecked(skuId, event) {
      //如果鼠标点击的checkbox值为真则返回1否则返回0
      let isChecked = event.target.checked ? 1 : 0;
      // 派发请求修改check状态
      try {
        await this.$store.dispatch("changeCheckCart", { skuId, isChecked });
        //  修改成功后重新发请求获取更新后的购物车列表
        this.getData();
      } catch (error) {
        alert(error.messahe);
      }
    },
    //删除所有选择的商品
    async deleteAllChecked() {
      // 测试
      // let result = await this.$store.dispatch('deleteAllChecked')
      // console.log(result);
      try {
        await this.$store.dispatch("deleteAllChecked");
        //重新发请求，更新购物车数据
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    //修改所有商品的状态
    async changeAllChecked(event) {
      //如果全选为true则返回1，否则返回0
      let isAllChecked = event.target.checked ? 1 : 0;
      // 派发请求修改所有商品勾选状态
      try {
        await this.$store.dispatch("changeAllChecked", isAllChecked);
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    //跳转到请求订单信息页面
    async trade() {
      this.$router.push("/trade");
    },
  },
};
</script>
<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>