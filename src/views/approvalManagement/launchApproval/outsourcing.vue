<template>
  <div class="w_100 pt_30 plr_30 ptb_30">
    <!-- 筛选条件 -->
    <el-card class="box-card mb_30">
      <el-form :inline="true" :model="paramForm" label-width="80px" label-position="left">
        <!-- <el-form-item label="工序编号">
                <el-input v-model="paramForm.orderNo" />
        </el-form-item>-->
        <el-form-item label="订单号">
          <el-input v-model="paramForm.orderNo"/>
        </el-form-item>
        <el-form-item label="图纸号">
          <el-input v-model="paramForm.bomNo"/>
        </el-form-item>

        <el-form-item label="BOM名称">
          <el-input v-model="paramForm.bomName"/>
        </el-form-item>
        <el-form-item
          label="状态"
          prop="status"
        >
          <el-select v-model="paramForm.status" placeholder="请选择">
            <el-option key="01" label="全部" value=""/>
            <el-option key="01" label="待审核" value="01"/>
            <el-option key="02" label="待验收" value="02"/>
            <el-option key="03" label="验收通过" value="03"/>
            <el-option key="04" label="审核拒绝" value="04"/>
            <el-option key="05" label="验收拒绝" value="05"/>
          </el-select>
        </el-form-item>
        <el-form-item label="报工日期">
          <el-date-picker
            v-model="paramForm.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            end-placeholder="结束日期"
          ></el-date-picker>
          <!-- <el-date-picker v-model="date" type="daterange" range-separator="至" value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>-->
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
            {{getStatusObj[scope.row.reviewStatus]}}
            <i
              class="el-icon-warning-outline link-type"
              v-if="scope.row.reviewStatus=='04' || scope.row.reviewStatus=='05'"
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
  import {my_page_list, page_list, page_list_started} from '@/api/approval'
  import {getStatusObj, getStatusList} from '@/utils/dictionary.js'

  export default {
    components: {
      // MultipleImage
    },
    data() {
      return {
        date: null,
        getStatusObj,
        getStatusList,
        tableList: [
          {
            label: '图纸号',
            value: 'bomNo'
          },
          {
            label: 'BOM名称',
            value: 'bomName'
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
            label: '订单号',
            value: 'orderNo'
          },
          {
            label: '报工日期',
            value: 'createdTime'
          },
          {
            label: '报工数量',
            value: 'reportCount'
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
          status: ''
          //  status: '01'
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
            this.date = {}
            this.paramForm = {
              // procedureName: '',
              // orderNo: '',
              // bomNo: ''
              status: ''
            }
            this.pages = {
              total: 0,
              page_num: 1,
              page_size: 10
            }
          }

          if (this.paramForm.date) {
            this.paramForm.startTime = this.paramForm.date[0] + ' 00:00:00'
            this.paramForm.endTime = this.paramForm.date[1] + ' 23:59:59'
          }
          var paramForm = JSON.parse(JSON.stringify(this.paramForm))
          if (!paramForm.status) {
            delete paramForm.status
          }
          delete paramForm.date
          const res = await my_page_list({
            page: {
              page_num: this.pages.page_num,
              page_size: this.pages.page_size
            },
            params: paramForm
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

  ::v-deep .launchApproval-product .el-form-item {
    /* width: 20%; */
    margin-right: 20px !important;
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
