<template>
  <span style="display:inline-block;"></span>
</template>
<script>
  import {get_proc_list, get_bom_list} from '@/api/order'

  export default {
    components: {},
    data() {
      return {
        bomNoList: [],
        procList: [],
        paramForm: {}
      }
    },
    props: ['bomNos', 'procedureCodes', 'type'],
    async created() {
      if (this.type == 1 || this.type == 3) {
        await this.get_BOM()
      }
      if (this.type == 3 || this.type == 2) {
        await this.get_PROC()
      }
    },
    beforeDestroy() {
    },
    watch: {},
    methods: {
      async get_PROC() {
        const res = await get_proc_list({
          page: {
            page_num: 1,
            page_size: 500
          }
        })
        this.procList = res.data
        this.$emit('update:procList', this.procList)
      },
      async get_BOM() {
        const res = await get_bom_list({
          page: {
            page_num: 1,
            page_size: 500
          }
        })
        this.bomNoList = res.data
        this.$emit('update:bomNoList', this.bomNoList)
      }
    }
  }
</script>

