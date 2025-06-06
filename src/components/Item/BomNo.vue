<template>
  <el-select
    v-model="localValue"
    filterable
    remote
    clearable
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading"
    :disabled="disabled"
    @change="handleChange"
  >
    <el-option v-for="item in itemList" :key="item.bomNo" :label="item.itemName" :value="item.bomNo"></el-option>
  </el-select>
</template>

<script>
import { bomSelected, itemSelected } from '@/api/item/itemStock'
import debounce from 'lodash/debounce'

export default {
  props: {
    itemNo: String,
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      itemList: [],
      loading: false,
      localValue: this.itemNo // 本地缓存，用于和父组件双向同步
    }
  },
  watch: {
    itemNo(newVal) {
      this.localValue = newVal
      // 自动回显（初始化或者父组件切换）
      if (newVal) this.getData(newVal)
      else this.itemList = []
    }
  },
  methods: {
    remoteMethod: debounce(async function(query) {
      // 3位起搜（可调节）
      if (!query || query.length < 3) {
        this.itemList = []
        this.loading = false
        return
      }
      this.loading = true
      try {
        const res = await bomSelected({ params: { bomNo: query } })
        const arr = res.data || []
        const seen = new Set()
        this.itemList = arr.filter(item => {
          if (!item || !item.bomNo) return false
          if (seen.has(item.bomNo)) return false
          seen.add(item.bomNo)
          return true
        })
      } catch {
        this.itemList = []
      } finally {
        this.loading = false
      }
    }, 800),
    // 本地 change 事件同步父组件
    handleChange(val) {
      this.$emit('update:itemNo', val)
    },
    getData(bomNo) {
      if (!bomNo) return
      this.loading = true
      itemSelected({ params: { itemNo: bomNo } }).then(res => {
        // 只回显选中项，不追加多余选项
        this.itemList = res.data ? [res.data[0]] : []
      }).catch(() => {
        this.itemList = []
      }).finally(() => {
        this.loading = false
      })
    }
  },
  created() {
    if (this.itemNo) {
      this.getData(this.itemNo)
    }
  }
}
</script>
