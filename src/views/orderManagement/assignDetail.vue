<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
      <el-form-item label="图纸号" class="condition">
        <BomNoSelect :item-no.sync="queryParams.params.itemNo"/>
      </el-form-item>
      <el-form-item label="车间" class="condition">
        <el-select v-model="queryParams.params.deptId" clearable placeholder="请选择状态" style="width:140px;" filterable>
          <el-option :key="dept.code" v-for="(dept) in workShopList" :label="dept.name" :value="dept.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备" class="condition">
        <deviceSelected :bind-id.sync="queryParams.params.deviceId"  />
      </el-form-item>
      <el-form-item label="工序名称" class="condition">
        <multipleProcedure :bind-name.sync='queryParams.params.procedureNames' />
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
      <el-table-column label="工单号" align="center" prop="workOrderNo"/>
      <el-table-column label="图纸号" align="center" prop="bomNo"/>
      <el-table-column label="工序名称" align="center" prop="procedureName"/>
      <el-table-column label="分配数量" align="center" prop="itemCount"/>
      <el-table-column label="正品数量" align="center" prop="realCount"/>
      <el-table-column label="次品数量" align="center" prop="deffCount"/>
      <el-table-column label="车间" align="center" prop="deptName"/>
      <el-table-column label="设备" align="center" prop="deviceName"/>
      <el-table-column label="班次" align="center" prop="shiftTypeDesc"/>
      <el-table-column label="分配人" align="center" prop="createdByName"/>
      <el-table-column label="分配时间" align="center" prop="createdTime"/>
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
import { workOrderLogPage } from '@/api/workOrder/workOrder'

export default {
  components: {
    DateIntervals: () => import('@/components/DateIntervals'),
    Pagination: () => import('@/components/Pagination'),
    BomNoSelect: () => import('@/components/Item/BomNo'),
    WorkShop: () => import('@/components/Dept/workShop'),
    deviceSelected: () => import('@/components/Device/deviceSelected'),
    multipleProcedure: () => import('@/components/Item/multipleProcedure'),


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
      workShopList:[],
      form: {},
      pageTotal: 0,
      pageList: {},
      title: '',
      dialogShow: false,
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getSelectOptions();
    this.getData()
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page.page_num = 1
      this.getData()
    },
    beforeClose() {
      this.form = {}
      this.$refs['form'].clearValidate()
    },
    getSelectOptions(){
      dictInfo("WORK_SHOP",r=>this.workShopList=r);
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
      workOrderLogPage(this.queryParams).then(res => {
        this.pageList = res.data
        this.pageTotal = Number(res.page.total_num)
      })
    },

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
