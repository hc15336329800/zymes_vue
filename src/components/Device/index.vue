<template>
  <pinyinSelect
    :selectList="deviceList"
    labelName="name"
    lableId="code"
    :value="deviceId"
    :selectChange.sync="deviceId"
  ></pinyinSelect>
</template>
<script>
  import pinyinSelect from '@/components/pinyinSelect.vue'
  import {deviceSelect} from '@/api/device/deviceInfo'

  export default {
    components: {
      pinyinSelect
    },
    props: {
      bindId: {
        type: String
      },
      pageName: {
        type: String
      },
      deviceList: {
        type: Array
      }
    },
    data() {
      return {
        deviceList: [],
        deviceId: ''
      }
    },

    created() {
      this.deviceId = this.bindId
      if (this.pageName == 'procedureList') {
      } else {
        this.getDeviceList()
      }
    },
    beforeDestroy() {
    },
    watch: {
      deviceId(newVal, oldVal) {
        this.$emit('update:bindId', newVal)
      },
      bindId(newVal, oldVal) {
        this.deviceId = this.bindId
      }
    },
    methods: {
      getDeviceList() {
        deviceSelect({}).then(res => {
          this.deviceList = res.data
        })
      }
    }
  }
</script>

