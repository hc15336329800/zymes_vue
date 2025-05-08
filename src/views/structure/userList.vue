<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      class="commen-search"
      ref="queryRef"
      :inline="true"
      label-width="70px"
    >
      <el-form-item label="姓名" class="condition">
        <el-input
          v-model="queryParams.params.nickName"
          placeholder="请输入姓名"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系方式" class="condition">
        <el-input
          v-model="queryParams.params.phoneNumber"
          placeholder="请输入联系方式"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="停用" class="condition">
        <el-select
          v-model="queryParams.params.dataStatus"
          placeholder="用户状态"
          clearable
          style="width: 240px"
        >
          <el-option key="00" label="正常" value="00"></el-option>
          <el-option key="01" label="停用" value="01"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="commen-button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
      </el-form-item>
      <el-form-item class="commen-button reset">
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb8">
      <el-button type="primary" class="commen-button" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </el-row>
    <el-table :data="userPageList" class="commen-table">
      <el-table-column label="姓名" align="center" prop="nickName"/>
      <el-table-column label="账号" align="center" prop="userName"/>
      <el-table-column label="联系方式" align="center" prop="mobile"/>
      <el-table-column label="所属部门" align="center" prop="deptName" show-overflow-tooltip/>
      <el-table-column label="所属角色" align="center" prop="roleNameStr" show-overflow-tooltip/>
      <el-table-column label="停用" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.dataStatus"
            active-value="01"
            inactive-value="00"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createdTime" width="160"/>

      <el-table-column label="操作" align="center" width="310" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button link type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
          <el-button link type="primary" @click="handleResetPsw(scope.row)">重置密码</el-button>
          <el-button link type="primary" @click="updatePassword(scope.row)">更新密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      style="text-align: right"
      v-show="pageTotal>0"
      :total="pageTotal"
      :page.sync="queryParams.page.page_num"
      :limit.sync="queryParams.page.page_size"
      @pagination="getUserPageList"
    />

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="openDetail" width="780px" :destroy-on-close="true">
      <userForm ref="userForm" @cancel="cancel"></userForm>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dalogVisible" width="60%" center :destroy-on-close="true">
      <el-form label-position="right" :rules="pwdInputRule" label-width="80px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input
            v-model="userInfoForm.oldPassword"
            placeholder="请输入旧密码"
            maxlength="30"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="userInfoForm.newPassword"
            placeholder="请输入新密码"
            maxlength="30"
            style="width: 240px"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dalogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changePsw">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    userPageList,
    deleteUserInfo,
    changeUserStatus,
    resetPsw,
    updatePsw
  } from '@/api/structure/userInfo'

  export default {
    name: 'userPageList',
    components: {
      DateIntervals: () => import('@/components/DateIntervals'),
      Pagination: () => import('@/components/Pagination'),
      UserForm: () => import('./children/addOrEditUser')
    },
    data() {
      return {
        userPageList: [],
        openDetail: false,
        pageTotal: 0,
        dalogVisible: false,
        title: '',
        userInfoForm: {},
        queryParams: {
          params: {},
          page: {
            page_num: 1,
            page_size: 10
          }
        },
        userStatusOptions: [],
        sexStatusOptions: [],
        detailRules: {
          userName: [
            {required: true, message: '账号不能为空', trigger: 'blur'},
            {
              min: 2,
              max: 20,
              message: '账号长度必须介于 2 和 20 之间',
              trigger: 'blur'
            }
          ],
          nickName: [
            {required: true, message: '姓名不能为空', trigger: 'blur'}
          ],
          phoneNumber: [
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: '请输入正确的手机号码',
              trigger: 'blur'
            }
          ]
        },
        pwdInputRule: {
          oldPassword: [
            {required: true, message: '旧密码不能为空', trigger: 'blur'}
          ],
          confirmPassword: [
            {required: true, message: '请再次输入新密码', trigger: 'blur'}
          ],
          newPassword: [
            {required: true, message: '新密码不能为空', trigger: 'blur'},
            {
              validator: (rule, value, callback) => {
                const reg = /^[A-Za-z0-9]{6,16}$/ //6-16位密码校验规则
                if (reg.test(value)) {
                  callback()
                } else {
                  callback(new Error())
                }
              },
              message: '新密码必须由数字、字母组合,请输入6-16位',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    created() {
    },
    mounted() {
      this.$nextTick(function () {
        this.getUserPageList()
      })
    },
    methods: {
      /** 查询用户列表 */
      getUserPageList() {
        userPageList(this.queryParams).then(res => {
          this.userPageList = res.data
          this.pageTotal = Number(res.page.total_num)
        })
      },
      async changePsw() {
        updatePsw({
          params: this.userInfoForm
        }).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.dalogVisible = false
        })
      },

      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.page.page_num = 1
        this.getUserPageList()
      },
      /** 重置密码按钮操作 */
      handleResetPsw(row) {
        this.$confirm('确认重置密码，密码将重置为123456！', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          resetPsw({
            params: {
              userId: row.id,
              newPassword: 123456
            }
          }).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          })
        })
      },
      updatePassword(row) {
        this.userInfoForm.id = row.id
        this.dalogVisible = true
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        this.$confirm('确认要删除数据吗?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deleteUserInfo({id: row.id}).then(res => {
              this.getUserPageList()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            })
          })
          .then(() => {
          })
      },
      /** 用户状态修改  */
      handleStatusChange(row) {
        let text = row.dataStatus === '00' ? '启用' : '停用'
        this.$confirm('确认要' + text + row.userName + '用户吗?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let statusParams = {
              params: {id: row.id, dataStatus: row.dataStatus}
            }
            changeUserStatus(statusParams).then(res => {
              this.getUserPageList()
              this.$message({
                type: 'success',
                message: '修改成功'
              })
            })
          })
          .then(() => {
          })

      },

      /** 重置操作表单 */
      handleReset() {
        this.queryParams = {
          page: {
            page_num: 1,
            page_size: 10
          },
          params: {
            startTime: '',
            endTime: ''
          }
        }
        this.getUserPageList()
      },

      /** 取消按钮 */
      cancel() {
        this.openDetail = false
        this.getUserPageList()
      },

      /** 新增按钮操作 */
      handleAdd() {
        this.userInfoForm = {
          dataStatus: '00'
        }
        this.openDetail = true
        this.title = '新增员工'
      },

      /** 修改按钮操作 */
      handleUpdate(row) {
        this.openDetail = true
        this.title = '修改员工'
        this.$nextTick(() => {
          this.$refs['userForm'].handleUpdate(row.id)
        })
      }
    }
  }
</script>
