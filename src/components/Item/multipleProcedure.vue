<template>
  <el-select
    v-model="procedureNames"
    filterable
    remote
    clearable
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading"
    multiple
  >
    <el-option
      v-for="item in procedureList"
      :key="item.procedureCode"
      :label="item.procedureName"
      :value="item.procedureName"
    ></el-option>
  </el-select>
</template>
<script>
  import {listNameByShortCode} from '@/api/item/mesProcedure'

  export default {
    data() {

      return {
        procedureNames: [],
        procedureList: [],
        loading: false,

      }
    },
    props: {

      bindName: {
        type: Array,
        default: [],
      }
    },
    created() {
      this.procedureNames = this.bindName
      // this.remoteMethod();
    },
    beforeDestroy() {
    },
    watch: {
      procedureNames(newVal, oldVal) {
        this.$emit('update:bindName', newVal)
      }
    },
    methods: {
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true
          setTimeout(async () => {
            var res = await listNameByShortCode({
              params: {
                shortCode: query
              }
            })
            this.procedureList = res.data
          }, 200)
        } else {
          this.procedureList = []
        }
        this.loading = false
      },

    }
  }
</script>

