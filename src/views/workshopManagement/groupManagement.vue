<!--分组管理-->
<template>
  <div class="app-container">


<!--    搜索框-->
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
      <el-form-item label="分组名称" class="condition">
        <el-input v-model="queryParams.params.groupName" placeholder="请输入名称" clearable/>
      </el-form-item>
      <workShop :bindId.sync="queryParams.params.deptId" :required-dept="false"/>
      <el-form-item class="commen-button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
      </el-form-item>
      <el-form-item class="commen-button reset">
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
      <el-form-item></el-form-item>
    </el-form>



    <el-row class="mb8" v-if="hasPerm('B009001000001')">
      <el-button type="primary" class="commen-button" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </el-row>
    <el-table :data="pageList" class="commen-table mt_20">
      <el-table-column type="index" width="55" label="序号"></el-table-column>
      <el-table-column label="分组名称" align="center" prop="groupName"/>
      <el-table-column label="主报工人" align="center" prop="groupUserName"/>
      <el-table-column label="车间" align="center" prop="deptName"/>
      <el-table-column
        label="描述"
        prop="remark"
        header-align="center"
        align="center"
        width="220"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createdTime"/>
      <el-table-column label="操作" align="center" width="310" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- 确认后不能编辑和删除 -->
          <el-button
            link
            type="primary"
            v-if="hasPerm('B009001000001')"
            icon="Edit"
            @click="handleDetail(scope.row)"
          >工人详情
          </el-button>
          <el-button
            link
            type="primary"
            v-if="hasPerm('B009001000002')"
            icon="Edit"
            @click="handleUpdate(scope.row)"
          >编辑
          </el-button>
          <el-button
            link
            type="primary"
            v-if="hasPerm('B009001000003')"
            icon="Delete"
            @click="handleDelete(scope.row)"
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
        <el-form-item prop="groupName" label="分组名称">
          <el-input v-model="form.groupName"/>
        </el-form-item>
        <userSelect :title="userTitle" :user-id.sync="form.groupUid" :required-user="true"/>
        <workShop :bindId.sync="form.deptId" :required-dept="true"/>
        <el-form-item prop="remark" label="描述">
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
    addGroup,
    deleteGroup,
    detailGroup,
    groupPageList,
    updateGroup
  } from '@/api/group/group'

  export default {
    components: {
      DateIntervals: () => import('@/components/DateIntervals'),
      Pagination: () => import('@/components/Pagination'),
      UserSelect: () => import('@/components/user/userSelect'),
      WorkShop: () => import('@/components/Dept/workShop')
    },
    data() {
      return {
        userTitle: '组报工人',
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
          groupName: [{required: true, message: '请输入名称', trigger: 'blur'}],
          remark: [{required: true, message: '请输入备注', trigger: 'blur'}]
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
        groupPageList(this.queryParams).then(res => {
          this.pageList = res.data
          this.pageTotal = Number(res.page.total_num)
        })
      },
      handleAdd() {
        this.title = '新增'
        this.dialogShow = true
      },
      handleUpdate(row) {
        detailGroup({
          params: {
            id: row.id
          }
        }).then(res => {
          this.form = res.data
          this.dialogShow = true
        })

        this.title = '编辑'
      },
      handleDetail(row) {
        this.$router.push({
          name: 'groupDetailManagement',
          query: {
            id: row.id
          }
        })
      },
      handleDelete(row) {
        this.$confirm('确认要删除数据吗?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deleteGroup({
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
              updateGroup({
                params: this.form
              }).then(res => {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.getData()
              })
            } else {
              addGroup({params: this.form}).then(res => {
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
