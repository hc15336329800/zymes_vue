<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
      <el-form-item label="图纸号" class="condition">
        <BomNoSelect :item-no.sync="queryParams.params.itemNo"/>
      </el-form-item>
      <el-form-item label="厂家" class="condition">
        <el-select
          v-model="queryParams.params.userId"
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
      </el-form-item>

      <el-form-item label="工序名称" class="condition">
        <multipleProcedure :bind-name.sync="queryParams.params.procedureNames"/>
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
    <el-table :data="pageList" class="commen-table mt_20">
      <el-table-column type="index" width="55" label="序号"></el-table-column>
      <el-table-column label="图纸号" align="center" prop="bomNo"/>
      <el-table-column label="工序名称" align="center" prop="procedureName"/>
      <el-table-column label="外协厂家" align="center" prop="userName"/>
      <el-table-column label="分配数量" align="center" prop="outerCount"/>
      <el-table-column label="正品数量" align="center" prop="realCount"/>
      <el-table-column label="待验收正品数量" align="center" prop="waitRealCount"/>
      <el-table-column label="次品数量" align="center" prop="deffCount"/>
      <el-table-column label="待验收次品数量" align="center" prop="waitDeffCount"/>
      <el-table-column label="分配时间" align="center" prop="createdTime"/>
      <el-table-column label="接收状态" align="center" prop="acceptStatusDesc"/>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- 确认后不能编辑和删除 -->
          <el-button
            link
            type="primary"
            icon="Edit"
            v-if="hasPerm('B010002000001')"
            @click="handleAccept(scope.row)"
          >接收
          </el-button>
          <el-button
            link
            type="primary"
            icon="Edit"
            v-if="scope.row.acceptStatus='01' && hasPerm('B010002000002')"
            @click="handleReport(scope.row)"
          >报工
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
    <el-dialog title="报工" :visible.sync="dialogShow" width="480px" @close="beforeClose">
      <el-form
        :model="reportForm"
        class="commen-form"
        :rules="rules"
        ref="reportForm"
        label-width="80px"
      >
        <el-form-item prop="procedureName" label="工序名称" class="condition">
          <el-input v-model="reportForm.procedureName" :disabled="true"/>
        </el-form-item>
        <el-form-item prop="realCount" label="正品数量">
          <el-input-number
            v-model="reportForm.realCount"
            :precision="3"
            :controls="false"
            :min="0"
          />
        </el-form-item>
        <el-form-item prop="deffCount" label="次品数量">
          <el-input-number
            v-model="reportForm.deffCount"
            :precision="3"
            :controls="false"
            :min="0"
          />
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
  import {outerPageList} from '@/api/outTask/outTask'
  import {outerUserList} from '@/api/structure/userInfo'
  import {outTaskAcceptReport, outTaskReport} from '@/api/outTask/outTaskReport'

  export default {
    components: {
      DateIntervals: () => import('@/components/DateIntervals'),
      Pagination: () => import('@/components/Pagination'),
      BomNoSelect: () => import('@/components/Item/BomNo'),
      multipleProcedure: () => import('@/components/Item/multipleProcedure')
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
        reportForm: {
          taskId: '',
          realCount: 0,
          deffCount: 0
        },
        form: {},
        pageTotal: 0,
        pageList: {},
        title: '',
        dialogShow: false,
        rules: {
          realCount: [
            {required: true, message: '请输入正品数量', trigger: 'blur'}
          ],
          deffCount: [
            {required: true, message: '请输入次品数量', trigger: 'blur'}
          ]
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
        this.reportForm = {}
        this.$refs['reportForm'].clearValidate()
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
        outerPageList(this.queryParams).then(res => {
          this.pageList = res.data
          this.pageTotal = Number(res.page.total_num)
        })
      },
      handleAdd() {
        this.title = '新增'
        this.dialogShow = true
      },
      handleReport(row) {
        this.$set(this.reportForm, 'taskId', row.id)
        this.$set(this.reportForm, 'procedureName', row.procedureName)
        this.$set(this.reportForm, 'realCount', 0)
        this.$set(this.reportForm, 'deffCount', 0)

        this.dialogShow = true
        this.title = '编辑'
      },
      handleAccept(row) {
        outTaskAcceptReport({
          params: {
            id: row.id
          }
        }).then(res => {
          this.dialogShow = false
          this.getData()
          this.$message({
            type: 'success',
            message: '接收成功'
          })
        })
      },
      submitForm() {
        outTaskReport({
          params: this.reportForm
        }).then(res => {
          this.dialogShow = false
          this.getData()
          this.$message({
            type: 'success',
            message: '分配成'
          })
        })
      },

      cancel() {
        this.dialogShow = false
        this.reportForm = {}
        this.$refs['reportForm'].clearValidate()
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
