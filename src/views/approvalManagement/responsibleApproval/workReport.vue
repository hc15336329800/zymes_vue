<!--报工审批-->
<template>
  <div class="app-container">

<!--    搜索栏-->
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
      <el-form-item label="审核状态" class="condition">
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
      <el-form-item label="设备" class="condition">
        <deviceSelected :bind-id.sync="queryParams.params.deviceId"/>
      </el-form-item>
      <el-form-item label="工序名称" class="condition">
        <multipleProcedure :bind-name.sync="queryParams.params.procedureNames"/>
      </el-form-item>
      <el-form-item label="报工时间" class="condition">
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

    <!--    工具栏-->
    <el-row class="mb8">
      <el-button
        type="primary"
        class="commen-button"
        v-if="hasPerm('B008002000001')"
        v-show="buttonShow"
        @click="handlePassStatus('01')"
      >
        <img
          src="@/assets/images/yes.png"
          alt
          style="width: 14px; margin-right: 4px;vertical-align:middle;"
        >审核通过
      </el-button>
      <el-button
        type="primary"
        class="commen-button"
        v-if="hasPerm('B008002000002')"
        v-show="buttonShow"
        @click="handleRejectStatus('02')"
      >
        <img
          src="@/assets/images/no.png"
          alt
          style="width: 14px; margin-right: 4px;vertical-align:middle;"
        >审核拒绝
      </el-button>

<!--      <el-button-->
<!--        type="primary"-->
<!--        class="commen-button"-->
<!--        v-if="showVerifyBtn"-->
<!--        @click="handleVerfilyStatus('03')"-->
<!--      >-->
<!--        <img src="@/assets/images/yes.png" alt style="width: 14px; margin-right: 4px;vertical-align:middle;">-->
<!--        验收通过-->
<!--      </el-button>-->

<!--      <el-button-->
<!--        type="primary"-->
<!--        class="commen-button"-->
<!--        v-if="showRejectVerifyBtn"-->
<!--        @click="handleRejectVerfilyStatus('04')"-->
<!--      >-->
<!--        <img src="@/assets/images/no.png" alt style="width: 14px; margin-right: 4px;">-->
<!--        验收拒绝-->
<!--      </el-button>-->


    </el-row>

    <!--   表格-->
    <el-table :data="pageList" class="commen-table mt_20" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>

      <el-table-column label="订单号" align="center" prop="orderNo"/>

      <el-table-column label="图纸号" align="center" prop="bomNo"/>
      <el-table-column label="物料号" align="center" prop="itemNo"/>
      <el-table-column label="物料名" align="center" prop="itemName"/>

      <el-table-column label="工单号" align="center" prop="workOrderNo"/>
      <el-table-column label="车间" align="center" prop="deptName"/>
      <el-table-column label="设备" align="center" prop="deviceName"/>
      <el-table-column label="组名" align="center" prop="groupName"/>
      <el-table-column label="报工类型" align="center" prop="reportTypeDesc"/>
      <el-table-column label="工序" align="center" prop="procedureName"/>
      <el-table-column label="分配数量" align="center" prop="planTotalCount"/>
      <el-table-column label="正品数量" align="center" prop="realCount"/>
      <el-table-column label="次品数量" align="center" prop="deffCount"/>


<!--      <el-table-column label="组报工人" align="center" prop="groupUserName"/>-->
      <el-table-column label="审核状态" align="center" prop="statusDesc"/>
      <el-table-column label="报工时间" align="center" prop="createdTime"/>


      <!--      <el-table-column-->
<!--        prop="remark"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        width="180"-->
<!--        label="拒绝原因"-->
<!--        :show-overflow-tooltip="true"-->
<!--      />-->
    </el-table>

    <pagination
      style="text-align: right"
      v-show="pageTotal>0"
      :total="pageTotal"
      :page.sync="queryParams.page.page_num"
      :limit.sync="queryParams.page.page_size"
      @pagination="getData"
    />
  </div>
</template>
<script>
import { dictInfo } from '@/api/common'
import {
  updateStatus,
  updateVerifyStatus,
  workReportPage
} from '@/api/workOrder/workReport'
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
      workShopList: [],
      statusList: [],
      verifyList: [],
      queryParams: {
        params: {
          status: '00'
        },
        page: {
          page_num: 1,
          page_size: 10
        }
      },
      selectList: [],
      multipleSelection: [],
      form: {},
      pageTotal: 0,
      pageList: {},
      title: '',
      dialogShow: false,
      buttonShow: false,
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      }
    }
  },

  computed: {
    showVerifyBtn() {
      let permissions = localStorage.getItem('perms')
      if (!permissions) return false
      try {
        permissions = JSON.parse(permissions)
      } catch (e) {
        return false
      }
      return Array.isArray(permissions) && permissions.includes('B008002000003')
    },
    showRejectVerifyBtn() {
      let permissions = localStorage.getItem('perms')
      if (!permissions) return false
      try {
        permissions = JSON.parse(permissions)
      } catch (e) {
        return false
      }
      return Array.isArray(permissions) && permissions.includes('B008002000004')
    }
  },


  created() {

    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}')
    // console.log('userInfo----:', userInfo)


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
      dictInfo('REPORT_STATUS', r => (this.statusList = r))
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page.page_num = 1
      this.getData()
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
      workReportPage(this.queryParams).then(res => {
        this.pageList = res.data
        this.pageTotal = Number(res.page.total_num)
      })
    },
    handlePassStatus() {
      if (this.selectList.length == 0) {
        this.$message.error('请勾选数据！')
        return
      }
      this.$confirm('确认审核通过?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        this.updateReportStatus('01')
      })
    },
    handleRejectStatus() {
      if (this.selectList.length == 0) {
        this.$message.error('请勾选数据！')
        return
      }
      this.$prompt('请填写审核不通过的原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'auditClass',
        inputType: 'textarea'
      })
        .then(({ value }) => {
          // console.log("测试1"+value)
          if (!value || value.length == 0) {
            this.$message.error('请填写审核不通过的原因！')
            return
          }
          this.updateReportStatus('02', value)
        })
        .catch(() => {})
    },
    updateReportStatus(status, message) {
      updateStatus({
        params: {
          ids: this.selectList,
          status: status,
          message: message
        }
      }).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getData()
      })
    },
    handleRejectVerfilyStatus() {
      if (this.selectList.length == 0) {
        this.$message.error('请勾选数据！')
        return
      }
      this.$prompt('请填写验收不通过的原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'auditClass',
        inputType: 'textarea'
      })
        .then(({ value }) => {

          // console.log( '测试2'+value)
          if (!value || value.length == 0) {
            this.$message.error('请填写验收不通过的原因！')
            return
          }
          this.updateVerify('04', value)
        })
        .catch(() => {})
    },
    handleVerfilyStatus() {
      if (this.selectList.length == 0) {
        this.$message.error('请勾选数据！')
        return
      }
      this.$confirm('确认验收通过?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        this.updateVerify('03')
      })
    },
    updateVerify(status, message) {
      updateVerifyStatus({
        params: {
          ids: this.selectList,
          status: status,
          message: message
        }
      }).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getData()
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
      // console.log('测试6'+this.multipleSelection, 'this.selectList')
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
