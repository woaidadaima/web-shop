// 引入请求详情页API
import { reqGoodsInfo, reqAddToCar } from '@/api/index'
// 引入获取uuid的函数
import { getUUID } from '@/utils/uuid_token';
const state = {
    goodsInfo: {},
    uuid_token: getUUID()
}
const actions = {
    // 调用获取商品详情函数
    async getGoodsInfo({ commit }, skuId) {
        let result = await reqGoodsInfo(skuId)
        if (result.code == 200) {
            commit('GETGOODSINFO', result.data)
        }
    },
    async addOrUpdateShopCar({ commit }, { id, skuNumber }) {
        //传统promise写法
        // return reqAddToCar(id, skuNumber).then((res)=>{
        //     return res
        // },(rej) => {
        //     return Promise.reject(new Error(rej))
        // }); 
        // 语法糖asnyc await
        let result = await reqAddToCar(id,skuNumber)
        if (result.code == 200) {
            return 'ok'
        } else {
            // 失败抛出错误
            return Promise.reject(new Error('参数错误'))
        }
    }
}
const mutations = {
    GETGOODSINFO(state, info) {
        return state.goodsInfo = info
    }
}
const getters = {
    // 简化属性,初始时goodsInfo为一个空对象，
    // 若数据还未及时给到goodsInfo,那么空对象的skuInfo则为undefine,
    // 控制台会报Undefined错误
    categoryView: (state) => state.goodsInfo.categoryView || {},
    price: (state) => state.goodsInfo.price,
    skuInfo: (state) => state.goodsInfo.skuInfo || {},
    spuSaleAttrList: (state) => state.goodsInfo.spuSaleAttrList || {},
}

export default {
    state,
    actions,
    mutations,
    getters
}