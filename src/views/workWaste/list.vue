<template>
  <div class="w_100 pt_30 plr_30 ptb_30">
    <!-- 筛选条件 -->
    <el-card class="box-card mb_30">
      <el-form :inline="true" :model="paramForm" label-width="80px" label-position="left">
        <el-form-item label="BOM编码">
          <!-- <el-input v-model="paramForm.bomNo" /> -->
          <el-select
            v-model="paramForm.bomNos"
            multiple
            placeholder="请选择"
            filterable
            class="input1"
            clearable
            remote
            :remote-method="remoteMethod2"
          >
            <el-option
              v-for="(item,id) in bomNoList"
              :key="id"
              :label="item.bomNo"
              :value="item.bomNo"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="paramForm.orderNo"/>
        </el-form-item>
        <el-form-item label="工序编码">
          <el-input v-model="paramForm.procedureCode"/>
        </el-form-item>
        <el-form-item class="commen-no-bg">
          <el-button type="primary" icon="el-icon-search" class @click="operHandle(1)">查询</el-button>
          <el-button class="ml_20" icon="el-icon-refresh" @click="getList('clear')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
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
      <el-table-column
        v-for="item in tableList"
        :key="item.label"
        align="center"
        :label="item.label"
        :width="item.label == &quot;操作&quot; ? 80 : &quot;&quot;"
      >
        <template slot-scope="scope">
          <template
            v-if="item.label == &quot;状态&quot;"
          >{{ scope.row.status == "01" ? "待确认": "已确认" }}
          </template>
          <template v-else-if="item.label == &quot;操作&quot;">
            <div
              v-if="scope.row.status == '01'"
              class="cur_point c_02"
              @click="operHandle(2,scope.row)"
            >确认
            </div>
          </template>
          <template v-else>{{ scope.row[item.value] }}</template>
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
      <span class="product-total">共{{ pages.total }}页</span>
    </el-pagination>
  </div>
</template>
<script>
  import workWasteApi from '@/api/workWasteApi'

  import {get_bom_list, get_bom_list_keyword} from '@/api/order'

  export default {
    data() {
      return {
        bomNoList: [],
        tableList: [
          // {
          //   label: '序号',
          //   value: 'id'
          // },
          {
            label: 'BOM编码',
            value: 'bomNo'
          },
          {
            label: '产品编码',
            value: 'procedureCode'
          },
          {
            label: '订单号',
            value: 'orderNo'
          },
          {
            label: '工单号',
            value: 'workOrderNo'
          },
          {
            label: '工序编码',
            value: 'procedureCode'
          },
          {
            label: '录入人',
            value: 'createdBy'
          },
          {
            label: '录入时间',
            value: 'createdTime'
          },
          {
            label: '工序名称',
            value: 'procedureName'
          },
          {
            label: '补录原因',
            value: 'wasteDesc'
          },
          {
            label: '补录数量',
            value: 'itemCount'
          },
          {
            label: '操作工',
            value: 'updatedBy'
          },
          {
            label: '状态',
            value: 'status'
          },
          {
            label: '操作',
            value: ''
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
          bomNo: '',
          orderNo: '',
          procedureCode: ''
        }
      }
    },
    async created() {
      // await this.get_BOM()
      await this.getList('clear')
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
      async getList(str) {
        this.listLoading = true
        try {
          if (str == 'clear') {
            this.paramForm = {
              bomNo: '',
              orderNo: '',
              procedureCode: ''
            }
            this.pages = {
              total: 0,
              page_num: 1,
              page_size: 10
            }
          }
          // this.tabs携带
          // console.log(this.paramForm,'this.paramForm')
          const res = await workWasteApi.work_waste_list({
            page: {
              page_num: this.pages.page_num,
              page_size: this.pages.page_size
            },
            params: this.paramForm
          })
          if (res.data) {
            this.list = res.data
            this.pages.total = Number(res.page.total_num)
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
        switch (type) {
          case 1: // 查询
            this.pages.page_num = 1
            this.pages.total = 0
            this.getList()
            break
          case 2: // 确认
            this.$router.push({
              name: 'workWasteConfirm',
              query: {id: item.wasteId}
            })
            break
          default:
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
