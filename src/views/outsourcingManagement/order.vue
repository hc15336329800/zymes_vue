<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
      <el-form-item label="图纸号" class="condition">
        <BomNoSelect :item-no.sync="queryParams.params.itemNo"/>
      </el-form-item>
      <el-form-item label="工序名称" class="condition">
        <multipleProcedure :bind-name.sync="queryParams.params.procedureNames"/>
      </el-form-item>
      <el-form-item label="分配状态" class="condition">
        <el-select
          v-model="queryParams.params.status"
          clearable
          placeholder="请选择状态"
          style="width:140px;"
          filterable
        >
          <el-option
            :key="dept.code"
            v-for="(dept) in statusList"
            :label="dept.name"
            :value="dept.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="commen-button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
      </el-form-item>
      <el-form-item class="commen-button reset">
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
      <el-form-item></el-form-item>
    </el-form>

    <el-table :data="pageList" class="commen-table mt_20" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="55" label="序号"></el-table-column>
      <el-table-column label="图纸号" align="center" prop="bomNo"/>
      <el-table-column label="工序名称" align="center" prop="procedureName"/>
      <el-table-column label="工序总数" align="center" prop="totalCount"/>
      <el-table-column label="外协数量" align="center" prop="outerAllocCount"/>
      <el-table-column label="已分配" align="center" prop="outerPubCount"/>
      <el-table-column label="待分配" align="center" prop="waitPubCount"/>
      <el-table-column label="外协已生产" align="center" prop="outerProdCount"/>
      <el-table-column label="操作" align="center" width="310" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- 确认后不能编辑和删除 -->
          <el-button
            link
            type="primary"
            icon="Edit"
            v-if="hasPerm('B010001000001')"
            @click="handleAlloc(scope.row)"
          >分配厂家
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
      <el-table :data="this.submitParams.list" class="commen-table mt_20">
        <el-table-column label="厂家" align="center" prop="bomNo">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.userId"
              clearable
              placeholder="请选择厂家"
              style="width:140px;"
              filterable
            >
              <el-option
                :key="user.code"
                v-for="(user) in userList"
                :label="user.name"
                :value="user.code"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="分配数量" align="center" prop="outerPubCount">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.outerCount"
              :precision="3"
              :controls="false"
              :min="0"
            />
          </template>
        </el-table-column>
      </el-table>
      <div>
        <div style="width:100%;text-align:center;">
          <el-button link type="primary" icon="Edit" @click="addUser()">新增厂家</el-button>
          <el-button link type="primary" icon="Edit" @click="submitForm()">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {outerPubList} from '@/api/procAllocation/procAllocation'
  import {addOuterTask, listTaskById} from '@/api/outTask/outTask'
  import {outerUserList} from '@/api/structure/userInfo'

  export default {
    components: {
      DateIntervals: () => import('@/components/DateIntervals'),
      Pagination: () => import('@/components/Pagination'),
      BomNoSelect: () => import('@/components/Item/BomNo'),
      multipleProcedure: () => import('@/components/Item/multipleProcedure'),
      outerUserSelect: () => import('@/components/user/outerUserSelect')
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
        userList: [],
        submitParams: {
          id: '',
          list: []
        },
        selectList: [],
        multipleSelection: [],
        statusList: [
          {code: '00', name: '待分配'},
          {code: '01', name: '已分配'}
        ],
        form: {},
        pageTotal: 0,
        pageList: {},
        title: '',
        dialogShow: false,
        rules: {
          userId: [{required: true, message: '请选择外协', trigger: 'blur'}],
          count: [{required: true, message: '请输入分配数量', trigger: 'blur'}]
        }
      }
    },
    created() {
      this.getSelectOption()
      this.getData()
    },
    methods: {
      getSelectOption() {
        outerUserList({}).then(res => {
          this.userList = res.data
        })
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
      addUser() {
        if (!this.submitParams.list) {
          this.submitParams.list = []
        }
        this.submitParams.list.push({
          userId: '',
          outerCount: ''
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
        this.getData()
      },
      getData() {
        outerPubList(this.queryParams).then(res => {
          this.pageList = res.data
          this.pageTotal = Number(res.page.total_num)
        })
      },
      //外协分配厂家
      handleAlloc(row) {
        this.title = row.procedureName
        listTaskById({
          params: {
            id: row.id
          }
        }).then(res => {
          this.submitParams.list = res.data
        })
        this.submitParams.id = row.id
        this.$set(this.form, 'id', row.id)
        this.dialogShow = true
      },
      submitForm() {
        addOuterTask({
          params: this.submitParams
        }).then(res => {
          this.dialogShow = false
          this.getData()
          this.$message({
            type: 'success',
            message: '分配成'
          })
        })
      },
      handleSelectionChange(val) {
        if (val.length == this.pageList.length) {
          //当前页数据全选
          val.forEach(item => {
            if (this.selectList.every(it => it != item.id)) {
              this.selectList.push(item.id)
              this.multipleSelection.push(item)
            }
          })
        } else if (val.length > 0) {
          //当前页数据部分改动
          this.pageList.forEach(item => {
            let index = val.findIndex(it => it.id == item.id)
            if (index > -1) {
              if (this.selectList.every(i => i != item.id)) {
                this.selectList.push(item.id)
                this.multipleSelection.push(item)
              }
            } else {
              let i = this.selectList.findIndex(i => i == item.id)
              if (i > -1) {
                this.selectList.splice(i, 1)
                this.multipleSelection.splice(i, 1)
              }
            }
          })
        } else if (val.length == 0) {
          //当前页数据全删除
          this.pageList.forEach(item => {
            let index = this.selectList.findIndex(it => it == item.id)
            if (index > -1) {
              this.selectList.splice(index, 1)
              this.multipleSelection.splice(index, 1)
            }
          })
        }
        console.log(this.multipleSelection, 'this.selectList')
      },

      handleAdd() {
        this.title = '新增'
        this.dialogShow = true
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
