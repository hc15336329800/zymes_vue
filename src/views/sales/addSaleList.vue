<template>
  <div class="app-container">
    <label for="reportCount" class="el-form-item__label flex_center mb_10" style="width: 120px;">
      <span style="color: #ff4949;" class="mr_5">*</span>
      <span>需求明细：</span>
    </label>
    <el-table
      id="isTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      border
      highlight-current-row
      class="table mb_30"
    >
      <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
      <el-table-column
        v-for="item in tableList"
        :key="item.label"
        align="center"
        :label="item.label"
        :width="item.label == '操作'?150:''"
      >
        <template slot-scope="scope">
          <template v-if="item.label == '关联客户'">
            <el-input v-model="scope.row.custName" placeholder="请输入内容"></el-input>
          </template>
          <template v-if="item.label == '图纸号'">
            <el-select
              v-model="scope.row.itemNo"
              filterable
              remote
              @focus="focusId=scope.$index"
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              class="input1"
              clearable
            >
              <el-option
                v-for="(item,id) in scope.row.itemNoList"
                :key="id"
                :label="item.bomNo"
                :value="item.itemNo"
              />
            </el-select>
          </template>
          <template v-if="item.label == '工序'">
            <el-select
              v-model="scope.row.procedureId"
              filterable
              remote
              clearable
              @focus="focusId=scope.$index"
              placeholder="请输入关键词"
              :remote-method="remoteMethod2"
              :loading="loading"
            >
              <el-option
                v-for="item in scope.row.procedureList"
                :key="item.id"
                :label="item.procedureName"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
          <template v-else-if="item.label == '需求数量'">
            <el-input-number v-model="scope.row.needNum" :precision="0"></el-input-number>
          </template>
          <template v-else-if="item.label == '操作'">
            <div class="flex_row flex_x_between">
              <div class="cur_point c_02 ml_20" @click="operHandle(5,scope.row,scope.$index)">删除</div>
            </div>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" icon="el-icon-plus" class="mb_20" @click="operHandle(3)">新增一行</el-button>
    <div class="w_100 flex_row flex_x_center">
      <el-button type plain class="ml_20" @click="operHandle(1)">取消</el-button>
      <el-button type="primary" class="ml_20" @click="operHandle(2)">确定</el-button>
    </div>
  </div>
</template>
<script>
  import {
    get_bom_list_keyword,
    list_procedure_by_item
  } from '@/api/order'
  import {add_sales_list} from '@/api/sales'

  export default {
    data() {
      return {
        custName: '',
        itemNoList: [],
        options: [],
        loading: false,
        focusId: null,
        tableList: [
          {
            label: '关联客户',
            value: 'custName'
          },
          {
            label: '图纸号',
            value: 'itemNo'
          },
          {
            label: '工序',
            value: 'procedureId'
          },
          {
            label: '需求数量',
            value: 'needNum'
          },
          {
            label: '操作',
            value: 'procedureCode'
          }
        ],
        list: [],

        listLoading: false
      }
    },
    created() {
      for (var k = 0; k < 30; k++) {
        this.list.push({custName: null, itemNo: '', itemNoList: []})
      }
      // this.get_BOM()
    },
    methods: {
      remoteMethod2(query) {
        if (!this.list[this.focusId].itemNo) {
          this.$message.error('请先选择图纸号')
          return
        }
        this.loading = true
        this.loading = false
        list_procedure_by_item({
          params: {
            shortCode: query,
            itemNo: this.list[this.focusId].itemNo
          }
        }).then(res => {
          // this.list[this.focusId].procedureList = res.data
          this.$set(this.list[this.focusId], 'procedureList', res.data)
        })

      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true
          setTimeout(async () => {
            this.loading = false
            var res = await get_bom_list_keyword({
              params: {
                bomNo: query
              }
            })
            this.$set(this.list[this.focusId], 'itemNoList', res.data)
            // this.list[this.focusId].itemNoList = res.data
          }, 200)
        } else {
          this.$set(this.list[this.focusId], 'itemNoList', [])
        }
      },

      async operHandle(type, item, index) {
        switch (type) {
          case 1: // 返回
            this.$router.push({
              name: 'salesManagesment'
            })
            break
          case 2: // 确认新增
            var reg = /^(\+)?\d+(\.\d+)?$/
            var list = JSON.parse(JSON.stringify(this.list))
            if (this.list[0].custName == '') {
              this.$message.error('第一条关联客户不能为空')
              return
            }
            list.forEach(item => {
              if (item.itemNoList) {
                delete item.itemNoList
              }
              if (item.procedureList) {
                delete item.procedureList
              }
            })

            var res = await add_sales_list({
              params: {
                list: list
              }
            })
            this.$message({
              type: 'success',
              message: '提交成功'
            })
            this.$router.push({
              name: 'salesManagesment'
            })
            break
          case 3: // 确认新增
            this.list.push({})
            break
          case 5: // 删除
            this.list.splice(index, 1)
            break
          default:
        }
      }
    }
  }
</script>
