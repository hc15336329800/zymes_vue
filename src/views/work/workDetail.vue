<template>
  <div class="w_100 pt_30 plr_30 ptb_30 commen-form">
    <el-row class="mb_30">
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">工单号:</div>
        <div class="ml_10">{{ procedure.workOrderNo }}</div>
      </el-col>
      <!-- <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          BOM名称：
        </div>
        <div class="ml_10">
        </div>
      </el-col>-->
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">工序名称：</div>
        <div class="ml_10">{{ procedure.procedureName }}</div>
      </el-col>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">单价:</div>
        <div class="ml_10">{{ procedure.hoursFixed }}</div>
      </el-col>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">图纸号：</div>
        <div class="ml_10">{{ procedure.bomNo }}</div>
      </el-col>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">工序编号：</div>
        <div class="ml_10">{{ procedure.procedureCode }}</div>
      </el-col>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">订单号：</div>
        <div class="ml_10">{{ procedure.orderNo }}</div>
      </el-col>
      <!-- <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          分配数量：
        </div>
        <div class="ml_10">
        </div>
      </el-col>-->
    </el-row>
    <el-form :inline="true" :model="paramForm" label-width="90px" label-position="left">
      <el-form-item label="报工日期">
        <!-- <el-date-picker
          v-model="paramForm.createdTime"
          align="right"
          value-format="yyyy-MM-dd HH:MM:SS"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>-->
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="报工类型">
        <el-select v-model="paramForm.isWasteReport" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="paramForm.status" placeholder="请选择">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class @click="getList()">查询</el-button>
        <el-button class="ml_20" @click="getList('clear')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="isTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      border
      highlight-current-row
      class="table mb_30"
    >
      <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
      <el-table-column label="报工日期" prop="createdTime" align="center"></el-table-column>
      <el-table-column align="center" label="报工类型">
        <template
          slot-scope="scope"
          align="center"
        >{{ scope.row.isWasteReport== "0"?'报工记录':'次品补录记录 '}}
        </template>
      </el-table-column>
      <el-table-column label="报工数量" prop="reportCount" align="center"></el-table-column>
      <el-table-column label="报工状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.status== "01"?'待审核': scope.row.status== "02"?'待验收 ':scope.row.status==
          "03"?'验收通过 ':scope.row.status== "04"?'审核拒绝':scope.row.status== "05"?'验收拒绝':''}}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager,next,  sizes, slot"
      :total="pages.total"
      :current-page="pages.page_num"
      :page-size="pages.page_size"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
      <span class="product-total">共{{ pages.total }}条</span>
    </el-pagination>
  </div>
</template>
<script>
  // import MultipleImage from "@/components/Upload/MultipleImage.vue"
  import {work_deails, work_order} from '@/api/work'

  export default {
    components: {
      // MultipleImage
    },
    data() {
      return {
        paramForm: {},
        total: null,
        options: [
          {
            label: '报工记录',
            value: '0'
          },
          {
            label: '次品补录记录',
            value: '1'
          }
        ],
        // 01:待审核，02:待验收，03:验收通过 ，04:审核拒绝，05:验收拒绝
        options2: [
          {
            label: '待审核',
            value: '01'
          },
          {
            label: '待验收',
            value: '02'
          },
          {
            label: '验收通过',
            value: '03'
          },
          {
            label: '审核拒绝',
            value: '04'
          },
          {
            label: '验收拒绝',
            value: '05'
          }
        ],
        procedure: {},
        date: [],
        tableList: [
          // {
          //   label: '序号',
          //   value: 'id'
          // },
          {
            label: '报工日期',
            value: 'createdTime'
          },
          {
            label: '报工类型',
            value: 'isWasteReport'
          },
          {
            label: '报工数量',
            value: 'reportCount'
          },
          {
            label: '状态',
            value: 'status'
          }
        ],
        tableList2: [
          // {
          //   label: '序号',
          //   value: 'id'
          // },
          {
            label: '补录日期',
            value: 'lastProcedureCode'
          },
          {
            label: '次品数量',
            value: 'lastProcedureCode'
          },
          {
            label: '整改完成时间',
            value: 'lastProcedureName'
          },
          {
            label: '次品原因',
            value: 'itemNo'
          },
          {
            label: '状态',
            value: 'status'
          }
        ],
        list: [],
        listLoading: false,
        activeName: 'first',
        // 分页
        pages: {
          total: 0,
          page_num: 1,
          page_size: 10
        },
        // 查询参数
        paramForm: {
          workOrderId: '97119135672389632',
          createdTime: '',
          isWasteReport: '',
          status: ''
        }
      }
    },
    async created() {
      this.getDetail()
      await this.getList('clear')
    },
    methods: {
      handleClick() {
      },
      async getDetail() {
        const res2 = await work_order({
          page: {page_num: 1, page_size: 1000},
          params: {}
        })
        if (res2 && res2.data) {
          this.procedure = res2.data.filter(item => {
            return item.id == this.$route.query.id
          })[0]
        }
      },
      async getList(str) {
        const self = this
        this.listLoading = true
        try {
          if (str == 'clear') {
            //         this.paramForm = {
            //           workOrderId: self.$route.query.id,
            //           "createdTime": "2022-10-03T11:09:02.626Z",
            // "isWasteReport": "string",
            // "status": "string"
            //         }
            this.paramForm = {}
            this.date = []
            this.paramForm.workOrderId = self.$route.query.id
            this.pages = {
              total: 0,
              page_num: 1,
              page_size: 10
            }
          }
          if (this.date) {
            this.paramForm.startTime = this.date[0]
            this.paramForm.endTime = this.date[1]
          } else {
            delete this.paramForm.startTime
            delete this.paramForm.endTime
          }
          const res = await work_deails({
            page: {
              page_num: this.pages.page_num,
              page_size: this.pages.page_size
            },
            params: this.paramForm
          })
          if (res.data) {
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
      async operHandle() {
        // 查询
        this.pages.page_num = 1
        this.pages.total = 0
        this.getList()
      }
    }
  }
</script>
<style lang="scss">
  .el-tabs__nav-wrap::after {
    background-color: #fff;
  }
</style>
<style scoped lang="scss">
  .work-detail {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #000;
    font-weight: 700;
    flex-wrap: wrap;

    > div {
      width: 24%;
      margin-bottom: 20px;

      span:first-child {
        display: inline-block;
        width: 80px;
      }
    }
  }

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
