<template>
  <div class="w_100 pt_30 plr_30 ptb_30">
    <!-- 分析范围 -->
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
    <!-- 编辑外协管理 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" fit border highlight-current-row
              class="table mb_30">
      <el-table-column type="index" width="55" align="center" label="序号"/>
      <el-table-column align="center" label="工序名称"/>
      <el-table-column align="center" label="单价"/>
      <el-table-column type="nunber" align="center" width="250" label="外协分配数量">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.number" style="width: 200px;" placeholder="请输入数量"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
        <span class="cur_point c_02" @click="deleteOrder(scope.row.id)">
          删除
        </span>
        </template>
      </el-table-column>

    </el-table>
    <div class="w_100 flex_row flex_x_center">
      <el-button class="ml_20" @click="back()">取消</el-button>
      <el-button type="primary" class="ml_20" @click="sureEdit()">确定</el-button>
    </div>
  </div>
</template>
<script>

  export default {
    components: {},
    data() {
      return {
        procedure: {},
        tableList: [], list: [{number: 2}],
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
          name: 'outsourcingOrder'
        })
      },
      async deleteOrder() {
        await this.$confirm('确认删除？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // createdBy: this.userInfo.userName}
        // let res = await outer_order_accept({ page: { page_num: '', page_size: '' }, params: { id: item.id, createdBy: "in reprehenderit" } })
        this.$message({
          message: "操作成功",
          type: 'success'
        });
        this.getDetail()
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
