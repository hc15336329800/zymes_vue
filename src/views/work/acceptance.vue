<template>
  <div class="w_100 pt_30 plr_30 ptb_30">
    <!-- 筛选条件 -->
    <el-form :inline="true" :model="paramForm" label-width="120px" label-position="left">
      <el-form-item label="BOM编码">
        <el-input v-model="paramForm.bomNo"/>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input v-model="paramForm.orderNo"/>
      </el-form-item>
      <el-form-item label="工序名称">
        <!-- <el-input v-model="paramForm.procedureName"  /> -->
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
      <el-form-item label="日期" prop="date">
        <el-time-picker
          v-model="paramForm.date"
          is-range
          range-separator="至"
          start-placeholder="开始时间"
          value-format="HH:MM:SS"
          end-placeholder="结束时间"
        ></el-time-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class @click="operHandle(1)">查询</el-button>
        <el-button class="ml_20" @click="getList('clear')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row class="flex_row ptb_20 c_b fw_bold fs_24">
      <el-button type="primary" class @click="operHandle(2,2)">审核拒绝</el-button>
      <el-button type="primary" class="ml_20" @click="operHandle(2,1)">审核通过</el-button>
      <el-button type="primary" class="ml_20" @click="operHandle(3,2)">验收拒绝</el-button>
    </el-row>

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
            <span v-if="scope.row.status == '04'">审核拒绝</span>
            <span v-if="scope.row.status == '03'">验收通过</span>
            <span v-if="scope.row.status == '05'">验收拒绝</span>
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
  import {work_report_list, work_report_batchUpdateStatus} from '@/api/work'
  import {parseTime} from '@/utils'
  import {mapGetters} from 'vuex'
  import {remote_list} from '@/api/order'

  export default {
    data() {
      return {
        tableList: [
          {
            label: 'BOM编码',
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
          },
          {
            label: '操作',
            value: ''
          }
        ],
        options: [],
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
          status: ''
        },
        selectList: [], //已选择的数据
        flag: true
      }
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    async created() {
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
      selectable: function (row, index) {
        if (row.status == '01' || row.status == '02') {
          return true
        } else {
          return false
        }
      },
      async getList(str) {
        this.listLoading = true
        try {
          if (str == 'clear') {
            this.paramForm = {
              bomNo: '',
              orderNo: '',
              procedureName: '',
              status: ''
            }
            this.pages = {
              total: 0,
              page_num: 1,
              page_size: 10
            }
          }
          // this.tabs携带
          if (this.paramForm.date) {
            this.paramForm.startTime = this.paramForm.date[0]
            this.paramForm.endTime = this.paramForm.date[1]
          }
          var paramForm = JSON.parse(JSON.stringify(this.paramForm))
          delete paramForm.date
          const res = await work_report_list({
            page: {
              page_num: this.pages.page_num,
              page_size: this.pages.page_size
            },
            params: paramForm
          })
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
        console.log(val)

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
