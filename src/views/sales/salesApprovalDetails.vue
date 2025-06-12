<template>
  <div class="app-container">
    <el-table :data="pageList" class="commen-table mt_20">
<!--      <el-table-column type="index" width="55" label="序号" />-->
      <el-table-column label="订单号" align="center" prop="orderNo" />
      <el-table-column label="客户名称" align="center" prop="custName" />
<!--      <el-table-column label="物料编号" align="center" prop="itemNo" />-->
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

    <div class="w_100 flex_row flex_x_center">
      <el-button type plain class="ml_20" @click="back()">返回</el-button>
    </div>
  </div>
</template>


<script>


import { getAllByOrderNo } from '@/api/sales/sales'

export default {
  data() {
    return {
      pageList: [],
    }
  },
  created() {
    this.getData()
  },
  methods: {



    back() {
      this.$router.push({ name: 'salesManagesment' })
    },
    getData() {
      const idList = JSON.parse(this.$route.query.id || '[]')
      const orderNo = idList.length ? idList[0] : null
      if (!orderNo) {
        this.$message.error('未传入订单号')
        return
      }

      getAllByOrderNo({ orderNo }).then(res => {
        if (res.tx_code === '00') {
          this.pageList = res.data || []
        } else {
          this.$message.error(res?.error_info?.message || '查询失败')
        }
      })
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
