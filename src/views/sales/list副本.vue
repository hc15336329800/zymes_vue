<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
      <el-form-item label="订单号" class="condition">
        <el-input v-model="queryParams.params.orderNo" placeholder="请输入订单号" clearable/>
      </el-form-item>
      <el-form-item label="客户" class="condition">
        <el-input v-model="queryParams.params.custName" placeholder="请输入名称" clearable/>
      </el-form-item>
      <el-form-item label="图纸号" class="condition">
        <BomNoSelect :item-no.sync="queryParams.params.itemNo"/>
      </el-form-item>
      <el-form-item label="是否可下单" class="condition">
        <el-select v-model="queryParams.params.canPlace" placeholder="请选择下单状态" clearable>
          <el-option
            v-for="dict in canPlaceList"
            :key="dict.code"
            :label="dict.name"
            :value="dict.code"
          />
        </el-select>
      </el-form-item>
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
      <el-table-column label="图纸号" align="center" prop="bomNo"/>
      <el-table-column label="客户" align="center" prop="custName"/>
      <el-table-column label="产品名称" align="center" prop="itemNamelist.vue"/>
      <el-table-column label="需求数量" align="center" prop="needNum"/>
      <el-table-column label="已下单数量" align="center" prop="orderedNum"/>
      <el-table-column label="待下单数量" align="center" prop="waitOrderedNum"/>
      <el-table-column label="工序名称" align="center" prop="procedureName"/>
      <el-table-column label="创建时间" align="center" prop="createdTime"/>
      <el-table-column label="操作" align="center" width="310" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- 确认后不能编辑和删除 -->
          <el-button link type="primary" icon="Edit" @click="handlePlace(scope.row)">下生产单</el-button>
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
    <!-- 下达 -->
    <el-dialog
      title="编辑销售订单"
      :visible.sync="dialogShow"
      width="460px"
      top="10vh"
      @close="beforeClose"
    >
      <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="关联客户">
            <el-input v-model="form.custName" :disabled="true"/>
          </el-form-item>
          <el-form-item label="图纸号" prop="bomNo">
            <BomNoSelect :item-no.sync="form.itemNo" :disabled="true"/>
          </el-form-item>
          <el-form-item label="需求数量" prop="needNum">
            <el-input v-model="form.needNum"/>
          </el-form-item>
        </el-form>
        <div class="w_100 flex_row flex_x_center">
          <el-button @click="cancel('dialogVisible1')">取消</el-button>
          <el-button type="primary" plain class="ml_20" @click="submitForm()">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'
  import {get_new_export} from '@/api/common'
  import {
    deleteSales,
    detailSales,
    salesPageList,
    updateSales
  } from '@/api/sales/sales'
  import {sales_import_order} from '@/api/sales'
  import {mapGetters} from "vuex";

  export default {
    components: {
      UploadExcelComponent,
      DateIntervals: () => import('@/components/DateIntervals'),
      Pagination: () => import('@/components/Pagination'),
      BomNoSelect: () => import('@/components/Item/BomNo')
    },
    data() {
      return {
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
          needNum: [{required: true, message: '请输入数量', trigger: 'blur'}]
        }
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
          params: {}
        }
        this.$refs.userInfoDateIntervals.initDateData()
        this.getData()
      },
      getData() {
        salesPageList(this.queryParams).then(res => {
          this.pageList = res.data
          this.pageTotal = Number(res.page.total_num)
        })
      },
      handleAdd() {
        this.$router.push({
          name: 'addSaleList'
        })
      },
      handleUpdate(row) {
        detailSales({
          params: {
            id: row.id
          }
        }).then(res => {
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
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id) {
              updateSales({
                params: this.form
              }).then(res => {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.getData()
              })
            }
            this.dialogShow = false
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
        this.toDetails([row.id])
      },
      toDetails(ids) {
        this.$router.push({
          name: 'salesApprovalDetails',
          query: {
            id: JSON.stringify(ids)
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
</style>
