<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
<!--      <el-form-item label="母件图纸号" class="condition">-->
<!--        <BomNoSelect ref="BomNoSelect" :item-no.sync="queryParams.params.parentItemNo"/>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="子件图纸号" class="condition">-->
<!--        <multipleBomNo ref="multipleBomNo" :item-nos.sync="queryParams.params.childItemNos"/>-->
<!--      </el-form-item>-->
      <el-form-item label="状态" class="condition">
        <el-select v-model="queryParams.orderStatus" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in statusList"
            :key="dict.code"
            :label="dict.name"
            :value="dict.code"
          />
        </el-select>
      </el-form-item>

      <el-form-item class="commen-button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
      </el-form-item>
      <el-form-item class="commen-button reset">
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
      <el-form-item></el-form-item>
    </el-form>
<!--    <el-row class="mb8">-->
<!--      <el-button-->
<!--        type="primary"-->
<!--        class="commen-button"-->
<!--        v-if="hasPerm('B006002000004')"-->
<!--        v-show="buttonShow"-->
<!--        icon="el-icon-plus"-->
<!--        @click="procAlloc"-->
<!--      >工序分配-->
<!--      </el-button>-->
<!--      <el-button type="primary" class="mb_20" @click="operHandle()">批量关闭</el-button>-->
<!--    </el-row>-->


    <el-table
      :data="pageList"
      row-key="id"
      :tree-props="{ children: 'children' }"
      default-expand-all
      border
      style="width: 100%;"
    >
      <el-table-column label="部件名称" prop="itemName" />
      <el-table-column label="物料号" prop="itemNo" />
      <el-table-column label="BOM号" prop="bomNo" />

      <el-table-column label="子件号" prop="useItemNo" />
      <el-table-column label="用量" prop="useItemCount" />
      <el-table-column label="父级编码" prop="parentCode" />
    </el-table>


    <pagination
      style="text-align: right"
      v-show="pageTotal>0"
      :total="pageTotal"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getData"
    />
  </div>
</template>
<script>

  import {dictInfo} from '@/api/common'
  import {orderPageList, updateOrderStatus,updateAllocation,getBomTreePage} from '@/api/order/order'

  export default {
    components: {
      DateIntervals: () => import('@/components/DateIntervals'),
      Pagination: () => import('@/components/Pagination'),
      BomNoSelect: () => import('@/components/Item/BomNo'),
      multipleBomNo: () => import('@/components/Item/multipleBomNo')
    },
    data() {
      return {
        statusList: [],
        selectList: [],
        multipleSelection: [],
        // queryParams: {
        //   orderNo: '',
        //   parentItemNo: '',
        //   // childItemNos: [],
        //   orderDtlStatus: '04',
        //   pageNum: 1,
        //   pageSize: 100
        // }

        queryParams: {
          bomNo: '',         // 查询用 BOM 编号
          pageNum: 1,
          pageSize: 10
        },

        form: {},
        pageTotal: 0,
        pageList: [],  // ✅ 正确：树形数据必须是数组

        title: '',
        dialogShow: false,
        buttonShow: false,
        rules: {
          name: [{required: true, message: '请输入名称', trigger: 'blur'}],
          remark: [{required: true, message: '请输入备注', trigger: 'blur'}]
        }
      }
    },
    created() {
      this.buttonShow = true
      this.getOptionData()

      // 🌟 默认加载指定 bomNo 的数据
      this.queryParams.bomNo = 'BOM20240501'  // ⚠️ 可根据需要调整默认值
      this.getData()
    },

    methods: {
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getData()
      },
      beforeClose() {
        this.form = {}
        this.$refs['form'].clearValidate()
      },
      /** 重置操作表单 */
      handleReset() {
        this.queryParams = {
          orderNo: '',
          parentItemNo: '',
          // childItemNos: [],
          orderDtlStatus: '',
          pageNum: 1,
          pageSize: 100
        }
        this.getData()
      },
      getOptionData() {
        dictInfo('ORDER_STATUS', r => (this.statusList = r))
      },

      //初始化和查询
      getData() {

        getBomTreePage(this.queryParams).then(res => {
          this.pageList = res.data || []
          this.pageTotal = Number(res.page?.total_num || 0)

          // 🌟调试检查
          if (this.pageList.length === 0) {
            this.$message.warning('暂无数据，请检查 bomNo 是否正确')
          } else {
            console.log('BOM 树数据加载成功：', this.pageList)
          }
        })


      },
      procAlloc() {
        if (this.selectList.length == 0) {
          this.$message.error('请选择工序分配的生产单！')
          return
        }
        this.$router.push({
          name: 'newprocessAllocation',
          query: {
            id: JSON.stringify(this.selectList)
          }
        })
      },
      updateOrderStatus(row, status) {
        updateOrderStatus({
          params: {
            id: row.id,
            orderDtlStatus: status
          }
        }).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.getData()
        })
      },
      handleSelectionChange(val) {
        if (val.length == this.pageList.length) {
          //当前页数据全选
          val.forEach(item => {
            if (this.selectList.every(it => it != item.id)) {
              this.selectList.push(item.id)
              this.multipleSelection.push(item)
            }
          })
        } else if (val.length > 0) {
          //当前页数据部分改动
          this.pageList.forEach(item => {
            let index = val.findIndex(it => it.id == item.id)
            if (index > -1) {
              if (this.selectList.every(i => i != item.id)) {
                this.selectList.push(item.id)
                this.multipleSelection.push(item)
              }
            } else {
              let i = this.selectList.findIndex(i => i == item.id)
              if (i > -1) {
                this.selectList.splice(i, 1)
                this.multipleSelection.splice(i, 1)
              }
            }
          })
        } else if (val.length == 0) {
          //当前页数据全删除
          this.pageList.forEach(item => {
            let index = this.selectList.findIndex(it => it == item.id)
            if (index > -1) {
              this.selectList.splice(index, 1)
              this.multipleSelection.splice(index, 1)
            }
          })
        }
        console.log(this.multipleSelection, 'this.selectList')
      },
      operHandle() {
        if (this.selectList.length <= 0) {
          this.$message.error('请选择数据')
          return
        }
        this.$confirm("确认批量关闭", '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          updateAllocation({
            params: {
              ids: this.selectList,
              status: "06"
            }
          }).then(res => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getData()

          })
        })


      },
      cancel() {
        this.dialogShow = false
        this.form = {}
        this.$refs['form'].clearValidate()
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
