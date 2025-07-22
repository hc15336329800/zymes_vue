<!--bom列表-->
<template>
  <div class="app-container">

<!--    搜索框-->
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
      <el-form-item label="BOM号" class="condition">
        <BomNoSelect :item-no.sync="queryParams.params.bomNo" />
      </el-form-item>


      <el-form-item label="物料号" class="condition">
        <ItemNoSelect :item-no.sync="queryParams.params.itemNo" />
      </el-form-item>

      <el-form-item label="产品名称" class="condition">
        <el-input v-model="queryParams.params.itemName" placeholder="请输入名称" clearable />
      </el-form-item>
      <el-form-item label="库位" class="condition">
        <el-select v-model="queryParams.location" placeholder="请选择产品库位" clearable>
          <el-option
            v-for="dict in locationList"
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


<!--    工具栏-->
    <el-row class="flex_row pb_10 c_b fw_bold fs_24">
      <el-button
        type="primary"
        icon="el-icon-plus"
        v-if="hasPerm('B002004000001')"
        @click="handleAdd()"
      >新增
      </el-button>

      <upload-excel-component
        text="工序导入"
        v-if="hasPerm('B002004000004')"
        :on-success="uploadProcedureSuccess"
        class="ml_20"
        :loading="loading"
        ref="uploadGong"
      />



      <!--       ==================== 上传相关 ====================-->


      <!-- 上传控件    v-if="showNewImport"-->
      <el-upload
        action="#"
        :show-file-list="false"
        :http-request="doUpload">
        <el-button size="mini" type="primary" style="margin-left: 20px; margin-right: 20px">用料导入NEW</el-button>
      </el-upload>

      <!--      ==================== 手动同步相关 ====================-->

      <!-- 外部同步bom -->
      <el-button
        v-if="showNewImport"
        type="primary"
        icon="el-icon-plus"
         @click="confirmSyncErpToMes"
      >外部同步bom和工序
      </el-button>




      <!-- 新增：外部同步时间选择 -->
      <el-date-picker
        v-if="showNewImport"
        v-model="syncTime"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择同步时间"
        size="mini"
        style="margin-left: 10px;width:150px;"
      ></el-date-picker>

      <!-- 内部同步bom -->
      <el-button
        v-if="showNewImport"
        type="primary"
        icon="el-icon-plus"
        @click="confirmInnerSyncBom"
      >内部同步bom和工序（2025-03-19）
      </el-button>




        <el-input       v-if="showNewImport" v-model="syncItemNo" placeholder="请输入 itemNo 号" clearable size="mini" style="width:150px;" />

      <el-input       v-if="showNewImport" v-model="syncBomNo" placeholder="请输入 BOM 号" clearable size="mini" style="width:150px;" />


        <el-button    v-if="showNewImport"  size="mini" type="primary" @click="handleInnerSyncBomByItem">内部同步bom和工序（按物料）</el-button>








      <div
        @click="dialogVisible1=true"
        style="color:#3145ec;font-size:14px;float:right;z-index:999;position:absolute;right:0px;top:16px;"
      >
        <span style="cursor:pointer;">下载模版</span>
      </div>
    </el-row>


<!--    列表-->
    <el-table :data="pageList" class="commen-table mt_20">
      <el-table-column type="index" width="55" label="序号"></el-table-column>
      <el-table-column label="Bom号" align="center" prop="bomNo" />
      <el-table-column label="物料号" align="center" prop="itemNo" />
      <!--      <el-table-column label="产品编码" align="center" prop="itemNo"/>-->
      <el-table-column label="产品名称" align="center" prop="itemName" />
      <el-table-column label="型号" align="center" prop="itemModel" />
      <el-table-column label="来源" align="center" prop="itemOrigin" />
      <el-table-column label="库存量" align="center" prop="itemCount" />
      <el-table-column label="净重" align="center" prop="netWeight" />
      <el-table-column label="单位" align="center" prop="itemMeasure" />
      <el-table-column label="库位" align="center" prop="locationDesc" />
      <el-table-column label="创建时间" align="center" prop="createdTime" />
      <el-table-column label="操作" align="center" width="320" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- 确认后不能编辑和删除 -->
          <el-button link type="primary" icon="Edit" @click="handleDetail(scope.row)">工序详情</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUsedDetail(scope.row)">用料详情</el-button>
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
            <el-form-item prop="bomNo" label="图纸号">
              <el-input v-model="form.bomNo" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="itemNo" label="产品编码">
              <el-input v-model="form.itemNo" :disabled="form.id" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="itemName" label="产品名称">
              <el-input v-model="form.itemName" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item prop="itemModel" label="规格型号">
              <el-input v-model="form.itemModel" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="itemOrigin" label="产品来源">
              <el-select v-model="form.itemOrigin" placeholder="请选择产品来源" clearable>
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
              <el-select v-model="form.location" placeholder="请选择产品库位" clearable>
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
            <el-form-item prop="itemCount" label="库存量">
              <el-input-number v-model="form.itemCount" :precision="3" :controls="false" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="netWeight" label="净重">
              <el-input-number v-model="form.netWeight" :precision="3" :controls="false" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="itemMeasure" label="单位">
              <el-input v-model="form.itemMeasure" />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="dialog-footer" style="text-align: center;width:100%;">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog title="选择模板" :visible.sync="dialogVisible1" width="300px" top="10vh">
      <div>
        <div class="template-list">
          <div>
            工序模板
            <span
              style="color:#3145ec;"
              @click="downLoadTemplate('/api/item/mes_procedure/down_proc_temp')"
            >下载</span>
          </div>
          <div>
            用料模板
            <span
              style="color:#3145ec;"
              @click="downLoadTemplate('/api/item/mes_item_use/down_use_temp')"
            >下载</span>
          </div>
        </div>
        <div class="w_100 flex_row flex_x_center">
          <el-button type="primary" plain class="ml_20" @click="dialogVisible1=false">关闭</el-button>
        </div>
      </div>
    </el-dialog>


  </div>
</template>
<script>
import { addStock, bomPageList, deleteStock, detailStock, updateStock } from '@/api/item/itemStock'
import { getWarehouseSelected } from '@/api/item/warehouse'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { get_new_export } from '@/api/common'
import { uploadProcedure } from '@/api/item/mesProcedure'
import {
  refreshBomTree,
  uploadUsed,
  uploadUsedNew,
  innerSyncBom,
  syncErpToMes,
  innerSyncBomItem
} from '@/api/item/mesItemUsed' // 路径按实际调整


export default {
  components: {
    UploadExcelComponent,
    DateIntervals: () => import('@/components/DateIntervals'),
    Pagination: () => import('@/components/Pagination'),
    BomNoSelect: () => import('@/components/Item/BomNo'),
    ItemNoSelect: () => import('@/components/Item/ItemNo')
  },
  data() {
    return {

      // syncTime: '', // 新增：同步时间参数
      syncTime: this.formatNowTime(), // 新增：默认当前时间


      // 新增状态控制
      showNewImport: false,

      syncItemNo: '0', // 新增：同步物料号
      syncBomNo: '0', // 新增：同步BOM号


      // ==================== 上传相关 ====================

      rootItemNo: '',     // 这里可手输或上传成功后再填写
      canGen: false,


      // ==================== 旧 ====================


      queryParams: {
        params: {},
        page: {
          page_num: 1,
          page_size: 10
        }
      },
      itemOriginList: [
        { code: '自制', name: '自制' },
        { code: '采购', name: '采购' }
      ],
      locationList: [],
      loading: false,
      dialogVisible1: false,
      form: {},
      pageTotal: 0,
      // pageList: {},
      pageList: [],
      title: '',
      dialogShow: false,
      rules: {
        bomNo: [{ required: true, message: '请输入图纸号', trigger: 'blur' }],
        itemNo: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        itemName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        itemOrigin: [
          { required: true, message: '请选择产品来源', trigger: 'blur' }
        ],
        itemCount: [
          { required: true, message: '请选择产品数量', trigger: 'blur' }
        ],
        netWeight: [
          { required: true, message: '请选择产品净重', trigger: 'blur' }
        ],
        itemMeasure: [
          { required: true, message: '请选择产品单位', trigger: 'blur' }
        ],
        location: [{ required: true, message: '请选择库位', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getSelectOption()
    this.getData()
  },
  methods: {

    // 构建当前时间
    formatNowTime() {
      const date = new Date()
      const Y = date.getFullYear()
      const M = (date.getMonth() + 1).toString().padStart(2, '0')
      const D = date.getDate().toString().padStart(2, '0')
      const h = date.getHours().toString().padStart(2, '0')
      const m = date.getMinutes().toString().padStart(2, '0')
      const s = date.getSeconds().toString().padStart(2, '0')
      return `${Y}-${M}-${D} ${h}:${m}:${s}`
    },

// ==================== 同步相关  ====================

    // 新增：外部同步时弹窗输入密码，验证通过后调用原方法
    confirmSyncErpToMes() {
      this.$prompt('请输入同步密码', '外部同步 ERP 验证', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'password',
        inputValidator: (value) => {
          if (value === '135896') {
            return true;
          } else {
            return '密码错误';
          }
        }
      }).then(({ value }) => {
        // 密码正确，调用原同步方法
        this.syncErpToMes();
      }).catch(() => {
        this.$message.info('已取消同步操作');
      });
    },


    //  内部同步工序和用料（根据物料号）
    async handleInnerSyncBomByItem() {
      if (!this.syncItemNo) {
        this.$message.warning('请先选择物料号');
        return;
      }
      if (!this.syncBomNo) {
        this.$message.warning('请先选择 BOM 号');
        return;
      }

      try {
        this.loading = true;
        let intervalFlag = setInterval(() => {
          this.$message.info('操作正在进行中，请耐心等待...');
        }, 5000);

        await innerSyncBomItem({
          ItemNo: this.syncItemNo,
          bomNo: this.syncBomNo
        });

        this.$message.success('内部同步（按物料）完成');
        this.getData();
        this.loading = false;

        clearInterval(intervalFlag);
      } catch (e) {
        this.$message.error('内部同步（按物料）失败');
        this.loading = false;
      } finally {
        if (intervalFlag) clearInterval(intervalFlag);  // 保证清理
        this.loading = false;
      }
    },

    confirmInnerSyncBom() {
      this.$prompt('请输入同步密码', '内部同步 ERP 验证', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'password',
        inputValidator: (value) => {
          if (value === '135896') {
            return true;
          } else {
            return '密码错误';
          }
        }
      }).then(({ value }) => {
        // 密码正确，调用原同步方法
        this.innerSyncBom();
      }).catch(() => {
        this.$message.info('已取消同步操作');
      });
    },



    // 内部同步
    async innerSyncBom() {
      this.loading = true
      let intervalFlag = null
      try {
        // 每隔 10 秒提醒一次
        intervalFlag = setInterval(() => {
          this.$message.info('操作正在进行中，请耐心等待...')
        }, 5000)

        await innerSyncBom({
          syncTime: this.syncTime, // 新增：传入选中的时间参数
        })
        this.$message.success('内部同步 BOM 完成')
        this.getData()
      } catch (e) {
        this.$message.error('内部同步 BOM 失败')
      } finally {
        clearInterval(intervalFlag)
        this.loading = false
      }
    },
    //   外部同步
    async syncErpToMes() {
      this.loading = true
      let intervalFlag = null
      try {
        intervalFlag = setInterval(() => {
          this.$message.info('操作正在进行中，请耐心等待...')
        }, 5000)


        // 最小改动：增加时间参数传递
        await syncErpToMes({
          syncTime: this.syncTime // 新增：传入选中的时间参数
        })

        // await syncErpToMes()
        this.$message.success('外部同步 BOM 完成')
        this.getData()
      } catch (e) {
        this.$message.error('外部同步 BOM 失败')
      } finally {
        clearInterval(intervalFlag)
        this.loading = false
      }
    },



    // ==================== 上传相关  ====================
    // 上传  - 只支持 .xlsx
    doUpload(param) {

      const fd = new FormData()
      fd.append('file', param.file)   // 仍然取 param.file


      uploadUsedNew(fd).then(res => {
        this.$message.success(res.msg || '用料导入成功')
        this.canGen = true                    // 启用“生成树”按钮
      }).catch(() => {                 // 便于调试
        this.$message.error('上传失败')
      })
    },

    // 生成 BOM 树
    doGenTree() {
      if (!this.rootItemNo) {
        this.$message.error('请先填写根物料编码')
        return
      }
      refreshBomTree([this.rootItemNo]).then(() => {
        this.$message.success('BOM 树已生成')
        this.canGen = false
      })
    },

    // ====================  ====================

    // 新增方法：控制NEW按钮显示3秒
    toggleNewImportButton() {
      this.showNewImport = true
      setTimeout(() => {
        this.showNewImport = false
      }, 2000) // 3秒后自动隐藏
    },

    uploadProcedure,
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
    handleDetail(row) {
      this.$router.push({
        name: 'BOMDetail',
        query: {
          id: row.id,
          itemNo: row.itemNo,
          bomNo: row.bomNo,
          itemName: row.itemName
        }
      })
    },
    handleUsedDetail(row) {
      this.$router.push({
        name: 'itemUsedDetail',
        query: {
          id: row.id,
          itemNo: row.itemNo,
          itemName: row.itemName
        }
      })
    },
    /** 重置操作表单 */
    handleReset() {
      this.showNewImport = true,  //隐藏

        this.queryParams = {
          page: {
            page_num: 1,
            page_size: 10
          },
          params: {}
        }
      // this.$refs.userInfoDateIntervals.initDateData()  //日期区间筛选
      this.getData()
    },
    getData() {
      this.queryParams.params.itemType = '01'
      bomPageList(this.queryParams).then(res => {
        // this.pageList = res.data
        // 确保拿到的 data 是 Array，再赋值给 pageList
        this.pageList = Array.isArray(res.data) ? res.data : (res.data.list || [])
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
    downLoadTemplate(url) {
      get_new_export(url, {
        page: { page_num: 1, page_size: 1 },
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
            this.form.itemType = '01'
            addStock({ params: this.form }).then(res => {
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
    async uploadUsedSuccess(file) {
      let res = await uploadUsed(file)
      this.$refs.uploadGong.loading = false
      if (res) {
        this.$message({
          type: 'success',
          message: '导入成功'
        })
        this.getData()
      }
    },
    async uploadProcedureSuccess(file) {
      let res = await uploadProcedure(file)
      this.$refs.uploadYong.loading = false
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

.template-list > div {
  border: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  height: 32px;
  align-items: center;
  padding: 0 5px;
  border-radius: 3px;
  margin-bottom: 10px;
  cursor: pointer;

  &:hover {
    background-color: #eee;
    color: #000;
  }
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
