<template>
  <el-select v-model="deviceId" placeholder="请选择设备" clearable>
    <el-option v-for="dict in deviceList" :key="dict.code" :label="dict.name" :value="dict.code"/>
  </el-select>
</template>
<script>
  import {dictInfo} from '@/api/common'

  export default {

    props: {
      bindId: {
        type: String
      }
    },
    data() {
      return {
        deviceList: [],
        deviceId: '',

      }
    },

    created() {
      this.deviceId = this.bindId
      this.getDeviceList();
    },
    beforeDestroy() {
    },
    watch: {
      deviceId(newVal, oldVal) {
        this.$emit('update:bindId', newVal)
      },
      bindId(newVal, oldVal) {
        this.deviceId = this.bindId
      },
    },
    methods: {
      getDeviceList() {
        dictInfo("DEVICE", r => this.deviceList = r)
      },

    }
  }
</script>

