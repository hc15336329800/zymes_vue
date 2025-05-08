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
        <deviceSelected :bind-id.sync="queryParams.params.deviceId"/>
      </el-form-item>
      <el-form-item label="工序名称" class="condition">
        <multipleProcedure :bind-name.sync='queryParams.params.procedureNames'/>
      </el-form-item>
      <el-form-item label="状态" class="condition">
        <el-select v-model="queryParams.params.procStatus" clearable placeholder="请选择状态" style="width:140px;"
                   filterable>
          <el-option :key="proc.code" v-for="(proc) in procStatusList" :label="proc.name"
                     :value="proc.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分配状态" class="condition">
        <el-select v-model="queryParams.params.allocStatus" clearable placeholder="请选择状态" style="width:140px;"
                   filterable>
          <el-option :key="item.code" v-for="(item) in allocStatusList" :label="item.name"
                     :value="item.code"></el-option>
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
    <el-row class="mb8">
      <el-button type="primary" class="commen-button" icon="el-icon-plus" @click="handleAdd">工序分配</el-button>
      <el-button type="primary" class="commen-button" icon="el-icon-plus" @click="updateStatus('01')">启用</el-button>
      <el-button type="primary" class="commen-button" icon="el-icon-plus" @click="updateStatus('00')">停用</el-button>
      <el-button type="primary" class="commen-button" icon="el-icon-plus" @click="handleOuter">外协分配</el-button>

    </el-row>
    <el-table :data="pageList" class="commen-table mt_20" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="图纸号" align="center" prop="bomNo"/>
      <el-table-column label="产品名称" align="center" prop="itemName"/>
      <el-table-column label="工序名称" align="center" prop="procedureName"/>
      <el-table-column label="定额工时" align="center" prop="hoursFixed"/>
      <el-table-column label="总数" align="center" prop="totalCount"/>
      <el-table-column label="已分配" align="center" prop="workerAllocCount"/>
      <el-table-column label="待分配" align="center" prop="waitAllocCount"/>
      <el-table-column label="已报工" align="center" prop="prodCount"/>
      <el-table-column label="使用中间件数" align="center" prop="midCount"/>
      <el-table-column label="外协量" align="center" prop="outerAllocCount"/>
      <el-table-column label="单号" align="center" prop="orderNo"/>
      <el-table-column label="设备名称" align="center" prop="deviceName"/>
      <el-table-column label="车间" align="center" prop="deptName"/>
      <el-table-column label="状态" align="center" prop="procStatusDesc"/>

    </el-table>
    <pagination
      style="text-align: right"
      v-show="pageTotal>0"
      :total="pageTotal"
      :page.sync="queryParams.page.page_num"
      :limit.sync="queryParams.page.page_size"
      @pagination="getData"
    />
    <el-dialog title="请选择" :visible.sync="chooseDataVisible" width="800px">
      <div class="flex">
        <div style="margin-right:30px;">
          <span class="procedure-enterprise public02">班次：</span>
          <el-select
            v-model="shiftType"
            clearable
            placeholder="请选择班次"
            style="width:140px;"
            filterable
          >
            <el-option
              :key="shift.code"
              v-for="(shift) in shiftList"
              :label="shift.name"
              :value="shift.code"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div style="margin-top: 20px;font-size: 16px;display: flex;flex-wrap:wrap;">
        <div
          v-for="(item,k) in chooseData"
          :key="k"
          style="margin-bottom: 10px;margin-right: 30px;"
        >
          <span>{{item.procedureName}}-{{item.bomNo}}</span>
          <i
            class="el-icon-circle-close"
            style="cursor: pointer;color: #33a0f6;"
            @click="deleteData(item.id)"
          ></i>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="operHandle(5)">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import {allocationPageList, listAllocationById, updateAllocation} from '@/api/procAllocation/procAllocation'
  import {dictInfo} from '@/api/common'

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
          params: {
            allocStatus: '00',
            procStatus: '01'
          },
          page: {
            page_num: 1,
            page_size: 10
          }
        },
        shiftType: '',
        chooseData: [],
        workShopList: [],
        chooseDataVisible: false,
        shiftList: [],
        allocStatusList: [
          {code: '', name: '全部'},
          {code: '00', name: '待分配'},
          {code: '01', name: '已分配'}
        ],
        procStatusList: [],
        selectList: [],
        multipleSelection: [],
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
      this.getOptionData();
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
      },
      getOptionData() {
        dictInfo("SHIFT_TYPE", r => this.shiftList = r);
        dictInfo("PROC_STATUS", r => this.procStatusList = r);
        dictInfo("WORK_SHOP", r => this.workShopList = r);

      },
      /** 重置操作表单 */
      handleReset() {
        this.queryParams = {
          page: {
            page_num: 1,
            page_size: 10
          },
          params: {
            allocStatus: '00'
          }
        }
        this.$refs.userInfoDateIntervals.initDateData()
        this.getData()
      },
      getData() {
        this.queryParams.params.dtlIds = JSON.parse(this.$route.query.id)
        allocationPageList(this.queryParams).then(res => {
          this.pageList = res.data
          this.pageTotal = Number(res.page.total_num)
        })
      },
      handleAdd() {
        if (this.selectList.length <= 0) {
          this.$message.error('请选择数据')
          return
        }
        this.chooseDataVisible = true
        listAllocationById({
          params: {
            ids: this.selectList
          }
        }).then(res => {
          this.chooseData = res.data
        })
      },
      handleOuter() {
        if (this.selectList.length <= 0) {
          this.$message.error('请选择数据')
          return
        }
        this.$router.push({
          name: 'outerAlloc',
          query: {
            id: JSON.stringify(this.selectList)
          }
        })

      },
      operHandle() {
        if (!this.shiftType) {
          this.$message.error('请选择班次')
          return
        }
        var newArr = []
        this.chooseData.forEach(item => {
          newArr.push(item.id)
        })
        if (newArr.length <= 0) {
          this.$message.error('请选择要操作的数据')
          return
        }
        this.$router.push({
          name: 'procedureList',
          query: {
            id: JSON.stringify(newArr),
            allocModel: this.allocModel,
            shiftType: this.shiftType,
          }
        })
      },
      updateStatus(status) {
        if (this.selectList.length <= 0) {
          this.$message.error('请选择数据')
          return
        }
        let statusName = status === '01' ? "启用" : "停用"
        this.$confirm("确认" + statusName, '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          updateAllocation({
            params: {
              ids: this.selectList,
              status: status
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
      deleteData(id) {
        this.chooseData = this.chooseData.filter(item => {
          return item.id != id
        })
        this.list.forEach(item => {
          if (id === item.id) {
            this.$refs.multipleTable.toggleRowSelection(item, false)
          }
        })
        console.log(this.chooseData)
      },
      cancel() {
        console.log('-==========cancel')
        this.chooseDataVisible = false
        this.chooseData = []
        this.list.forEach(item => {
          if (this.selectList.indexOf(item.id) > -1) {
            this.$refs.multipleTable.toggleRowSelection(item, false)
          }
        })
        this.selectList = []
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
