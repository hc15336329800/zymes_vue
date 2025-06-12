<template>
  <div class="w_100 pt_30 plr_30 ptb_30">
    <el-card>
      <el-tabs v-model="activeName" @tab-click="getData">
        <el-tab-pane label="发货统计" name="first">
          <div style=" font-size: 14px;font-weight: 700;color: #606266;" class="mb_30">
            月份：
            <el-date-picker
              v-model="month"
              type="month"
              @change="getStatic"
              value-format="yyyy-MM"
              format="yyyy-MM"
              placeholder="选择月"
            ></el-date-picker>
          </div>
          <el-table
            id="isTable"
            v-loading="listLoading"
            :data="staticObj.list"
            element-loading-text="Loading"
            fit
            border
            highlight-current-row
            class="table mb_30"
          >
            <el-table-column prop="itemNo" align="center" fixed width="80px"></el-table-column>
            <el-table-column
              v-for="(item,k) in staticObj.days"
              :key="item.label"
              align="center"
              :label="(k+1)"
              width
            >
              <template slot-scope="scope">{{ scope.row[k+1]==0?'':scope.row[k+1] }}</template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="发货明细" name="second">
          <el-form :inline="true" :model="paramForm" label-width="80px" label-position="left">
            <el-form-item label="发货人">
              <el-input v-model="paramForm.sendAcctName"/>
            </el-form-item>
            <el-form-item label="发货日期">
              <el-date-picker
                v-model="paramForm.date"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="图纸号">
              <BomNoSelect :item-no.sync="paramForm.itemNo"/>
            </el-form-item>
            <el-form-item label="接收客户">
              <el-input v-model="paramForm.custName"/>
            </el-form-item>
            <el-form-item class="commen-no-bg">
              <el-button type="primary" icon="el-icon-search" class @click="operHandle(1)">查询</el-button>
              <el-button class="ml_20" icon="el-icon-refresh" @click="getList('clear')">重置</el-button>
            </el-form-item>
          </el-form>
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
              width
            >
              <template slot-scope="scope">
                <template v-if="item.label == '操作类型'">
                  {{scope.row.type =="01" ? "下达": scope.row.type =="02" ? "质检":scope.row.type =="03" ?
                  "审核":scope.row.type
                  =="04" ? "拒绝": scope.row.type}}
                </template>
                <template v-else>{{ scope.row[item.value] }}</template>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'
  import {delivery_record_sta, delivery_record_export} from '@/api/sales'
  import {get_new_export} from '@/api/common'
  import {work_assign_add, work_report_add, work_waste_add} from '@/api/work'
  import {get_bom_list, get_bom_list_keyword} from '@/api/order'

  export default {
    components: {
      UploadExcelComponent,
      BomNoSelect: () => import('@/components/Item/BomNo')

    },
    data() {
      return {
        staticObj: {},
        staticList: [],
        itemNoList: [],
        month: null,
        activeName: 'second',
        paramForm: {
          itemNo: '',
          custName: '',
          sendAcctName: '',
          startDate: '',
          endDate: ''
        },
        tableList: [
          // {
          //   label: '序号',
          //   value: 'id'
          // },
          {
            label: '发货人',
            value: 'sendAcctName'
          },
          {
            label: '发货日期',
            value: 'sendTime'
          },
          {
            label: '图纸号',
            value: 'itemNo'
          },
          {
            label: '接收客户',
            value: 'custName'
          },
          {
            label: '发货数量',
            value: 'sendCount'
          }
        ],
        list: [
          {
            id: '76411',
            orderDtlStatus: '01'
          }
        ],
        listLoading: false,
        // 分页
        pages: {
          total: 0,
          page_num: 1,
          page_size: 10
        },
        // 查询参数
        dialogVisible1: false,
        dialogVisible2: false,
        dialogVisible3: false,
        dialogVisible4: false,
        form: {},
        rules: {
          assignCount: [
            {
              required: true,
              trigger: ['blur', 'change'],
              validator: (rule, value, callback) => {
                let reg = /^(\+)?\d+(\.\d+)?$/
                if (value === '') {
                  callback(new Error('请输入'))
                } else if (!reg.test(value)) {
                  callback(new Error('为正数'))
                } else {
                  callback()
                }
              }
            }
          ],
          itemCount: [
            {
              required: true,
              trigger: ['blur', 'change'],
              validator: (rule, value, callback) => {
                let reg = /^(\+)?\d+(\.\d+)?$/
                if (value === '') {
                  callback(new Error('请输入次品数量'))
                } else if (!reg.test(value)) {
                  callback(new Error('为正数'))
                } else {
                  callback()
                }
              }
            }
          ],
          reportCount: [
            {
              required: true,
              message: '请输入',
              trigger: ['blur', 'change'],
              validator: (rule, value, callback) => {
                let reg = /^\d+$/
                if (value === '') {
                  callback(new Error('请输入'))
                } else if (!reg.test(value)) {
                  callback(new Error('为非负整数'))
                } else {
                  callback()
                }
              }
            }
          ],
          wasteDesc: [
            {
              required: true,
              message: '请输入次品原因',
              trigger: ['blur', 'change']
            }
          ],
          finishTime: [
            {
              required: true,
              message: '请选择整改完成时间',
              trigger: ['blur', 'change']
            }
          ]
        },
        flag: true
      }
    },
    created() {
      // this.get_BOM()
      this.getData()
    },
    methods: {
      remoteMethod2(query) {
        if (query !== '') {
          setTimeout(async () => {
            var res = await get_bom_list_keyword({
              params: {
                itemNo: query
              }
            })
            this.itemNoList = res.data
          }, 200)
        } else {
          this.itemNoList = []
        }
      },
      async get_BOM() {
        const res = await get_bom_list({
          page: {
            page_num: 1,
            page_size: 500
          }
        })
        this.itemNoList = res.data
      },
      async getData() {
        this.month = this.dealDate(new Date())
        if (this.activeName == 'first') {
          await this.getStatic()
        } else {
          await this.getList('clear')
        }
      },
      dealDate: function (date) {
        var Y = date.getFullYear() + '-'
        var M =
          date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1
        var D = date.getDate() + ' '
        var h = date.getHours() + ':'
        var m = date.getMinutes() + ':'
        var s = date.getSeconds()
        return Y + M
      },
      async getStatic() {
        var res = await delivery_record_sta({
          page: {page_num: this.pages.page_num, page_size: this.pages.page_size},
          params: {
            date: this.month
          }
        })
        if (res.data) {
          this.staticObj = res.data
          this.staticList = res.data.list
          this.staticList.forEach((item, index) => {
            for (var k = 0; k < this.staticObj.days; k++) {
              item[k + 1] = item.counts[k]
            }
          })
          console.log(this.staticList)
        }
      },
      closeDialog(name) {
        // this.$nextTick(()=>{
        //   this.$refs.form.clearValidate()
        //   })
        this[name] = false
        this.assignCount = ''
        this.itemCount = ''
        this.finishTime = ''
        this.wasteDesc = ''
        this.reportCount = ''
      },
      async getList(str) {
        this.listLoading = true
        try {
          if (str == 'clear') {
            for (var k in this.paramForm) {
              this.paramForm[k] = ''
            }
            this.pages = {
              total: 0,
              page_num: 1,
              page_size: 1000
            }
          } else {
            if (this.paramForm.date) {
              this.paramForm.startDate = this.paramForm.date[0]
              this.paramForm.endDate = this.paramForm.date[1]
            }
          }

          var paramForm = JSON.parse(JSON.stringify(this.paramForm))

          delete paramForm.date
          const res = await delivery_record_export({
            page: {
              page_num: this.pages.page_num,
              page_size: this.pages.page_size
            },
            params: paramForm
          })
          if (res.data) {
            this.list = res.data
            this.pages.total = res.page.total_num - 0
          }
        } finally {
          this.listLoading = false
        }
      },
      handleCurrentChange(val) {
        // 点击页码切换数据
        this.pages.page_num = val
        this.getList()
      },
      handleSizeChange(val) {
        // 点击页码切换数据
        this.pages.page_size = val
        this.getList()
      },
      async operHandle(type, item) {
        // const self = this;
        /** 清空校验 */
        try {
          switch (type) {
            case 1: // 查询
              this.pages.page_num = 1
              this.pages.total = 0
              this.getList()
              break
            case 2: // 导出
              var paramForm = JSON.parse(JSON.stringify(this.paramForm))
              if (!this.paramForm.date) {
                this.$message.error('请选择日期')
                return
              }
              if (!this.paramForm.itemNo) {
                this.$message.error('请选择图纸号')
                return
              }
              if (this.paramForm.date) {
                paramForm.startDate = this.paramForm.date[0]
                paramForm.endDate = this.paramForm.date[1]
              }
              delete paramForm.date
              const res = get_new_export('/api/sales/delivery_record/export', {
                page: {page_num: 1, page_size: 1},
                params: paramForm
              })
              break
            default:
          }
        } finally {
          setTimeout(() => {
            this.flag = true
          }, 2000)
        }
      },
      closeDia() {
        this.form = {}
      },
      async confirm(type) {
        // console.log(this.selectProductTemp)
        try {
          if (this.flag) {
            this.flag = false
            const form = this.form
            const validate = await this.$refs.form.validate()
            if (validate) {
              if (type == 1) {
                //下达
                await work_assign_add({
                  params: {workOrderId: form.id, assignCount: form.assignCount}
                })
                this.dialogVisible1 = false
              } else if (type == 2) {
                //报工
                await work_report_add({
                  params: {
                    isWasteReport: '0',
                    workOrderId: form.id,
                    reportCount: form.reportCount - 0
                  }
                })
                this.dialogVisible2 = false
              } else if (type == 3) {
                //次品补录
                const form1 = {
                  workOrderId: form.id,
                  workOrderNo: form.workOrderNo,
                  orderNo: form.orderNo,
                  itemNo: form.itemNo,
                  procedureCode: form.procedureCode,
                  procedureName: form.procedureName,
                  itemNo: form.itemNo,
                  itemName: form.itemName,
                  finishTime: form.finishTime,
                  wasteDesc: form.wasteDesc,
                  itemCount: form.itemCount,
                  createdBy: form.createdBy,
                  createdTime: form.createdTime
                }
                await work_waste_add({params: form1})
                this.dialogVisible3 = false
              } else if (type == 4) {
                //次品报工
                await work_report_add({
                  params: {
                    isWasteReport: '1',
                    workOrderId: form.id,
                    reportCount: form.reportCount
                  }
                })
                this.dialogVisible4 = false
              }
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.getList('clear')
            }
          }
        } finally {
          setTimeout(() => (this.flag = true), 1000)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .input {
    width: 380px;
  }

  ::v-deep .el-form--inline .el-form-item {
    margin-right: 20px;
  }

  ::v-deep .el-tabs__nav-wrap::after {
    background-color: #fff;
  }

  ::v-deep .my_label {
    width: 120px;
  }

  .add_img {
    width: 148px;
    height: 148px;

    img {
      width: 100%;
      height: 100%;
    }

    .delete_img {
      width: 20px;
      height: 20px;
      right: -10px;
      top: -15px;
    }
  }

  .btn {
    width: 200px;
  }
</style>
