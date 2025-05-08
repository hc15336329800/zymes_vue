<template>
  <div class="w_100 pt_30 plr_30 ptb_30">
    <!-- 筛选条件 -->
    <el-card class="box-card mb_30">
      <el-form :inline="true" :model="paramForm" label-width="85px" label-position="left">
        <el-form-item label="订单号">
          <el-input v-model="paramForm.orderNo"/>
        </el-form-item>
        <el-form-item label="图纸号">
          <el-input v-model="paramForm.bomNo"/>
        </el-form-item>
        <el-form-item label="申请人">
          <el-input v-model="paramForm.createdBy"/>
        </el-form-item>
        <el-form-item label="申请日期">
          <el-date-picker v-model="date" type="date" placeholder="选择日期" style="width: 187px;"></el-date-picker>
        </el-form-item>
        <el-form-item label="物料编码">
          <el-input v-model="paramForm.orgiItemNo"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class @click="operHandle(1)">查询</el-button>
          <el-button class="ml_20" @click="getList('clear')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
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
          <template v-if="item.label == '状态'">
            {{scope.row.reviewStatus =="00" ? "待审核": scope.row.reviewStatus =="01" ?
            "审核通过":scope.row.reviewStatus =="02" ?
            "审核不通过":scope.row.reviewStatus}}
            <i
              class="el-icon-warning-outline link-type"
              v-if="scope.row.reviewStatus=='02'"
              @click="showReason(scope.row.reviewDesc)"
            ></i>
          </template>
          <template v-else>{{ scope.row[item.value] }}</template>
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
  // import MultipleImage from "@/components/Upload/MultipleImage.vue"
  // import { work_log } from '@/api/work'
  import {page_list_started} from '@/api/approval'

  export default {
    components: {
      // MultipleImage
    },
    data() {
      return {
        date: [],
        tableList: [
          {
            label: '图纸号',
            value: 'bomNo'
          },
          {
            label: '订单号',
            value: 'orderNo'
          },
          {
            label: '物料编码',
            value: 'orgiItemNo'
          },
          {
            label: '物料名称',
            value: 'orgiItemName'
          },
          {
            label: '规格',
            value: 'itemModel'
          },
          {
            label: '计量单位',
            value: 'itemMeasure'
          },
          {
            label: '所需数量',
            value: 'needItemCount'
          },
          {
            label: '申请替换为',
            value: 'repItemName'
          },
          {
            label: '状态',
            value: 'reviewStatus'
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
          // procedureName: '',
          // orderNo: '',
          // bomNo: ''
        }
      }
    },
    async created() {
      await this.getList('clear')
    },
    methods: {
      showReason(reason) {
        //查看审批拒绝原因
        this.$alert(reason, '审批拒绝原因', {
          confirmButtonText: '关闭',
          customClass: 'close-center',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${action}`
            })
          }
        })
      },
      async getList(str) {
        this.listLoading = true
        try {
          if (str == 'clear') {
            this.paramForm = {
              // procedureName: '',
              // orderNo: '',
              // bomNo: ''
            }
            this.pages = {
              total: 0,
              page_num: 1,
              page_size: 10
            }
          }
          if (this.date) {
            this.paramForm.startTime = this.date[0]
            this.paramForm.endTime = this.date[1]
          }
          const res = await page_list_started({
            page: {
              page_num: this.pages.page_num,
              page_size: this.pages.page_size
            },
            params: this.paramForm
          })
          if (res.data instanceof Array) {
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
      async operHandle() {
        // 查询
        this.pages.page_num = 1
        this.pages.total = 0
        this.getList()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .input {
    width: 380px;
  }

  ::v-deep .el-message-box .el-message-box__btn {
    text-align: center !important;
  }

  /* ::v-deep .launchApproval-product .el-form-item {
        width: 24%;
        margin-right: 0px !important;
      } */

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
