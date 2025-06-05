<template>
  <el-select
    v-model="itemNo"
    filterable
    remote
    clearable
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading"
    :disabled="disabled"
  >
    <el-option v-for="item in itemList" :key="item.bomNo" :label="item.itemName" :value="item.bomNo"></el-option>
  </el-select>
</template>

<script>
import { bomSelected, itemSelected } from '@/api/item/itemStock'
import debounce from 'lodash/debounce'

export default {
  data() {
    return {
      itemList: [],
      loading: false
    }
  },
  props: {
    itemNo: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  created() {
    // 初始化赋值
     if (this.itemNo) {
      this.getData(this.itemNo)
    }
    // 防抖包装，只在created里赋值一次，保证方法引用稳定
    // this.remoteMethod = debounce(this._remoteMethod, 1000)
  },
  // beforeDestroy() {
  //   // 清除定时器，防止内存泄漏
  //   if (this.remoteMethod && this.remoteMethod.cancel) {
  //     this.remoteMethod.cancel()
  //   }
  // },
  watch: {

    // 父组件props变化时，重置本地状态和下拉
    itemNo(newVal) {
      // 如果外部置空，清空列表
      if (!newVal) this.itemList = []
    }
  },
  methods: {

    // 核心远程搜索方法，已防抖
    //  bug卡死问题：数据源 itemList 里存在重复 bomNo
    remoteMethod: debounce(async function(query) {
      if (!query) {
        this.itemList = []
        this.loading = false
        return
      }
      this.loading = true
      try {
        const res = await bomSelected({ params: { bomNo: query } })
        // 前端去重
        const arr = res.data || []
        const map = {}
        this.itemList = arr.filter(item => {
          if (item && item.bomNo && !map[item.bomNo]) {
            map[item.bomNo] = true
            return true
          }
          return false
        })
      } catch {
        this.itemList = []
      } finally {
        this.loading = false
      }
    }, 1000),



    // 物料号外部变更时，直接查物料
    getData(params) {
      if (params) {
        this.loading = true
        itemSelected({
          params: { itemNo: params }
        }).then(res => {
          this.itemList = res.data
        }).catch(() => {
          this.itemList = []
        }).finally(() => {
          this.loading = false
        })
      }
    },
    // 清空本地下拉数据和选中项
    resetData() {
      this.clearData()
    },
    clearData() {
      this.itemList = []
    }
  }
}
</script>
