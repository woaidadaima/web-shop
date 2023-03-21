// 二次封装ajax,用于发送mock请求
import axios from 'axios'
// 引入Nprogess
import NProgress from 'nprogress'
//引入NProgress样式
import "nprogress/nprogress.css"
const mockRequires = axios.create({
    baseURL: '/mock',
    timeout: 5000
})

mockRequires.interceptors.request.use(
    (config) => {
        NProgress.start();
        return config
    }
)
mockRequires.interceptors.response.use( (response) =>{
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    NProgress.done();
    return response.data;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(new Error('faile'));
});
export default mockRequires