<template>
  <div class="w_100 pt_30 plr_30 ptb_30">
    <el-form
      ref="form"
      :inline="true"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="left"
    >
      <el-form-item label="预测单号" prop="forecastOrderNo">
        <el-input v-model="form.forecastOrderNo" class="input"/>
      </el-form-item>
    </el-form>

    <div>
      <el-table
        id="isTable"
        :data="form.addShopOrderDetailParamDTOList"
        element-loading-text="Loading"
        fit
        border
        highlight-current-row
        class="table mb_30"
      >
        <el-table-column align="center" prop="bomNo" label="BOM编码">
          <!-- <template slot-scope="scope">
            <el-input v-model="scope.row.bomNo" class="input1" />
          </template> -->
        </el-table-column>
        <el-table-column align="center" label="数量">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.purchasesCount" class="input1"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <div class="w_100 flex_row flex_x_center">
              <!-- <div class="cur_point c_02" @click="operHandle(1, scope)">
                 查看详情
               </div> -->
              <div
                class="cur_point c_02 ml_20"
                @click="operHandle(2, scope.$index)"
              >
                删除
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="w_100 flex_row mb_40">
        <el-input style="width: 230px;margin-right: 16px;" v-model="bomNo" placeholder="请输入BOM编码增加行" class="input1"/>
        <el-button :disabled="!(bomNo&&bomNo.length>0)" type="primary" icon="el-icon-plus"
                   @click="addForecastOrderCheck()"
        >增加一行
        </el-button
        >
      </div>
    </div>
    <div class="w_100 flex_row flex_x_center">
      <el-button @click="operHandle(4)">取消</el-button>
      <el-button type="primary" plain class="ml_20" @click="confirm"
      >确定
      </el-button
      >
    </div>
  </div>
</template>
<script>
  // import MultipleImage from "@/components/Upload/MultipleImage.vue"
  import purchaseForecastApi from "./api";

  export default {
    components: {
      // MultipleImage
    },
    data() {
      return {
        bomNo: '',
        // 表单
        form: {
          forecastOrderNo: "",
          addShopOrderDetailParamDTOList: [],
        },
        rules: {
          forecastOrderNo: [
            {required: true, message: "请输入", trigger: ["blur", "change"]},
          ],
        },
        id: "",
        flag: true,
      };
    },
    async created() {
      if (this.$route.query.id) this.id = this.$route.query.id;
    },
    methods: {
      async addForecastOrderCheck() {
        const res = await purchaseForecastApi.addForecastOrderCheck({params: {bomNo: this.bomNo}});
        if (res.data) { // 校验成功
          this.form.addShopOrderDetailParamDTOList.push({
            bomNo: this.bomNo,
            purchasesCount: "",
          });
        } else {//校验失败
          this.$message({
            message: 'BOM编码无效，请重新输入！',
            type: "warning",
          });
        }
        console.log(res)
      },
      async operHandle(type, item) {
        switch (type) {
          case 1: // 查看详情
            // this.info = JSON.parse(JSON.stringify(item))
            // this.dialogVisible = true
            break;
          case 2: // 删除
            if (this.form.addShopOrderDetailParamDTOList.length > 1) {
              this.form.addShopOrderDetailParamDTOList.splice(item, 1);
            } else {
              this.$message({
                message: "不能删除",
                type: "error",
              });
            }
            break;
          case 3: // 新增一行
            this.form.addShopOrderDetailParamDTOList.push({
              bomNo: "",
              purchasesCount: "",
            });
            break;
          case 4: // 取消
            this.$router.push({
              name: "purchaseForecastList",
            });
            break;
          default:
        }
      },
      menuSelect(index, path) {
        console.log(index, path);
      },
      closeDia() {
        this.info = [];
      },
      async confirm() {
        // console.log(this.selectProductTemp)
        try {
          if (this.flag) {
            this.flag = false;
            const validate = await this.$refs.form.validate();
            if (validate) {
              var isValidate = false;
              if (!this.form.addShopOrderDetailParamDTOList || this.form.addShopOrderDetailParamDTOList.length < 1) {
                this.$message({
                  message: '列表数据为空，请添加',
                  type: "warning",
                });
                return;
              }
              this.form.addShopOrderDetailParamDTOList.forEach((item, index) => {
                if (!item.bomNo || !item.purchasesCount) {
                  isValidate = true;
                  this.$message({
                    message: '第' + (index + 1) + '行数据不能为空',
                    type: "warning",
                  });
                  return;
                }
              })
              if (isValidate) {
                return;
              }
              const form = JSON.parse(JSON.stringify(this.form));
              const res = await purchaseForecastApi.addForecastOrder({params: form});
              if (res.tx_code == '00') {
                this.$message({
                  message: '提交成功',
                  type: "success",
                });
                this.$router.push({
                  name: "purchaseForecastList",
                });
              }
            }
          }
        } finally {
          setTimeout(() => (this.flag = true), 2000);
        }
      },
      getImg(img) {
        this.form.img = img;
        this.$refs.form.validateField("img");
      },
      rmImage() {
        this.form.img = "";
        this.$refs.form.validateField("img");
      },
    },
  };
</script>

<style lang="scss" scoped>
  .input {
    width: 380px;
  }

  .input1 {
    width: 200px;
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

  table {
    min-height: 500px;
  }
</style>
