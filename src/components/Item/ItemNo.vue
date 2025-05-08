<template>
  <el-form-item
    prop="deptId"
    :label="title"
    :rules="requiredItem?[ { required: true, validator:validateItem}]:[]"
  >
    <el-select
      v-model="name2"
      filterable
      @change="itemChange"
      placeholder="请选择物料编码"
      clearable
      remote
      reserve-keyword
      :remote-method="remoteMethod"
      :loading="loading"
    >
      <el-option
        v-for="dict in itemList"
        :key="dict.itemNo"
        :label="dict.itemName"
        :value="dict.itemNo"
      />
    </el-select>
  </el-form-item>
</template>
<script>
  import {itemSelected} from '@/api/item/itemStock'

  export default {
    name: 'itemSelected',
    props: {
      itemNo: {
        type: String
      },
      itemName: {
        type: String
      },
      disabled: {
        type: Boolean,
        default: false
      },
      title: {
        type: String
      },
      bomNo: {
        type: String
      },
      requiredItem: {
        type: Boolean,
        default: false
      }
    },
    data() {
      var validateItem = (rule, value, callback) => {
        if (!this.name2) {
          callback(new Error('请选择物料'))
        } else {
          callback()
        }
      }
      return {
        name2: '',
        itemList: [],
        validateItem,
        loading: false
      }
    },
    methods: {
      resetData() {
        this.name2 = null
        this.itemList = []
      },
      selectOptionsList() {
        itemSelected({
          params: {
            itemNo: this.itemNo
          }
        }).then(res => {
          this.itemList = res.data
        })
      },
      itemChange() {
        var item = this.itemList.filter(item => {
          return item.itemNo == this.name2
        })[0]
        console.log('-----', item)
        this.$emit('update:itemNo', this.name2)
        if (item) {
          this.$emit('update:itemName', item.itemName)
          this.$emit('update:bomNo', item.bomNo)
        } else {
          this.$emit('update:itemName', '')
          this.$emit('update:bomNo', '')
        }
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true
          setTimeout(async () => {
            var res = await itemSelected({
              params: {
                itemNo: query
              }
            })
            this.itemList = res.data
          }, 200)
        } else {
          this.itemList = []
        }
        this.loading = false
      }
    },
    created() {
      this.name2 = this.itemNo
      this.selectOptionsList()
    },
    watch: {
      itemNo(newVal, oldVal) {
        this.name2 = newVal
      }
    }
  }
</script>
