<template>
  <el-form-item prop='deptId' label="所属车间" :rules="requiredDept?[ { required: true, validator:validateDept}]:[]" >
    <el-select  v-model="name2" @change="deptChange"  placeholder="请选择工作车间" clearable >
      <el-option v-for="dict in deptList" :key="dict.code" :label="dict.name" :value="dict.code" />
    </el-select>
  </el-form-item>

</template>
<script>
import { dictInfo } from '@/api/common'

export default {
  name: 'workShop',
  props: {
    bindId: {
      type: String
    },
    bindName: {
      type: String
    },
    requiredDept: {
      type: Boolean,
      default:false
    }
  },
  data() {
    var validateDept = (rule, value, callback) => {
      console.log("===== ",this.name2)
      if (!this.name2) {
        callback(new Error('请选择车间'))
      } else {
        callback()
      }
    }
    return {
      name2: '',
      deptList: [],
      validateDept
    }
  },
  methods: {
    selectOptionsList() {
      dictInfo("WORK_SHOP",r => (this.deptList = r) )

    },
    deptChange() {
      console.log("===== ",this.name2)
      if(this.name2){
        var name = this.deptList.filter(item => {
          return item.code == this.name2
        })[0].name
        this.$emit('update:bindId', this.name2)
        this.$emit('update:bindName', name)
      }else{
        this.$emit('update:bindId', this.name2)
        this.$emit('update:bindName', '')
      }


    }
  },
  created() {
    this.name2 = this.bindId
    this.selectOptionsList()
  },
  watch: {


    bindId(newVal, oldVal) {
      this.name2 = newVal
    },

  }
}
</script>
