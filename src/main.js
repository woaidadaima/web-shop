import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入全局组件 import后的组件标签名要和组件内name属性的名字一样，一般大写
import TypeNav from '@/components/TypeNav'
import Carousel from '@/components/Carousel'
import Pagination from '@/components/Pagination'
import { Button ,MessageBox} from 'element-ui';
//全局引入API
import * as API from '@/api'
// 全局组件需要组件name属性，第二个参数是标签，标签是组件的name
Vue.component(TypeNav.name, TypeNav)
// 组件标签第一个字母一般大写
Vue.component(Carousel.name,Carousel)
// 引入页面组件
Vue.component(Pagination.name,Pagination)
// 注册elem-button
Vue.component(Button.name, Button)
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
// 引入axios
// import reqCategoryList from './api/index'
// console.log(reqCategoryList());
// 引入store
import store from '@/store'
//引入mock文件
import '@/mock/mockServer'
// 引入swiper样式
import 'swiper/css/swiper.css'
Vue.config.productionTip = false
// 引入懒加载插件
import VueLazyload from 'vue-lazyload'
//引入表单验证插件
import '@/plugins/validate'
// 引入图片
import atm from '@/assets/images/1.gif'
Vue.use(VueLazyload,{
  //加载图片为ATM
  loading:atm
})
new Vue({
  el:'#app',
  render: h => h(App),
  router,
  store,
   // 配置全局总线
   beforeCreate(){
    Vue.prototype.$bus = this
    //将API配置到Vue的原型对象上
    Vue.prototype.$API = API
  },
  mounted(){
    // console.log(this);
  }
})