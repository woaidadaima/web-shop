import { reqCartList, reqDeleteCart,reqCheckCart, } from "@/api"
const state = {
    shopCartList: [],
    
}
const actions = {
    //获取购物车列表的Action
    async getCartList({ commit }) {
        let result = await reqCartList()
        if (result.code == 200) {
            commit('GETCARTLIST', result.data)
        } else {
            Promise.reject(new Error('失败了'))
        }
    },
    //删除购物车商品的Action
    async deleteCartGoods({ commit }, skuId) {
        let result = await reqDeleteCart(skuId)
        if (result.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('faile了'))
        }
    },
    //修改商品选中状态的Action
    async changeCheckCart({commit},{skuId,isChecked}){
        let result =await reqCheckCart(skuId,isChecked)
        if(result.code == 200){
            return 'ok'
        }else {
            return Promise.reject(new Error('参数错误'))
        }
    },
    //删除所有选中状态的Action
    deleteAllChecked({dispatch,getters}){
        // 定义一个数组用于存储遍历出来的Promise
        let promiseAll =[]
        getters.cartList.cartInfoList.forEach(elem => {
            //只有商品被选中才调用删除商品的函数
            let result =  elem.isChecked == 1? dispatch('deleteCartGoods',elem.skuId) :''
            //将得到的Promise加入数组
            promiseAll.push(result)
        });
        //调用Promise.all函数，只有当所有的promise结果都是成功才返回OK，否则返回错误信息
        return Promise.all(promiseAll)
    },
    //修改所有商品的选中状态的Action
    changeAllChecked({dispatch,state},isChecked){
        let promiseAll = []
        state.shopCartList[0].cartInfoList.forEach( (elem) => {
            let result =  dispatch('changeCheckCart',{skuId:elem.skuId,isChecked})
            promiseAll.push(result)
        });
        return Promise.all(promiseAll)
    },
   
}
const mutations = {
    // 获取购物车列表
    GETCARTLIST(state, data) {
        state.shopCartList = data
    },
    // 清除购物车列表
    CLEARSHOPCAR(state){
        state.shopCartList = []
    },
  
}
const getters = {
    cartList(state) {
        return state.shopCartList[0] || {};
    },
}
export default {
    state,
    actions,
    mutations,
    getters
}