<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
      <el-form-item label="图纸号" class="condition">
        <BomNoSelect :item-no.sync="queryParams.params.itemNo"/>
      </el-form-item>
      <el-form-item label="出入库" class="condition">
        <el-select
          v-model="queryParams.params.bizType"
          clearable
          placeholder="请选择类型"
          style="width:140px;"
          filterable
        >
          <el-option
            :key="dict.code"
            v-for="(dict) in typeList"
            :label="dict.name"
            :value="dict.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="确认状态" class="condition">
        <el-select
          v-model="queryParams.params.storeStatus"
          clearable
          placeholder="请选择状态"
          style="width:140px;"
          filterable
        >
          <el-option
            :key="dict.code"
            v-for="(dict) in statusList"
            :label="dict.name"
            :value="dict.code"
          ></el-option>
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
    <el-row class="mb8" v-if="hasPerm('B006007000001')">
      <el-button type="primary" class="commen-button" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </el-row>
    <el-table :data="pageList" class="commen-table mt_20">
      <el-table-column type="index" width="55" label="序号"/>
      <el-table-column label="图纸号" align="center" prop="bomNo"/>
      <el-table-column label="产品编码" align="center" prop="itemNo"/>
      <el-table-column label="产品名称" align="center" prop="itemName"/>
      <el-table-column label="出入库" align="center" prop="bizTypeDesc"/>
      <el-table-column label="申请数量" align="center" prop="itemCount"/>
      <el-table-column label="状态" align="center" prop="storeStatusDesc"/>
      <el-table-column label="申请数量" align="center" prop="itemCount"/>
      <el-table-column label="申请数量" align="center" prop="itemCount">
        <template slot-scope="scope">
          <template>{{scope.row.autoFlag =="01" ? "领料":"手动"}}</template>
        </template>
      </el-table-column>
      <el-table-column label="确认时间" align="center" prop="confirmTime"/>
      <el-table-column label="创建时间" align="center" prop="createdTime"/>
      <el-table-column label="操作" align="center" width="310" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- 确认后不能编辑和删除 -->
          <el-button
            link
            type="primary"
            v-if="hasPerm('B006007000002')"
            icon="Edit"
            @click="handleUpdate(scope.row)"
          >编辑
          </el-button>
          <el-button
            link
            type="primary"
            v-if="hasPerm('B006007000003')"
            icon="Delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    <pagination style="text-align: right" v-show="pageTotal>0" :total="pageTotal" :page.sync="queryParams.page.page_num" :limit.sync="queryParams.page.page_size"-->
    <!--                @pagination="getData" />-->
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
        <el-form-item label="图纸号" prop="itemNo">
          <BomNoSelect :item-no.sync="form.itemNo"/>
        </el-form-item>
        <el-form-item prop="itemCount" label="申请数量">
          <el-input-number v-model="form.itemCount" :precision="3" :controls="false" :min="0"/>
        </el-form-item>
        <el-form-item label="出入库" prop="bizType">
          <el-select
            v-model="form.bizType"
            clearable
            placeholder="请选择类型"
            style="width:140px;"
            filterable
          >
            <el-option
              :key="dict.code"
              v-for="(dict) in typeList"
              :label="dict.name"
              :value="dict.code"
            ></el-option>
          </el-select>
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
import { dictInfo } from '@/api/common'
import {
  addStore,
  deleteStore,
  detailStore,
  storePageList,
  updateStore
} from '@/api/inout/store'

  export default {
    components: {
      DateIntervals: () => import('@/components/DateIntervals'),
      Pagination: () => import('@/components/Pagination'),
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
        typeList: [],
        statusList: [],
        title: '',
        dialogShow: false,
        rules: {
          itemNo: [{required: true, message: '请输入图纸号', trigger: 'blur'}],
          itemCount: [{required: true, message: '请输入数量', trigger: 'blur'}],
          bizType: [{required: true, message: '请选择出入库', trigger: 'blur'}]
        }
      }
    },
    created() {
      this.getOptionData()
      this.getData()
    },
    methods: {
      getOptionData() {
        dictInfo('STOCK_TYPE', r => (this.typeList = r))
        dictInfo('CONFIRM_STATUS', r => (this.statusList = r))
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
        storePageList(this.queryParams).then(res => {
          this.pageList = res.data
          this.pageTotal = Number(res.page.total_num)
        })
      },
      handleAdd() {
        this.title = '新增'
        this.dialogShow = true
      },
      handleUpdate(row) {
        detailStore({
          params: {
            id: row.id
          }
        }).then(res => {
          this.form = res.data
          this.dialogShow = true
        })

        this.title = '编辑'
      },
      handleDelete(row) {
        this.$confirm('确认要删除数据吗?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deleteStore({
              params: {
                id: row.id
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
              updateStore({
                params: this.form
              }).then(res => {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.getData()
              })
            } else {
              addStore({params: this.form}).then(res => {
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
                this.getData()
              })
            }
            this.dialogShow = false
          }
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
