<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
      <el-form-item label="图纸号" class="condition">
        <BomNoSelect :item-no.sync="queryParams.params.itemNo"/>
      </el-form-item>
      <el-form-item label="出入库" class="condition">
        <el-select
          v-model="queryParams.params.bizType"
          clearable
          placeholder="请选择类型"
          style="width:140px;"
          filterable
        >
          <el-option
            :key="dict.code"
            v-for="(dict) in typeList"
            :label="dict.name"
            :value="dict.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="确认状态" class="condition">
        <el-select
          v-model="queryParams.params.storeStatus"
          clearable
          placeholder="请选择状态"
          style="width:140px;"
          filterable
        >
          <el-option
            :key="dict.code"
            v-for="(dict) in statusList"
            :label="dict.name"
            :value="dict.code"
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
        class="commen-button"
        @click="handleAccepts()"
        v-if="hasPerm('B012002000001')"
      >
        <img
          data-v-3d1a650d
          src="@/assets/images/yes.png"
          alt
          style="width: 14px; margin-right: 4px;vertical-align:middle;"
        >确认
      </el-button>
    </el-row>
    <el-table :data="pageList" class="commen-table mt_20" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="图纸号" align="center" prop="bomNo"/>
      <el-table-column label="产品编码" align="center" prop="itemNo"/>
      <el-table-column label="产品名称" align="center" prop="itemName"/>
      <el-table-column label="出入库" align="center" prop="bizTypeDesc"/>
      <el-table-column label="申请数量" align="center" prop="itemCount"/>
      <el-table-column label="状态" align="center" prop="storeStatusDesc"/>
      <el-table-column label="申请数量" align="center" prop="itemCount"/>
      <el-table-column label="申请数量" align="center" prop="itemCount">
        <template slot-scope="scope">
          <template>{{scope.row.autoFlag =="01" ? "领料":"手动"}}</template>
        </template>
      </el-table-column>
      <el-table-column label="确认时间" align="center" prop="confirmTime"/>
      <el-table-column label="创建时间" align="center" prop="createdTime"/>
      <el-table-column label="操作" align="center" width="310" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- 确认后不能编辑和删除 -->
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleAccept(scope.row)"
            v-if="hasPerm('B012002000001')"
          >确认
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
  </div>
</template>
<script>
  import {
    addDeviceType,
    deleteDeviceType,
    detailDeviceType,
    pageList,
    updateDeviceType
  } from '@/api/device/deviceType'
  import {dictInfo} from '@/api/common'
  import {
    addStore,
    confirmStore,
    deleteStore,
    detailStore,
    storePageList,
    updateStore
  } from '@/api/inout/store'

  export default {
    components: {
      DateIntervals: () => import('@/components/DateIntervals'),
      Pagination: () => import('@/components/Pagination'),
      BomNoSelect: () => import('@/components/Item/BomNo')
    },
    data() {
      return {
        queryParams: {
          params: {
            storeStatus: '00'
          },
          page: {
            page_num: 1,
            page_size: 10
          }
        },
        form: {},
        pageTotal: 0,
        pageList: {},
        typeList: [],
        statusList: [],
        selectList: [],
        multipleSelection: [],
        title: '',
        dialogShow: false,
        rules: {
          itemNo: [{required: true, message: '请输入图纸号', trigger: 'blur'}],
          itemCount: [{required: true, message: '请输入数量', trigger: 'blur'}],
          bizType: [{required: true, message: '请选择出入库', trigger: 'blur'}]
        }
      }
    },
    created() {
      this.getOptionData()
      this.getData()
    },
    methods: {
      getOptionData() {
        dictInfo('STOCK_TYPE', r => (this.typeList = r))
        dictInfo('CONFIRM_STATUS', r => (this.statusList = r))
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
        storePageList(this.queryParams).then(res => {
          this.pageList = res.data
          this.pageTotal = Number(res.page.total_num)
        })
      },
      handleAccept(item) {
        this.confirmStatus([item.id])
      },
      handleAccepts() {
        if (this.selectList.length == 0) {
          this.$message.error('请勾选数据！')
          return
        }
        this.confirmStatus(this.selectList)
      },
      confirmStatus(item) {
        confirmStore({
          params: {
            ids: item
          }
        }).then(res => {
          this.getList()
          this.$message({
            type: 'success',
            message: '确认成功'
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
