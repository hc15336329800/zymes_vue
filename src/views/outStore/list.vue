<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
      <el-form-item label="图纸号" class="condition">
        <BomNoSelect :item-no.sync="queryParams.params.itemNo"/>
      </el-form-item>
      <el-form-item label="物料编码" class="condition">
        <el-input v-model="queryParams.params.useItemNo" placeholder="请输入物料名称" clearable/>
      </el-form-item>
      <el-form-item label="部门" class="condition">
        <el-select
          v-model="queryParams.params.deptId"
          clearable
          placeholder="请选择状态"
          style="width:140px;"
          filterable
        >
          <el-option
            :key="dept.code"
            v-for="(dept) in deptList"
            :label="dept.name"
            :value="dept.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" class="condition">
        <el-select
          v-model="queryParams.params.reviewStatus"
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
      <el-form-item label="确认状态" class="condition">
        <el-select
          v-model="queryParams.params.outStatus"
          clearable
          placeholder="请选择状态"
          style="width:140px;"
          filterable
        >
          <el-option
            :key="dept.code"
            v-for="(dept) in outStatusList"
            :label="dept.name"
            :value="dept.code"
          ></el-option>
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
        v-if="hasPerm('B012001000001')"
        class="commen-button"
        @click="updateOutStatusBatch('01')"
      >
        <img
          data-v-3d1a650d
          src="@/assets/images/yes.png"
          alt
          style="width: 14px; margin-right: 4px;vertical-align:middle;"
        >审核通过
      </el-button>
      <el-button
        type="primary"
        class="commen-button"
        @click="updateOutStatusBatch('02')"
        v-if="hasPerm('B012001000002')"
      >
        <img
          data-v-3d1a650d
          src="@/assets/images/no.png"
          alt
          style="width: 14px; margin-right: 4px;vertical-align:middle;"
        >审核拒绝
      </el-button>
    </el-row>
    <el-table :data="pageList" class="commen-table mt_20" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"/>
      <el-table-column label="图纸号" align="center" prop="bomNo"/>
      <el-table-column label="用料编码" align="center" prop="useItemNo"/>
      <el-table-column label="用料名称" align="center" prop="useItemName"/>
      <el-table-column label="创建时间" align="center" prop="createdTime"/>
      <el-table-column label="预估用量" align="center" prop="planCount"/>
      <el-table-column label="实际领料" align="center" prop="realCount"/>
      <el-table-column label="库存量" align="center" prop="itemCount"/>
      <el-table-column label="部门" align="center" prop="deptName"/>
      <el-table-column label="审核状态" align="center" prop="reviewStatusDesc"/>
      <el-table-column label="领料状态" align="center" prop="outStatusDesc"/>
      <el-table-column label="领料时间" align="center" prop="outTime"/>
      <el-table-column label="领料人" align="center" prop="userName"/>
      <el-table-column label="审核人" align="center" prop="reviewName"/>
      <el-table-column label="操作" align="center" width="310" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- 确认后不能编辑和删除 -->
          <el-button
            link
            type="primary"
            icon="Edit"
            v-if="scope.row.reviewStatus=='00' && hasPerm('B012001000001')"
            @click="updateOutStatus(scope.row,'01')"
          >审核通过
          </el-button>
          <el-button
            link
            type="primary"
            icon="Delete"
            v-if="scope.row.reviewStatus=='00' && hasPerm('B012001000002')"
            @click="updateOutStatus(scope.row,'02')"
          >审核拒绝
          </el-button>
          <el-button
            link
            type="primary"
            icon="Delete"
            v-if="(scope.row.reviewStatus=='01' && scope.row.outStatus=='00' ) && hasPerm('B012001000003')"
            @click="handAccept(scope.row)"
          >领料
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
    <el-dialog title="领料确认" :visible.sync="dialogShow" width="480px" @close="beforeClose">
      <el-form :model="form" class="commen-form" :rules="rules" ref="form" label-width="80px">
        <userSelect :title="checkTitle" :user-id.sync="form.outUser" :required-user="true"/>
        <el-form-item prop="deptId" label="部门">
          <el-select
            v-model="form.deptId"
            clearable
            placeholder="请选择状态"
            style="width:140px;"
            filterable
          >
            <el-option
              :key="dept.code"
              v-for="(dept) in deptList"
              :label="dept.name"
              :value="dept.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="useItemNo" label="物料">
          <el-select v-model="form.useItemNo" clearable>
            <el-option
              v-for="item in itemList"
              :key="item.itemNo"
              :label="item.itemName"
              :value="item.itemNo"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="领料数量" class="condition" prop="planCount">
          <el-input-number v-model="form.realCount" :precision="3" :controls="false" :min="0"/>
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
    detailOutStore,
    outStorePageList,
    updateCheckStatus,
    updateOutStore
  } from '@/api/outstore/outStore'
  import {dictInfo} from '@/api/common'
  import {itemSelected} from '@/api/item/itemStock'

  export default {
    components: {
      DateIntervals: () => import('@/components/DateIntervals'),
      Pagination: () => import('@/components/Pagination'),
      BomNoSelect: () => import('@/components/Item/BomNo'),
      UserSelect: () => import('@/components/user/userSelect'),
      itemSelected: () => import('@/components/Item/ItemNo')
    },
    data() {
      return {
        useTitle: '物料编码',
        loading: false,
        queryParams: {
          params: {},
          page: {
            page_num: 1,
            page_size: 10
          }
        },
        checkTitle: '领料人',
        deptList: [],
        statusList: [],
        outStatusList: [
          {code: '00', name: '待出库'},
          {code: '01', name: '已出库'}
        ],
        itemList: [],
        selectList: [],
        multipleSelection: [],
        form: {},
        pageTotal: 0,
        pageList: {},
        title: '',
        dialogShow: false,
        rules: {
          deptId: [{required: true, message: '请选择部门', trigger: 'blur'}],
          planCount: [{required: true, message: '请输入数量', trigger: 'blur'}],
          useItemNo: [{required: true, message: '请选择物料', trigger: 'blur'}]
        }
      }
    },
    created() {
      this.selectOptionsList()
      this.getData()
    },
    methods: {
      selectOptionsList() {
        dictInfo('WORK_SHOP', r => (this.deptList = r))
        dictInfo('REP_CHECK_STATUS', r => (this.statusList = r))
        itemSelected({params: {}}).then(res => {
          this.itemList = res.data
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
      submitForm() {
        updateOutStore({params: this.form}).then(res => {
          this.getData()
          this.$message({
            type: 'success',
            message: '领料成功'
          })
          this.dialogShow = false
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
        this.$refs.userInfoDateIntervals.initDateData()
        this.getData()
      },
      getData() {
        outStorePageList(this.queryParams).then(res => {
          this.pageList = res.data
          this.pageTotal = Number(res.page.total_num)
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
      updateOutStatus(row, status) {
        let name = status === '01' ? '确认审核通过' : '确认审核拒绝'
        this.$confirm(name, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.updateStatus([row.id], status)
        })
      },
      handAccept(row) {
        detailOutStore({
          params: {
            id: row.id
          }
        }).then(res => {
          this.form = res.data
          this.dialogShow = true
        })
      },
      updateOutStatusBatch(status) {
        if (this.selectList.length == 0) {
          this.$message.error('请勾选数据！')
          return
        }
        let name = status === '01' ? '确认审核通过' : '确认审核拒绝'
        this.$confirm(name, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.updateStatus(this.selectList, status)
        })
      },
      updateStatus(ids, status) {
        updateCheckStatus({
          params: {
            ids: ids,
            status: status
          }
        }).then(res => {
          this.getData()
          this.$message({
            type: 'success',
            message: '操作成功'
          })
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
