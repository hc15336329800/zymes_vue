<template>
  <el-select
    v-model="procedureName"
    filterable
    remote
    clearable
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading"
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
        procedureName: null,
        procedureList: [],
        loading: false,

      }
    },
    props: {

      bindName: {
        type: String
      }
    },
    created() {
      this.procedureName = this.bindName
      // this.remoteMethod();
    },
    beforeDestroy() {
    },
    watch: {
      procedureName(newVal, oldVal) {
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

