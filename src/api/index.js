import { method } from 'lodash'
import requires from './ajax'
// 引入mockajax
import mockRequires from './mockAjax'
// 封装向服务器请求三级分类的API
export  const reqCategoryList = ()=>{
    return requires({url:'/product/getBaseCategoryList'})
}
// 封装向服务器请求轮播图的API
export const reqBanerList = ()=>{
    return mockRequires({url:'/banner'})
}
// 封装向服务器请求floor数据的API
export const reqFloorList = ()=> mockRequires.get('/floor')
//封装向服务器请求商品的API
export const reqGetGoodsList = (params)=>{
    return requires({url:'/list',method:'post',data:params})
}
//封装向服务器请求商品详情数据得API
export const reqGoodsInfo = (skuId) => {
    return requires({url:`/item/${ skuId }`,})
}
//封装添加购物车数据到服务器的API
export const reqAddToCar = (skuId,skuNum) => {
    return requires({url:`/cart/addToCart/${ skuId }/${ skuNum }`,method:'post'})
}
//封装向服务器请求购物车列表的接口
export const reqCartList = () => {
    return requires({url:'/cart/cartList',method:'get'})
}
//封装向服务器请求删除购物车商品的接口
export const reqDeleteCart = (skuId) => {
    return requires({url:`/cart/deleteCart/${skuId}`,method:'delete'})
}
//封装向服务器请求修改选中状态的接口
export const reqCheckCart  = (skuID,isChecked) => {
    return requires({url:`/cart/checkCart/${skuID}/${isChecked}`,method:'get'})
}
//封装向服务器请求发送手机验证码给用户的接口
export const reqPhoneCode = (phone) => {
    return requires({url:`/user/passport/sendCode/${phone}`,method:'get'})
}
//封装向服务器请求注册用户信息接口
export const reqRegisterUser = (data) => {
    return requires({url:`user/passport/register`,data,method:'POST'})
}
//封装向服务器获取登录信息的接口
export const reqLogin = (data) => {
    return requires({url:`/user/passport/login`,data,method:'post'})
}
//封装向服务器请求退出登录的接口
export const reqLogout = () => {
    return requires({url:`/user/passport/logout`,method:'get'})
}
//封装向服务器请求获取用户信息的接口
export const reqUserInfo = () => requires({url:`/user/passport/auth/getUserInfo`,method:'get'})
//封装向服务器请求获取订单交易页信息的接口
export const reqTradeInfo = () => requires({url:`/order/auth/trade`,method:'get'})
//封装向服务器请求获取用户地址信息的接口
export const reqUserAddress = () => requires({url:`/user/userAddress/auth/findUserAddressList`,method:'get'})
//封装向服务器请求提交订单信息的接口
export const reqSubmitOrder = (tradeNo,data) => requires({url:`/order/auth/submitOrder?tradeNo=${tradeNo}`,data,method:'post'})
//封装向服务器请求支付信息的接口
export const reqPayment = (orderId) => requires({url:`/payment/weixin/createNative/${orderId}`,method:'get'})
//封装向服务器请求查询订单支付状态的接口
export const reqPaymentStatus = (orderId) => requires({url:`/payment/weixin/queryPayStatus/${orderId}`,method:'get'})
//封装向服务器请求获取个人中心订单列表的数据接口
export const reqOrderList = (page,limit) => requires({url:`/order/auth/${page}/${limit}`,method:'get'})
// export const reqFloorList = ()=>{
//     return mockRequires({url:'/floor'})
// }
// export default reqCategoryList