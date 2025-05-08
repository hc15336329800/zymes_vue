<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
      <el-form-item label="图纸号" class="condition">
        <BomNoSelect :item-no.sync="queryParams.params.itemNo"/>
      </el-form-item>
      <el-form-item prop="workOrderNo" label="工单号" class="condition">
        <el-input v-model="queryParams.params.workOrderNo"/>
      </el-form-item>
      <el-form-item label="车间" class="condition">
        <el-select
          v-model="queryParams.params.deptId"
          clearable
          placeholder="请选择状态"
          style="width:140px;"
          filterable
        >
          <el-option
            :key="dept.code"
            v-for="(dept) in workShopList"
            :label="dept.name"
            :value="dept.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备" class="condition">
        <deviceSelected :bind-id.sync="queryParams.params.deviceId"/>
      </el-form-item>
      <el-form-item label="状态" class="condition">
        <el-select v-model="queryParams.params.status" placeholder="请选择">
          <el-option key="01" label="全部" value=""/>
          <el-option key="01" label="未完成" value="01"/>
          <el-option key="02" label="已完成" value="02"/>
        </el-select>
      </el-form-item>
      <el-form-item label="工序名称" class="condition">
        <multipleProcedure :bind-name.sync="queryParams.params.procedureNames"/>
      </el-form-item>
      <el-form-item class="commen-button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
      </el-form-item>
      <el-form-item class="commen-button reset">
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
      <el-form-item class="commen-button">
        <el-button type="primary"  @click="allHandleAssign" v-show="buttonShow" >批量下达</el-button>
      </el-form-item>
      <el-form-item class="commen-button">
        <el-button type="primary" @click="allHandleReport" v-show="buttonShow" >批量报工</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb8">
      <!--      <el-button type="primary" class="commen-button" icon="el-icon-plus" @click="handleAdd">新增</el-button>-->
    </el-row>
    <el-table :data="pageList" class="commen-table mt_20"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column label="图纸号" align="center" prop="bomNo"/>
      <el-table-column v-if="showColumn" label="物料编码" align="center" prop="itemNo"/>
      <el-table-column label="工单号" align="center" prop="workOrderNo"/>
      <el-table-column label="工序" align="center" prop="procedureName"/>
      <el-table-column label="设备" align="center" prop="deviceName"/>
      <el-table-column label="车间" align="center" prop="deptName"/>
      <el-table-column label="班次" align="center" prop="shiftType" :formatter="statusFormatter"/>
      <el-table-column label="分配数量" align="center" prop="planTotalCount"/>
      <el-table-column label="已下达数量" align="center" prop="assignCount"/>
      <el-table-column label="待下达数量" align="center" prop="waitAssignCount"/>
      <el-table-column label="待验收正品数量" align="center" prop="toReviewRealCount"/>
      <el-table-column label="正品数量" align="center" prop="realCount"/>
      <el-table-column label="待确认次品数量" align="center" prop="toReviewDeffCount"/>
      <el-table-column label="次品数量" align="center" prop="deffCount"/>
      <el-table-column label="更新时间" align="center" prop="updatedTime" width="100"/>
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <!-- 确认后不能编辑和删除 -->
          <el-button
            link
            type="primary"
            v-if="hasPerm('B009003000002')"
            icon="Edit"
            @click="handleAssign(scope.row)"
            v-show="buttonShow"
          >下达
          </el-button>
          <el-button link type="primary" v-if="hasPerm('B009003000001')" icon="Delete" @click="handleReport(scope.row)" v-show="buttonShow">
            报工
          </el-button>
          <el-button v-if="scope.row.deviceName.indexOf('折弯机') !==-1" link type="primary" icon="Delete"
                     @click="handleHastrue(scope.row,0)">开始
          </el-button>
          <el-button v-if="scope.row.deviceName.indexOf('折弯机') !==-1" link type="primary" icon="Delete"
                     @click="handleHastrue(scope.row,1)">完成
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
    <el-dialog title="下达" :visible.sync="dialogShow" width="480px" @close="beforeClose">
      <el-form :model="form" class="commen-form" :rules="rules" ref="form" label-width="80px">
        <el-form-item prop="procedureName" label="工序名称">
          <el-input v-model="form.procedureName" :disabled="true"/>
        </el-form-item>
        <el-form-item prop="assignCount" label="下达数量">
          <el-input-number v-model="form.assignCount" :precision="3" :controls="false" :min="0"/>
        </el-form-item>
        <el-form-item v-if="showColumn" prop="deviceName" label="设备名称">
          <el-input-number v-model="form.deviceName" :precision="3" :controls="false" :min="0"/>
        </el-form-item>
        <el-form-item v-if="showColumn" prop="itemNo" label="物料名称">
          <el-input-number v-model="form.itemNo" :precision="3" :controls="false" :min="0"/>
        </el-form-item>
        <el-form-item v-if="showColumn" prop="itemNo" label="图纸号">
          <el-input-number v-model="form.bomNo" :precision="3" :controls="false" :min="0"/>
        </el-form-item>
        <div class="dialog-footer" style="text-align: center;width:100%;">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- 添加或修改对话框 -->
    <el-dialog title="确认" :visible.sync="dialogShow1" width="480px" @close="beforeClose1">
      <el-form
        :model="reportForm"
        class="commen-form"
        :rules="rules1"
        ref="reportForm"
        label-width="80px"
      >
        <el-form-item prop="procedureName" label="工序名称" class="condition">
          <el-input v-model="reportForm.procedureName" :disabled="true"/>
        </el-form-item>
        <el-form-item label="报工类型" class="condition" prop="groupId">
          <el-select
            v-model="reportForm.reportType"
            clearable
            placeholder="请选择分组"
            style="width:200px;"
            filterable
          >
            <el-option
              :key="dept.code"
              v-for="(dept) in reportTypeList"
              :label="dept.name"
              :value="dept.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分组" class="condition" prop="groupId">
          <el-select
            v-model="reportForm.groupId"
            clearable
            placeholder="请选择分组"
            style="width:200px;"
            filterable
          >
            <el-option
              :key="dept.code"
              v-for="(dept) in groupList"
              :label="dept.name"
              :value="dept.code"
            ></el-option>
          </el-select>
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
          <el-button @click="cancel1">取 消</el-button>
          <el-button type="primary" @click="submitForm1">确认完成</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- 添加或修改对话框 -->
    <el-dialog title="确认" :visible.sync="dialogShow2" width="480px" @close="beforeClose1">
      <el-form
        :model="reportForm1"
        class="commen-form"
        :rules="rules2"
        ref="reportForm1"
        label-width="80px"
      >
        <el-form-item prop="procedureName" label="已选择序号" class="condition" v-if="showFormItem">
          <el-input v-model="reportForm1.ids" :disabled="true"/>
        </el-form-item>
        <el-form-item label="报工类型" class="condition" prop="groupId">
          <el-select
            v-model="reportForm1.reportType"
            clearable
            placeholder="请选择分组"
            style="width:200px;"
            filterable
          >
            <el-option
              :key="dept.code"
              v-for="(dept) in reportTypeList"
              :label="dept.name"
              :value="dept.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分组" class="condition" prop="groupId">
          <el-select
            v-model="reportForm1.groupId"
            clearable
            placeholder="请选择分组"
            style="width:200px;"
            filterable
          >
            <el-option
              :key="dept.code"
              v-for="(dept) in groupList"
              :label="dept.name"
              :value="dept.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="dialog-footer" style="text-align: center;width:100%;">
          <el-button @click="cancel1">取 消</el-button>
          <el-button type="primary" @click="submitForm2">确认完成</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import {dictInfo} from '@/api/common'
  import {addAssign, addReport,addAllReport, workOrderList, saveItemand, getRealnumber,allAddAssign} from '@/api/workOrder/workOrder'
  import {groupSelected} from '@/api/group/group'
  import {mapGetters} from "vuex";

  export default {
    components: {
      DateIntervals: () => import('@/components/DateIntervals'),
      Pagination: () => import('@/components/Pagination'),
      BomNoSelect: () => import('@/components/Item/BomNo'),
      WorkShop: () => import('@/components/Dept/workShop'),
      deviceSelected: () => import('@/components/Device/deviceSelected'),
      multipleProcedure: () => import('@/components/Item/multipleProcedure')
    },
    data() {
      return {
        queryParams: {
          params: {
            status:'01'
          },
          page: {
            page_num: 1,
            page_size: 10
          }
        },
        form: {},
        reportForm: {},
        reportForm1: {},
        groupList: [],
        reportTypeList: [],
        pageTotal: 0,
        pageList: {},
        title: '',
        workShopList: [],
        dialogShow: false,
        dialogShow1: false,
        dialogShow2: false,
        showColumn: false,
        showFormItem: false,
        buttonShow: false,
        multipleSelection: [],
        rules: {
          assignCount: [
            {required: true, message: '请输入下达数量', trigger: 'blur'}
          ]
        },
        rules1: {
          realCount: [
            {required: true, message: '请输入正品数量', trigger: 'blur'}
          ],
          deffCount: [
            {required: true, message: '请输入次品数量', trigger: 'blur'}
          ],
          groupId: [{required: true, message: '请选择分组', trigger: 'blur'}],
          reportType: [
            {required: true, message: '请选择报工类型', trigger: 'blur'}
          ]
        },
        rules2: {
          groupId: [{required: true, message: '请选择分组', trigger: 'blur'}],
          reportType: [
            {required: true, message: '请选择报工类型', trigger: 'blur'}
          ]
        },
        selectList: []
      }
    },
    created() {
      const user = localStorage.getItem('user_info');
      const name = JSON.parse(user).userName;
      this.buttonShow = true;
      // if(name ==='admin'){
      //   this.buttonShow = true;
      // }else{
      //   this.currentHour = new Date().getHours();
      //   if(this.currentHour === 18 || this.currentHour === 19 || this.currentHour === 20 || this.currentHour === 21){
      //     this.buttonShow = true;
      //   }
      // }
      this.getSelectOptions()
      this.getData()
    },
    methods: {
      getSelectOptions() {
        dictInfo('WORK_SHOP', r => (this.workShopList = r))
        dictInfo('REPORT_TYPE', r => (this.reportTypeList = r))

        groupSelected({}).then(res => {
          this.groupList = res.data
        })
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.page.page_num = 1
        this.getData()
      },
      beforeClose1() {
        this.reportForm = {}
        this.$refs['reportForm'].clearValidate()
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
        this.getData()
      },
      getData() {
        workOrderList(this.queryParams).then(res => {
          this.pageList = res.data
          this.pageTotal = Number(res.page.total_num)
        })
      },
      handleAssign(row) {
        this.$set(this.form, 'workOrderId', row.id)
        this.$set(this.form, 'procedureName', row.procedureName)
        this.$set(this.form, 'assignCount', row.waitAssignCount)
        this.$set(this.form, 'itemNo', row.itemNo)
        this.$set(this.form, 'deviceName', row.deviceName)
        this.$set(this.form, 'bomNo', row.bomNo)
        this.dialogShow = true
      },
      allHandleAssign() {
        if (this.selectList.length == 0) {
          this.$message.error('请勾选数据！')
          return
        }
        this.$confirm('确定全部下达,将下达所有数量？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          allAddAssign({
            params: {
              ids: this.selectList
            }
          }).then(res => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getData()
          })
        })
      },
      allHandleReport() {
        if (this.selectList.length == 0) {
          this.$message.error('请勾选数据！')
          return
        }
        this.$set(this.reportForm1, 'ids', this.selectList)
        this.dialogShow2 = true
      },
      handleReport(row) {
        if (row.deviceName.indexOf('切管机') >= 0 || row.deviceName.indexOf('火焰切割机') || row.deviceName.indexOf('焊接') >= 0) {
          getRealnumber(row).then(res => {
            this.$set(this.reportForm, 'workOrderId', row.id)
            this.$set(this.reportForm, 'procedureName', row.procedureName)
            this.$set(this.reportForm, 'realCount', res.data)
            this.$set(this.reportForm, 'deffCount', 0)
            this.dialogShow1 = true
          })
        } else {
          this.$set(this.reportForm, 'workOrderId', row.id)
          this.$set(this.reportForm, 'procedureName', row.procedureName)
          this.$set(this.reportForm, 'realCount', row.waitReportCount)
          this.$set(this.reportForm, 'deffCount', 0)
          this.dialogShow1 = true
        }
      },
      handleHastrue(row, statu) {
        row.dataStatus = statu;
        saveItemand({
          params: row
        }).then(res => {
          this.getData()
          this.$message({
            type: 'success',
            message: '开始加工'
          })
        })
      },
      submitForm() {
        addAssign({
          params: this.form
        }).then(res => {
          this.getData()
          this.$message({
            type: 'success',
            message: '下达成功'
          })
        })
        this.dialogShow = false
      },
      submitForm1() {
        addReport({
          params: this.reportForm
        }).then(res => {
          this.$message({
            type: 'success',
            message: '全部报工成功'
          })
          this.getData()
        })
        this.dialogShow1 = false
      },
      submitForm2() {
        addAllReport({
          params: this.reportForm1
        }).then(res => {
          this.$message({
            type: 'success',
            message: '全部报工成功'
          })
          this.getData()
        })
        this.dialogShow2 = false
      },
      cancel1() {
        this.dialogShow1 = false
        this.reportForm = {}
        this.$refs['reportForm'].clearValidate()
      },
      statusFormatter(row, column) {
        if (row.shiftType === '01') {
          return '白班';
        } else if (row.shiftType === '02') {
          return '夜班';
        }
        return '未知';
      },
      cancel() {
        this.dialogShow = false
        this.form = {}
        this.$refs['form'].clearValidate()
      },
      handleSelectionChange(val) {
        if (val.length == this.pageList.length) {
          // console.log(this.pageList)
          //当前页数据全选
          this.pageList.forEach(item => {
            console.log(item)
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
