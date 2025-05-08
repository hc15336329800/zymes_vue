<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
      <el-form-item label="设备名称" class="condition">
        <el-input v-model="queryParams.params.device" placeholder="请输入名称" clearable/>
      </el-form-item>


      <el-form-item class="commen-button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
      </el-form-item>
      <el-form-item></el-form-item>
    </el-form>
    <el-table :data="pageList" class="commen-table mt_20">
      <el-table-column type="index" width="55" label="序号"></el-table-column>
      <el-table-column v-if="showColumn" label="主键" align="center" prop="id"/>
      <el-table-column label="设备名称" align="center" prop="device"/>
      <el-table-column label="工位" align="center" prop="station"/>
      <el-table-column label="库位" align="center" prop="location"/>
      <el-table-column label="状态"  align="center" prop="status" :formatter="statusFormatter" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- 确认后不能编辑和删除 -->
          <el-button link type="primary" @click="handleUpdate(scope.row,0)">入料</el-button>
          <el-button link type="primary" @click="handleUpdate(scope.row,1)">出料</el-button>
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
    updateDeviceLocation,
    DeviceLocationPageList
  } from '@/api/item/deviceLocation'

  export default {
    components: {
      DateIntervals: () => import('@/components/DateIntervals'),
      Pagination: () => import('@/components/Pagination')
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
        form: {},
        pageTotal: 0,
        pageList: {},
        title: '',
        dialogShow: false,
        rules: '',
        showColumn: false
      }
    },
    created() {
      this.getData()
    },
    methods: {
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.page.page_num = 1
        this.getData()
      },
      getData() {
        DeviceLocationPageList(this.queryParams).then(res => {
          this.pageList = res.data
          this.pageTotal = Number(res.page.total_num)
        })
      },
      handleUpdate(row,status) {
        updateDeviceLocation({
          params: {
            status: status,
            id:row.id
          }
        }).then(res => {
          this.form = res.data
          this.getData();
        })
      },
      statusFormatter(row, column, cellValue) {
        const statusMap = {
          0: '有货',
          1: '无货',
        };
        return statusMap[cellValue] || '未定义';
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
</style>
