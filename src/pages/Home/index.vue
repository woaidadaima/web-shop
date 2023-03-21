<template>
  <div>
    <TypeNav/>
    <ListContainer/>
    <TodayRecommend/>
    <Rank/>
    <Like/>
    <Floor v-for="(list) in floorList" :key="list.id" :list = "list"/>
    <Brand/>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import ListContainer from './ListContainer'
import TodayRecommend from './TodayRecommend'
import Rank from './Rank'
import Like from './Like'
import Floor from './Floor'
import Brand from './Brand'
export default {
    name:'home',
    components:{
      ListContainer,
      TodayRecommend,
      Rank,
      Like,
      Floor,
      Brand
      },
    mounted(){
      //floorList为复用组件，请求需要再父组件单中使用，否则无法遍历list数据生成两个floor组件
      this.$store.dispatch('home/getFloorList')
    },
    computed:{
      ...mapState("home",['floorList'])
    }
}
</script>

<style>

</style>