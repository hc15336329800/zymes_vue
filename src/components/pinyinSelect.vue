<template>
  <el-select
    :disabled="disabled"
    v-model="value"
    filterable
    :filter-method="pinyingMatch"
    @change="setValue"
    @visible-change="focusIpt"
    placeholder="请选择"
    clearable
  >
    <el-option
      :key="item[lableId]"
      v-for="(item,k) in options"
      :k="k"
      :label="item[labelName]"
      :value="item[lableId]"
    ></el-option>
  </el-select>
</template>
<script>
  export default {
    name: 'pinyingMatch',
    data() {
      return {
        options: []
      }
    },
    created() {
      this.options = this.selectList
    },
    props: [
      'selectList',
      'disabled',
      'labelName',
      'lableId',
      'value',
      'type',
      'index',
      'useName'
    ],
    watch: {
      selectList(newVal, oldVal) {
        this.options = newVal
      }
    },
    methods: {
      focusIpt() {
        if (this.useName) {
          this.options = []
          this.options = this.useName
          this.selectList = this.options
        } else {
          this.options = this.selectList
        }
      },
      pinyingMatch(val) {
        var that = this
        if (val) {
          var result = []
          //
          //注意otherList是内容数组，根据自己项目修改
          this.selectList.forEach(e => {
            //注意，e.employeeName是遍历数组之后的键，按需修改
            var m = this.pinyin.match(e[this.labelName], val)
            // console.log(m);
            if (m) {
              result.push(e)
            }
          })
          //搜索到相应的数据就把符合条件的n个数据赋值brand
          this.options = result
        } else {
          //没有搜索到数据，就还展示所有的brand
          //copyotherList也是内容数组，为了显示全部，需要添加进之前的内容
          this.options = that.copyotherList
        }
      },
      setValue(val) {
        if (this.type == 'getName') {
          this.$emit('valChange', {
            index: this.index,
            val: val
          })
        } else {
          this.$emit('update:selectChange', val)
        }
      }
    }
  }
</script>
