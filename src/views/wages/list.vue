<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
      <el-form-item label="图纸号" class="condition">
        <BomNoSelect :item-no.sync="queryParams.params.itemNo"/>
      </el-form-item>
      <el-form-item label="工人" class="condition">
        <pinyinSelect :selectList="userList" labelName="name" lableId="code" :value="queryParams.params.userId"
                      :selectChange.sync="queryParams.params.userId"></pinyinSelect>
      </el-form-item>
      <el-form-item label="工序名称" class="condition">
        <multipleProcedure :bind-name.sync='queryParams.params.procedureNames'/>
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
<!--      <el-form-item class="commen-button">-->
<!--        <el-button type="primary" class="mb_20" @click="operHandle()" v-if="hasPerm('B006006000002')">-->
<!--          <img-->
<!--            src="@/assets/images/export.png"-->
<!--            style="width:14px;vertical-align:center;margin-right:4px;"-->
<!--            alt-->
<!--          >导出-->
<!--        </el-button>-->
<!--      </el-form-item>-->
      <el-form-item></el-form-item>
    </el-form>

    <el-table :data="pageList" class="commen-table mt_20">
      <el-table-column type="index" width="55" label="序号"></el-table-column>
      <el-table-column label="订单号" align="center" prop="orderNo"/>
      <el-table-column label="图纸号" align="center" prop="bomNo"/>
      <el-table-column label="工人" align="center" prop="userName"/>

      <el-table-column label="工序" align="center" prop="procedureName"/>
      <el-table-column label="加工件数" align="center" prop="userCount"/>
      <el-table-column label="单价" align="center" prop="hoursFixed"/>
      <el-table-column label="工资" align="center" prop="wages"/>
      <el-table-column label="日期" align="center" prop="createDate"/>
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
  import {dictInfo, get_new_export} from '@/api/common'
  import {workReportPage} from '@/api/workOrder/workReport'
  import {wages_page_list} from '@/api/wages'
  import pinyinSelect from '@/components/pinyinSelect.vue'
  import {new_audit_delivery_page_list} from "@/api/order";

  export default {
    components: {
      pinyinSelect,
      DateIntervals: () => import('@/components/DateIntervals'),
      Pagination: () => import('@/components/Pagination'),
      BomNoSelect: () => import('@/components/Item/BomNo'),
      UserSelect: () => import('@/components/user/userSelect'),
      multipleProcedure: () => import('@/components/Item/multipleProcedure'),
    },
    data() {
      return {
        userTitle: '工人',
        workShopList: [],
        statusList: [],
        userList: [],
        queryParams: {
          params: {},
          page: {
            page_num: 1,
            page_size: 20
          }
        },
        form: {},
        pageTotal: 0,
        pageList: {},
        title: '',
        dialogShow: false,
        rules: {
          name: [{required: true, message: '请输入名称', trigger: 'blur'}],
          remark: [{required: true, message: '请输入备注', trigger: 'blur'}]
        }
      }
    },
    created() {

      //获取用户信息  当前登录用户  当前用户
      const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}')
      console.log('当前登录用户id----:', userInfo.id)

      // ✅ 初始化时设置 userId 为当前用户
      this.queryParams.params.userId = userInfo.id

      this.getSelectOptions()
      this.getData()
    },
    methods: {
      getSelectOptions() {
        dictInfo("USER_INFO", r => (this.userList = r))


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
            page_size: 20
          },
          params: {}
        }
        this.$refs.userInfoDateIntervals.initDateData()
        this.getData()
      },
      getData() {
        wages_page_list(this.queryParams).then(res => {
          this.pageList = res.data
          this.pageTotal = Number(res.page.total_num)
        })
      },
      async operHandle() {

        get_new_export('api/work/worker_report_dtl/export_order', {
          page: {page_num: 1, page_size: 1},
          params: this.queryParams
        })
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
