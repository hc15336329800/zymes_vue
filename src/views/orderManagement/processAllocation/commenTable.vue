<template>
  <div>
    <el-table
      id="isTable"
      border
      :data="submitList"
      fit
      key="tableData.steam_4"
      highlight-current-row
      class="table mb_10 isTable2"
    >
      <el-table-column align="center" label="操作工">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.acctNo"
            placeholder="请输入"
            filterable
            class="input1"
            :disabled="scope.row.dtlId?true:false"
            @focus="focusId=scope.$index"
            @change="getAcctName(scope.$index,scope.row.acctNo)"
            :remote-method="remoteMethod"
            remote
          >
            <el-option
              v-for="(item,id) in scope.row.acctNameList"
              :key="id"
              :label="item.employeeName"
              :value="item.employeeNo"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="modelTypeName?modelTypeName:tab2==1?'按比例（%）':'按件数（件）'"
      >
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.curCount"
            class="input1"
            type="number"
            max="100"
            maxlength="3"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="已分配数量">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.allocCount"
            class="input1"
            type="number"
            max="100"
            maxlength="3"
            :disabled="true"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="报工数量">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.prdCount"
            class="input1"
            type="number"
            max="100"
            maxlength="3"
            :disabled="true"
          />
        </template>
      </el-table-column>

      <el-table-column align="center" label="已下达数量">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.assignCount"
            class="input1"
            type="number"
            max="100"
            maxlength="3"
            :disabled="true"
          />
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div
            class="cur_point c_02"
            @click="operHandle2(2,scope.$index)"
            v-if="!scope.row.dtlId"
          >删除</div>
        </template>
      </el-table-column>
    </el-table>
    <div class="w_100 flex_row">
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        v-if="(!submitList ||submitList.length==0 || !submitList[0].dtlId || model=='01' || model=='03')"
        @click="operHandle2(4)"
      >增加一行
      </el-button>
    </div>
  </div>
</template>
<script>
  import {get_all_workers, list_by_short_code} from '@/api/common'
  import pinyinSelect from '@/components/pinyinSelect.vue'

  export default {
    name: 'CommenTable',
    props: [
      'tab2',
      'submitList',
      'detail',
      'modelTypeName',
      'workOptionsVal',
      ,
      'model'
    ],
    data() {
      return {
        info: [],
        list: [],
        listLoading: false,
        workOptions: [],
        focusId: null
      }
    },
    components: {
      pinyinSelect
    },
    watch: {
      workOptionsVal(val) {
        this.workOptions = val
      }
      // submitList(val) {
      //   val = []
      //   val.forEach(item2 => {
      //     if (item2.acctName) {
      //       var acctNo = item2.acctNo
      //       console.log(acctNo)
      //       this.$set(item2, 'acctNameList', [
      //         {
      //           employeeName: item2.acctName,
      //           employeeNo: item2.acctNo
      //         }
      //       ])
      //       this.$set(item2, 'acctNo', '')
      //       this.$nextTick(() => {
      //         this.$set(item2, 'acctNo', acctNo)
      //       })
      //     }
      //   })
      // }
    },
    created() {
      if (!this.workOptionsVal) {
        this.get_all_workers()
      } else {
        this.workOptions = this.workOptionsVal
      }
    },
    methods: {
      refreshData() {
        console.log('123')
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true
          list_by_short_code({
            params: {
              code: query
            }
          }).then(res => {
            this.$set(this.submitList[this.focusId], 'acctNameList', res.data)
            // this.submitList[this.focusId].acctNameList = res.data
          })
        } else {
          this.$set(this.submitList[this.focusId], 'acctNameList', [])
        }
      },
      getAcctName(index, acctNo) {
        // var index = obj.index
        // this.submitList[index].acctNo = obj.val
        this.submitList[index].acctName = this.workOptions.filter(item => {
          return item.employeeNo == acctNo
        })[0].employeeName
      },
      async get_all_workers() {
        // 获取员工信息
        const res = await get_all_workers()
        if (res.data) {
          this.workOptions = res.data
        }
      },
      getSubmitArr() {
        if (!this.submitList || this.submitList.length == 0) {
          this.$message.error('请添加分配数据！')
          return
        }
        for (var k = 0; k < this.submitList.length; k++) {
          var data = this.submitList[k]
          if (!data.acctNo) {
            this.$message.error('请选择操作工！')
            return
          } else if (!data.acctNo) {
            this.$message.error('请填写分配数量或比例！')
            return
          }
        }
        return this.submitList
      },
      async operHandle2(type, item) {
        switch (type) {
          case 2: // 删除
            if (this.submitList.length > 1) {
              this.submitList.splice(item, 1)
              this.submitList.forEach(item2 => {
                if (item2.acctName) {
                  var acctNo = item2.acctNo
                  this.$set(item2, 'acctNameList', [
                    {
                      employeeName: item2.acctName,
                      employeeNo: item2.acctNo
                    }
                  ])
                  this.$set(item2, 'acctNo', '')
                  this.$nextTick(() => {
                    this.$set(item2, 'acctNo', acctNo)
                  })
                }
              })
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
<style lang="scss">
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
