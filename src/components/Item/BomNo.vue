
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
    <el-option v-for="item in itemList" :key="item.itemNo" :label="item.bomNo" :value="item.itemNo"></el-option>
  </el-select>
</template>
<script>
import { bomSelected, itemSelected } from '@/api/item/itemStock'

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
    this.itemNo1 = this.itemNo
    this.getData(this.itemNo)
  },
  beforeDestroy() {},
  watch: {
    itemNo1(newVal, oldVal) {
      this.$emit('update:itemNo', newVal)
    },
    itemNo(newVal, oldVal) {
      if (!newVal) {
        this.resetData()
      }
    }
  },
  methods: {
    resetData() {
      this.itemNo1 = null
      this.clearData()
    },
    getData(params) {
      if (params) {
        itemSelected({
          params: {
            itemNo: params
          }
        }).then(res => {
          this.itemList = res.data
        })
      }
    },

    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(async () => {
          var res = await bomSelected({
            params: {
              bomNo: query
            }
          })
          this.itemList = res.data
        }, 200)
      } else {
        this.itemList = []
      }
      this.loading = false
    },
    clearData() {
      //清理数据
      console.log('======', '清理数据')
      this.itemList = []
    }
  }
}
</script>

