<template>
  <el-select v-model="userId" clearable placeholder="请选择厂家" style="width:140px;" filterable>
    <el-option :key="user.code" v-for="(user) in userList" :label="user.name" :value="user.code"></el-option>
  </el-select>
</template>
<script>
  import {outerUserList} from '@/api/structure/userInfo'

  export default {
    data() {

      return {
        userId: '',
        userList: [],
        loading: false,

      }
    },
    props: {
      bindId: {
        type: String
      },
    },
    created() {
      this.userId = this.bindId
      this.getData();
    },
    beforeDestroy() {
    },
    watch: {
      userId(newVal, oldVal) {
        this.$emit('update:bindId', newVal)
      }
    },
    methods: {
      getData() {
        outerUserList({}).then(res => {
          this.userList = res.data
        })
      },
    }
  }
</script>
