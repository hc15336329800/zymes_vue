<template>
  <div>
    <el-form :model="userInfoForm" :rules="detailRules" ref="userFormRef" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="nickName">
            <el-input v-model="userInfoForm.nickName" placeholder="请输入姓名" maxlength="30" style="width: 240px"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式" prop="mobile">
            <el-input v-model="userInfoForm.mobile" placeholder="请输入联系方式" maxlength="11" style="width: 240px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属部门" prop="deptId">
            <tree-select :data="deptList" v-model="userInfoForm.deptId" clearable filterable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属角色" prop='roleId'>
            <el-select v-model="userInfoForm.roleIds" multiple placeholder="所属角色" style="width: 240px">
              <el-option v-for="item in roleOptions" :key="item.roleCode" :label="item.roleName"
                         :value="item.roleCode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="账号" prop="userName">
            <el-input v-model="userInfoForm.userName" placeholder="请输入账号" maxlength="50" style="width: 240px"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户密码" prop="password" v-if='!userInfoForm.id'>
            <el-input v-model="userInfoForm.password" type='password' auto-complete='new-password' placeholder="请输入密码"
                      maxlength="50" style="width: 240px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <div class="dialog-footer" style="text-align: center;width:100%;">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-row>
    </el-form>

  </div>
</template>
<script>
  import {
    saveUserInfo,
    updateUserInfo,
    getUserDetail
  } from '@/api/structure/userInfo'
  import {userRoleInfo} from '@/api/structure/roleinfo'
  import {deptTree} from '@/api/structure/dept'

  export default {
    name: 'addOrEditUser',
    components: {
      TreeSelect: () => import('@/components/TreeSelect')
    },
    data() {
      return {
        deptList: [],
        roleOptions: [],
        curFileList: [],
        userInfoForm: {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        },
        form: {},
        dalogVisible: false,
        detailRules: {
          userName: [
            {required: true, message: '用户名称不能为空', trigger: 'blur'},
            {
              min: 2,
              max: 20,
              message: '用户名称长度必须介于 2 和 20 之间',
              trigger: 'blur'
            }
          ],

          nickName: [
            {required: true, message: '用户昵称不能为空', trigger: 'blur'}
          ],
          deptId: [
            {required: true, message: '请选择部门', trigger: 'blur'}
          ],
          // roleId:[
          //   { required: true, message: '请选择角色', trigger: 'blur' }
          // ],
          email: [
            {
              required: true,
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'change']
            }
          ],
          password: [
            {required: true, message: "密码不能为空", trigger: "blur"},
            {
              validator: (rule, value, callback) => {
                const reg = /^[A-Za-z0-9]{6,16}$/;//6-16位密码校验规则
                if (reg.test(value)) {
                  callback();
                } else {
                  callback(new Error());
                }
              },
              message: "密码必须由数字、字母组合,请输入6-16位",
              trigger: "blur",
            },
          ],
          mobile: [
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: '请输入正确的手机号码',
              trigger: 'blur',
              required: true
            }
          ]
        }
      }
    },
    created() {
      this.selectOptionsList()
    },
    mounted() {
    },
    methods: {

      /** 提交按钮 */
      async submitForm() {
        let valid = await this.$refs['userFormRef'].validate()
        if (valid) {
          let insert = this.userInfoForm.id == undefined
          var newForm = JSON.parse(JSON.stringify(this.userInfoForm))
          if (insert) {
            saveUserInfo(newForm).then(res => {
              this.cancel();
              this.$message({
                message: '新增成功',
                type: 'success'
              })
            })
          } else {
            updateUserInfo(newForm).then(res => {
              this.cancel();
              this.$message({
                message: '更新成功',
                type: 'success'
              })
            })
          }
        }
      },

      cancel() {
        this.$emit('cancel')
      },
      selectOptionsList() {
        //查询用户角色
        userRoleInfo({params: ''}).then(res => {
          this.roleOptions = res.data
        })
        // 查询部门
        deptTree({
          params: {paterId: ''}
        }).then(res => {
          this.deptList = res.data
        })
      },
      /** 修改按钮操作 */
      handleUpdate(id) {
        getUserDetail(id).then(res => {
          this.userInfoForm = res.data
          this.userInfoForm.id = id
        })
      }
    }
  }
</script>
