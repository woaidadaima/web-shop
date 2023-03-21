import Vue from 'vue'
import Vuex from 'vuex'
import home from './home'
import search from './search'
import detail from './detail'
import shopCart from './shopCart'
import registerLogin from './register&login'
import trade from './trade'
Vue.use(Vuex)
export default new Vuex.Store({
    modules:{
        home,
        search,
        detail,
        shopCart,
        registerLogin,
        trade
    }
})