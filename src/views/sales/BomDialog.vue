<template>
  <el-dialog
    title="请选择产品"
    :visible.sync="visible"
    width="800px"
    top="10vh"
    @close="$emit('cancel')"
  >
    <!-- 搜索输入框 -->
    <el-input
      placeholder="请输入BOM号"
      v-model="queryParams.params.itemNo"
      class="mb_10"
      clearable
      @keyup.enter.native="getData"
    />

    <!-- 图纸表格 -->
    <el-table
      :data="bomList"
      style="width: 100%"
      height="400"
      @row-dblclick="selectBom"
    >
      <el-table-column prop="itemNo" label="BOM号" min-width="120" />
      <el-table-column prop="itemName" label="产品名称" min-width="120" />
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.page.page_num"
      :limit.sync="queryParams.page.page_size"
      @pagination="getData"
    />

    <!-- 弹窗底部 -->
    <span slot="footer">
      <el-button @click="$emit('cancel')">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { pageList } from '@/api/mesItemStock' // 替换为你项目的 API 模块
import Pagination from '@/components/Pagination/index.vue' // 确保路径正确


export default {
  components: {
    Pagination
  },

  props: {
    visible: Boolean
  },
  data() {
    return {
      bomList: [],
      total: 0,
      queryParams: {
        params: {
          itemType: '01',    //  01为成品
          itemNo: ''         // 搜索关键字
        },
        page: {
          page_num: 1,
          page_size: 10
        }
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.resetQuery()
        this.getData()
      }
    }
  },
  methods: {
    // 双击行时选中图纸并回传
// 双击选择图纸时
    selectBom(row) {
       this.$emit('selected', row.itemNo, row.itemName) // ✅ 同时传两个值
      this.$emit('cancel') // ✅ 正确关闭弹窗
    },

    // 查询图纸列表
    getData() {
      pageList(this.queryParams).then(res => {
        this.bomList = res.data || []
        this.total = res.page?.total_num || 0
      })
    },
    resetQuery() {
      this.queryParams = {
        params: {
          itemType: '01',
          itemNo: ''
        },
        page: {
          page_num: 1,
          page_size: 10
        }
      }
    }
  }
}
</script>

<style scoped>
.mb_10 {
  margin-bottom: 10px;
}
</style>
