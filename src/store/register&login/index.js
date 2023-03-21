import {reqPhoneCode,reqRegisterUser,reqLogin,reqLogout,reqUserInfo} from '@/api'
//引入Token的函数
import {setToken,getToken,removeToken} from '@/utils/token'
const state ={
    code:'',
    token:getToken(),
    userInfo:{}
}
const actions = {
    //获取手机验证码的Action
   async getCode({commit},phone){
        let result = await reqPhoneCode(phone)
        // console.log(result);
       if (result.code == 200) {
            commit('GETCODE',result.data)
            return 'ok'
       }else{
           return Promise.reject(new Error('faile'))
       }
    },
    //注册用户的ACtion
    async registerUser({commit},data){
        let result = await reqRegisterUser(data)
        if(result.code == 200){
            return 'ok'
        }else {
            return Promise.reject(new Error('账号已存在'))
        }
    },
    //登录的Action
    async login({commit},data){
        let result = await reqLogin(data)
        //如果成功交返回的数据提交给仓库
        if(result.code == 200){
            commit('GETTOKEN',result.data.token)
            return 'ok'
        }else {
            return Promise.reject(new Error('faile'))
        }
    },
    //获取用户信息的Action
    async getUserInfo({commit}){
        let result = await reqUserInfo()
        if(result.code == 200){
            commit('GETUSERINFO',result.data)
            return 'ok'
        }else{
            return Promise.reject(new Error('faile'))
        }
    },
    // 退出登录的ACtion
    async logout({commit}){
        let result = await reqLogout()
        //如果登录成功，则清楚userInfo里的数据
        if(result.code == 200){
            commit('CLEAR')
            return 'ok'
        }else {
            return Promise.reject(new Error('faile'))
        }
    }   
}
const mutations = {
    GETCODE(state,data){
        state.code = data 
    },
    GETTOKEN(state,data){
        setToken(data)
        state.token = data
    },
    //获取用户信息
    GETUSERINFO(state,data){
        state.userInfo = data 
    },
    CLEAR(state){
        // 将用户信息清空
        state.token = ''
        state.userInfo = {}
        //清楚本地存储
        removeToken()
    }
}
const getters ={
    userName:(state) => state.userInfo.name
}

export default{
    state,
    actions,
    mutations,
    getters
}