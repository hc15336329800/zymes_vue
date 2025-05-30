<template>
  <el-select
    v-model="itemNo1"
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
      itemNo1: '',
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
    this.itemNo1 = this.itemNo
    if (this.itemNo) {
      this.getData(this.itemNo)
    }
    // 防抖包装，只在created里赋值一次，保证方法引用稳定
    this.remoteMethod = debounce(this._remoteMethod, 1000)
  },
  beforeDestroy() {
    // 清除定时器，防止内存泄漏
    if (this.remoteMethod && this.remoteMethod.cancel) {
      this.remoteMethod.cancel()
    }
  },
  watch: {
    // 双向同步
    itemNo1(newVal) {
      this.$emit('update:itemNo', newVal)
    },
    // 父组件props变化时，重置本地状态和下拉
    itemNo(newVal) {
      if (!newVal) {
        this.resetData()
      }
    }
  },
  methods: {
    // 远程搜索逻辑，供防抖包装
    async _remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        try {
          const res = await bomSelected({
            params: { bomNo: query }
          })
          this.itemList = res.data
        } catch (err) {
          // 捕获错误，避免loading假死
          this.itemList = []
        } finally {
          this.loading = false
        }
      } else {
        this.itemList = []
        this.loading = false
      }
    },
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
      this.itemNo1 = null
      this.clearData()
    },
    clearData() {
      this.itemList = []
    }
  }
}
</script>
