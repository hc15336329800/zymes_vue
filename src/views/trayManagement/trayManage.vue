<template>
  <div class="app-container">
    <el-row class="mb8">
      <el-button type="primary" class="commen-button" @click="saveAllData">保存</el-button>
    </el-row>
    <el-table :data="pageList" ref="myTable" class="commen-table mt_20" @cell-dblclick="handleCellClick">
      <el-table-column type="index" width="55" label="序号"></el-table-column>
      <el-table-column v-if="showColumn" label="主键" align="center" prop="id"></el-table-column>
      <el-table-column label="托盘编码" align="center" prop="trayid"></el-table-column>
      <el-table-column label="设备名称" align="center" prop="deviceName"></el-table-column>
      <el-table-column label="物料名称" align="center" prop="itemname">
        <template slot="header" slot-scope="scope">
          物料名称<i class="el-icon-setting"/>
        </template>
      </el-table-column>
      <el-table-column label="物料件数" align="center" prop="realCount" :formatter="formatterCount">
        <template slot="header" slot-scope="scope">
          物料件数<i class="el-icon-setting"/>
        </template>
      </el-table-column>
      <el-table-column label="库位码" align="center" prop="location">
        <template slot="header" slot-scope="scope">
          库位码<i class="el-icon-setting"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="310" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- 确认后不能编辑和删除 -->
          <el-button link type="primary" icon="Edit" @click="saveData(scope.row)">保存</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
          <el-button link type="primary" @click="handleAdd(scope.$index, scope.row)">新增</el-button>
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
    <!-- 物料双击dialog -->
    <el-dialog title="编辑" :visible.sync="dialogShow" width="480px" @close="beforeClose">
      <el-form :model="form" class="commen-form" :rules="rules" ref="form" label-width="80px">
        <el-form-item v-if="showColumn" prop="row" label="行">
          <el-input-number v-model="form.row" :precision="3" :controls="false" :min="0"/>
        </el-form-item>
        <el-form-item v-if="column" prop="itemNo" label="lie">
          <el-input-number v-model="form.column" :precision="3" :controls="false" :min="0"/>
        </el-form-item>
        <el-form-item label="物料名称" class="condition">
          <el-select v-model="form.itemName" placeholder="请选择" style="width: 187px;">
            <el-option
              v-for="dict in itemList"
              :key="dict.item_no"
              :label="dict.item_name"
              :value="dict.item_name"
            />
          </el-select>
        </el-form-item>
        <div class="dialog-footer" style="text-align: center;width:100%;padding-top: 40px;">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import {addTrayInfo, deleteOneData, getItem} from '@/api/trayManagement/trayManage'
  import {trayPageList} from '@/api/trayManagement/trayManage'
  import {addAllTrayInfo} from '@/api/trayManagement/trayManage'

  export default {
    components: {
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
        pageList: {
          id: '',
          trayid: '',
          deviceName: '',
          itemname: '',
          realCount: '',
          location: ''
        },
        title: '',
        showColumn: false,
        intervalId: null,
        itemList: [],
        dialogShow: false
      }
    },
    created() {
      this.getData();
      this.intervalId = setInterval(this.getData, 50000); // 每5秒请求一次
    },
    destroyed() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    },
    methods: {
      beforeClose() {
        this.form = {}
        this.$refs['form'].clearValidate()
      },
      getData() {
        setTimeout(() => {
          trayPageList(this.queryParams).then(res => {
            this.pageList = res.data
            this.pageTotal = Number(res.page.total_num)
          })
        }, 500);
      },
      handleAdd(index, row) {
        // 创建一个新对象，并将上一行的数据复制进去
        let newRow = Object.assign({}, this.pageList[index]);
        // 将新行添加到数据源中
        newRow.id = '';
        this.pageList.splice(index + 1, 0, newRow);
      },
      saveData(row) {
        addTrayInfo({params: row}).then(res => {
          this.$message({
            message: '插入成功',
            type: 'success'
          })
          window.location.reload();
        })
      },
      handleDelete(row) {
        deleteOneData({params: row}).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          window.location.reload();
        })
      },
      handleCellClick(row, column, cell, event) {
        const columnName = column.property;
        if (columnName == "itemname" || columnName == "realCount" || columnName == "location") {
          if (columnName == "realCount" || columnName == "location") {
            this.$prompt('请输入内容', '编辑', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputValue: row[column.property]
            }).then(({value}) => {
              this.$set(row, column.property, value); // 更新数据
            }).catch(() => {
              // 用户取消编辑
            });
          }
          if (columnName == "itemname") {
            this.$set(this.form, 'row', row);
            this.$set(this.form, 'column', column);
            getItem({params: row}).then(res => {
              this.itemList = res.data;
              this.dialogShow = true
            })
          }
        }
      },
      saveAllData() {
        addAllTrayInfo({params: this.pageList}).then(res => {
          this.$message({
            message: '全部插入成功',
            type: 'success'
          })
          window.location.reload();
        })
      },
      cancel() {
        this.dialogShow = false
        this.form = {}
        this.$refs['form'].clearValidate()
      },
      submitForm() {
        this.$set(this.form.row, this.form.column.property, this.form.itemName); // 更新数据
        this.dialogShow = false;
      },
      formatterCount(row, column, cellValue, index) {
        return cellValue ? Math.floor(cellValue) : '--';
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
