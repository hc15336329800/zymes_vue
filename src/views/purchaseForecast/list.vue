<template>
  <div class="w_100 pt_30 plr_30 ptb_30">
    <!-- 筛选条件 -->
    <el-card class="box-card mb_30">
      <el-form :inline="true" :model="paramForm" label-width="120px" label-position="left">
        <el-form-item label="预测订单号">
          <el-input v-model="paramForm.orderNo"/>
        </el-form-item>
        <el-form-item label="BOM编号">
          <el-input v-model="paramForm.bomNo"/>
        </el-form-item>
        <el-form-item label="产品编码">
          <el-input v-model="paramForm.itemNo"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="" @click="operHandle(1)">查询</el-button>
          <el-button class="ml_20" @click="getList('clear')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-row class="flex_row pb_10 c_b fw_bold fs_24">
      <el-button type="primary" icon="el-icon-plus" @click="operHandle(2)">订单录入</el-button>
      <el-button class="ml_20" type="primary" icon="el-icon-plus" :disabled="!(id&&id.length>0)"
                 @click="operHandle(3, { id: false })">物料需求分析
      </el-button>
      <el-button :disabled="!(id&&id.length>0)" type="primary" icon="el-icon-plus" @click="operHandle(4)">导出采购预测订单
      </el-button>
      <el-button :disabled="!(id&&id.length>0)" type="primary" icon="el-icon-plus" @click="operHandle(5)">导出物料采购需求明细
      </el-button>
    </el-row>

    <el-table id="isTable" ref="multipleTable" v-loading="listLoading" :data="list" element-loading-text="Loading" fit
              border highlight-current-row class="table mb_30" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"/>
      <el-table-column v-for="item in tableList" :key="item.label" align="center" :label="item.label"
                       :width="item.label == '操作' ? 280 : ''">
        <template slot-scope="scope">
          <template v-if="item.label == '操作'">
            <div class="cur_point c_02" @click="operHandle(3, scope.row)">
              物料需求分析
            </div>
          </template>
          <template v-else>
            {{ scope.row[item.value] }}
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager,next,  sizes, slot" :total="pages.total"
                   :current-page="pages.page_num"
                   :page-size="pages.page_size" @current-change="handleCurrentChange" @size-change="handleSizeChange">
      <span class="product-total">共{{ pages.total }}条</span>
    </el-pagination>
  </div>
</template>
<script>
  import purchaseForecastApi from "./api";
  import {get_new_export} from '@/api/common'

  export default {
    components: {},
    data() {
      return {
        id: "",
        tableList: [
          {
            label: "预测单号",
            value: "forecastOrderNo",
          },
          {
            label: "BOM编号",
            value: "bomNo",
          },
          {
            label: "产品编号",
            value: "itemNo",
          },
          {
            label: "产品名称",
            value: "itemName",
          },
          {
            label: "数量",
            value: "itemCount",
          },
          {
            label: "操作",
            value: "",
          },
        ],
        list: [],
        listLoading: true,
        // 分页
        pages: {
          total: 0,
          page_num: 1,
          page_size: 10,
        },
        // 查询参数
        paramForm: {
          bomNo: "",
          orderNo: "",
          itemNo: "",
        },
      };
    },
    async created() {
      await this.getList("clear");
    },
    methods: {
      async getList(str) {
        this.listLoading = true;
        try {
          if (str === "clear") {
            this.paramForm = {
              bomNo: "",
              orderNo: "",
              itemNo: "",
            };
            this.pages = {
              total: 0,
              page_num: 1,
              page_size: 10,
            };
          }
          const res = await purchaseForecastApi.queryForecastOrderPageList({
            page: {
              page_num: this.pages.page_num,
              page_size: this.pages.page_size
            }, params: this.paramForm
          });
          if (res.data) {
            this.list = res.data;
            this.pages.total = parseInt(res.page.total_num);
          }
        } finally {
          this.listLoading = false;
        }
      },
      handleCurrentChange(val) {
        // 点击页码切换数据
        this.pages.page_num = val;
        this.getList();
      },
      handleSizeChange(val) {
        // 点击页码切换数据
        this.pages.page_size = val;
        this.getList();
      },
      beforeUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1;

        if (isLt1M) {
          return true;
        }

        this.$message({
          message: "Please do not upload files larger than 1m in size.",
          type: "warning",
        });
        return false;
      },
      async handleSuccess() {
        await this.getList();
      },
      async operHandle(type, item) {
        switch (type) {
          case 1: // 查询
            this.pages.page_num = 1;
            this.pages.total = 0;
            this.getList();
            break;
          case 2: // 新增订单录入
            this.$router.push({
              name: "purchaseForecastDetail",
            });
            break;
          case 3: // 需求分析
            this.demandAnalysis(item.id);
            break;
          case 4: // 导出
            get_new_export(
              '/api/work/forecast_order/exportPurchasesForecastOrder',
              {page: {page_num: 1, page_size: this.pages.total}, params: {ids: this.id}}
            )
            break;
          case 5: // 导出
            get_new_export(
              '/api/work/forecast_order/exportPurchasesForecastOrder',
              {page: {page_num: 1, page_size: this.pages.total}, params: {ids: this.id}}
            )
            break;
          default:
        }
      },
      handleSelectionChange(val) {
        const res = val
          .map((val) => {
            return val.id;
          })
          .join();
        this.id = res;
        console.log(this.id);
      },
      demandAnalysis(id) {
        let itemNo = {};
        if (id === false) {
          itemNo = {itemNo: this.id};
        } else {
          itemNo = {itemNo: id};
        }
        if (itemNo !== "") {
          this.$router.push({
            name: "demandAnalysis",
            query: itemNo,
          });
        }
      },
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
