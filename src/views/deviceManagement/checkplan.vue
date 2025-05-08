<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
      <el-form-item label="计划名称" class="condition">
        <el-input v-model="queryParams.params.name" placeholder="请输入名称" clearable/>
      </el-form-item>
      <el-form-item label="计划类型" class="condition">
        <el-select v-model="queryParams.params.checkType" placeholder="请选择类型" clearable>
          <el-option
            v-for="dict in checkTypeList"
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
    <el-row class="mb8">
      <el-button
        type="primary"
        class="commen-button"
        icon="el-icon-plus"
        v-if="hasPerm('B003003000001')"
        @click="handleAdd"
      >新增
      </el-button>
    </el-row>
    <el-table :data="pageList" class="commen-table mt_20">
      <el-table-column type="index" width="55" label="序号"></el-table-column>
      <el-table-column label="计划名称" align="center" prop="name"/>
      <el-table-column label="计划类型" align="center" prop="checkTypeDesc"/>
      <el-table-column label="设备编码" align="center" prop="deviceNo"/>
      <el-table-column label="设备名称" align="center" prop="deviceName"/>
      <el-table-column label="开始时间" align="center" prop="beginTime"/>
      <el-table-column label="结束时间" align="center" prop="endTime"/>
      <el-table-column label="负责人" align="center" prop="userIdDesc"/>
      <el-table-column label="创建时间" align="center" prop="createdTime"/>
      <el-table-column label="操作" align="center" width="310" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- 确认后不能编辑和删除 -->
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleDetail(scope.row)"
            v-if="hasPerm('B003003000004')"
          >详情
          </el-button>
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-if="hasPerm('B003003000002')"
          >编辑
          </el-button>
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-if="hasPerm('B003003000003')"
          >删除
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
    <!-- 添加或修改设备点检计划头对话框 -->
    <el-dialog :title="title" :visible.sync="dialogShow" width="960px" @close="beforeClose">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="计划名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入计划名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="deviceId" label="设备">
              <deviceSelected :bind-id.sync="form.deviceId"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="checkType" label="计划类型">
              <el-select v-model="form.checkType" placeholder="请选择类型" clearable>
                <el-option
                  v-for="dict in checkTypeList"
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
            <userSelect :title="checkTitle" :user-id.sync="form.userId" :required-user="true"/>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开始日期" prop="beginTime">
              <el-date-picker
                v-model="form.beginTime"
                size="small"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束日期" prop="endTime">
              <el-date-picker
                v-model="form.endTime"
                size="small"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-tabs type="border-card">
        <el-tab-pane :label="form.checkType=='01'?'点检项目':'保养项目'">
          <Checksubject
            ref="getList"
            :check-type.sync="form.checkType"
            :item-ids.sync="form.itemId"
          />
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {dictInfo} from '@/api/common'
  import {
    addCheckInfo,
    checkPageList,
    deleteCheckInfo,
    detailCheckInfo,
    updateCheckInfo
  } from '@/api/device/checkPlan'

  export default {
    components: {
      DateIntervals: () => import('@/components/DateIntervals'),
      Pagination: () => import('@/components/Pagination'),
      deviceSelected: () => import('@/components/Device/deviceSelected'),
      Checksubject: () => import('@/components/Device/Checksubject'),
      UserSelect: () => import('@/components/user/userSelect')
    },
    data() {
      return {
        checkTypeList: [],
        queryParams: {
          params: {},
          page: {
            page_num: 1,
            page_size: 10
          }
        },
        checkTitle: '负责人',
        form: {},
        pageTotal: 0,
        pageList: {},
        title: '',
        dialogShow: false,
        rules: {
          name: [{required: true, message: '请输入名称', trigger: 'blur'}],
          deviceId: [{required: true, message: '请选择设备', trigger: 'blur'}],
          checkType: [
            {required: true, message: '请选择项目类型', trigger: 'blur'}
          ],
          beginTime: [
            {required: true, message: '请选择开始时间', trigger: 'blur'}
          ],
          endTime: [
            {required: true, message: '请选择结束时间', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.getSelectOptions()
      this.getData()
    },
    methods: {
      getSelectOptions() {
        dictInfo('CHECK_TYPE', r => (this.checkTypeList = r))
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
        checkPageList(this.queryParams).then(res => {
          this.pageList = res.data
          this.pageTotal = Number(res.page.total_num)
        })
      },
      handleAdd() {
        this.title = '新增'
        this.dialogShow = true
      },
      handleDetail(row) {
        this.getDetail(row.id)
        this.title = '详情'
      },
      getDetail(id) {
        detailCheckInfo({
          params: {
            id: id
          }
        }).then(res => {
          this.form = res.data
          this.dialogShow = true
        })
      },
      handleUpdate(row) {
        this.getDetail(row.id)
        this.title = '编辑'
      },
      handleDelete(row) {
        this.$confirm('确认要删除数据吗?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deleteCheckInfo({
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
        if (!this.form.itemId) {
          this.$message.error('请选择类型')
          return
        }
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id) {
              updateCheckInfo({
                params: this.form
              }).then(res => {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.getData()
              })
            } else {
              addCheckInfo({params: this.form}).then(res => {
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
