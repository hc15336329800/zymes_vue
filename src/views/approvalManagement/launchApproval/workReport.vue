<template>
  <div class="w_100 pt_30 plr_30 ptb_30">
    <!-- 筛选条件 -->
    <el-card class="box-card mb_30">
      <el-form :inline="true" :model="paramForm" label-width="80px" label-position="left">
        <el-form-item label="BOM编码">
          <el-input v-model="paramForm.bomNo"/>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="paramForm.orderNo"/>
        </el-form-item>
        <el-form-item label="工序名称">
          <!-- <el-input v-model="paramForm.procedureName" /> -->

          <el-select
            v-model="paramForm.procedureName"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in options"
              :key="item.procedureCode"
              :label="item.procedureName"
              :value="item.procedureName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="验收状态">
          <el-select v-model="paramForm.status" placeholder="请选择">
            <el-option label="待审核" value="01"/>
            <el-option label="待验收" value="02"/>
            <el-option label="审核拒绝" value="04"/>
            <el-option label="验收通过" value="03"/>
            <el-option label="验收拒绝" value="05"/>
          </el-select>
        </el-form-item>
        <el-form-item label="车间" prop="workShopName">
          <el-select v-model="paramForm.workShopName" placeholder="请选择">
            <el-option
              v-for="item in getWorkCenterList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工人" prop="workShopName">
          <el-select v-model="paramForm.acctNo" placeholder="请选择" filterable class="input1">
            <el-option
              v-for="(item,id) in workOptions"
              :key="id"
              :label="item.employeeName"
              :value="item.employeeNo"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="paramForm.date"
            is-range
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            end-placeholder="结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class @click="operHandle(1)">查询</el-button>
          <el-button class="ml_20" @click="getList('clear')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-table
      res="multipleTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      border
      highlight-current-row
      class="table mb_30"
      @select="handleSelectionChange"
      @select-all="handleSelectionChange"
    >
      <el-table-column type="selection" :selectable="selectable"></el-table-column>
      <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
      <el-table-column
        v-for="item in tableList"
        :key="item.label"
        align="center"
        :label="item.label"
        :width="item.label == '操作' ? 180 : ''"
      >
        <template slot-scope="scope">
          <template v-if="item.label == '状态'">
            <span v-if="scope.row.status == '01'">待审核</span>
            <span v-if="scope.row.status == '02'">待验收</span>
            <span v-if="scope.row.status == '04'">
              审核拒绝
              <i
                class="el-icon-warning-outline link-type"
                @click="showReason(scope.row.reviewDesc,1)"
              ></i>
            </span>
            <span v-if="scope.row.status == '03'">验收通过</span>
            <span v-if="scope.row.status == '05'">
              验收拒绝
              <i
                class="el-icon-warning-outline link-type"
                @click="showReason(scope.row.reviewDesc,2)"
              ></i>
            </span>
          </template>
          <template v-else-if="item.label == '操作'">
            <!-- 待审核 -->
            <div v-if="scope.row.status == '01'" class="flex_row flex_x_between">
              <div class="cur_point c_02" @click="operHandle(4,1,scope.row)">审核通过</div>
              <div class="cur_point c_02" @click="operHandle(4,2,scope.row)">审核拒绝</div>
            </div>
            <!-- 待验收 -->
            <div v-if="scope.row.status == '02'" class="flex_row flex_x_between">
              <div class="cur_point c_02" @click="operHandle(5,1,scope.row)">验收通过</div>
              <div class="cur_point c_02" @click="operHandle(5,2,scope.row)">验收拒绝</div>
            </div>
          </template>
          <template v-else>{{ scope.row[item.value] }}</template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager,next,  sizes, slot"
      :total="pages.total - 0"
      :current-page="pages.page_num - 0"
      :page-size="pages.page_size - 0"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
      <span class="product-total">共{{ pages.total }}条</span>
    </el-pagination>
  </div>
</template>
<script>
import { work_report_list, work_report_batchUpdateStatus } from '@/api/work'
import { parseTime } from '@/utils'
import { get_all_workers } from '@/api/common'
import { mapGetters } from 'vuex'
import { remote_list } from '@/api/order'
import { get_work_center_list } from '@/api/getWorkCenter'
export default {
  data() {
    return {
      getWorkCenterList: [],
      options: [],
      tableList: [
        {
          label: 'BOM编码',
          value: 'bomNo'
        },
        {
          label: '图纸号名称',
          value: 'bomNo'
        },
        {
          label: '订单号',
          value: 'orderNo'
        },
        {
          label: '工单号',
          value: 'workOrderNo'
        },
        {
          label: '工序编码',
          value: 'procedureCode'
        },
        {
          label: '工序名称',
          value: 'procedureName'
        },
        {
          label: '报工数量',
          value: 'reportCount'
        },
        {
          label: '操作工',
          value: 'createdBy'
        },
        {
          label: '操作时间',
          value: 'createdTime'
        },
        {
          label: '状态',
          value: 'status'
        }
      ],
      list: [],
      listLoading: false,
      // 分页
      pages: {
        total: 0,
        page_num: 1,
        page_size: 10
      },
      // 查询参数
      paramForm: {
        bomNo: '',
        orderNo: '',
        procedureName: '',
        status: '',
        workShopName: ''
      },
      selectList: [], //已选择的数据
      flag: true,
      workOptions: []
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  async created() {
    await this.get_all_workers()
    await this.getWorkCenter()
    await this.getList('clear')
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(async () => {
          this.loading = false
          this.options = (await remote_list({
            params: {
              shortCode: query
            }
          })).data
        }, 200)
      } else {
        this.options = []
      }
    },
    showReason(reason, type) {
      //查看审批拒绝原因
      this.$alert(reason, type == 1 ? '审批拒绝原因' : '验收拒绝原因', {
        confirmButtonText: '关闭',
        customClass: 'close-center',
        callback: action => {}
      })
    },
    async get_all_workers() {
      // 获取员工信息
      const res = await get_all_workers()
      if (res.data) {
        this.workOptions = res.data
      }
    },
    async getWorkCenter() {
      //获取车间的下拉框
      var result = await get_work_center_list()
      this.getWorkCenterList = result.data
    },
    selectable: function(row, index) {
      if (row.status == '01' || row.status == '02') {
        return true
      } else {
        return false
      }
    },
    dealDate: function(date, type) {
      var Y = date.getFullYear() + '-'
      var M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      var D = date.getDate() + ' '
      var h = date.getHours() + ':'
      var m = date.getMinutes() + ':'
      var s = date.getSeconds()
      return Y + M + D + h + m + s
    },
    setTime() {
      const end = new Date()
      const start = new Date()
      start.setTime(new Date(new Date().toLocaleDateString()).getTime())
      end.setTime(
        new Date(new Date().toLocaleDateString()).getTime() +
          24 * 60 * 60 * 1000
      )
      this.$set(this.paramForm, 'date', [start, end])
    },
    async getList(str) {
      this.listLoading = true
      try {
        if (str == 'clear') {
          this.paramForm = {
            bomNo: '',
            orderNo: '',
            procedureName: '',
            status: '',
            workShopName: '',
            date: []
          }
          this.setTime()
          if (this.getWorkCenterList && this.getWorkCenterList.length > 0) {
            this.$set(
              this.paramForm,
              'workShopName',
              this.getWorkCenterList[0].code
            )
          }
          this.pages = {
            total: 0,
            page_num: 1,
            page_size: 10
          }
        }

        if (this.paramForm.date) {
          if (this.paramForm.date[0] instanceof Date) {
            this.paramForm.startTime = this.dealDate(this.paramForm.date[0])
            this.paramForm.endTime = this.dealDate(this.paramForm.date[1])
          } else {
            this.paramForm.startTime = this.paramForm.date[0]
            this.paramForm.endTime = this.paramForm.date[1]
          }
        }
        var paramForm = JSON.parse(JSON.stringify(this.paramForm))
        delete paramForm.date
        // this.tabs携带
        // console.log(this.paramForm,'this.paramForm')
        const res = await work_report_list({
          page: {
            page_num: this.pages.page_num,
            page_size: this.pages.page_size
          },
          params: paramForm
        })
        console.log(res, 'res')
        if (res.data) {
          this.list = res.data
          this.pages.total = res.page.total_num - 0
          this.$nextTick(() => {
            this.handleSelectProduct()
          })
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
    async operHandle(type, index, item) {
      try {
        let res
        switch (type) {
          case 1: // 查询
            this.pages.page_num = 1
            this.pages.total = 0
            this.selectList = []
            this.getList()
            break
          case 2: // 批量审核
            if (this.selectList.length) {
              await this.$confirm(
                index == 1 ? '确认批量审核通过？' : '确认批量审核拒绝？',
                '提示',
                {
                  confirmButtonText: '确认',
                  cancelButtonText: '取消',
                  type: 'warning'
                }
              )
              if (this.flag) {
                this.flag = false
                res = await work_report_batchUpdateStatus({
                  params: {
                    workReportId: this.selectList.join(','),
                    status: index == 1 ? '02' : '04'
                  }
                })
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.selectList = []
                this.getList()
              }
            } else {
              this.$message({
                message: '请选择批量审核数据',
                type: 'error'
              })
            }
            break
          case 3: // 批量验收拒绝
            if (this.selectList.length) {
              await this.$confirm(
                index == 1 ? '确认批量验收通过？' : '确认批量验收拒绝？',
                '提示',
                {
                  confirmButtonText: '确认',
                  cancelButtonText: '取消',
                  type: 'warning'
                }
              )
              if (this.flag) {
                this.flag = false
                res = await work_report_batchUpdateStatus({
                  params: {
                    workReportId: this.selectList.join(','),
                    status: index == 1 ? '03' : '05'
                  }
                })
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.selectList = []
                this.getList()
              }
            } else {
              this.$message({
                message: '请选择批量验收数据',
                type: 'error'
              })
            }
            break
          case 4: // 单个审核
            await this.$confirm(
              index == 1 ? '确认审核通过？' : '确认审核拒绝？',
              '提示',
              {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
              }
            )
            if (this.flag) {
              this.flag = false
              res = await work_report_batchUpdateStatus({
                params: {
                  workReportId: item.workReportId,
                  status: index == 1 ? '02' : '04'
                }
              })
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.selectList = []
              this.getList()
            }
            break
          case 5: // 单个验收
            await this.$confirm(
              index == 1 ? '确认验收通过？' : '确认验收拒绝？',
              '提示',
              {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
              }
            )
            if (this.flag) {
              this.flag = false
              res = await work_report_batchUpdateStatus({
                params: {
                  workReportId: item.workReportId,
                  status: index == 1 ? '03' : '05'
                }
              })
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.selectList = []
              this.getList()
            }
            break
          default:
        }
      } finally {
        setTimeout(() => {
          this.flag = true
        }, 1000)
      }
    },
    handleSelectProduct() {
      this.list.forEach(item => {
        let i = this.selectList.findIndex(i => i == item.workReportId)
        if (i > -1) {
          this.$refs.multipleTable.toggleRowSelection(item, true)
        }
      })
    },
    handleSelectionChange(val) {
      if (val.length == this.list.length) {
        //当前页数据全选
        val.forEach(item => {
          if (this.selectList.every(it => it != item.workReportId)) {
            this.selectList.push(item.workReportId)
          }
        })
      } else if (val.length > 0) {
        //当前页数据部分改动
        this.list.forEach(item => {
          let index = val.findIndex(it => it.workReportId == item.workReportId)
          if (index > -1) {
            if (this.selectList.every(i => i != item.workReportId)) {
              this.selectList.push(item.workReportId)
            }
          } else {
            let i = this.selectList.findIndex(i => i == item.workReportId)
            if (i > -1) this.selectList.splice(i, 1)
          }
        })
      } else if (val.length == 0) {
        //当前页数据全删除
        this.list.forEach(item => {
          let index = this.selectList.findIndex(it => it == item.workReportId)
          if (index > -1) this.selectList.splice(index, 1)
        })
      }
      console.log(this.selectList, 'this.selectList')
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
