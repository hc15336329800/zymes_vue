<template>
  <div class="w_100 pt_30 plr_30 ptb_30">
    <!-- 分析范围 -->
    <el-row class="flex_row ptb_20 c_b fw_bold fs_24"> 分析范围: <label>{{orderNoRanges}}</label></el-row>
    <el-row class="flex_row ptb_20 c_b fw_bold fs_24">
      <el-button type="primary" icon="el-icon-download" size="mini" @click="exportItemPurchasesRequireDetail()">导出
      </el-button>
    </el-row>
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
      <el-table-column type="index" width="55" align="center" label="序号"/>
      <el-table-column
        v-for="item in tableList"
        :key="item.label"
        align="center"
        :label="item.label"
        :width="item.label == '操作' ? 280 : ''"
      >
        <template slot-scope="scope">
          <template>
            {{ scope.row[item.value] }}
          </template>
        </template>
      </el-table-column>

    </el-table>
    <div class="w_100 flex_row flex_x_center">
      <el-button type="primary" plain class="ml_20" @click="back()">返回</el-button>
    </div>
  </div>
</template>
<script>
  import purchaseForecastApi from "./api";
  import {get_new_export} from '@/api/common'

  export default {
    components: {},
    data() {
      return {
        tableList: [
          {
            label: "物料编码",
            value: "itemNo",
          },
          {
            label: "物料名称",
            value: "itemName",
          },
          {
            label: "计量单位",
            value: "itemMeasure",
          },
          {
            label: "预测量",
            value: "forecastCount",
          },
          {
            label: "库存量",
            value: "itemCount",
          }, {
            label: "推荐采购量",
            value: "recommendCount",
          }
        ],
        list: [],
        listLoading: true,
        // 分页
        pages: {
          total: 0,
          page_num: 1,
          page_size: 99999999,
        },
        // 查询参数
        paramForm: {
          ids: "",
        },
        orderNoRanges: ''
      };
    },
    async created() {
      if (this.$route.query.itemNo) {
        this.paramForm.ids = this.$route.query.itemNo;
        await this.getList();
      }
    },
    methods: {
      back() {
        this.$router.push({
          name: 'purchaseForecastList'
        })
      },
      async getList() {
        this.listLoading = true;
        try {
          const res = await purchaseForecastApi.queryItemRequireAnalysePageList({
            page: {
              page_num: this.pages.page_num,
              page_size: this.pages.page_size
            }, params: this.paramForm
          });
          if (res.data) {
            this.list = res.data;
            this.list.forEach(item => {
              this.orderNoRanges += item.orderNoRange + ',';
            })
            this.orderNoRanges = this.orderNoRanges.slice(0, this.orderNoRanges.length - 1);
            this.total = res.page.total_num;
          }
        } finally {
          this.listLoading = false;
        }
      },
      exportItemPurchasesRequireDetail() {
        get_new_export(
          '/api/work/forecast_order/exportItemPurchasesRequireDetail',
          {page: {page_num: this.pages.page_num, page_size: this.pages.page_size}, params: this.paramForm}
        )
      }
    },
  };
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
