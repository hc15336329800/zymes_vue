<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
      <el-form-item label="图纸号" class="condition">
        <BomNoSelect :item-no.sync='queryParams.params.itemNo'/>
      </el-form-item>
      <el-form-item label="工序名称" class="condition">
        <Procedure :bind-name.sync='queryParams.params.procedureName' :bind-id.sync='queryParams.params.procedureCode'/>
      </el-form-item>

      <el-form-item class="commen-button">
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
      </el-form-item>
      <el-form-item class="commen-button reset ">
        <el-button icon="Refresh" @click="handleReset">重置</el-button>
      </el-form-item>
      <el-form-item>
      </el-form-item>
    </el-form>

    <el-table :data="pageList" class="commen-table mt_20">
      <el-table-column label="产品编码" align="center" prop="itemNo"/>
      <el-table-column label="图纸号" align="center" prop="bomNo"/>
      <el-table-column label="工序名称" align="center" prop="procedureName"/>
      <el-table-column label="工序编码" align="center" prop="procedureCode"/>
      <el-table-column label="序号" align="center" prop="seqNo"/>
      <el-table-column label="库存量" align="center" prop="itemCount"/>
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


  import {midPageList} from '@/api/item/mesMidItem'

  export default {
    components: {
      DateIntervals: () => import('@/components/DateIntervals'),
      Pagination: () => import('@/components/Pagination'),
      Procedure: () => import('@/components/Item/MesProcedure'),
      BomNoSelect: () => import('@/components/Item/BomNo')

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
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          remark: [
            {required: true, message: '请输入备注', trigger: 'blur'}
          ],
        }

      }
    },
    created() {
      this.getData();
    },
    methods: {
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.page.page_num = 1
        this.getData()
      },
      beforeClose() {
        this.form = {}
        this.$refs['form'].clearValidate()
      },
      /** 重置操作表单 */
      handleReset() {
        this.queryParams = {
          page: {
            page_num: 1,
            page_size: 10
          },
          params: {}
        }
        this.getData()
      },
      getData() {
        midPageList(this.queryParams).then(res => {
          this.pageList = res.data
          this.pageTotal = Number(res.page.total_num)
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
