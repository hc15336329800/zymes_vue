<!--生产下单审批-->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
<!--      <el-form-item label="图纸号" class="condition">-->
<!--        <BomNoSelect :item-no.sync="queryParams.params.itemNo"/>-->
<!--      </el-form-item>-->
      <el-form-item label="订单号" class="condition">
        <el-input v-model="queryParams.params.orderNo"/>
      </el-form-item>
      <el-form-item label="订单类型" class="condition">
        <el-select v-model="queryParams.params.bizType" placeholder="请选择类型" clearable>
          <el-option
            v-for="dict in orderTypeList"
            :key="dict.code"
            :label="dict.name"
            :value="dict.code"
          />
        </el-select>
      </el-form-item>
<!--      <el-form-item label="审批状态" class="condition">-->
<!--        <el-select v-model="queryParams.params.placeStatus" placeholder="请选择类型" clearable>-->
<!--          <el-option-->
<!--            v-for="dict in approvalList"-->
<!--            :key="dict.code"-->
<!--            :label="dict.name"-->
<!--            :value="dict.code"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->

      <el-form-item label="申请时间" class="condition">
        <DateIntervals
          ref="userInfoDateIntervals"
          @getData="getData"
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


<!--    <el-row class="mb8">-->
<!--      <el-button-->
<!--        type="primary"-->
<!--        class="commen-button"-->
<!--        v-if="hasPerm('B008001000001')"-->
<!--        v-show="buttonShow"-->
<!--        @click="batchPass"-->
<!--      >-->
<!--        <img-->
<!--          src="@/assets/images/yes.png"-->
<!--          alt-->
<!--          style="width: 14px; margin-right: 4px;vertical-align:middle;"-->
<!--        >批量确认-->
<!--      </el-button>-->
<!--      <el-button-->
<!--        type="primary"-->
<!--        class="commen-button"-->
<!--        v-if="hasPerm('B008001000002')"-->
<!--        v-show="buttonShow"-->
<!--        @click="batchRefuse"-->
<!--      >-->
<!--        <img-->
<!--          src="@/assets/images/no.png"-->
<!--          alt-->
<!--          style="width: 14px; margin-right: 4px;vertical-align:middle;"-->
<!--        >批量拒绝-->
<!--      </el-button>-->
<!--    </el-row>-->

    <el-table :data="pageList" class="commen-table mt_20">
      <el-table-column label="订单号" align="center" prop="orderNo" />
      <el-table-column label="客户名称" align="center" prop="custName" />
      <el-table-column label="BOM号" align="center" prop="bomNo" />
      <el-table-column label="物料名称" align="center" prop="itemName" />
      <el-table-column label="需求数量" align="center" prop="needNum" />
      <el-table-column label="紧急情况" align="center" prop="bizType" />
      <el-table-column label="审批状态" align="center" prop="placeStatus">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.placeStatus === '00'" type="info" effect="dark">待审批</el-tag>
          <el-tag v-else-if="scope.row.placeStatus === '01'" type="success" effect="dark">通过</el-tag>
          <el-tag v-else-if="scope.row.placeStatus === '02'" type="danger" effect="dark">拒绝</el-tag>
          <el-tag v-else type="warning" effect="dark">未知</el-tag>
        </template>
      </el-table-column>
<!--      <el-table-column label="审批意见" align="center" prop="approvalMsg" width="220" show-overflow-tooltip />-->
      <el-table-column label="申请人" align="center" prop="applyName" />
      <el-table-column label="申请时间" align="center" prop="applyTime" />
      <el-table-column label="操作" align="center" width="310" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- 确认后不能编辑和删除 -->
          <el-button
            link
            type="primary"
            v-if="scope.row.placeStatus=='00' && hasPerm('B008001000001')"
            v-show="buttonShow"
            icon="Edit"
            @click="approvalPass(scope.row)"
          >审批通过
          </el-button>
          <el-button
            link
            type="primary"
            v-if="scope.row.placeStatus=='00' && hasPerm('B008001000002')"
            v-show="buttonShow"
            icon="Delete"
            @click="approvalRefuse(scope.row)"
          >拒绝
          </el-button>
        </template>
      </el-table-column>
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
  import {dictInfo} from '@/api/common'
  import {approvalPass, approvalRefuse, placePageList} from '@/api/sales/sales'


   import { getAllByOrderNoPageList } from '@/api/sales/sales'


  export default {
    components: {
      DateIntervals: () => import('@/components/DateIntervals'),
      Pagination: () => import('@/components/Pagination'),
      BomNoSelect: () => import('@/components/Item/BomNo')
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
        multipleSelection: [],
        selectList: [],

        pageTotal: 0,
        pageList: {},
        title: '',

        buttonShow: false,

      }
    },
    created() {
      const user = localStorage.getItem('user_info');
      const name = JSON.parse(user).userName;
      this.buttonShow = true;
      this.getSelectOptions()
      // this.getData()
      // this.getData(true) // ✅ 初始化查询时不带筛选参数
    },
    methods: {
      getSelectOptions() {
        dictInfo('ORDER_TYPE', r => (this.orderTypeList = r))
        dictInfo('APPROVAL_STATUS', r => (this.approvalList = r))
      },
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
        this.$refs.userInfoDateIntervals.initDateData()
        this.getData()
      },
      getData(isInit = false) {
        const basePage = {
          pageNum: this.queryParams.page.page_num,
          pageSize: this.queryParams.page.page_size
        }

        const payload = isInit
          ? basePage
          : {
            ...this.queryParams.params,
            ...basePage
          }

        getAllByOrderNoPageList(payload).then(res => {
          this.pageList = res.data || []
          this.pageTotal = Number(res.page?.total_num || 0)
        })
      },
      approvalRefuse(row) {
        this.refuse([row.id])
      },
      batchPass() {
        this.approval(this.selectList)
      },
      batchRefuse() {
        this.refuse(this.selectList)
      },
      refuse(ids) {
        if (!ids || ids.length == 0) {
          this.$message.error('请勾选数据！')
          return
        }
        this.$prompt('请填写审核不通过的原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'auditClass',
          inputType: 'textarea'
        })
          .then(({value}) => {
            console.log(value)
            if (!value || value.length == 0) {
              this.$message.error('请填写审核不通过的原因！')
              return
            }
            approvalRefuse({
              params: {
                approvalMsg: value,
                list: ids
              }
            }).then(res => {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.getData()
            })
          })
          .catch(() => {
          })
      },

      // approvalPass(row) {
      //   this.approval([row.id])
      // },

      // 审批通过按钮
      approvalPass(row) {
        this.$confirm('确认审核通过？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          approvalPass({ id: row.id }).then(() => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getData()
          })
        })
      },

      //
      approval(ids) {
        if (!ids || ids.length == 0) {
          this.$message.error('请勾选数据！')
          return
        }
        this.$confirm('确认审核通过？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          approvalPass({
            params: {
              list: ids
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
