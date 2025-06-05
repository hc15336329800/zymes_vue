<template>
  <el-form-item
    prop="deptId"
    :label="title"
    :rules="requiredItem ? [{ required: true, validator: validateItem }] : []"
  >
    <el-select
      v-model="name2"
      filterable
      @change="itemChange"
      placeholder="请选择物料编码"
      clearable
      remote
      reserve-keyword
      :remote-method="remoteMethod"
      :loading="loading"
      :disabled="disabled"
    >
      <el-option
        v-for="dict in itemList"
        :key="dict.itemNo"
        :label="dict.itemName"
        :value="dict.itemNo"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { itemSelected } from '@/api/item/itemStock'
import debounce from 'lodash/debounce'

export default {
  name: 'itemSelected',
  props: {
    itemNo: { type: String },
    itemName: { type: String },
    disabled: { type: Boolean, default: false },
    title: { type: String },
    bomNo: { type: String },
    requiredItem: { type: Boolean, default: false }
  },
  data() {
    // 校验函数保持不变
    const validateItem = (rule, value, callback) => {
      if (!this.name2) callback(new Error('请选择物料'))
      else callback()
    }
    return {
      name2: '',
      itemList: [],
      validateItem,
      loading: false
    }
  },
  methods: {
    resetData() {
      this.name2 = null
      this.itemList = []
    },


    // “只输入内容时才查找”的远程方法（被 debounce 包裹后赋给 remoteMethod）
    async _remoteMethod(query) {
      // 必须输入3位及以上才发请求
      if (query && query.trim().length >3) {
        this.loading = true
        try {
          const res = await itemSelected({ params: { itemNo: query } })
          // 去重处理（itemNo唯一）
          const arr = res.data || []
          const map = {}
          this.itemList = arr.filter(item => {
            if (!item || !item.itemNo) return false
            if (map[item.itemNo]) return false
            map[item.itemNo] = true
            return true
          })
        } catch (err) {
          this.itemList = []
        } finally {
          this.loading = false
        }
      } else {
        // 输入不足3位，直接清空下拉，不发请求
        this.itemList = []
        this.loading = false
      }
    },

    // 回显用：只查一次，且只查指定物料，不是全量
    async fetchForEcho(itemNo) {
      if (itemNo) {
        try {
          const res = await itemSelected({ params: { itemNo } })
          this.itemList = res.data || []
        } catch (err) {
          this.itemList = []
        }
      } else {
        this.itemList = []
      }
    },
    itemChange() {
      const item = this.itemList.find(item => item.itemNo == this.name2)
      this.$emit('update:itemNo', this.name2)
      if (item) {
        this.$emit('update:itemName', item.itemName)
        this.$emit('update:bomNo', item.bomNo)
      } else {
        this.$emit('update:itemName', '')
        this.$emit('update:bomNo', '')
      }
    }
  },
  created() {
    this.name2 = this.itemNo
    // 只做回显，不做下拉
    if (this.itemNo) {
      this.fetchForEcho(this.itemNo)
    }
    // 用 debounce 包裹远程搜索方法，只赋值一次
    this.remoteMethod = debounce(this._remoteMethod, 800)
  },
  beforeDestroy() {
    if (this.remoteMethod && this.remoteMethod.cancel) {
      this.remoteMethod.cancel()
    }
  },
  watch: {
    // 外部 itemNo 变动时，同步 v-model 并做回显处理
    itemNo(newVal) {
      this.name2 = newVal
      if (newVal) {
        this.fetchForEcho(newVal)
      } else {
        this.itemList = []
      }
    }
  }
}
</script>
