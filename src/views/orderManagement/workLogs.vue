<template>
  <div class="w_100 pt_30 plr_30 ptb_30">
    <!-- 筛选条件 -->
    <el-card class="box-card mb_30">
      <el-form :inline="true" :model="paramForm" label-width="80px" label-position="left">
        <el-form-item label="图纸号">
          <!-- <el-input v-model="paramForm.bomNo"/> -->
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
        <el-form-item label="工序名称">
          <el-select
            v-model="paramForm.procedureName"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in options"
              :key="item.procedureCode"
              :label="item.procedureName"
              :value="item.procedureName"
            ></el-option>
          </el-select>
          <!-- <el-input v-model="paramForm.procedureName"  /> -->
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
      <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
      <el-table-column
        v-for="item in tableList"
        :key="item.label"
        align="center"
        :label="item.label"
        width
      >
        <template slot-scope="scope">
          <template
            v-if="item.label == '操作类型'"
          >{{scope.row.type =="01" ? "下达": scope.row.type =="02" ? "质检":scope.row.type =="03" ? "审核":scope.row.type
            =="04" ? "拒绝": scope.row.type}}
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
      <span class="product-total">共{{ pages.total }}条</span>
    </el-pagination>
  </div>
</template>
<script>
  // import MultipleImage from "@/components/Upload/MultipleImage.vue"
  import {work_log} from '@/api/work'
  import {remote_list, get_bom_list, get_bom_list_keyword} from '@/api/order'

  export default {
    components: {
      // MultipleImage
    },
    data() {
      return {
        bomNoList: [],
        options: [],
        tableList: [
          {
            label: '图纸号',
            value: 'bomNo'
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
            label: '工序名称',
            value: 'procedureName'
          },
          {
            label: '数量',
            value: 'itemCount'
          },
          {
            label: '操作人',
            value: 'createdBy'
          },
          {
            label: '操作时间',
            value: 'createdTime'
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
          procedureName: '',
          orderNo: '',
          bomNo: ''
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
      async getList(str) {
        this.listLoading = true
        try {
          if (str == 'clear') {
            this.paramForm = {
              procedureName: '',
              orderNo: '',
              bomNo: ''
            }
            this.pages = {
              total: 0,
              page_num: 1,
              page_size: 10
            }
          }
          const res = await work_log({
            page: {
              page_num: this.pages.page_num,
              page_size: this.pages.page_size
            },
            params: this.paramForm
          })
          console.log(res, 'res')
          if (res.data instanceof Array) {
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
