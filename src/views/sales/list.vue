<template>
  <div class="app-container">


    <!--订单列表-->
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
      <el-form-item label="订单号" class="condition" >
        <el-input v-model="queryParams.params.orderNo" placeholder="请输入订单号" clearable   style="    width: 180px;"/>
      </el-form-item>
      <el-form-item label="客户" class="condition"  >
        <el-input v-model="queryParams.params.custName" placeholder="请输入名称" clearable  style="    width: 180px;"/>
      </el-form-item>
      <el-form-item label="物料号" class="condition">
        <BomNoSelect :item-no.sync="queryParams.params.itemNo" style="    width: 180px;"/>
      </el-form-item>
<!--      <el-form-item label="是否可下单" class="condition">-->
<!--        <el-select v-model="queryParams.params.canPlace" placeholder="请选择下单状态" clearable>-->
<!--          <el-option-->
<!--            v-for="dict in canPlaceList"-->
<!--            :key="dict.code"-->
<!--            :label="dict.name"-->
<!--            :value="dict.code"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item label="创建时间" class="condition">
        <DateIntervals
          ref="userInfoDateIntervals"
          @getData="getData"
          :beginTime.sync="queryParams.params.beginTime"
          :endTime.sync="queryParams.params.endTime"
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
    <el-row class="flex_row pb_10 c_b fw_bold fs_24">
      <el-button
        type="primary"
        class="commen-button"
        icon="el-icon-plus"
        v-if="hasPerm('B004001000001')"
        v-show="buttonShow"
        @click="handleAdd"
      >新增
      </el-button>
      <el-button
        type="primary"
        icon="el-icon-s-order"
        v-if="hasPerm('B004001000004')"
        v-show="buttonShow"
        @click="handlePlaces()"
      >批量下生产单
      </el-button>
      <upload-excel-component
        text="导入销售单"
        :on-success="handleSuccess"
        class="ml_10"
        file-name-type="file"
        :loading="loading"
        ref="uploadGong"
        v-if="hasPerm('B004001000005')"
        v-show="buttonShow"
      />
      <el-button
        type="primary"
        class="ml_10"
        @click="exportOrder()"
        v-if="hasPerm('B004001000006')"
      >
        <img src="@/assets/images/export.png" style="width:14px;vertical-align:center;" alt>导出销售单
      </el-button>
      <div
        @click="downLoadTemplate()"
        style="color:#3145ec;font-size:14px;float:right;z-index:999;position:absolute;right:0px;top:16px;"
      >
        <span style="cursor:pointer;">下载模版</span>
      </div>
    </el-row>
    <el-table :data="pageList" class="commen-table mt_20" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="订单号" align="center" prop="orderNo"/>
      <el-table-column label="BOM号" align="center" prop="itemNo"/>
      <el-table-column label="客户" align="center" prop="custName"/>
      <el-table-column label="产品名称" align="center" prop="itemName"/>
      <el-table-column label="需求数量" align="center" prop="needNum"/>
<!--      <el-table-column label="已下单数量" align="center" prop="orderedNum"/>-->
<!--      <el-table-column label="待下单数量" align="center" prop="waitOrderedNum"/>-->
<!--      <el-table-column label="工序名称" align="center" prop="procedureName"/>-->
      <el-table-column label="创建时间" align="center" prop="createdTime"/>
      <el-table-column label="操作" align="center" width="310" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- 确认后不能编辑和删除 -->
           <el-button link type="primary" icon="Edit" @click="handlePlace(scope.row)">下生产单</el-button>
          <el-button link type="primary" icon="Plus" @click="openPlaceDialog(scope.row)">下生产单 NEW</el-button>

          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
          <el-button link type="primary" icon="Edit" @click="handleDetail(scope.row)">审批详情</el-button>
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


<!--新增订单-->
    <el-dialog
      :title="title + '销售订单'"
      :visible.sync="dialogShow"
      width="600px"
      top="20vh"
      @close="beforeClose"
      custom-class="dialog-round-top"
    >
      <!-- ✅ 正确位置：form 放这里！ -->
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="销售单号">
          <el-input v-model="form.orderNo" :disabled="true" />
        </el-form-item>
        <el-form-item label="客户名称" prop="custName">
          <el-input v-model="form.custName" :disabled="title !== '新增'" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="产品名称" prop="itemName">
          <el-input
            v-model="form.itemName"

            placeholder="点击产品"
            readonly
            @focus="openBomDialog"
          />
        </el-form-item>

          <el-form-item label="BOM编号" prop="itemNo">
            <el-input v-model="form.itemNo" :disabled="true" />

        </el-form-item>

        <el-form-item label="需求数量" prop="needNum">
          <el-input-number v-model="form.needNum" :min="1" :max="100" />
        </el-form-item>
      </el-form>

      <!-- 操作按钮 -->
      <div class="w_100 flex_row flex_x_center mt_20">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" plain class="ml_20" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>


    <BomDialog
      :visible.sync="bomDialogVisible"
      @selected="onBomSelected"
      @cancel="bomDialogVisible = false"
    />


    <!-- 下生产单弹窗 -->
    <el-dialog
      title="下生产单"
      :visible.sync="placeDialogVisible"
      width="500px"
      top="20vh"
      @close="resetPlaceForm"
    >
      <el-form :model="placeForm" :rules="placeRules" ref="placeFormRef" label-width="100px">
        <el-form-item label="承诺交期" prop="deliverTime">
          <el-date-picker
            v-model="placeForm.deliverTime"
            type="datetime"
            placeholder="选择交期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%;"
          />
        </el-form-item>

        <el-form-item label="优先级别" prop="bizType">
          <el-select v-model="placeForm.bizType" placeholder="请选择优先级">
            <el-option label="紧急" value="02" />
            <el-option label="加急" value="03" />
            <el-option label="正常" value="01" />
            <el-option label="延后" value="04" />
          </el-select>
        </el-form-item>
      </el-form>

      <div style="text-align: right; margin-top: 20px;">
        <el-button @click="placeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPlaceOrderHandler">提交</el-button>
      </div>
    </el-dialog>



  </div>
</template>
<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import BomDialog from './BomDialog.vue'

import {get_new_export} from '@/api/common'
import {
  deleteSales,
  detailSales,
  salesPageList,
  updateSales
} from '@/api/sales/sales'
import {sales_import_order} from '@/api/sales'
import {mapGetters} from "vuex";


//todo:  请使用submitPlaceOrder接口作为下生产订单的接口
import { add,update,infoById,submitPlaceOrder} from '@/api/saleOrder' //补丁


export default {
  components: {
    BomDialog,
    UploadExcelComponent,
    DateIntervals: () => import('@/components/DateIntervals'),
    Pagination: () => import('@/components/Pagination'),
    BomNoSelect: () => import('@/components/Item/BomNo')
  },
  data() {
    return {


      /////////////////////////////////下订单弹窗/////////////////////////////////////////////////
      placeDialogVisible: false,
      placeForm: {
        deliverTime: '',
        bizType: '',
        orderNo: '',
        saleId: '',
        orderedNum: 1 // 默认下单数量
      },
      placeRules: {
        deliverTime: [{ required: true, message: '请选择交期', trigger: 'change' }],
        bizType: [{ required: true, message: '请选择优先级', trigger: 'change' }]
      },


      //////////////////////////////////////////////////////////////////////////////////

      bomDialogVisible: false, //bom弹窗

      queryParams: {
        params: {
          canPlace: '01'
        },
        page: {
          page_num: 1,
          page_size: 10
        }
      },
      dialogVisible1: false,
      canPlaceList: [
        {code: '01', name: '可下单'},
        {code: '00', name: '不可下单'}
      ],
      locationList: [],
      loading: false,
      selectList: [],
      multipleSelection: [],
      form: {},
      pageTotal: 0,
      pageList: [],
      title: '',
      dialogShow: false,
      buttonShow: false,
      currentHour: null,
      rules: {
        custName: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
        itemNo: [{ required: true, message: '请选择产品', trigger: 'change' }],
        needNum: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          { type: 'number', min: 1, max: 100, message: '数量必须为1-100的整数', trigger: 'blur' }
        ]
      },

    }
  },
  created() {
    const user = localStorage.getItem('user_info');
    const name = JSON.parse(user).userName;
    this.buttonShow = true;
    // if(name ==='admin'){
    //   this.buttonShow = true;
    // }else{
    //   this.currentHour = new Date().getHours();
    //   if(this.currentHour === 18 || this.currentHour === 19 || this.currentHour === 20 || this.currentHour === 21){
    //     this.buttonShow = true;
    //   }
    // }
    this.getSelectOption()
    this.getData()
  },
  methods: {


    /////////////////////////////////下订单弹窗/////////////////////////////////////////////////

    // 打开弹窗并设置初始数据
    openPlaceDialog(row) {
      this.placeForm = {
        deliverTime: '',
        bizType: '',
        orderNo: row.orderNo,
        saleId: row.id,
        orderedNum: row.waitOrderedNum || row.needNum || 1
      }
      this.placeDialogVisible = true
    },

// 表单提交逻辑
    submitPlaceOrderHandler() {
      this.$refs.placeFormRef.validate(valid => {
        if (!valid) return
        const payload = [ { ...this.placeForm } ]
        submitPlaceOrder(payload).then(res => {
          this.$message.success(res.msg || '提交成功')
          this.placeDialogVisible = false
          this.getData()
        }).catch(err => {
          this.$message.error(err.msg || '提交失败')
        })
      })
    },

// 清空表单
    resetPlaceForm() {
      this.placeForm = {
        deliverTime: '',
        bizType: '',
        orderNo: '',
        saleId: '',
        orderedNum: 1
      }
      this.$refs.placeFormRef && this.$refs.placeFormRef.clearValidate()
    },


    ///////////////////////////////// /////////////////////////////////////////////////

    /** bom弹窗 */
    openBomDialog() {
      this.bomDialogVisible = true
    },
    /** bom弹窗 */
    onBomSelected(itemNo,itemName) {
      this.form.itemNo = itemNo
      this.form.itemName = itemName // ✅ 回填产品名称

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
    getSelectOption() {
    },
    /** 重置操作表单 */
    handleReset() {
      this.queryParams = {
        page: {
          page_num: 1,
          page_size: 10
        },
        params: {
          itemType: "01"
        }
      }
      this.$refs.userInfoDateIntervals.initDateData()
      this.getData()
    },
    getData() {
      salesPageList(this.queryParams).then(res => {
        this.pageList = res.data
        // this.pageTotal = Number(res.page.total_num)
        this.pageTotal = Number(res.page?.total_num || 0)  //todo: 错误提醒未解析的变量 page

      })
    },
    handleAdd() {
      this.title = '新增'
      this.form = {
        orderNo: this.genOrderNo(), // 自动生成单号
        custName: '',
        itemNo: '',
        needNum: 1
      }
      this.dialogShow = true
    },
    // 新增 genOrderNo() 方法（本地模拟销售单号）
    genOrderNo() {
      const now = new Date()
      const ymd = now.getFullYear().toString()
        + String(now.getMonth() + 1).padStart(2, '0')
        + String(now.getDate()).padStart(2, '0')
      const rand = Math.floor(Math.random() * 9000) + 1000
      return ymd + rand
    },

    handleUpdate(row) {
      infoById(
         {
          id: row.id
        }
      ).then(res => {
        this.form = res.data
        this.dialogShow = true
      })

      this.title = '编辑'
    },
    downLoadTemplate() {
      let url = '/api/sales/sale_order/down_temp'
      get_new_export(url, {
        page: {page_num: 1, page_size: 1},
        params: {}
      })
    },
    handleDelete(row) {
      this.$confirm('确认要删除数据吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteSales({
            params: {
              list: [row.id]
            }
          }).then(res => {
            this.getData()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
        })
        .then(() => {
        })
    },
    // 增强 submitForm() 方法支持“新增模式”调用后端接口
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) return

        const sale = {
          custName: this.form.custName,
          itemNo: this.form.itemNo,
          needNum: this.form.needNum
        }

        if (this.title === '新增') {
          add(sale).then(() => {
            this.$message.success('新增成功')
            this.dialogShow = false
            this.getData()
          })
        } else {
          update({ ...sale, id: this.form.id }).then(() => {
            this.$message.success('修改成功')
            this.dialogShow = false
            this.getData()
          })
        }
      })
    },
    exportOrder() {
      if (this.selectList.length == 0) {
        this.$message.error('请勾选要导出的订单')
        return
      }
      get_new_export('/api/sales/sale_order/export_order', {
        page: {page_num: 1, page_size: 1},
        params: {list: this.selectList}
      })
    },
    async handleSuccess(file, type) {
      let res
      this.$refs.uploadGong.loading = false
      console.log(file)
      res = await sales_import_order(file)

      if (res) {
        this.$message({
          type: 'success',
          message: '导入成功'
        })
        this.getData()
      }
    },
    cancel() {
      this.dialogShow = false
      this.form = {}
      this.$refs['form'].clearValidate()
    },
    handlePlace(row) {
      this.toPlaces([row.id])
    },
    handlePlaces() {
      this.toPlaces(this.selectList)
    },
    toPlaces(ids) {
      if (ids.length == 0) {
        this.$message.error('请勾选订单数据')
        return
      }
      this.$router.push({
        name: 'placeProductionOrder',
        query: {
          id: JSON.stringify(ids)
        }
      })
    },
    handleDetail(row) {
      // this.toDetails([row.id])
      this.toDetails([row.orderNo]) // ✅ 改为传 orderNo
    },
    toDetails(orderNos) {
      this.$router.push({
        name: 'salesApprovalDetails',
        query: {
          id: JSON.stringify(orderNos)
        }
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


::v-deep(.el-dialog__header) {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  overflow: hidden;
}


</style>
