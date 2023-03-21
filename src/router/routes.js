// 引入路由组件
import Home from '@/pages/Home'
import Register from '@/pages/Register'
import Search from '@/pages/Search'
import Login from '@/pages/Login'
import Detail from '@/pages/Detail'
import AddCartSuccess from '@/pages/AddCartSuccess'
import ShopCart from '@/pages/ShopCart'
import Trade from '@/pages/Trade'
import Pay from '@/pages/Pay'
import PaySuccess from '@/pages/PaySuccess'
// import Center from '@/pages/Center'
// const Center = () => import('@/pages/Center')
// import MyOrder from '@/pages/Center/MyOrder'
import GroupOrder from '@/pages/Center/GroupOrder'
import shopCart from '@/store/shopCart'
export default [
    {
        
        name:'center',
        path:'/center',
        component:() => import('@/pages/Center'),
        children:[
            {
                path:'myOrder',
                component:() => import('@/pages/Center/MyOrder')
            },
            {
                path:'groupOrder',
                component:GroupOrder
            }
        ],
        meta:{ show: true},
        redirect:'center/myOrder'
    },
    {
        name:'paySuccess',
        path:'/paySuccess',
        component:PaySuccess,
        meta:{ show: true}
    },
    {
        name:'pay',
        path:'/pay',
        component:Pay,
        beforeEnter: (to, from, next) => {
            if(from.path === '/trade'){
                next()
            }else{
                next(false)
            }
        },
        meta:{ show: true}
    },
    {
        name:'trade',
        path:'/trade',
        component:Trade,
        //路由独享守卫，进入trade前进行判断
        beforeEnter: (to, from, next) => {
            //只有从购物车路由跳转到trade才放行，否则待在原来页面
            if(from.path === '/shopCart'){
                next()
            }else{
                next(false)
            }
        },
        meta:{ show: true}
    },
    {
        name:'shopCart',
        path:'/shopCart',
        component:ShopCart,
        meta:{ show: true}
    },
    {
        name:'addCartSuccess',
        path:'/addCartSuccess',
        component:AddCartSuccess,
        meta:{ show: true}
    },
    {
        name:'detail',
        path:'/detail/:id?',
        component:Detail,
        meta:{ show: true}
    },
    {
        path: '/login',
        component: Login,
    },
    {
        name:'home',
        path: '/home',
        component: Home,
        //控制显示隐藏底部foot组件，默认undefined为false
        meta: { show: true }
    },
    {
        path: '/register',
        component: Register
    },
    {
        name: 'search',
        path: '/search/:keyword?',
        meta: { show: true },
        component: Search,
        // props布尔值为真只能传递params参数给对应的组件路由
        // props:true
        // props数组写法可以传递params和query参数，返回值是一个对象
        // props: ($route) => {
        //     return {
        //         keyWord: $route.params,
        //         k: $route.query
        //     }
        // }
    },
    {
        path: '*',
        redirect: '/home'
    }
]