<template>
  <div class="pagination">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="pageSizes"
      layout="sizes,prev, pager, next, jumper,total"
      :current-page.sync="currentPage"
      :page-size="limit"
      :total="total"
      >
    </el-pagination>
  </div>
</template>
 
<script>
  export default {
    name: "pagination",
    data() {
      return {
        currentPage: 1,
        limit:5,
        // page_sizes:[5,10],
      }
    },
    props: {
      total: {
        required: false,
        default: 0
      },
      small: {
        required: false,
        type: Boolean,
        default: false
      },
      pageSizes:{
        type:Array,
        required:false,
        default: [5,10,15,20]
      }
    },
    watch: {
      currentPage(val) {
        // 改变这个值并不会触发 handleCurrentChange
        if (typeof val === "number") {
          // console.log('prop currentPage!!!');
          this.currentPage = val;
        }
      },
    },
    methods: {
      // 当前页变化
      handleCurrentChange(val) {
        this.$emit("handleCurrentChange", val);
      },
      // size变化
      handleSizeChange(val) {
        this.limit = val;
        this.currentPage = 1;
        this.$emit('handleSizeChange', val);
      },
    }
  }
</script>

<style scoped>
  .pagination {
    margin: 20px 0;
    text-align: center;
  }
</style>