<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
      <el-form-item label="设备名称" class="condition">
        <el-input v-model="queryParams.params.device" placeholder="请输入名称" clearable/>
      </el-form-item>


      <el-form-item class="commen-button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
      </el-form-item>
      <el-form-item></el-form-item>
    </el-form>
    <el-row class="mb8">
      <el-button type="primary" class="commen-button" icon="el-icon-plus" @click="deviceLocationAdd">新增</el-button>
    </el-row>
    <el-table :data="pageList" class="commen-table mt_20">
      <el-table-column type="index" width="55" label="序号"></el-table-column>
      <el-table-column v-if="showColumn" label="主键" align="center" prop="id"/>
      <el-table-column label="设备名称" align="center" prop="device"/>
      <el-table-column label="工位" align="center" prop="station"/>
      <el-table-column label="库位" align="center" prop="location"/>
      <el-table-column label="agv对应点位" align="center" prop="agvlocation"/>
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
    <el-dialog :title="title" :visible.sync="dialogShow" width="480px" @close="beforeClose">
      <el-form :model="form" class="commen-form" :rules="rules" ref="form" label-width="80px">
        <el-form-item prop="name" label="设备">
          <el-input v-model="form.device"/>
        </el-form-item>
        <el-form-item prop="name" label="工位">
          <el-input v-model="form.station"/>
        </el-form-item>
        <el-form-item prop="name" label="库位">
          <el-input v-model="form.location"/>
        </el-form-item>
        <el-form-item prop="remark" label="agv点位">
          <el-input v-model="form.agvlocation"/>
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
    addDeviceLocation,
    deleteDeviceLocation,
    detailDeviceLocation,
    updateDeviceLocation,
    DeviceLocationPageList
  } from '@/api/item/deviceLocation'

  export default {
    components: {
      DateIntervals: () => import('@/components/DateIntervals'),
      Pagination: () => import('@/components/Pagination')
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
        title: '',
        dialogShow: false,
        rules: '',
        showColumn: false
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
      getData() {
        DeviceLocationPageList(this.queryParams).then(res => {
          this.pageList = res.data
          this.pageTotal = Number(res.page.total_num)
        })
      },
      deviceLocationAdd() {
        this.title = '新增'
        this.dialogShow = true
      },
      handleUpdate(row) {
        detailDeviceLocation({
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
            deleteDeviceLocation({
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
              updateDeviceLocation({
                params: this.form
              }).then(res => {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.getData()
              })
            } else {
              addDeviceLocation({params: this.form}).then(res => {
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
