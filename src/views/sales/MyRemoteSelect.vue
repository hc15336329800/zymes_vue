<template>
  <div>
    <el-select v-model="computed_value" remote placeholder="请输入" filterable :remote-method="remoteMethod2"
               class="input1"
               clearable v-bind="$attrs" v-on="$listeners">
      <el-option v-for="(item, id) in bomNoList" :key="id" :label="item.bomNo" :value="item.itemNo"/>
    </el-select>

  </div>
</template>

<script>
  import {get_bom_list, get_bom_list_keyword} from '@/api/order'
  import {itemSelected} from '@/api/item/itemStock'

  export default {
    name: 'MyRemoteSelect',
    inheritAttrs: false,
    props: {
      pageName: {
        type: String,
        default: ''
      },

      pageName2: {
        type: String,
        default: ''
      },
      value: {
        type: String,
        default: ''
      }
    },
    created() {
      this.getData()
    },
    mounted() {
    },
    computed: {
      computed_value: {
        get() {
          return this.value
        },
        set(newV) {
          console.log('newV', newV);
          this.$emit('input', newV)
        }
      }
    },
    data() {
      return {
        bomNoList: [],
      }
    },

    methods: {
      remoteMethod2(query) {
        if (query !== '') {
          setTimeout(async () => {
            var res = await get_bom_list_keyword({
              params: {
                bomNo: query
              }
            })
            this.bomNoList = res.data
          }, 200)
        } else {
          this.bomNoList = []
        }
      },
      getData() {
        if (this.value) {
          itemSelected({
            params: {
              itemNo: this.value
            }
          }).then(res => {
            this.bomNoList = res.data
          })
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-input__inner {
    height: 22px;
    border: none;
    border-bottom: 1px solid #000;
    border-radius: unset;
    box-sizing: border-box;
  }

  ::v-deep .el-select__caret {
    color: #282323 !important;
    margin-top: 5px !important;
  }
</style>
