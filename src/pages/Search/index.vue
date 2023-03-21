<template>
  <div>
    <!-- 三级联动列表 -->
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread面包屑-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 展示分类面包屑 -->
            <li class="with-x" v-show="searchParams.categoryName">
              {{ searchParams.categoryName }}<i @click="removeCategory">×</i>
            </li>
            <!-- 展示关键信息面包屑 -->
            <li class="with-x" v-show="searchParams.keyword">
              {{ searchParams.keyword }}<i @click="removeKeyword">×</i>
            </li>
            <!-- 展示品牌信息面包屑 -->
            <li class="with-x" v-show="searchParams.trademark">
              {{ searchParams.trademark.split(':')[1] }}<i @click="removeTrademark">×</i>
            </li>
             <!-- 展示平台售卖属性面包屑，参数props是一个数组所以只能用v-for来进行展示 -->
            <li class="with-x" v-for="(attr,index) in searchParams.props" :key="index">
              {{ attr.split(':')[1] }}<i @click="removeAttr(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector @trademarkInfo="trademarkInfo" @attrInfo="attrInfo"/>

        <!--details-->
        <div class="details clearfix">
          <!-- 详情页最上面导航 -->
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li :class="{active:isOne}" @click="changeOrder('1')">
                  <a>综合 <span v-show="isOne" class="iconfont" :class="isDesc? 'icon-arrowdown':'icon-arrowup'" > </span></a>
                </li>
                <li :class="{active:isTwo}" @click="changeOrder('2')">
                  <a>价格 <span v-show="isTwo" class="iconfont" :class="isDesc? 'icon-arrowdown':'icon-arrowup'"></span></a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 商品列表 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="goods of goodsList" :key="goods.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- to前要加冒号进行数据参数绑定，router里先对params参数占位 -->
                    <router-link :to="{name:'detail',params:{id:`${goods.id}`}}" 
                      ><img v-lazy="goods.defaultImg"
                    /></router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i @click="test">{{ goods.price }}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                      target="_blank"
                      href="item.html"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                      >{{ goods.title }}</a
                    >
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 底部页签 -->
          <!-- <div class="fr page">
            <div class="sui-pagination clearfix">
              <ul>
                <li class="prev disabled">
                  <a href="#">«上一页</a>
                </li>
                <li class="active">
                  <a href="#">1</a>
                </li>
                <li>
                  <a href="#">2</a>
                </li>
                <li>
                  <a href="#">3</a>
                </li>
                <li>
                  <a href="#">4</a>
                </li>
                <li>
                  <a href="#">5</a>
                </li>
                <li class="dotted"><span>...</span></li>
                <li class="next">
                  <a href="#">下一页»</a>
                </li>
              </ul>
              <div><span>共10页&nbsp;</span></div>
            </div>
          </div> -->
          <!-- 测试使用 -->
          <!-- <Pagination :total="91" :pageNo="2" :continues="5" :pageSize="3"/> -->
          <Pagination :total="total" :pageNo="searchParams.pageNo" :continues="5" :pageSize="searchParams.pageSize" @getPageNo="getPageNo"/>        
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SearchSelector from "./SearchSelector/SearchSelector";
import {reqGoodsInfo} from '@/api/index'
export default {
  name: "Search",
  data() {
    return {
      searchParams: {
        category2Id: "",
        category1Id: "",
        category3Id: "",
        categoryName: "",
        keyword: "",
        order: "1:desc",
        pageNo: 1,
        pageSize: 3,
        props: [],
        trademark: "",
      },
    };
  },
  components: {
    SearchSelector,
  },
  computed: {
    ...mapGetters("search", ["goodsList"]),
    // 判断order是综合还是价格
    isOne(){
      return this.searchParams.order.indexOf('1')!=-1
    },
    isTwo(){
      return this.searchParams.order.indexOf('2')!=-1
    },
    // 判断是否是降序
    isDesc(){
      return this.searchParams.order.indexOf('desc')!=-1
    },
    //获取一共多少条数据
    ...mapGetters('search',['total'])
  },
  beforeMount() {
    // 挂载前修改seachParams参数传递给服务器
    Object.assign(this.searchParams, this.$route.query, this.$route.params);
  },
  mounted() {
    // 组件挂载后派发请求
    this.getList();
  },
  watch: {
    // 监视路由信息变化，当路由发生跳转前，更新路由参数，再向服务器发请求
    $route() {
      //清空categoryID,值为undefined，参数将不会传递给服务器，可以优化配置减小服务器压力
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
      this.searchParams.pageNo = 1
      // 将路由参数赋值给给searchParams
      Object.assign(this.searchParams, this.$route.query, this.$route.params);
      // 向服务器发请求
      this.getList();
    },
  },
  methods: {
    //测试接口数据
    test(){
      console.log(1);
      reqGoodsInfo(13)
    },
    //获取数据列表函数
    getList() {
      this.$store.dispatch("search/getGoodsList", this.searchParams);
    },
    // 移除面包屑分类名
    removeCategory() {
      // 隐藏面包屑的分类名
      this.searchParams.categoryName = undefined;
      // 重新向服务器发请求
      // this.getList();
      // 进行路由跳转（将params和query参数初始化）
      // 如果有params参数则保留
       this.$router.push({
          name:'search',
          params: this.$route.params
        })
    },
    //移除面包屑关键字相关信息
    removeKeyword(){
      this.searchParams.keyword = undefined
      // 再次向服务器请求数据，刷新数据
      // this.getList();
      //通知header组件清楚关键字
      this.$bus.$emit("clear");
      //路由跳转，清楚url上得keyword
       this.$router.push({
          name:'search',
          // 如果有query参数则带上query参数
          query:this.$route.query
        })
    },
    //自定义事件，获取品牌信息
    trademarkInfo(data){
      //配置searchParams参数
      this.searchParams.trademark = `${data.tmId}:${data.tmName}`
      this.searchParams.pageNo = 1
      //向服务器发送请求
      this.getList()
    },
    // 移除品牌面包屑
    removeTrademark(){
      //将trademark参数置空
      this.searchParams.trademark = ''
      this.searchParams.pageNo = 1
      // 重新发送请求
      this.getList();
    },
    // 展示有关平台售卖属性的商品
    attrInfo(attr,valueList){
      // 整理props参数
      let props = `${attr.attrId}:${valueList}:${attr.attrName}`
      //判断是否已有props参数，如果已有就不添加
      if(this.searchParams.props.indexOf(props)==-1) this.searchParams.props.push(props)
      // 再次向服务器发请求
      this.getList();
    },
    //移除平台售卖面包屑属性
    removeAttr(index){
      // 重新配置props参数
      this.searchParams.props.splice(index,1)
      // 再次发送请求
      this.getList();
    },
    //修改排序相关属性，flag标志着点击的是综合还是价格
    changeOrder(flag){
      // 初始默认为综合降序
      let originOrder =this.searchParams.order
      // 判断点击的是综合还是价格
      if(flag == originOrder.split(':')[0]){
        // 修改排序,判断原始的排序是否是降序，如果是修改为升序
        this.searchParams.order = `${flag}:${originOrder.split(':')[1]=='desc'?'asc':'desc'}`
        //向服务器发请求
        this.getList()
      }else{
        // 修改参数默认排序为降序
        this.searchParams.order = `${flag}:desc`
         //向服务器发请求
        this.getList()
      }
    },
    //绑定自定义事件，获取当前是第几页
    getPageNo(pageNo){
      // 整理参数重新发送请求
      this.searchParams.pageNo = pageNo
      this.getList()
    }
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      // .page {
      //   width: 733px;
      //   height: 66px;
      //   overflow: hidden;
      //   float: right;

      //   .sui-pagination {
      //     margin: 18px 0;

      //     ul {
      //       margin-left: 0;
      //       margin-bottom: 0;
      //       vertical-align: middle;
      //       width: 490px;
      //       float: left;

      //       li {
      //         line-height: 18px;
      //         display: inline-block;

      //         a {
      //           position: relative;
      //           float: left;
      //           line-height: 18px;
      //           text-decoration: none;
      //           background-color: #fff;
      //           border: 1px solid #e0e9ee;
      //           margin-left: -1px;
      //           font-size: 14px;
      //           padding: 9px 18px;
      //           color: #333;
      //         }

      //         &.active {
      //           a {
      //             background-color: #fff;
      //             color: #e1251b;
      //             border-color: #fff;
      //             cursor: default;
      //           }
      //         }

      //         &.prev {
      //           a {
      //             background-color: #fafafa;
      //           }
      //         }

      //         &.disabled {
      //           a {
      //             color: #999;
      //             cursor: default;
      //           }
      //         }

      //         &.dotted {
      //           span {
      //             margin-left: -1px;
      //             position: relative;
      //             float: left;
      //             line-height: 18px;
      //             text-decoration: none;
      //             background-color: #fff;
      //             font-size: 14px;
      //             border: 0;
      //             padding: 9px 18px;
      //             color: #333;
      //           }
      //         }

      //         &.next {
      //           a {
      //             background-color: #fafafa;
      //           }
      //         }
      //       }
      //     }

      //     div {
      //       color: #333;
      //       font-size: 14px;
      //       float: right;
      //       width: 241px;
      //     }
      //   }
      // }
    }
  }
}
</style>