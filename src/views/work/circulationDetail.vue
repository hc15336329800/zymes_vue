<template>
  <div class="w_100 pt_30 plr_30 ptb_30">

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
      <el-table-column v-for="item in tableList" :key="item.label" align="center" :label="item.label" width="">
        <template slot-scope="scope">
          {{ scope.row[item.value] }}
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
  import {work_flow} from '@/api/work'

  export default {
    components: {
      // MultipleImage
    },
    data() {
      return {
        tableList: [
          // {
          //   label: '序号',
          //   value: 'id'
          // },
          {
            label: '上游工序编号',
            value: 'lastProcedureCode'
          },
          {
            label: '上游工序名称',
            value: 'lastProcedureName'
          },
          {
            label: '产品编码',
            value: 'itemNo'
          },
          {
            label: '产品名称',
            value: 'itemName'
          },
          {
            label: '流转总量',
            value: 'totalCount'
          },
          {
            label: '使用量',
            value: 'itemMeasure'
          },
          {
            label: '剩余量',
            value: 'leftCount'
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
      await this.getList('clear')
    },
    methods: {
      async getList(str) {
        const self = this;
        this.listLoading = true
        try {
          if (str == 'clear') {

            this.paramForm = {
              id: self.$route.query.id
              // procedureName: '',
              // orderNo: '',
              // bomNo: ''
            }
            this.pages = {
              total: 0,
              page_num: 1,
              page_size: 10
            }
          }
          const res = await work_flow({
            page: {page_num: this.pages.page_num, page_size: this.pages.page_size},
            params: this.paramForm
          })
          console.log(res, 'res')
          if (res.data) {
            this.list = res.data
            this.total = res.page.total_num
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
      async operHandle() { // 查询
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
