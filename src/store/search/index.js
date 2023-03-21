import {reqGetGoodsList} from '@/api/index'
const state={
    searchList:{}
}
const getters={
     //goodsList初始为空对象，如果请求数据未返回则返回undefine报错
     // 当数据没回来时让goodsList接收一个空数组
    goodsList:state => state.searchList.goodsList ||[],
    trademarkList:state => state.searchList.trademarkList ||[],
    attrsList:state => state.searchList.attrsList || [],
    total:state => state.searchList.total 
}
const actions={
    //params参数有就用已有的，没有的话要传默认传一个空对象，不传则会失败
   async getGoodsList({commit},params={}){
        let result = await reqGetGoodsList(params)
        // console.log(result);
        if (result.code==200) {
            commit('GETGOODSLIST',result.data)
        }
    }
}
const mutations={
    GETGOODSLIST(state,goodsList){
       
       state.searchList = goodsList 
    }
}
export default {
   namespaced:true,
   state,
   getters,
   actions,
   mutations
}