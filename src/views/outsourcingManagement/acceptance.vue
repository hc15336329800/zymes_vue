<template>
  <div class="w_100 pt_30 plr_30 ptb_30">
    <!-- 筛选条件 -->
    <el-form :inline="true" :model="paramForm" label-width="120px" label-position="left">
      <el-form-item label="外协厂商">
        <el-select v-model="paramForm.outerUser" filterable placeholder="请选择" class="input">
          <el-option v-for="item in outerOptions" :key="item.id" :label="item.employeeName" :value="item.employeeName"/>
        </el-select>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input v-model="paramForm.orderNo" class="input"/>
      </el-form-item>
      <el-form-item label="产品编码">
        <el-input v-model="paramForm.itemNo" class="input"/>
      </el-form-item>
      <el-form-item label="BOM编码">
        <el-input v-model="paramForm.bomNo" class="input"/>
      </el-form-item>
      <el-form-item label="报工时间">
        <el-date-picker
          v-model="paramForm.createdTime"
          class="input"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        />
      </el-form-item>
      <el-form-item label="报工状态">
        <el-select v-model="paramForm.status" placeholder="请选择" class="input">
          <el-option label="待验收" value="00"/>
          <el-option label="验收通过" value="01"/>
          <el-option label="验收拒绝" value="02"/>
          <!-- <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" /> -->
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="" @click="operHandle(1)">查询</el-button>
        <el-button class="ml_20" @click="getList('clear')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row class="flex_row ptb_20 c_b fw_bold fs_24">
      <el-button type="primary" class="" @click="operHandle(2,2)">验收拒绝</el-button>
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
      @select-all='handleSelectionChange'
    >
      <el-table-column
        align="center"
        type="selection"
        :selectable="selectable"
        width="55">
      </el-table-column>
      <el-table-column v-for="item in tableList" :key="item.label" align="center" :label="item.label"
                       :width="item.label == '操作' ? 180 : ''">
        <template slot-scope="scope">
          <template v-if="item.label == '操作'">
            <!-- 待验收 -->
            <div v-if="scope.row.status == '00'" class="flex_row flex_x_between">
              <div class="cur_point c_02" @click="operHandle(3,1,scope.row)">验收通过</div>
              <div class="cur_point c_02" @click="operHandle(3,2,scope.row)">验收拒绝</div>
            </div>
          </template>

          <template v-else-if="item.label == '状态'">
            <!-- 待接收   外协单状态;01：领取，02:报工，03:确认，04:拒绝 -->
            <span v-if="scope.row.status == '00'">待验收</span>
            <span v-if="scope.row.status == '01'">验收通过</span>
            <span v-if="scope.row.status == '02'">验收拒绝</span>

            <!-- <el-option label="待验收" value="00" />
            <el-option label="验收通过" value="03" />
            <el-option label="验收拒绝" value="04" /> -->

          </template>
          <template v-else>
            {{ scope.row[item.value] }}
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager,next,  sizes, slot"
      :total="pages.total"
      :current-page="pages.page_num"
      :page-size="pages.page_size"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
      <span class="product-total">共{{ pages.total }}条</span>
    </el-pagination>
  </div>
</template>
<script>
  import {outer_log_list, outer_log_batchUpdateStatus, get_all_outer} from '@/api/outsourcingManagement'
  import {parseTime} from "@/utils"
  import {mapGetters} from "vuex"

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
            label: '产品编码',
            value: 'itemNo'
          },
          {
            label: '产品名称',
            value: 'itemName'
          },
          {
            label: '外协厂商',
            value: 'outerUser'
          },
          {
            label: '外协分配数量',
            value: 'outerCount'
          },
          {
            label: '剩余待完成数量',
            value: 'pendingCount'
          },
          {
            label: '本次报工数量',
            value: 'itemCount'
          },
          {
            label: '报工人',
            value: 'createdBy'
          },
          {
            label: '报工时间',
            value: 'createdTime'
          },
          {
            label: '状态',
            value: 'statusStr'
          },
          {
            label: '操作',
            value: ''
          }
        ],
        list: [
          // {workReportId: "12"},
          // {workReportId: "13"},
          // {workReportId: "14"},
          // {workReportId: "15"},
          // {workReportId: "16"},
          // {workReportId: "17"},
        ],
        statusOptions: [
          {
            value: "01",
            label: "领取"
          },
          {
            value: "02",
            label: "报工"
          },
          {
            value: "03",
            label: "确认"
          },
          {
            value: "04",
            label: "拒绝"
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
        paramForm: {
          bomNo: '',
          orderNo: '',
          outerUser: '',
          itemNo: "",
          status: "",
          createdTime: ""
        },
        outerOptions: [],
        selectList: [], //已选择的数据
        flag: true
      }
    },
    computed: {
      ...mapGetters(["userInfo"])
    },
    async created() {
      this.get_all_outer()
      await this.getList('clear')
    },
    methods: {
      selectable: function (row, index) {
        if (row.status == '00') {
          return true
        } else {
          return false
        }

      },
      async get_all_outer() { // 获取所有外协厂商
        const res = await get_all_outer()
        if (res.data) {
          this.outerOptions = res.data
        }
      },
      async getList(str) {
        this.listLoading = true
        try {
          if (str == 'clear') {
            this.paramForm = {
              bomNo: '',
              orderNo: '',
              outerUser: '',
              itemNo: "",
              status: "",
              createdTime: ""
            }
            this.pages = {
              total: 0,
              page_num: 1,
              page_size: 10
            }
          }
          const res = await outer_log_list({
            page: {page_num: this.pages.page_num, page_size: this.pages.page_size},
            params: this.paramForm
          })
          if (res.data instanceof Array) {
            let data = res.data.map(item => {
              let status = this.statusOptions.find(it => it.value == item.status)
              return {
                ...item,
                statusStr: status ? status.label : (item.status == "00" ? "待验收" : item.status)
              }
            })
            this.list = data
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
          let res;
          switch (type) {
            case 1: // 查询
              this.pages.page_num = 1
              this.pages.total = 0
              this.selectList = []
              this.getList()
              break
            case 2: // 批量验收拒绝
              if (this.selectList.length) {
                await this.$confirm(index == 1 ? '确认批量验收通过？' : '确认批量验收拒绝？', '提示', {
                  confirmButtonText: '确认',
                  cancelButtonText: '取消',
                  type: 'warning'
                })
                if (this.flag) {
                  this.flag = false
                  // createdTime: parseTime(new Date())
                  res = await outer_log_batchUpdateStatus({
                    params: {
                      acceptanceList: this.selectList,
                      status: index == 1 ? "01" : "02"
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
              break;
            case 3: // 单个验收
              await this.$confirm(index == 1 ? '确认验收通过？' : '确认验收拒绝？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
              })
              const params = {
                acceptanceList: [{outerId: item.outerId, outReportId: item.reportId}],
                status: index == 1 ? "01" : "02",
                createdBy: item.createdBy,	//创建人
                createdTime: item.createdTime
              };
              if (this.flag) {
                this.flag = false
                res = await outer_log_batchUpdateStatus({params})
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.selectList = []
                this.getList()
              }
              break;
            default:
              ;
          }
        } finally {
          setTimeout(() => {
            this.flag = true
          }, 1000)
        }
      },
      handleSelectProduct() {
        this.list.forEach(item => {
          let i = this.selectList.findIndex(i => i.outerId == item.outerId)
          if (i > -1) {
            this.$refs.multipleTable.toggleRowSelection(item, true);
          }
        });
      },
      handleSelectionChange(val) {
        if (val.length == this.list.length) { //当前页数据全选
          val.forEach(item => {
            if (this.selectList.every(it => it.reportId != item.reportId)) {
              this.selectList.push({outerId: item.outerId, outReportId: item.reportId})
            }
          });
        } else if (val.length > 0) { //当前页数据部分改动
          this.list.forEach(item => {
            let index = val.findIndex(it => it.reportId == item.reportId)
            if (index > -1) {
              if (this.selectList.every(i => i.reportId != item.reportId)) {
                this.selectList.push({outerId: item.outerId, outReportId: item.reportId})
              }
            } else {
              console.log(item.outerId)
              let i = this.selectList.findIndex(i => i.outReportId == item.reportId)
              console.log(i)
              if (i > -1) this.selectList.splice(i, 1)
            }
          });
        } else if (val.length == 0) { //当前页数据全删除
          this.selectList = []
        }
        console.log(this.selectList, "this.selectList")
      },
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
