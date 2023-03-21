import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入仓库
import store from '@/store'
Vue.use(VueRouter)
// 引入路由
import routes from './routes'
// console.log(VueRouter);
let orginPush = VueRouter.prototype.push
// console.log(orginPush);
let orginReplace = VueRouter.prototype.replace
VueRouter.prototype.push = function (location, resolve, reject) {
    if (resolve && reject) {
        orginPush.call(this, location, resolve, reject)
    } else {
        orginPush.call(this, location, () => { }, () => { })
    }
}
VueRouter.prototype.replace = function (location, resolve, reject) {
    if (resolve && reject) {
        orginReplace.call(this, location, resolve, reject)
    } else {
        orginReplace.call(this, location, () => { }, () => { })
    }
}
let router = new VueRouter({
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { y: 0, }
    },
})
//配置全局前置路由守卫
router.beforeEach(async (to, from, next) => {
    //获取Token
    let token = store.state.registerLogin.token
    let name = store.state.registerLogin.userInfo.name
    //用户已经登陆
    if (token) {
        //且跳转的路由不是注册和登录页，则放行，然后放请求重新获取用户信息进行展示
        if (to.path !== '/login' && to.path !== '/register') {
            //跳转前判断是否有用户信息如果有则放行，如果没有发请求在放行
            if (name) {
                next()
            } else {
                try {
                    //获取用户信息后放行
                    await store.dispatch('getUserInfo')
                    next()
                } catch (error) {
                    //token失效，获取用户信息失败，清除TOKEN,跳转到登录页
                    await store.dispatch('logout')
                    next('/login')
                }
            }
        } else {
            //如果跳转的是注册登录页则返回首页
            next({ name: 'home' })
        }
    } else {
        // 用户未登录从购物车跳到交易页面则返回登录页 
        if (from.path == '/shopCart' && to.path == '/trade') {
            next('/login')
        } else {
            let topath = to.path
            // 未登录想去交易页，pay相关页，个人中心页，停留在原来页面
            if (to.path.indexOf('trade') != -1 || to.path.indexOf('pay') != -1 || to.path.indexOf('center') != -1) {
                //如果去的是个人中心页则通过query存储在路由地址中
                next(`/login?redirect=${topath}`)
            } else {
                //其他情况放行
                next()
            }
        }
        // next()
    }
})
export default router