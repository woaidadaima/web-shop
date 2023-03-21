<template>
  <div class="pagination">
    <button :disabled="pageNo == 1" @click="$emit('getPageNo',pageNo-1)">上一页</button>
    <button v-if="startNumAndEndNum.start>1" @click="$emit('getPageNo',1)">1</button>
    <button v-if="startNumAndEndNum.start>2">···</button>

    <button v-for="(num,index) in startNumAndEndNum.end" :key="index" v-if="num >= startNumAndEndNum.start && num <= totalPages" :class="{active:pageNo==num}"  @click="$emit('getPageNo',num)">{{num}}</button>

    <button v-if="startNumAndEndNum.end < totalPages - 1">···</button>
    <button v-if="startNumAndEndNum.end < totalPages"  @click="$emit('getPageNo',totalPages)">{{totalPages}}</button>
    <button :disabled="pageNo == totalPages || totalPages == 0"  @click="$emit('getPageNo',pageNo+1)">下一页</button>

    <button style="margin-left: 30px">共 {{ totalPages }} 页 </button>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: ["total", "pageNo", "continues", "pageSize"],
  computed: {
    // 根据总共的数据和每页展示的数量计算共多少页
    totalPages() {
      return Math.ceil(this.total / this.pageSize);
    },
    //根据当前页码展示连续的五条数据的开始位置和结束位置
    startNumAndEndNum(){
        //props接受到得参数在组件实例对象VC身上
        const {pageNo,continues,totalPages} = this
        // 计算连续页码的起始页码和终止页码
        let end = pageNo + parseInt(continues/2)
        let start = pageNo - parseInt(continues/2)
        //如果终止页码大于总页数则让终止页为总页数
        if(end > totalPages){
            end = totalPages
            start = totalPages - continues +1
        }
         //如果起始页码小于1则让起始页为1,终止页码为连续页码数
        if(start<1){
            start = 1
            end = continues
        }
        return {start,end}
    },
  },
  methods:{
       //获取数据列表函数
    getList() {
      $store.dispatch("search/getGoodsList", searchParams);
    },
  }
};
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>