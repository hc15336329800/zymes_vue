<template>
  <div class="app-container">
    <el-table :data="pageList" class="commen-table mt_20">
      <el-table-column type="index" width="55" label="序号"></el-table-column>
      <el-table-column label="订单号" align="center" prop="orderNo"/>
      <el-table-column label="关联客户" align="center" prop="custName"/>
      <el-table-column label="图纸号" align="center" prop="bomNo"/>
      <el-table-column label="需求量" align="center" prop="needNum"/>
      <el-table-column label="下单量" align="center" prop="orderedNum"/>
      <el-table-column label="承诺交期" align="center" prop="deliverTime"/>
      <el-table-column label="订单类型" align="center" prop="bizTypeDesc"/>
      <el-table-column label="申请时间" align="center" prop="applyTime"/>
      <el-table-column label="审核状态" align="center" prop="placeStatusDesc"/>
      <el-table-column
        label="拒绝原因"
        prop="approvalMsg"
        header-align="center"
        align="center"
        width="220"
        :show-overflow-tooltip="true"
      ></el-table-column>
    </el-table>
    <div class="w_100 flex_row flex_x_center">
      <el-button type plain class="ml_20" @click="back()">返回</el-button>
    </div>
  </div>
</template>
<script>

  import {listDetails} from '@/api/sales/sales'

  export default {
    components: {
      DateIntervals: () => import('@/components/DateIntervals'),
      Pagination: () => import('@/components/Pagination')
    },
    data() {
      return {
        queryParams: {
          params: {},
          page: {
            page_num: 1,
            page_size: 10
          }
        },
        form: {},
        pageTotal: 0,
        pageList: {},
        title: '',
        dialogShow: false,
        rules: {
          name: [{required: true, message: '请输入名称', trigger: 'blur'}],
          remark: [{required: true, message: '请输入备注', trigger: 'blur'}]
        }
      }
    },
    created() {
      this.getData()
    },
    methods: {
      back() {
        this.$router.push({
          name: 'salesManagesment'
        })
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.page.page_num = 1
        this.getData()
      },

      getData() {
        this.queryParams.params.ids = JSON.parse(this.$route.query.id)
        listDetails(this.queryParams).then(res => {
          this.pageList = res.data
        })
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
