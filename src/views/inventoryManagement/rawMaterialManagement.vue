<template>
  <div class="app-container">

<!--    搜索框-->
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
      <el-form-item label="物料编码" class="condition">
        <el-input v-model="queryParams.params.itemNo" placeholder="请输入编码" clearable/>
      </el-form-item>
      <el-form-item label="物料名称" class="condition">
        <el-input v-model="queryParams.params.itemName" placeholder="请输入名称" clearable/>
      </el-form-item>
      <el-form-item label="来源" class="condition">
        <el-select v-model="queryParams.params.itemOrigin" placeholder="请选择物料来源" clearable>
          <el-option
            v-for="dict in itemOriginList"
            :key="dict.code"
            :label="dict.name"
            :value="dict.code"
          />
        </el-select>
      </el-form-item>
<!--      <el-form-item label="库位" class="condition">-->
<!--        <el-select v-model="queryParams.params.location" placeholder="请选择物料库位" clearable>-->
<!--          <el-option-->
<!--            v-for="dict in locationList"-->
<!--            :key="dict.code"-->
<!--            :label="dict.name"-->
<!--            :value="dict.code"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item label="类型" class="condition">
        <el-select v-model="queryParams.params.itemType" placeholder="请选择物料类型" clearable>
          <el-option
            label="物料"
            :value="'00'"
          />
          <el-option
            label="BOM"
            :value="'01'"
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


<!--    工具栏-->
    <el-row class="flex_row pb_10 c_b fw_bold fs_24">

      <el-button type="primary" class="commen-button" icon="el-icon-plus" @click="handleAdd">新增</el-button>
<!--      <upload-excel-component-->
<!--        text="物料导入"-->
<!--        :on-success="handleSuccess"-->
<!--        class="ml_20"-->
<!--        :loading="loading"-->
<!--        ref="uploadGong"-->
<!--      />-->
      <!-- 完全隐藏但仍可点击的NEW按钮 -->
      <upload-excel-component
        text="物料导入NEW"

        :on-success="handleSuccessNew"
        class="invisible-white-btn"
        :loading="loading"
        ref="uploadGong"
      />
      <div
        @click="downLoadTemplate()"
        style="color:#3145ec;font-size:14px;float:right;z-index:999;position:absolute;right:0px;top:16px;"
      >
        <span style="cursor:pointer;">下载模版</span>
      </div>
    </el-row>


<!--    列表-->
    <el-table :data="pageList" class="commen-table mt_20">
      <el-table-column type="index" width="55" label="序号"></el-table-column>
      <el-table-column label="物料编码" align="center" prop="itemNo"/>
      <el-table-column label="物料名称" align="center" prop="itemName"/>
      <el-table-column label="型号" align="center" prop="itemModel"/>
      <el-table-column label="来源" align="center" prop="itemOrigin"/>
      <el-table-column label="库存量" align="center" prop="itemCount"/>
      <el-table-column label="单位" align="center" prop="itemMeasure"/>
      <el-table-column label="库位" align="center" prop="locationDesc"/>
      <el-table-column label="创建时间" align="center" prop="createdTime"/>
      <el-table-column label="操作" align="center" width="310" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- 确认后不能编辑和删除 -->
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
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


    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="dialogShow" width="960px" @close="beforeClose">
      <el-form :model="form" class="commen-form" :rules="rules" ref="form" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="itemNo" label="物料编码">
              <el-input v-model="form.itemNo" :disabled="form.id"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="itemName" label="物料名称">
              <el-input v-model="form.itemName"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="itemModel" label="规格型号">
              <el-input v-model="form.itemModel"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item prop="itemOrigin" label="物料来源">
              <el-select v-model="form.itemOrigin" placeholder="请选择物料来源" clearable>
                <el-option
                  v-for="dict in itemOriginList"
                  :key="dict.code"
                  :label="dict.name"
                  :value="dict.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="location" label="库位">
              <el-select v-model="form.location" placeholder="请选择物料库位" clearable>
                <el-option
                  v-for="dict in locationList"
                  :key="dict.code"
                  :label="dict.name"
                  :value="dict.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="itemCount" label="数量">
              <el-input-number v-model="form.itemCount" :precision="3" :controls="false" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="itemMeasure" label="单位">
              <el-input v-model="form.itemMeasure"/>
            </el-form-item>
          </el-col>
        </el-row>

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
  addStock,
  deleteStock,
  detailStock,
  stockPageList,
  updateStock,
  uploadStock, uploadStockNew
} from '@/api/item/itemStock'
  import {getWarehouseSelected} from '@/api/item/warehouse'
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'
  import {get_new_export} from '@/api/common'

  export default {
    components: {
      UploadExcelComponent,
      DateIntervals: () => import('@/components/DateIntervals'),
      Pagination: () => import('@/components/Pagination')
    },
    data() {
      return {
        // 新增状态控制
        showNewImport: false,
        queryParams: {
          params: {
            itemType: '00' // 默认物料类型
          },
          page: {
            page_num: 1,
            page_size: 10
          }
        },
        itemOriginList: [
          {code: '自制', name: '自制'},
          {code: '采购', name: '采购'}
        ],
        locationList: [],
        loading: false,

        form: {},
        pageTotal: 0,
        pageList: [],
        title: '',
        dialogShow: false,
        rules: {
          itemNo: [{required: true, message: '请输入编码', trigger: 'blur'}],
          itemName: [{required: true, message: '请输入备注', trigger: 'blur'}],
          itemOrigin: [
            {required: true, message: '请选择物料来源', trigger: 'blur'}
          ],
          itemCount: [
            {required: true, message: '请选择物料数量', trigger: 'blur'}
          ],
          itemMeasure: [
            {required: true, message: '请选择物料单位', trigger: 'blur'}
          ],
          location: [{required: true, message: '请选择库位', trigger: 'blur'}]
        }
      }
    },
    created() {
      this.getSelectOption()
      this.queryParams.params.itemType = '00'
      this.getData()

    },
    methods: {

      // 新增方法：控制NEW按钮显示3秒
      toggleNewImportButton() {
        this.showNewImport = true
        setTimeout(() => {
          this.showNewImport = false
        }, 2000) // 3秒后自动隐藏
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
        getWarehouseSelected().then(res => {
          this.locationList = res.data
        })
      },
      /** 重置操作表单 */
      handleReset() {


        // this.toggleNewImportButton()
        this.showNewImport = true

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
        // this.queryParams.params.itemType = '00'
        stockPageList(this.queryParams).then(res => {
          this.pageList = res.data
          this.pageTotal = Number(res.page.total_num)
        })
      },
      handleAdd() {
        this.title = '新增'
        this.dialogShow = true
      },
      handleUpdate(row) {
        detailStock({
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
        let url = '/api/item/mes_item_stock/down_temp'
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
            deleteStock({
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
              updateStock({
                params: this.form
              }).then(res => {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.getData()
              })
            } else {
              this.form.itemType = '00'
              addStock({params: this.form}).then(res => {
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
      async handleSuccess(file) {
        let res = await uploadStock(file)
        this.$refs.uploadGong.loading = false
        if (res) {
          this.$message({
            type: 'success',
            message: '导入成功'
          })
          this.getData()
        }
      },

      // 无聊导入 new
      // 修改位置：handleSuccessNew 方法
      async handleSuccessNew(file) {
        let res = await uploadStockNew(file)
        this.$refs.uploadGong.loading = false
        if (res && res.code === 0) {
          // 优化提示逻辑
          const { successList = [], failList = [] } = res.data || {}
          // 1. 成功
          if (successList.length > 0) {
            this.$message({
              type: 'success',
              message: `成功导入${successList.length}条：${successList.join('、')}`
            })
          }
          // 2. 失败
          if (failList.length > 0) {
            // 支持多条失败原因
            let failMsg = failList.map((f, idx) =>
              `序号${idx + 1}：${f.itemNo ? `物料编码【${f.itemNo}】` : ''}，原因：${f.reason}`
            ).join('<br>')
            this.$alert(
              `<div style="max-height:500px;overflow:auto;text-align:left;">${failMsg}</div>`,
              `导入失败${failList.length}条，详情如下：`,
              { dangerouslyUseHTMLString: true }
            )
          }
          // 3. 都为空
          if (successList.length === 0 && failList.length === 0) {
            this.$message({ type: 'info', message: res.msg || '导入完成' })
          }
          this.getData()
        } else {
          this.$message({ type: 'error', message: res && res.msg ? res.msg : '导入失败' })
        }
      }      ,

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


  //完全隐藏但仍可点击
  .invisible-btn {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .invisible-white-btn {
    background: #ffffff;
    border: none !important;
    color: #ffffff;
    margin-left: 20px;
    padding: 12px 10px;
  }

</style>
