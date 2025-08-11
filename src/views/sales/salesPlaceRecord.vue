<!--下单记录-->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">

      <el-form-item label="订单号" class="condition">
        <el-input v-model="queryParams.params.orderNo"  style="    width: 180px;"/>
      </el-form-item>
      <el-form-item label="订单类型" class="condition" >
        <el-select v-model="queryParams.params.bizType" placeholder="请选择类型" clearable   style="    width: 180px;">
          <el-option v-for="dict in orderTypeList" :key="dict.code" :label="dict.name" :value="dict.code"/>
        </el-select>
      </el-form-item>
      <el-form-item label="审批状态" class="condition">
        <el-select v-model="queryParams.params.placeStatus" placeholder="请选择类型" clearable   style="    width: 180px;">
          <el-option v-for="dict in approvalList" :key="dict.code" :label="dict.name" :value="dict.code"/>
        </el-select>
      </el-form-item>

      <el-form-item label="申请时间" class="condition">
        <DateIntervals
          ref="userInfoDateIntervals"
          :beginTime.sync="queryParams.params.applyStartDate"
          :endTime.sync="queryParams.params.applyEndDate"
        />
      </el-form-item>

      <el-form-item class="commen-button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
      </el-form-item>
      <el-form-item class="commen-button reset">
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
      <el-form-item></el-form-item>
    </el-form>


    <el-table :data="pageList" class="commen-table mt_20">
      <!--      <el-table-column type="index" width="55" label="序号" />-->
      <el-table-column label="订单号" align="center" prop="orderNo" />
      <el-table-column label="客户名称" align="center" prop="custName" />
            <el-table-column label="BOM编号" align="center" prop="bomNo" />
      <el-table-column label="物料名称" align="center" prop="itemName" />
      <el-table-column label="需求数量" align="center" prop="needNum" />

      <!--      <el-table-column label="审批状态" align="center" prop="placeStatus" />-->
      <el-table-column label="紧急情况" align="center" prop="bizType" />


      <el-table-column label="审批状态" align="center" prop="placeStatus">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.placeStatus === '00'" type="info" effect="dark">待审批</el-tag>
          <el-tag v-else-if="scope.row.placeStatus === '01'" type="success" effect="dark">通过</el-tag>
          <el-tag v-else-if="scope.row.placeStatus === '02'" type="danger" effect="dark">拒绝</el-tag>
          <el-tag v-else type="warning" effect="dark">未知</el-tag>
        </template>
      </el-table-column>


      <el-table-column
        label="审批意见"
        prop="approvalMsg"
        header-align="center"
        align="center"
        width="220"
        :show-overflow-tooltip="true"
      ></el-table-column>



      <el-table-column label="申请人" align="center" prop="applyName" />
      <el-table-column label="申请时间" align="center" prop="applyTime" />

    </el-table>

    <pagination
      style="text-align: right"
      v-show="pageTotal>0"
      :total="pageTotal"
      :page.sync="queryParams.page.page_num"
      :limit.sync="queryParams.page.page_size"
      @pagination="getData"
    />
  </div>
</template>
<script>
import { dictInfo } from '@/api/common'
import { getAllByOrderNoPageList } from '@/api/sales/sales'

export default {
  components: {
    DateIntervals: () => import('@/components/DateIntervals'),
    Pagination: () => import('@/components/Pagination'),
  },
  data() {
    return {
      queryParams: {
        params: {
          placeStatus: '00'
        },
        page: {
          page_num: 1,
          page_size: 10
        }
      },
      orderTypeList: [],
      approvalList: [],
      pageList: [],
      pageTotal: 0,
      selectList: [],
      multipleSelection: []
    }
  },
  created() {
    this.getSelectOptions()// ✅ 加载字典项
    // this.getData()
    this.getData(true) // ✅ 初始化时不带筛选

  },
  methods: {
    getSelectOptions() {
      dictInfo("ORDER_TYPE", r => this.orderTypeList = r)
      dictInfo("APPROVAL_STATUS", r => this.approvalList = r)
    },
    handleQuery() {
      this.queryParams.page.page_num = 1
      this.getData()// ❌ 不传 true，这时带筛选参数
    },
    // 初始化时清空筛选字段
    handleReset() {
      this.queryParams = {
        page: {
          page_num: 1,
          page_size: 10
        },
        params: {} // ✅ 清空所有筛选项

      }
      this.$refs.userInfoDateIntervals?.initDateData()

    },
    // 初始化只传分页字段
    getData(isInit = false) {
      const basePage = {
        pageNum: this.queryParams.page.page_num,
        pageSize: this.queryParams.page.page_size
      }

      const payload = isInit
        ? basePage // ✅ 初始化只传分页
        : {
          ...this.queryParams.params,
          ...basePage
        }

      getAllByOrderNoPageList(payload).then(res => {
        this.pageList = res.data || []
        this.pageTotal = Number(res.page?.total_num || 0)
      })
    },

    handleSelectionChange(val) {
      const ids = val.map(i => i.id)
      this.selectList = ids
      this.multipleSelection = val
    },
    cancel() {
      this.dialogShow = false
      this.selectList = []
      this.multipleSelection = []
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
