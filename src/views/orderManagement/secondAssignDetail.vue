<template>
  <div class="w_100 pt_30 plr_30 ptb_30">
    <!-- 筛选条件 -->
    <el-card class="box-card mb_30">
      <!-- <el-form :inline="true" :model="paramForm" label-width="80px" label-position="left">
        <el-form-item label="图纸号">
          <!== <el-input v-model="paramForm.bomNo"/> ==>
          <el-select v-model="paramForm.bomNos" multiple placeholder="请选择" filterable class="input1" clearable remote
            :remote-method="remoteMethod2">
            <el-option v-for="(item, id) in bomNoList" :key="id" :label="item.bomNo" :value="item.bomNo" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="paramForm.orderNo" />
        </el-form-item>
        <el-form-item label="车间" prop="workShopName">
          <el-select v-model="paramForm.workShopName" placeholder="请选择">
            <el-option v-for="item in getWorkCenterList" :key="item.code" :label="item.name"
              :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工序">
          <!== <el-input v-model="paramForm.procedureName" /> ==>
          <el-select v-model="paramForm.procedureName" filterable remote clearable reserve-keyword placeholder="请输入关键词"
            :remote-method="remoteMethod" :loading="loading">
            <el-option v-for="item in options" :key="item.procedureCode" :label="item.procedureName"
              :value="item.procedureName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员" prop="acctNo">
          <pinyin-select :selectList="workOptions" labelName="employeeName" lableId="employeeNo" :value="paramForm.acctNo"
            :selectChange.sync="paramForm.acctNo"></pinyin-select>
          <!== <el-select
            v-model="paramForm.acctNo"
            placeholder="请选择"
            filterable
            class="input1"
            clearable
          >
            <el-option
              v-for="(item,id) in workOptions"
              :key="id"
              :label="item.employeeName"
              :value="item.employeeNo"
            />

          </el-select>==>
        </el-form-item>
        <el-form-item label="产品">
          <el-input v-model="paramForm.itemNo" />
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="date" type="daterange" range-separator="至" value-format="yyyy-MM-dd"
            format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class @click="operHandle(1)">查询</el-button>
          <el-button class="ml_20" @click="getList('clear')">重置</el-button>
        </el-form-item>
      </el-form> -->
    </el-card>
    <el-table id="isTable" v-loading="listLoading" :data="list" element-loading-text="Loading" fit border
              highlight-current-row class="table mb_30">
      <el-table-column type="index" fixed label="序号" align="center" width="60px"></el-table-column>
      <el-table-column key="00" fixed align="center" label="订单号" width="160">
        <template slot-scope="scope">{{ scope.row.orderNo }}</template>
      </el-table-column>
      <el-table-column key="00" fixed align="center" prop="bomNo" label="图纸号" width="160"></el-table-column>

      <el-table-column v-for="item in tableList" :key="item.label" align="center" :label="item.label">
        <template slot-scope="scope">

          <template v-if="item.label == '分配班次'">{{ scope.row.shiftType == "01" ? "白班" : "夜班" }}</template>
          <!-- <template v-else-if="item.label === '分配模式'">{{ scope.row.allocModel | filterAlloMode }}</template> -->
          <template v-else>{{ scope.row[item.value] }}</template>
        </template>

      </el-table-column>


      <!-- <el-table-column key="00" align="center">
        <template slot-scope="scope">
          <!== v-if="scope.row.allocModel == '04'" ==>
          <el-button type="text" >详情</el-button>
        </template>

      </el-table-column> -->
    </el-table>
    <el-pagination background layout="prev, pager,next,  sizes, slot" :total="pages.total"
                   :current-page="pages.page_num"
                   :page-size="pages.page_size" @current-change="handleCurrentChange" @size-change="handleSizeChange">
      <span class="product-total">共{{ pages.total }}条</span>
    </el-pagination>
  </div>
</template>
<script>
  import {alloc_log} from '@/api/work'
  import {get_work_center_list} from '@/api/getWorkCenter'
  import {get_all_workers} from '@/api/common'
  import {remote_lis, get_bom_list, remote_list, get_bom_list_keyword} from '@/api/order'
  import pinyinSelect from '@/components/pinyinSelect.vue'

  export default {
    data() {
      return {
        getWorkCenterList: [],
        options: [],
        bomNoList: [],
        workOptions: [],
        date: [],
        tableList: [
          // {
          //     label: '订单号',
          //     value: 'orderNo',
          // },
          // {
          //     label: '图纸号',
          //     value: 'bomNo'
          // },
          {
            label: '分配数量',
            value: 'allocCount'
          },
          {
            label: '报工数量',
            value: 'prodCount'
          },
          {
            label: '工序编码',
            value: 'procedureCode'
          },
          {
            label: '工序名称',
            value: 'procedureName'
          },
          {
            label: '工单号',
            value: 'workOrderNo'
          },
          {
            label: '分配时间',
            value: 'allocTime'
          },
          // {
          //   label: '分配模式',
          //   value: 'allocModel'
          // },
          {
            label: '工人',
            value: 'allocUser'
          },

          {
            label: '分配班次',
            value: 'shiftType'
          },
          {
            label: '分配者',
            value: 'createUser'
          },
          {
            label: '车间',
            value: 'workShopName'
          }
        ],
        list: [],
        listLoading: false,
        // 分页
        pages: {
          total: 0,
          page_num: 1,
          page_size: 10
        },
        // 查询参数
        paramForm: {
          orderNo: '',
          bomNo: '',
          workShopName: '',
          parentId: this.$route.query.id,
          beginTime: '',
          endTime: "",
        }
      }
    },
    filters: {
      filterAlloMode(val) {

        if (val == '01') {
          val = '按件数分(人)'

        } else if (val == '03') {

          val = '合工(人)'
        } else if (val == '04') {
          val = '合工(组)'

        }
        return val
      }
    },
    components: {
      pinyinSelect
    },
    async created() {
      // await this.get_BOM()
      // await this.getWorkCenter()
      // await this.get_all_workers()
      await this.getList()
    },
    methods: {
      remoteMethod2(query) {
        if (query !== '') {
          setTimeout(async () => {
            var res = await get_bom_list_keyword({
              params: {
                bomNo: query
              }
            })
            this.bomNoList = res.data
          }, 200)
        } else {
          this.bomNoList = []
        }
      },
      async get_BOM() {
        const res = await get_bom_list({
          page: {
            page_num: 1,
            page_size: 500
          }
        })
        this.bomNoList = res.data
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true
          setTimeout(async () => {
            this.loading = false
            this.options = (await remote_list({
              params: {
                shortCode: query
              }
            })).data
          }, 200)
        } else {
          this.options = []
        }
      },
      async get_all_workers() {
        // 获取员工信息
        const res = await get_all_workers()
        if (res.data) {
          this.workOptions = res.data
        }
      },
      async getWorkCenter() {
        //获取车间的下拉框
        var result = await get_work_center_list()
        this.getWorkCenterList = result.data
      },
      async getList(str) {
        this.listLoading = true
        try {
          // if (str == 'clear') {
          //   this.paramForm = {
          //     orderNo: '',
          //     bomNo: ''
          //   }
          //   this.date = []
          //   this.pages = {
          //     total: 0,
          //     page_num: 1,
          //     page_size: 10
          //   }
          // }
          // if (this.date) {
          //   this.paramForm.beginTime = this.date[0]
          //   this.paramForm.endTime = this.date[1]
          // } else {
          //   this.paramForm.beginTime = null
          //   this.paramForm.endTime = null
          // }


          const res = await alloc_log({
            page: {
              page_num: this.pages.page_num,
              page_size: this.pages.page_size
            },
            params: this.paramForm
          })
          console.log(res, 'res')
          if (res.data) {
            if (this.getWorkCenterList && this.getWorkCenterList.length > 0) {
              this.$set(
                this.paramForm,
                'workShopName',
                this.getWorkCenterList[0].code
              )
            }
            this.list = res.data
            this.pages.total = res.page.total_num - 0
          }
        } finally {
          this.listLoading = false
        }
      },
      handleCurrentChange(val) {
        // 点击页码切换数据
        this.pages.page_num = val
        this.getList()
      },
      handleSizeChange(val) {
        // 点击页码切换数据
        this.pages.page_size = val
        this.getList()
      },
      async operHandle(type, item) {
        // const self = this;
        /** 清空校验 */
        try {
          switch (type) {
            case 1: // 查询
              this.pages.page_num = 1
              this.pages.total = 0
              this.getList()
              break

            default:
          }
        } finally {
          setTimeout(() => {
            this.flag = true
          }, 2000)
        }
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
