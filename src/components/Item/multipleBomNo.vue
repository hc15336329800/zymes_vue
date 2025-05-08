<template>
  <el-select
    v-model="itemNos1"
    filterable
    remote
    clearable
    multiple
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading"
  >
    <el-option v-for="item in itemList" :key="item.itemNo" :label="item.bomNo" :value="item.itemNo"></el-option>
  </el-select>
</template>
<script>
  import {bomSelected} from '@/api/item/itemStock'

  export default {
    data() {
      return {
        itemNos1: [],
        itemList: [],
        loading: false
      }
    },
    props: {
      itemNos: {
        type: Array
      }
    },
    created() {
      this.itemNos1 = this.itemNos
    },
    beforeDestroy() {
    },
    watch: {
      itemNos1(newVal, oldVal) {
        this.$emit('update:itemNos', newVal)
      },
      itemNos(newVal, oldVal) {
        if (!newVal) {
          this.itemNos1 = null
          this.clearData()
        }
      }
    },
    methods: {
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
        this.itemList = []
      }
    }
  }
</script>

