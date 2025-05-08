<template>
  <div class="app-container">
    <el-table :data="pageList" class="commen-table mt_20">
      <el-table-column type="index" width="55" label="序号"></el-table-column>
      <el-table-column align="center" label="图纸号" prop="bomNo"></el-table-column>
      <el-table-column align="center" label="工序名称" prop="procedureName"></el-table-column>
      <el-table-column align="center" label="总数" prop="totalCount"></el-table-column>
      <el-table-column align="center" label="外协数量" prop="outerAllocCount"></el-table-column>
      <el-table-column align="center" label="外协生产数量" prop="outerProdCount"></el-table-column>
      <el-table-column align="center" label="分配数量" prop="bomNo" width="160">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.count" class="input1" type="number"/>
        </template>
      </el-table-column>
    </el-table>
    <div style="width:100%;text-align:center;">
      <el-button type="primary" plain class @click="back()">返回</el-button>
      <el-button type="primary" class @click="save()">保存</el-button>
    </div>
  </div>
</template>
<script>

  import {procProcedureList, procProcedureOuterList, publishOuter} from '@/api/procAllocation/procAllocation'

  export default {
    components: {
      DateIntervals: () => import('@/components/DateIntervals'),
      Pagination: () => import('@/components/Pagination')
    },
    data() {
      return {
        queryParams: {
          params: {},
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
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.page.page_num = 1
        this.getData()
      },
      back() {
        this.$router.back()
      },
      save() {

        publishOuter({
          params: {
            list: this.pageList
          }
        }).then(res => {
          this.$message({
            type: 'success',
            message: '分配成功'
          })
          this.getData()
        })
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
        this.$refs.userInfoDateIntervals.initDateData()
        this.getData()
      },
      getData() {
        this.queryParams.params.ids = JSON.parse(this.$route.query.id)
        procProcedureOuterList(this.queryParams).then(res => {
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
