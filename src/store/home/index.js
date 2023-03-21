import {reqCategoryList,reqBanerList, reqFloorList} from '@/api'
const state={
    categoryList:[],
    bannerList:[],
    floorList:[]
}
const getters={}
const actions={
    async getCategoryList({commit}){
        let result = await reqCategoryList()
        if (result.code==200) {
        commit('CATEGORYLIST',result.data.slice(0,16))
        }  
    },
    async getBannerList({commit}){
        let result = await reqBanerList()
        // 如果服务器响应成功，则提交数据
        if(result.code==200){
        commit('BANNERLIST',result.data)
        }
    },
    async getFloorList({commit}){
        // 等待请求服务器响应结束
        let result = await reqFloorList()
        // 如果服务器响应成功，则提交数据
        if(result.code==200){
        commit('FLOORLIST',result.data)
        }
    },
}
const mutations={
    CATEGORYLIST(state,categoryList){
        state.categoryList = categoryList 
    },
    BANNERLIST(state,bannerList){
        state.bannerList =bannerList 
    },
    FLOORLIST(state,floorList){
        state.floorList = floorList
    }
}
export default {
   namespaced:true,
   state,
   getters,
   actions,
   mutations
}