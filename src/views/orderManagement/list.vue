<!--工序下发页面-->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
      <el-form-item label="订单号" class="condition">
        <el-input v-model="queryParams.params.salesOrderNo" placeholder="请输入订单号" clearable/>
      </el-form-item>
      <el-form-item label="产品名" class="condition">
        <BomNoSelect :item-no.sync="queryParams.params.itemName"/>
      </el-form-item>
<!--      <el-form-item label="订单类型" class="condition">-->
<!--        <el-select v-model="queryParams.params.bizType" placeholder="请选择类型" clearable>-->
<!--          <el-option-->
<!--            v-for="dict in orderTypeList"-->
<!--            :key="dict.code"-->
<!--            :label="dict.name"-->
<!--            :value="dict.code"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="状态" class="condition">-->
<!--        <el-select v-model="queryParams.params.status" placeholder="请选择类型" clearable>-->
<!--          <el-option-->
<!--            v-for="dict in statusList"-->
<!--            :key="dict.code"-->
<!--            :label="dict.name"-->
<!--            :value="dict.code"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item class="commen-button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
      </el-form-item>
      <el-form-item class="commen-button reset">
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
      <el-form-item></el-form-item>
    </el-form>
    <el-row class="mb8">
      <el-button
        type="primary"
        class="commen-button"
        v-if="hasPerm('B006001000001')"
        icon="el-icon-plus"
        @click="batchSchedule"
      >批量排产
      </el-button>
    </el-row>

    <el-table :data="pageList" class="commen-table mt_20" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="订单号" align="center" prop="salesOrderNo" sortable="custom"/>
      <el-table-column label="产品名称" align="center" prop="itemName" sortable="custom"/>
      <el-table-column label="产品编码" align="center" prop="itemNo" sortable="custom"/>

      <el-table-column label="订单类型" align="center" prop="orderType"
                       :formatter="row => orderTypeMap[row.orderType] || row.orderType"  sortable="custom"/>

      <el-table-column label="优先级" align="center" prop="bizType"
                       :formatter="row => bizTypeMap[row.bizType] || row.bizType"   sortable="custom"/>


      <el-table-column label="交付时间" align="center" prop="deliverTime" sortable="custom"/>
      <el-table-column label="计划数量" align="center" prop="itemCount" sortable="custom"/>
<!--      <el-table-column label="工序名称" align="center" prop="procedureName"/>-->
      <el-table-column label="状态" align="center" prop="statusDesc" sortable="custom"/>
    </el-table>

    <pagination
      style="text-align: right"
      v-show="pageTotal>0"
      :total="pageTotal"
      :page.sync="queryParams.page.page_num"
      :limit.sync="queryParams.page.page_size"
      @pagination="getData"
    />
    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="dialogShow" width="480px" @close="beforeClose">
      <el-form :model="form" class="commen-form" :rules="rules" ref="form" label-width="80px">
        <el-form-item prop="name" label="类型名称">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item prop="remark" label="类型描述">
          <el-input type="textarea" v-model="form.remark"/>
        </el-form-item>
        <div class="dialog-footer" style="text-align: center;width:100%;">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import {
    addDeviceType,
    deleteDeviceType,
    detailDeviceType,
    pageList,
    updateDeviceType
  } from '@/api/device/deviceType'
  import {dictInfo} from '@/api/common'
  import {
    productionPageList,
    startScheduled
  } from '@/api/production/productionOrder'
  import {approvalPass} from '@/api/sales/sales'

  export default {
    components: {
      DateIntervals: () => import('@/components/DateIntervals'),
      Pagination: () => import('@/components/Pagination'),
      BomNoSelect: () => import('@/components/Item/BomNo')
    },
    data() {
      return {

        ///////////////////////////////批量多选////////////////////////////////////


        ///////////////////////////////简单映射////////////////////////////////////
        bizTypeMap: {
          '01': '正常',
          '02': '紧急',
          '03': '加急',
          '04': '延后'
        },
        orderTypeMap: {
          '01': '销售单',
          '02': '加急单',
          '03': '追加计划',
          '04': '月度单'
        },
        ///////////////////////////////////////////////////////////////////
        queryParams: {
          params: {},
          page: {
            page_num: 1,
            page_size: 10
          }
        },
        statusList: [],
        orderTypeList: [],
        selectList: [],
        multipleSelection: [],
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
      this.getSelectOptions()
      this.getData()
    },
    methods: {
      getSelectOptions() {
        dictInfo('ORDER_TYPE', r => (this.orderTypeList = r))
        dictInfo('PRODUCTION_STATUS', r => (this.statusList = r))
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
      getData() {
        productionPageList(this.queryParams).then(res => {
          this.pageList = res.data
          this.pageTotal = Number(res.page.total_num)
        })
      },

      // 排产按钮   单选
      // batchSchedule() {
      //   if (this.multipleSelection.length === 0) {
      //     this.$message.error('请勾选数据！')
      //     return
      //   }
      //
      //   this.$confirm('确定排产？', '提示', {
      //     confirmButtonText: '确认',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     // 默认使用第一个选中项
      //     // const first = this.multipleSelection[0]
      //     //
      //     // const requestData = {
      //     //   params: {
      //     //     bomNo: first.bomNo,
      //     //     salesOrderNo: first.salesOrderNo,
      //     //     rootItemNo: first.itemNo,
      //     //     rootCount: first.itemCount
      //     //   }
      //     // }
      //
      //     //【修改：批量处理，每一项都映射为接口参数结构】
      //     const paramsArr = this.multipleSelection.map(item => ({
      //       bomNo: item.bomNo,
      //       salesOrderNo: item.salesOrderNo,
      //       rootItemNo: item.itemNo,
      //       rootCount: item.itemCount
      //     }))
      //     const requestData = { params: paramsArr }
      //     startScheduled(requestData).then(res => {
      //       this.$message({ message: '操作成功', type: 'success' })
      //       this.getData()
      //     })
      //
      //     startScheduled(requestData).then(res => {
      //       this.$message({
      //         message: '操作成功',
      //         type: 'success'
      //       })
      //       this.getData()
      //     })
      //   })
      // },



      batchSchedule() {
        if (this.multipleSelection.length === 0) {
          this.$message.error('请勾选数据！')
          return
        }

        this.$confirm('确定批量排产？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const paramsArr = this.multipleSelection.map(item => ({
            bomNo: item.bomNo,
            salesOrderNo: item.salesOrderNo,
            rootItemNo: item.itemNo,
            rootCount: item.itemCount
          }))
          const requestData = { params: paramsArr }

          //格式化输出错误信息
          startScheduled(requestData).then(res => {
            let msg = res.data || ''
            // 判断并格式化“失败原因示例”后的内容
            const failIdx = msg.indexOf('失败原因示例：')
            if (failIdx > -1) {
              const prefix = msg.substring(0, failIdx + 7)
              // 多个分号结尾要过滤空项
              const details = msg.substring(failIdx + 7)
                .split('；')
                .filter(s => !!s.trim())
                .map(str => str.trim())
                .join('<br>')
              msg = `${prefix}<br>${details}`
            }
            this.$message({
              message: msg,
              type: msg.includes('失败0条') ? 'success' : 'info',
              duration: 10000,
              showClose: true,
              dangerouslyUseHTMLString: true
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
              console.log('测试' + item.id)
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
