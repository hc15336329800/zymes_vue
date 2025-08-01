<template>
  <basic-container>
    <avue-crud
      class="commen-table commen-search avue-crud"
      :option="option"
      :table-loading="loading"
      :data="roleData"
      :page.sync="rolePage"
      ref="crud"
      :permission="permissionList"
      v-model="form"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @search-change="searchChange"
      @search-reset="resetChange"
      @current-change="currentChange"
      @size-change="sizeChange"
    >
      <template slot="searchMenu">
        <el-button
          type="primary"
          class="commen-button"
          icon="el-icon-plus"
          style="float:right;background-color: #3145ec;color:#fff;"
          @click="$refs.crud.rowAdd()"
        >新增
        </el-button>
      </template>
      <template slot-scope="scope" slot="menuBtn">
        <el-dropdown-item divided @click.native="handleRole(scope.row, '01')">
          <img src="@/assets/image/user/menu.png" class="default" style="width:13px;">
          <img src="@/assets/image/user/menu-active.png" class="active" style="width:13px;">
          菜单
        </el-dropdown-item>
      </template>
    </avue-crud>
    <el-dialog class="roleSetting" title="角色详情" :visible.sync="box" width="530px">
      <el-tree
        :data="menuList"
        show-checkbox
        node-key="id"
        ref="roleMenuTree"
        :default-checked-keys="defaultObj"
        @check-change="hanleCheck"
        :default-expanded-keys="expandedCodes"

      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="box = false">取消</el-button>
        <el-button type="primary" @click="submitRoleMenu">确定</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {
    rolePageList,
    addRoleInfo,
    updateRole,
    delRole,
    roleMenuInfo,
    addRoleMenu
  } from '@/api/structure/roleinfo'
  import {menuTree} from '@/api/structure/menuinfo'

  export default {
    data() {
      return {
        form: {},
        box: false,
        channel: '01',
        props: {
          label: 'label'
        },
        menuList: [],
        defaultObj: [],
        expandedCodes: [],
        roleData: [],
        checkedRoleCode: '',
        loading: true,
        rolePage: {
          total: 0,
          page_size: 10,
          currentPage: 1
        },
        pageQuery: {
          params: {},
          page: {
            page_num: 1,
            page_size: 10
          }
        },
        option: {
          menuType: 'menu',
          indexLabel: '序号',
          menuBtnTitle: '操作',
          searchBtnText: '查询',
          emptyBtnText: '重置',
          emptyBtnIcon: 'el-icon-refresh',
          addBtn: false,
          addBtnText: '新建',
          addBtnIcon: ' ',
          emptyText: '暂无数据',
          stripe: false,
          refreshBtn: false,
          columnBtn: false,
          searchShowBtn: false,
          searchMenuSpan: 12,
          tip: false,
          indexFixed: false,
          menuFixed: false,
          border: false,
          index: true,
          viewBtn: true,
          column: [
            {
              label: '角色编码',
              prop: 'roleCode',
              search: true,
              addDisabled: true,
              editDisabled: true,
              align: 'center'
            },
            {
              label: '角色名称',
              prop: 'roleName',
              search: true,
              rules: [
                {
                  required: true,
                  message: '角色名称不能为空',
                  trigger: 'blur'
                }
              ]
            },
            {
              label: '角色描述',
              prop: 'roleDesc'
            }
          ]
        }
      }
    },
    created() {
      this.getPageList()
    },
    computed: {
      permissionList() {
        return {
          addBtn: true
        }
      }
    },
    methods: {
      getPageList() {
        this.pageQuery.page.page_num = this.rolePage.currentPage
        this.pageQuery.page.page_size = this.rolePage.page_size
        this.loading = true
        rolePageList(this.pageQuery).then(res => {
          this.roleData = res.data
          console.log(this.roleData)
          this.rolePage.total = Number(res.page.total_num)
          this.rolePage.currentPage = Number(res.page.page_num)
          this.rolePage.page_size = Number(res.page.page_size)
          this.loading = false
        })
      },
      searchChange(params, done) {
        this.pageQuery.params = params
        this.getPageList()
        done()
      },
      resetChange(params, done) {
        this.pageQuery.params = {}
        this.getPageList()
      },
      sizeChange(val) {
        this.rolePage.currentPage = 1
        this.rolePage.page_size = val
        this.getPageList()
      },
      currentChange(val) {
        this.rolePage.currentPage = val
        this.getPageList()
      },

      /**
       * 保存角色菜单
       */
      submitRoleMenu() {
        const menuList = this.$refs.roleMenuTree.getCheckedKeys()
        let parmas = {
          roleCode: this.checkedRoleCode,
          menuCodeList: menuList,
          channel: this.channel
        }
        addRoleMenu(parmas).then(res => {
          this.$message({
            type: 'success',
            message: '保存成功！'
          })
        })
        this.box = false
      },

      rowSave(row, done, loading) {
        addRoleInfo(row).then(
          () => {
            done()
            this.getPageList()
            this.$message({
              type: 'success',
              message: '保存成功！'
            })
          },
          error => {
            loading()
          }
        )
      },
      rowUpdate(row, index, done, loading) {
        updateRole(row).then(
          () => {
            done()
            this.getPageList()
            this.$message({
              type: 'success',
              message: '修改成功！'
            })
          },
          error => {
            loading()
          }
        )
      },
      rowDel(row) {
        this.$confirm('是否确定删除角色', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'userDel'
        })
          .then(() => {
            delRole({id: row.id}).then(res => {
              this.getPageList()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            })
          })
          .then(() => {
          })
      },

      handleRole(row, channel) {
        this.defaultObj = []
        this.checkedRoleCode = row.roleCode
        this.channel = channel
        // 获取到对于的菜单树
        menuTree({channel: channel})
          .then(res => {
            this.menuList = res.data
            const params = {roleCode: this.checkedRoleCode, channel: channel}
            // 查询到的选中的菜单code
            return roleMenuInfo(params)
          })
          .then(res => {
            this.defaultObj = res.data
            this.box = true
          })
      },
      /**
       * 选中逻辑
       */
      hanleCheck(data, node) {
        // console.log('checked:', this.$refs.roleMenuTree.getCheckedKeys())

        // const _this = this
        // const isChecked = this.$refs.roleMenuTree.getNode(data.id).checked
        // const isNotRoot = data.parId !== 'JBY_ROOT'
        // if (isChecked) {
        //   data.parId && setParentChecked(data.parId)
        //   if (isNotRoot) {
        //     data.children && setChildrenChecked(data.children, true)
        //   }
        // } else {
        //   data.children && setChildrenChecked(data.children, false)
        // }
        //
        // function setParentChecked(parentId) {
        //   const parentNode = _this.$refs.roleMenuTree.getNode(parentId)
        //   parentNode &&
        //   parentNode.data.parId &&
        //   setParentChecked(parentNode.data.parId)
        //   _this.$refs.roleMenuTree.setChecked(parentId, true)
        // }
        //
        // /**
        //  * 将子节点选中 或者反选
        //  */
        // function setChildrenChecked(node, isChecked) {
        //   node.forEach(item => {
        //     if (item.children) {
        //       setChildrenChecked(item.children, isChecked)
        //       _this.$refs.roleMenuTree.setChecked(item.id, isChecked)
        //     }
        //   })
        // }
        //
      }
    }
  }
</script>
