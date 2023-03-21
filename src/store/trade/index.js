import {reqUserAddress,reqTradeInfo, reqSubmitOrder} from '@/api/index.js'
const state = {
    userAddress:[],
    tradeInfo:{},
    orderId:''
}
const actions = {
     //获取订单也信息的Action
     async getTradeInfo({commit}){
        let result =  await reqTradeInfo()
        console.log(result);
        if(result.code == 200){
            commit('GETTRADEINFO',result.data)
            return 'ok'
        }else{
            return Promise.reject(new Error('faile'))
        }
    },
    //获取用户地址
    async getUserAddress({commit}){
        let result = await reqUserAddress()
        if(result.code == 200){
            commit('GETUSERADDRESS',result.data)
            return 'ok '
        }else{
            return Promise.reject(new Error('faile'))
        }
    },
    //提交用户订单
    async submitOrder({commit},{tradeNo,defaultUser}){
        let result = await reqSubmitOrder(tradeNo,defaultUser)
        // console.log(result);
        if(result.code == 200){
            commit('GETORDERID',result.data)
            return 'ok'
        }else{
            return Promise.reject(new Error ('faile'))
        }
    }
}
const mutations = {
    // 获取用户地址
    GETUSERADDRESS(state,data){
        state.userAddress = data
    },
      //获取订单信息
      GETTRADEINFO(state,data){
        state.tradeInfo = data
    },
    //获取订单号
    GETORDERID(state,data){
        state.orderId = data
    }
}
const getters = {}
export default {
    namespaced:true,
    state,
    actions,
    mutations,
    getters
}