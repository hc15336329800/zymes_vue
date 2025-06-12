<template>
  <div>
    <el-form
      :model="queryParams"
      class="commen-search"
      ref="queryRef"
      :inline="true"
      label-width="70px"
    >
      <el-form-item label="部门名称" class="condition">
        <el-input
          v-model="queryParams.params.deptName"
          placeholder="请输入部门名称"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item class="commen-button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
      </el-form-item>
      <el-form-item class="commen-button reset">
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="deptList"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      lazy
      :load="reflushTree"
      class="commen-table"
      default-expand-all
      ref="deptTreeRef"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="label" label="部门名称"></el-table-column>
      <el-table-column prop="directorUidDesc" label="部门负责人"></el-table-column>
      <el-table-column prop="createdByDesc" label="创建人"></el-table-column>
      <el-table-column prop="createdTime" label="创建时间"></el-table-column>
      <el-table-column prop="seqNo" label="序号"></el-table-column>
      <el-table-column prop="address" label="操作" align="center">
        <template slot-scope="scope">
          <el-button link type="primary" @click="handleAddDept(scope.row.id)" icon="Delete">新增</el-button>
          <el-button link type="primary" @click="handleEditDept(scope.row)">编辑</el-button>
          <el-button
            link
            type="primary"
            v-if="scope.row.parId!='JBY_ROOT'"
            @click="handleDeleteDept(scope.row.id)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="deptForm.id?'编辑部门':'新增部门'"
      :visible.sync="deptDialog"
      width="500px"
      :destroy-on-close="true"
    >
      <el-form
        :model="deptForm"
        :rules="deptRules"
        ref="deptForm"
        label-width="120px"
        @close="closeDistrDialog"
        class="demo-ruleForm commenForm"
        style="text-align:left;margin:0 auto;"
      >
        <el-form-item label="部门名称：" prop="deptName" class="condition">
          <el-input v-model="deptForm.deptName" :maxlength="50"/>
        </el-form-item>
        <userSelect :title="userTitle" :user-id.sync="deptForm.directorUid" :required-user="true"/>
        <el-form-item label="序号：" prop="seqNo" class="condition" style="width: 240px">
          <el-input v-model="deptForm.seqNo" type="number" min="1" max="65535"/>
        </el-form-item>
        <el-form-item prop="deptType" label="是否车间">
          <el-radio
            v-model="deptForm.deptType"
            :label="item.code"
            v-for="item in deptTypeList"
            :key="item.code"
          >{{item.name}}
          </el-radio>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="deptDialog = false">取 消</el-button>
        <el-button type="primary" size="small" @click="submitdeptForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    addDept,
    updateDept,
    detailDept,
    deleteDept,
    deptTree
  } from '@/api/structure/dept'

  import UserSelect from '@/components/user/userSelect.vue'

  export default {
    components: {
      UserSelect,
      Pagination: () => import('@/components/Pagination')
    },
    data() {
      return {
        title: '',
        queryParams: {
          params: {},
          page: {
            page_num: 1,
            page_size: 10
          }
        },
        deptTypeList: [
          {code: '00', name: '非车间'},
          {code: '01', name: '车间'}
        ],
        userTitle: '负责人:',
        deptList: [],
        maps: new Map(),
        userList: [],
        pageTotal: 0,
        deptDialog: false,
        loading: false,
        deptForm: {
          id: '',
          directorUid: '',
          deptType: '00'
        },
        deptRules: {
          deptName: [
            {required: true, message: '请输入部门名称', trigger: 'blur'}
          ],
          seqNo: [{required: true, message: '请输入序号', trigger: 'blur'}],
          deptType: [
            {required: true, message: '请选择是否为车间', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
    },
    mounted() {
      this.$nextTick(function () {
        this.getPgaeInfo()
      })
    },
    methods: {
      /** 查询一级部门 */
      getPgaeInfo() {
        this.deptList = []
        this.$refs.deptTreeRef.store &&
        (this.$refs.deptTreeRef.store.states.lazyTreeNodeMap = {})
        deptTree(this.queryParams).then(res => {
          this.deptList = res.data
        })
      },

      reflushTree(pid) {
        // 子节点刷新父节点数据
        this.getPgaeInfo()
      },

      handleQuery() {
        this.queryParams.page.page_num = 1
        this.getPgaeInfo()
      },
      handleReset() {
        this.queryParams = {
          page: {
            page_num: 1,
            page_size: 10
          }
        }
        this.getPgaeInfo()
      },
      async submitdeptForm() {
        //提交添加或者编辑分组
        let valid = await this.$refs['deptForm'].validate()
        if (valid) {
          var result = null
          if (this.deptForm.id) {
            result = await updateDept({
              params: this.deptForm
            })
          } else {
            result = await addDept({
              params: this.deptForm
            })
          }
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.deptDialog = false
          this.reflushTree(this.deptForm.paterId)
        }
      },

      handleAddDept(id) {
        this.deptForm = {
          paterId: id,
          directorUid: ''
        }
        this.deptDialog = true
      },

      handleEditDept(item) {
        this.deptForm = {}
        detailDept({
          params: {
            id: item.id
          }
        }).then(res => {
          this.deptForm = res.data
        })
        this.deptDialog = true
      },

      handleDeleteDept(id) {
        //删除部门
        this.$confirm('确认删除此部门？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        })
          .then(() => {
            deleteDept({
              params: {
                id: id
              }
            }).then(res => {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.reflushTree(res.data)
            })
          })
          .then(() => {
          })
      },

      cancel() {
        this.openDetail = false
      },
      closeDistrDialog() {
        this.deptForm = {}
        this.$refs['deptForm'].clearValidate()
        this.deptDialog = false
      }
    }
  }
</script>
