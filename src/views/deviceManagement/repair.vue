<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
      <el-form-item label="维修单名称" class="condition">
        <el-input v-model="queryParams.params.name" placeholder="请输入名称" clearable/>
      </el-form-item>

      <el-form-item label="设备" class="condition">
        <device-selected :bind-id.sync="queryParams.params.deviceId"/>
      </el-form-item>
      <el-form-item label="完成时间" class="condition">
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
    </el-form>
    <el-row class="mb8">
      <el-button
        type="primary"
        class="commen-button"
        icon="el-icon-plus"
        v-if="hasPerm('B003004000001')"
        @click="handleAdd"
      >新增
      </el-button>
    </el-row>
    <el-table :data="pageList" class="commen-table mt_20">
      <el-table-column type="index" width="55" label="序号"></el-table-column>
      <el-table-column label="维修单名称" align="center" prop="name" width="120"/>
      <el-table-column label="设备编码" align="center" prop="deviceNo"/>
      <el-table-column label="设备名称" align="center" prop="deviceName"/>
      <el-table-column label="保修日期" align="center" prop="reportTime"/>
      <el-table-column label="维修完成日期" align="center" prop="repairTime" width="120"/>
      <el-table-column label="验收日期" align="center" prop="checkTime"/>
      <el-table-column
        label="维修结果"
        prop="repairResult"
        header-align="center"
        align="center"
        width="180"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="维修人员" align="center" prop="repairUidDesc"/>
      <el-table-column label="验收人员" align="center" prop="checkUidDesc"/>
      <el-table-column label="操作" align="center" width="210" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- 确认后不能编辑和删除 -->
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-if="hasPerm('B003004000002')"
          >编辑
          </el-button>
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-if="hasPerm('B003004000003')"
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
    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="dialogShow" width="480px" @close="beforeClose">
      <el-form :model="form" class="commen-form" :rules="rules" ref="form" label-width="80px">
        <el-form-item prop="name" label="名称">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item prop="deviceId" label="设备">
          <deviceSelected :bind-id.sync="form.deviceId"/>
        </el-form-item>
        <el-form-item prop="reportTime" label="报修日期">
          <el-date-picker
            v-model="form.reportTime"
            size="small"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="repairTime" label="完成日期">
          <el-date-picker
            v-model="form.repairTime"
            size="small"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <userSelect :title="repairTitle" :user-id.sync="form.repairUid" :required-user="true"/>
        <el-form-item prop="repairResult" label="维修结果">
          <el-input type="textarea" v-model="form.repairResult"/>
        </el-form-item>
        <el-form-item prop="checkTime" label="验收日期">
          <el-date-picker
            v-model="form.checkTime"
            size="small"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <userSelect :title="checkTitle" :user-id.sync="form.checkUid" :required-user="true"/>

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
    addDeviceRepair,
    updateDeviceRepair,
    deleteDeviceRepair,
    detailDeviceRepair,
    repairPageList
  } from '@/api/device/deviceRepair'

  export default {
    components: {
      DateIntervals: () => import('@/components/DateIntervals'),
      Pagination: () => import('@/components/Pagination'),
      deviceSelected: () => import('@/components/Device/deviceSelected'),
      UserSelect: () => import('@/components/user/userSelect')
    },
    data() {
      return {
        repairTitle: '维修人',
        checkTitle: '验收人',
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
        title: '',
        dialogShow: false,
        rules: {
          name: [{required: true, message: '请输入名称', trigger: 'blur'}],
          deviceId: [{required: true, message: '请选择设备', trigger: 'blur'}],
          reportTime: [{required: true, message: '报修日期', trigger: 'blur'}],
          repairTime: [{required: true, message: '完成日期', trigger: 'blur'}],
          checkTime: [{required: true, message: '验收日期', trigger: 'blur'}],
          repairResult: [
            {required: true, message: '请输入维修结果', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
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
        repairPageList(this.queryParams).then(res => {
          this.pageList = res.data
          this.pageTotal = Number(res.page.total_num)
        })
      },
      handleAdd() {
        this.title = '新增'
        this.dialogShow = true
      },
      handleUpdate(row) {
        detailDeviceRepair({
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
            deleteDeviceRepair({
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
              updateDeviceRepair({
                params: this.form
              }).then(res => {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.getData()
              })
            } else {
              addDeviceRepair({params: this.form}).then(res => {
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
