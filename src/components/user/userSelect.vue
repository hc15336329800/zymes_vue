<template>
  <el-form-item :label="title" :rules="requiredUser?[ { required: true, validator:userValidate}]:[]">
    <pinyinSelect :selectList="userList" labelName="name" lableId="code" :value="uid"
                  :selectChange.sync="uid"></pinyinSelect>
  </el-form-item>
</template>
<script>
  import pinyinSelect from '@/components/pinyinSelect.vue'
  import {dictInfo} from '@/api/common'

  export default {
    components: {
      pinyinSelect
    },
    data() {
      var userValidate = (rule, value, callback) => {
        if (!this.uid) {
          callback(new Error('请选择'))
        } else {
          callback()
        }
      }
      return {
        userList: [],
        uid: '',
        userValidate


      }
    },
    props: ['title', 'userId', 'requiredUser'],
    created() {
      this.uid = this.userId
      this.getUserList();
    },
    beforeDestroy() {
    },
    watch: {
      uid(newVal, oldVal) {
        this.$emit('update:userId', newVal)
      },
      userId(newVal, oldVal) {
        this.uid = this.userId
      },
    },
    methods: {
      getUserList() {
        dictInfo("USER_INFO", r => (this.userList = r))
      },

    }
  }
</script>

