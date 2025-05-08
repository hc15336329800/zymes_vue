<template>
  <div class="w_100 pt_30 plr_30 ptb_30">
    <!-- 分析范围 -->
    <div class="flex-contain-detail">
      <el-row class="mb_30">
        <el-col :xs=" 6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
          <div class="label fw_bold fs_24">
            物料编码
          </div>
          <div class="ml_10">
            {{ procedure.itemNo }}
          </div>
        </el-col>
        <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
          <div class="label fw_bold fs_24">
            订单号：
          </div>
          <div class="ml_10">
            {{ procedure.itemName }}
          </div>
        </el-col>
        <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
          <div class="label fw_bold fs_24">
            产品编码：
          </div>
          <div class="ml_10">
            {{ procedure.bomNo }}
          </div>
        </el-col>
        <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
          <div class="label fw_bold fs_24">
            外协厂商
          </div>
          <div class="ml_10">
            {{ procedure.bomNo }}
          </div>
        </el-col>
        <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
          <div class="label fw_bold fs_24">
            BOM编码：
          </div>
          <div class="ml_10">
            {{ procedure.itemNo }}
          </div>
        </el-col>
        <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
          <div class="label fw_bold fs_24">
            产品名称 ：
          </div>
          <div class="ml_10">
            {{ procedure.itemName }}
          </div>
        </el-col>
        <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
          <div class="label fw_bold fs_24">
            外协分配数量：
          </div>
          <div class="ml_10">
            {{ procedure.bomNo }}
          </div>
        </el-col>
      </el-row>
      <div class="active">
        已接收
      </div>
    </div>
    <!-- 编辑外协管理 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" fit border highlight-current-row
              class="table mb_30">
      <el-table-column type="index" width="55" align="center" label="序号"/>
      <el-table-column v-for="item in detailTableList" :key="item.label" align="center" :label="item.label"
                       :width="item.label == '操作' ? 140 : ''">
        <template slot-scope="scope">
          {{ scope.row[item.value] }}
        </template>
      </el-table-column>
    </el-table>
    <div class="w_100 flex_row flex_x_center">
      <el-button class="ml_20" @click="back()">返回</el-button>
      <el-button type="primary" class="ml_20" @click="operHandle(3,$route.query.id)" v-if="procedure.status == '00'">
        报工
      </el-button>
      <el-button type="primary" class="ml_20" @click="operHandle(4,$route.query.id)" v-if="procedure.status == '00'">
        >报工日志
      </el-button>
      <el-button type="primary" class="ml_20" @click="operHandle(5,$route.query.id)" v-if="procedure.status == '01'">
        编辑
      </el-button>
      <el-button type="primary" class="ml_20" @click="operHandle(6,$route.query.id)" v-if="procedure.status == '01'">
        暂停
      </el-button>
      <el-button type="primary" class="ml_20" @click="operHandle(2,$route.query.id)" v-if="procedure.status == '01'">
        接收
      </el-button>
    </div>
  </div>
</template>
<script>
  // import purchaseForecastApi from "./api";
  import {get_new_export} from '@/api/common'

  export default {
    components: {},
    data() {
      return {
        procedure: {},
        tableList: [],
        detailTableList: [
          {
            label: "工序名称",
            value: "",
          },
          {
            label: "加工工时",
            value: "itemName",
          },
          {
            label: "外协分配数量",
            value: "itemMeasure",
          },
          {
            label: "报工数量",
            value: "forecastCount",
          },
          {
            label: "待验收数量",
            value: "itemCount",
          }, {
            label: "验收合格数量",
            value: "recommendCount",
          }, {
            label: "验收不合格数量",
            value: "recommendCount",
          }
        ],
        list: [{number: 2}],
        listLoading: false,
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
      this.getDetail()

    },
    methods: {
      operHandle() {

      },
      back() {
        this.$router.push({
          name: 'purchaseForecastList'
        })
      },
      async getDetail() {
        // this.listLoading = true;
        try {
          // const res = await purchaseForecastApi.queryItemRequireAnalysePageList({ page: { page_num: this.pages.page_num, page_size: this.pages.page_size }, params: this.paramForm });
          // if (res.data) {
          //   this.list = res.data;
          //   this.list.forEach(item=>{
          //     this.orderNoRanges+=item.orderNoRange+',';
          //   })
          //   this.orderNoRanges=this.orderNoRanges.slice(0,this.orderNoRanges.length-1);
          //   this.total = res.page.total_num;
          // }
        } finally {
          // this.listLoading = false;
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
  .flex-contain-detail {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > div {
      width: 100%;
    }

    > div:last-child {
      width: 70px;
      font-size: 20px;
      padding: 1px 2px;
      margin-left: 10px;
      border-radius: 3px;
      color: #fff;
      background-color: rgb(50, 87, 193);
      text-align: center;
      transform: rotate(30deg);

      &.active {
        background-color: rgb(227, 50, 64);
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
