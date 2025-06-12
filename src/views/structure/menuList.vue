<template>
  <basic-container>
    <avue-crud
      ref="crud"
      class="commen-table commen-search avue-crud"
      :option="optionMenu"
      :data="menuPageData"
      :before-close="beforeClose"
      @tree-load="menuTreeLoad"
      @search-change="searchChange"
      @search-reset="resetChange"
      @row-update="rowMenuUpdate"
      @row-save="rowMenuSave"
      @row-del="rowMenuDel"
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
      <template slot="menuBtn" slot-scope="{row}">
        <el-dropdown-item
          icon="el-icon-plus"
          divided
          v-if="row.menuType == '01'"
          @click.native="handleSubAdd(row, '01')"
        >新增子级
        </el-dropdown-item>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {
    menuLazyPage,
    delMenu,
    addMenu,
    updateMenu
  } from '@/api/structure/menuinfo'

  export default {
    name: 'Menu',
    components: {
      Pagination: () => import('@/components/Pagination')
    },
    data() {
      var validateParentVal = (rule, value, callback) => {
        const field = rule.field
        const msg = rule.message
        if (this.saveParams.parentCode) {
          let v = ''
          if (field === 'channel') {
            v = this.saveParams.channel
          } else if (field === 'menuType') {
            v = this.saveParams.menuType
          }
          if (v !== value) {
            callback(new Error(msg))
          }
        }
        callback()
      }
      return {
        // 查询参数
        parentCode: '',
        saveParams: {
          parentCode: '',
          channel: '',
          menuType: ''
        },
        queryParams: {
          parCode: '',
          menuCode: '',
          menuName: ''
        },
        menuPageData: [],
        optionMenu: {
          menuType: 'menu',
          menuBtnTitle: '操作',
          emptyBtnText: '重置',
          lazy: true,
          addBtn: false,
          rowKey: 'menuCode',
          rowParentKey: 'parentMenuCode',
          emptyBtnIcon: 'el-icon-refresh',
          menuWidth: '120',
          searchMenuSpan: 6,
          viewBtn: true,
          refreshBtn: false,
          columnBtn: false,
          searchShowBtn: false,
          column: [
            {
              label: '菜单编码',
              prop: 'menuCode',
              editDisabled: true,
              addDisplay: false,
              search: true,
              width: '180',
              align: 'center'
            },
            {
              label: '资源名称',
              prop: 'menuName',
              search: true,
              width: '180',
              rules: [
                {
                  required: true,
                  message: '资源名称不能为空',
                  trigger: 'blur'
                }
              ]
            },
            {
              label: '菜单地址',
              prop: 'menuUrl',
              width: '180'
            },
            {
              label: '菜单icon',
              prop: 'menuIcon'
            },
            {
              label: '顺序号',
              prop: 'seqNo',
              value: 1,
              type: 'number',
              min: 1,
              rules: [
                {
                  required: true,
                  message: '顺序号不能为空',
                  trigger: 'blur'
                }
              ]
            },
            {
              label: '资源类型',
              prop: 'menuType',
              editDisabled: true,
              type: 'radio',
              value: '01',
              dicData: [
                {
                  label: '菜单',
                  value: '01'
                },
                {
                  label: '按钮',
                  value: '02'
                }
              ]
              // rules: [{ required: true, validator: validateParentVal, trigger: 'change', message: '必须与上级资源类型一致'  }]
            },
            {
              label: '渠道',
              prop: 'channel',
              editDisabled: true,
              type: 'radio',
              value: '01',
              dicData: [
                {
                  label: 'web',
                  value: '01'
                },
                {
                  label: 'app',
                  value: '02'
                }
              ],
              rules: [
                {
                  required: true,
                  validator: validateParentVal,
                  trigger: 'change',
                  message: '必须与上级渠道一致'
                }
              ]
            }
          ]
        }
      }
    },
    created() {
      this.getPageList()
    },
    methods: {
      async getPageList() {
        this.parentCode = ''
        const md = await this.dataFromDb()
        this.menuPageData = md
      },

      searchChange(params, done) {
        this.queryParams = params
        this.getPageList()
        done()
      },

      resetChange(params, done) {
        this.queryParams = {}
        this.getPageList()
      },

      rowMenuDel(row, index, done) {
        delMenu({
          id: row.id
        }).then(() => {
          this.$message({
            type: 'success',
            message: '修改成功！'
          })
          this.getPageList()
        })
      },

      rowMenuSave(row, done, loading) {
        row.parentCode = this.saveParams.parentCode
        addMenu(row).then(
          () => {
            this.$message({
              type: 'success',
              message: '新增成功！'
            })
            done()
            this.getPageList()
          },
          error => {
            loading()
          }
        )
      },

      rowMenuUpdate(row, index, done) {
        updateMenu(row).then(
          () => {
            this.$message({
              type: 'success',
              message: '修改成功！'
            })
            done()
            this.getPageList()
          },
          error => {
            loading()
          }
        )
      },

      /**
       * 新增 子集的时候，类型和渠道应不被修改
       */
      handleSubAdd(row) {
        this.saveParams.parentCode = row.menuCode
        this.saveParams.channel = row.channel
        this.saveParams.menuType = row.menuType
        this.$refs.crud.rowAdd()
      },

      /** 查询菜单列表 */
      getPageeList() {
        this.loading = true
        menuLazyPage({
          page: {
            page_num: this.page.page_num,
            page_size: this.page.page_size
          },
          params: this.queryParams
        }).then(response => {
          this.menuList = this.handleTree(response.data, 'id')
          this.loading = false
        })
      },
      async menuTreeLoad(tree, treeNode, resolve) {
        this.parentCode = tree.menuCode
        const subData = await this.dataFromDb()
        resolve(subData)
      },
      dataFromDb() {
        this.queryParams.parCode = this.parentCode
        return new Promise(resolve => {
          menuLazyPage(this.queryParams).then(res => {
            const menuData = res.data
            resolve(menuData)
          })
        })
      },
      beforeClose(done, type) {
        this.saveParams = {}
        done()
      }
    }
  }
</script>
