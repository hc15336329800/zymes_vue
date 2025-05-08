<template>
  <div>
    <el-table
      id="isTable"
      border
      :data="submitList"
      fit
      highlight-current-row
      class="table mb_30 isTable2"
    >
      <el-table-column align="center" label="外协厂商">
        <template slot-scope="scope">
          <!-- <el-select
            v-model="scope.row.acctNo"
            placeholder="请选择"
            filterable
            class="input1"
            @change="getAcctName(scope.$index,scope.row.acctNo)"
          >
            <el-option
              v-for="(item,id) in workOptions"
              :key="id"
              :label="item.employeeName"
              :value="item.employeeNo"
            />
          </el-select>-->
          <pinyin-select
            type="getName"
            :selectList="workOptions"
            labelName="employeeName"
            lableId="employeeNo"
            :value="scope.row.acctNo"
            @valChange="getAcctName"
            :selectChange.sync="scope.row.acctNo"
            :index="scope.$index"
          ></pinyin-select>
        </template>
      </el-table-column>
      <el-table-column align="center" label="外协件数">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.allocCount"
            class="input1"
            type="number"
            max="100"
            maxlength="3"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div class="cur_point c_02" @click="operHandle2(2,scope.$index)">删除</div>
        </template>
      </el-table-column>
    </el-table>
    <div class="w_100 flex_row mb_20">
      <el-button type="primary" plain icon="el-icon-plus" @click="operHandle2(4)">增加一行</el-button>
    </div>
  </div>
</template>
<script>
  import {get_all_outer} from '@/api/order'
  import pinyinSelect from '@/components/pinyinSelect.vue'

  export default {
    name: 'outWorkerTable',
    props: ['submitList', 'workOptionsVal'],
    data() {
      return {
        info: [],
        list: [],
        listLoading: false,
        workOptions: []
      }
    },
    components: {
      pinyinSelect
    },
    created() {
      if (!this.workOptionsVal) {
        this.get_all_outer()
      } else {
        this.workOptions = this.workOptionsVal
      }
    },
    methods: {
      getAcctName(obj) {
        // console.log(this.workOptions)
        // this.submitList[index].acctName = this.workOptions.filter(item => {
        //   if(item.employeeNo ){
        //     console.log(item.employeeName)
        //   }
        //   return item.employeeNo == this.submitList[index].acctNo
        // })[0].employeeName

        var index = obj.index
        this.submitList[index].acctNo = obj.val
        this.submitList[index].acctName = this.workOptions.filter(item => {
          return item.employeeNo == this.submitList[index].acctNo
        })[0].employeeName
      },
      async get_all_outer() {
        // 获取员工信息
        const res = await get_all_outer()
        if (res.data) {
          this.workOptions = res.data
        }
      },

      async operHandle2(type, item) {
        switch (type) {
          case 2: // 删除
            if (this.submitList.length > 1) {
              this.submitList.splice(item, 1)
            } else {
              this.$message({
                message: '不能删除',
                type: 'error'
              })
            }
            break

          case 4: // 新增一行工序分配
            if (!this.submitList) {
              this.submitList = []
            }
            this.submitList.push({
              acctNo: '',
              acctName: '',
              allocCount: null
            })
            break
          default:
        }
      }
    }
  }
</script>
<style lang='scss'>
  #isTable.isTable2 {
    border: 1px #eee solid;

    th,
    td {
      //    border:1px #fafafa solid;
    }

    &.el-table .el-table__header-wrapper thead tr th,
    .el-table .el-table__fixed-header-wrapper thead tr th {
      background-color: #fafafa;
    }
  }
</style>
