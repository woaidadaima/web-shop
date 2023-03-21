// 二次封装axios并暴漏
import axios from 'axios'
// 引入Nprogess
import NProgress from 'nprogress'
//引入NProgress样式
import "nprogress/nprogress.css"
// 在当前模块中引入store
import store from '@/store'
const requires = axios.create({
    baseURL: '/api',
    timeout: 5000
})

requires.interceptors.request.use(
    (config) => {
        
        // 如果用户是游客身份登录，则在请求前加入响应请求头
        if (store.state.detail.uuid_token) {
            //请求头添加一个字段(userTempId):和后台老师商量好了
            config.headers.userTempId = store.state.detail.uuid_token;
        }
        //如果用户不是游客身份登录，则在请求前加入响应请求头
        if (store.state.registerLogin.token){
            config.headers.token = store.state.registerLogin.token
        }
        NProgress.start();
        return config
    }
)
requires.interceptors.response.use((response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    NProgress.done();
    return response.data;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(new Error('参数设置错误'));
});
export default requires