<template>
  <div class="app-container">
<!--    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">-->
<!--      <el-form-item label="物料编码" class="condition">-->
<!--        <el-input v-model="queryParams.params.itemNo" placeholder="请输入编码" clearable/>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="物料名称" class="condition">-->
<!--        <el-input v-model="queryParams.params.itemName" placeholder="请输入名称" clearable/>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="来源" class="condition">-->
<!--        <el-select v-model="queryParams.params.itemOrigin" placeholder="请选择物料来源" clearable>-->
<!--          <el-option-->
<!--            v-for="dict in itemOriginList"-->
<!--            :key="dict.code"-->
<!--            :label="dict.name"-->
<!--            :value="dict.code"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
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


<!--      <el-form-item class="commen-button">-->
<!--        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>-->
<!--      </el-form-item>-->
<!--      <el-form-item class="commen-button reset">-->
<!--        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>-->
<!--      </el-form-item>-->
<!--      <el-form-item></el-form-item>-->
<!--    </el-form>-->
    <el-row class="flex_row pb_10 c_b fw_bold fs_24">
<!--      <el-button type="primary" class="commen-button" icon="el-icon-plus" @click="handleAdd">新增</el-button>-->
      <upload-excel-component
        v-if="flag"
        text="物料导入"
        :on-success="handleSuccess"
        class="ml_20"
        :loading="loading"
        ref="uploadGong"
      />
      <el-button v-if="pageListCache.length>0" type="primary" class="commen-button" icon="el-icon-plus" @click="handleClean" style="margin-left: 20px">清空数据</el-button>

      <el-button v-if="flag" type="primary" class="commen-button" icon="el-icon-plus" style="margin-left: 20px" @click="handleHistory">导入记录</el-button>
      <el-button v-if="!flag" type="primary" class="commen-button" icon="el-icon-plus" style="margin-left: 20px" @click="flag = true">继续导入</el-button>

      <!--      <div-->
<!--        @click="downLoadTemplate()"-->
<!--        style="color:#3145ec;font-size:14px;float:right;z-index:999;position:absolute;right:0px;top:16px;"-->
<!--      >-->
<!--        <span style="cursor:pointer;">下载模版</span>-->
<!--      </div>-->
    </el-row>
    <template v-if="flag">
      <el-table :data="pageListCache" class="commen-table mt_20" key="0">
        <el-table-column type="index" width="55" label="序号"></el-table-column>
        <el-table-column label="表序号" align="center" prop="excelId"/>
        <el-table-column label="图号" align="center" prop="figureNumber"/>
        <el-table-column label="零件名称" align="center" prop="partName"/>
        <el-table-column label="零件尺寸" align="center" prop="partSize"/>
        <el-table-column label="数量" align="center" prop="number"/>
        <el-table-column label="切割长度" align="center" prop="cuttingLength"/>
        <el-table-column label="打标长度" align="center" prop="markingLength"/>
        <el-table-column label="蒸发去膜长度" align="center" prop="evaporationFilmLength"/>
  <!--      <el-table-column label="创建时间" align="center" prop=""/>-->
        <el-table-column label="操作" align="center" width="310" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <!-- 确认后不能编辑和删除 -->
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button v-if="pageListCache.length>0" type="primary" class="commen-button" icon="el-icon-plus" @click="handleAddInBulk" style="float: right">确定导入</el-button>
    </template>

    <template v-if="!flag">
      <el-table :data="pageList" class="commen-table mt_20" key="1">
        <el-table-column type="index" width="55" label="序号"></el-table-column>
        <el-table-column label="表序号" align="center" prop="excelId"/>
        <el-table-column label="图号" align="center" prop="figureNumber"/>

        <el-table-column label="零件名称" align="center" prop="partName"/>
        <el-table-column label="零件尺寸" align="center" prop="partSize"/>
        <el-table-column label="数量" align="center" prop="number"/>
        <el-table-column label="切割长度" align="center" prop="cuttingLength"/>
        <el-table-column label="打标长度" align="center" prop="markingLength"/>
        <el-table-column label="蒸发去膜长度" align="center" prop="evaporationFilmLength"/>
<!--        <el-table-column label="创建时间" align="center" prop="createdTime"/>-->
<!--        <el-table-column label="操作" align="center" width="310" class-name="small-padding fixed-width">-->
<!--          <template slot-scope="scope">-->
<!--            &lt;!&ndash; 确认后不能编辑和删除 &ndash;&gt;-->
<!--            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">编辑</el-button>-->
<!--            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
      <pagination
        style="text-align: right"
        v-show="pageTotal>0"
        :total="pageTotal"
        :page.sync="queryParams.page.page_num"
        :limit.sync="queryParams.page.page_size"
        @pagination="getData"
      />
    </template>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="dialogShow" width="960px" @close="beforeClose">
      <el-form :model="form" class="commen-form" :rules="rules" ref="form" label-width="140px">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="partName" label="零件名称">
              <el-input v-model="form.partName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="partSize" label="零件尺寸(mm*mm)">
              <el-input v-model="form.partSize"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="number" label="数量">
              <el-input v-model="form.number" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="cuttingLength" label="切割长度(m)">
              <el-input v-model="form.cuttingLength"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="markingLength" label="打标长度(m)">
              <el-input v-model="form.markingLength" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="evaporationFilmLength" label="蒸发去膜长度(m)">
              <el-input v-model="form.evaporationFilmLength"/>
            </el-form-item>
          </el-col>
        </el-row>
<!--        <el-row>-->
<!--          <el-col :span="8">-->
<!--            <el-form-item prop="itemOrigin" label="物料来源">-->
<!--              <el-select v-model="form.itemOrigin" placeholder="请选择物料来源" clearable>-->
<!--                <el-option-->
<!--                  v-for="dict in itemOriginList"-->
<!--                  :key="dict.code"-->
<!--                  :label="dict.name"-->
<!--                  :value="dict.code"-->
<!--                />-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="8">-->
<!--            <el-form-item prop="location" label="库位">-->
<!--              <el-select v-model="form.location" placeholder="请选择物料库位" clearable>-->
<!--                <el-option-->
<!--                  v-for="dict in locationList"-->
<!--                  :key="dict.code"-->
<!--                  :label="dict.name"-->
<!--                  :value="dict.code"-->
<!--                />-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--        <el-row>-->
<!--          <el-col :span="8">-->
<!--            <el-form-item prop="itemCount" label="数量">-->
<!--              <el-input-number v-model="form.itemCount" :precision="3" :controls="false" :min="0"></el-input-number>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="8">-->
<!--            <el-form-item prop="itemMeasure" label="单位">-->
<!--              <el-input v-model="form.itemMeasure"/>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->

        <div class="dialog-footer" style="text-align: center;width:100%;">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog title="数据选择"  :visible.sync="dialogShowMap" width="760px" @close="beforeClose" >
      <el-table :data="pageListTitle" class="commen-table mt_20" key="0" @selection-change="handleSelectionChange" style="margin-bottom: 20px">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="插入序号（默认0）" align="center" prop="index"/>
        <el-table-column label="排版名称" align="center" prop="title"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogShowMap = false">取 消</el-button>
      <el-button type="primary" @click="handleEnterAdd()" >确 定</el-button>
  </span>

    </el-dialog>
  </div>
</template>
<script>
import {
  addInBulk,
  addStock, cleanList,
  deleteStock,
  detailStock, get_list, get_map,
  stockPageList,
  updateStock,
  uploadStock
} from '@/api/tabularAnalysis/part.js'
  import {getWarehouseSelected} from '@/api/item/warehouse'
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'
  import {get_new_export} from '@/api/common'

  export default {
    name:'generalListOfParts',
    components: {
      UploadExcelComponent,
      DateIntervals: () => import('@/components/DateIntervals'),
      Pagination: () => import('@/components/Pagination')
    },
    data() {
      return {
        index:'--',
        flag:true,
        queryParams: {
          params: {},
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
        pageListCache: [],
        pageListTitle: [],
        selectedTitle: [],
        pageListMap: [],
        title: '',
        dialogShow: false,

        dialogShowMap: false,
        rules: {
          partName: [{required: true, message: '请输入零件名称', trigger: 'blur'}],
          partSize: [{required: true, message: '请输入零件尺寸', trigger: 'blur'}],
          number: [{required: true, message: '请输入数量', trigger: 'blur'}],
          cuttingLength: [{required: true, message: '请输入切割长度', trigger: 'blur'}],
          markingLength: [{required: true, message: '请输入打标长度', trigger: 'blur'}],
          evaporationFilmLength: [{required: true, message: '请输入蒸发去膜长度', trigger: 'blur'}],
        }
      }
    },
    created() {
      // this.getSelectOption()
      // this.getData()
    },
    methods: {
      handleSelectionChange(val) {
        // 先将所有的行的 `index` 设置为 `null`
        this.pageListTitle.forEach(item => {
          item.index = '--';
        });

        // 如果有选中的行数据，就给它们的 `index` 赋值为它们在选中数据中的索引
        val.forEach((item, index) => {
          item.index = index+1;
        });
        this.selectedTitle = val
      },

      handleEnterAdd() {
        this.selectedTitle.forEach(res=>{
          // let aaa = this.pageListMap.get(res.title)
          let data = this.pageListMap[res.title];
          data.forEach(d=>{
            this.pageListCache.push(d)
          })
        })

        console.log("this.pageListCache",this.pageListCache)
        this.dialogShowMap = false

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
      beforeCloseMap() {

      },
      getSelectOption() {
        getWarehouseSelected().then(res => {
          this.locationList = res.data
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
        // this.queryParams.params.itemType = '00'
        stockPageList(this.queryParams).then(res => {
          this.pageList = res.data
          this.pageTotal = Number(res.page.total_num)
        })
      },
      // 获取未上传的缓存数据
      getListApi() {
        get_list().then(res => {
          this.pageListCache = res.data
        })
      },
      // 获取未上传的缓存数据
      getListMapApi() {
        this.pageListTitle = []
        get_map().then(res => {
          this.pageListMap = res.data

          let titles = Object.keys(this.pageListMap);
          titles.forEach(t=>{
            this.pageListTitle.push({
              index : '--',
              title : t
            })
          })
        })
      },
      handleAdd() {
        this.title = '新增'
        this.flag = true

        this.dialogShow = true
      },
      handleHistory() {
        this.flag = false
        this.getData()
      },
      handleClean(title) {

        if (!title) {
          title = "确认要清除未导入的数据吗"
        }
        this.$confirm('确认要清除导入完成的数据吗?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.pageListCache = []
            this.pageListMap = []
            this.$message({
              type: 'success',
              message: '清除成功'
            })

          //   cleanList().then(res => {
          //     // this.getListApi()
          //
          //     this.$message({
          //       type: 'success',
          //       message: '清除成功'
          //     })
          //   })
          // })  .then(() => {

        })

      },
      handleUpdate(row) {
        this.form = row
        this.dialogShow = true
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
            console.log(22222222222222222222222222222222222222222222)
            const index = this.pageListCache.findIndex(item => item.excelId === row.excelId);
            if (index !== -1) {
              this.pageListCache.splice(index, 1);
            }

            // deleteStock({
            //   params: {
            //     id: row.id
            //   }
            // }).then(res => {
            //   this.getData()
            //   this.$message({
            //     type: 'success',
            //     message: '删除成功'
            //   })
            // })
          })
          .then(() => {
          })
      },
      // 批量添加
      handleAddInBulk() {
        this.$confirm('确认添加，添加后不可修改', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            addInBulk(this.pageListCache).then(res => {
              this.handleClean("是否一并清除已经导入的数据");
              this.$message({
                type: 'success',
                message: '添加成功'
              })
            })
          })  .then(() => {
        })
      },
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            // if (this.form.id) {
            //   updateStock({
            //     params: this.form
            //   }).then(res => {
            //     this.$message({
            //       message: '修改成功',
            //       type: 'success'
            //     })
            //     this.getData()
            //   })
            // } else {
            //   this.form.itemType = '00'
            //   addStock({params: this.form}).then(res => {
            //     this.$message({
            //       message: '新增成功',
            //       type: 'success'
            //     })
            //     this.getData()
            //   })
            // }
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
          // this.getData()
          // this.getListApi()
          this.getListMapApi()
          this.dialogShowMap = true
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
