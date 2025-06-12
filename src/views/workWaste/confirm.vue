<template>
  <div class="w_100 pt_30 plr_30 ptb_30">
    <el-row>
      <el-col :xs="8" :sm="8" :lg="8" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          BOM编码
        </div>
        <div class="ml_10">
          {{ detail.bomNo }}
        </div>
      </el-col>
      <el-col :xs="8" :sm="8" :lg="8" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          订单号
        </div>
        <div class="ml_10">
          {{ detail.orderNo }}
        </div>
      </el-col>
      <el-col :xs="8" :sm="8" :lg="8" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          补录原因
        </div>
        <div class="ml_10">
          {{ detail.wasteDesc }}
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="8" :sm="8" :lg="8" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          产品编码
        </div>
        <div class="ml_10">
          {{ detail.itemNo }}
        </div>
      </el-col>
      <el-col :xs="8" :sm="8" :lg="8" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          工单号
        </div>
        <div class="ml_10">
          {{ detail.workOrderNo }}
        </div>
      </el-col>
      <el-col :xs="8" :sm="8" :lg="8" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          次品数量
        </div>
        <div class="ml_10">
          {{ detail.itemCount }}
        </div>
      </el-col>
    </el-row>

    <el-row class="c_b fw_bold fs_24 ptb_20">
      工序设置
    </el-row>

    <el-table
      :data="form.wasteProcedureList"
      fit
      border
      ref="table"
      highlight-current-row
      class="table mb_20"
    >
      <el-table-column type="index" width="55" label="序号" align="center"/>
      <el-table-column v-for="item in tableList" :key="item.value" align="center" :label="item.label"
                       :width="item.label == &quot;工单号&quot; || item.label == &quot;数量&quot; ? 300 : &quot;&quot;">
        <template slot-scope="scope">
          <div v-if="item.label == &quot;工单号&quot;" class="flex_row flex_x_center">
            <el-input placeholder="请输入工单号搜索" v-model="scope.row.workOrderNo" class="input-with-select">
              <el-button slot="append" icon="el-icon-search"
                         @click="get_procedure_info(scope.row,scope.$index)"></el-button>
            </el-input>
          </div>
          <div v-else-if="item.label == &quot;数量&quot;" class="flex_row flex_x_center">
            <el-input-number v-model="scope.row.itemCount" class="input1"/>
          </div>
          <div v-else-if="item.label == &quot;操作&quot;" class="flex_row">
            <div class="cur_point c_02 ml_20" @click="operHandle(3,scope.$index)">删除</div>
          </div>
          <template v-else>
            {{ scope.row[item.value] }}
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="w_100 flex_row mb_40">
      <el-button type="primary" icon="el-icon-plus" @click="operHandle(1)">新增一行</el-button>
    </div>

    <el-row class="c_b fw_bold fs_24 ptb_20 ">
      物料领取
    </el-row>

    <el-table
      :data="form.wasteUserList"
      fit
      border
      highlight-current-row
      class="table mb_20"
    >
      <el-table-column type="index" width="55" label="序号" align="center"/>
      <el-table-column v-for="item in tableList1" :key="item.value" align="center" :label="item.label"
                       :width="item.label == &quot;物料编码&quot; || item.label == &quot;领料数量&quot;? 300 : &quot;&quot;">
        <template slot-scope="scope">
          <div v-if="item.label == &quot;物料编码&quot;" class="flex_row flex_x_center">
            <el-input placeholder="请输入编码搜索" v-model="scope.row.itemNo" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="get_item_info(scope.row,scope.$index)"></el-button>
            </el-input>
          </div>
          <div v-else-if="item.label == &quot;领料数量&quot;" class="flex_row flex_x_center">
            <el-input-number v-model="scope.row.itemCount" class="input1"/>
          </div>
          <template v-else-if="item.label == &quot;操作&quot;">
            <div class="flex_row">
              <!-- <div class="cur_point c_02" @click="operHandle(4,scope.row)">查看详情</div> -->
              <div class="cur_point c_02 ml_20" @click="operHandle(5,scope.$index)">删除</div>
            </div>
          </template>
          <template v-else>
            {{ scope.row[item.value] }}
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="w_100 flex_row mb_40">
      <el-button type="primary" icon="el-icon-plus" @click="operHandle(2)">新增一行</el-button>
    </div>

    <div class="w_100 flex_row flex_x_center">
      <el-button @click="operHandle(6)">取消</el-button>
      <el-button type="primary" plain class="ml_20" @click="confirm">确定</el-button>
    </div>
  </div>
</template>
<script>
  import workWasteApi from '@/api/workWasteApi'

  export default {
    data() {
      return {
        tableList: [
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
            label: '操作',
            value: ''
          }
        ],
        // 分页
        pages: {
          total: 0,
          page_num: 1,
          page_size: 10
        },
        // 查询参数
        paramForm: {},
        wlOptions: [],
        sbOptions: [],
        tableList1: [
          {
            label: '物料编码',
            value: 'itemNo'
          },
          {
            label: '物料名称',
            value: 'itemName'
          },
          {
            label: '领料数量',
            value: 'itemCount'
          },
          {
            label: '操作',
            value: ''
          }
        ],
        detail: {},
        id: '',
        flag: true,
        form: {
          wasteId: '',
          createdBy: '',
          createdTime: '',
          wasteProcedureList: [
            {
              wasteId: this.id,
              workOrderNo: '',
              procedureName: '',
              procedureCode: '',
              createdBy: '',
              createdTime: '',
              itemCount: 0
            }
          ],
          wasteUserList: [
            {
              wasteId: this.id,
              itemNo: '',
              itemName: '',
              itemCount: '',
              itemMeasure: '',
              createdBy: '',
              createdTime: ''
            }
          ],
        }
      }
    },
    async created() {
      if (this.$route.query.id) this.id = this.$route.query.id
      this.form.wasteId = this.id;
      this.getDetail();
      // this.getDetailList()
    },
    methods: {
      async getDetail() { // 获取头部详情
        if (this.id) {
          const res = await workWasteApi.confirm_title({
            params: this.id,
            'page': {
              'page_num': 1,
              'page_size': 10
            }
          })
          if (res.data) {
            this.detail = res.data
          }
        }
      },
      /**
       * 查询工单信息
       */
      async get_procedure_info(row, index) {
        if (row.workOrderNo) {
          const res = await workWasteApi.get_procedure_info({
            params: row.workOrderNo,
            'page': {
              'page_num': 1,
              'page_size': 10
            }
          })
          if (res.data) {
            this.form.wasteProcedureList[index].procedureName = res.data.procedureName;
            this.form.wasteProcedureList[index].procedureCode = res.data.procedureCode;
            this.form.wasteProcedureList[index].createdBy = res.data.createdBy;
            this.form.wasteProcedureList[index].createdTime = res.data.createdTime;
          } else {
            this.$message({
              message: '未找到工单号：' + row.workOrderNo + ",请重新输入！",
              type: "warning",
            });
          }
        }
      },
      /**
       * 获取物料列表
       */
      async get_item_info(row, index) {
        var res = await workWasteApi.get_item_info({
          'page': {
            'page_num': 1,
            'page_size': 10
          },
          'params': row.itemNo
        });
        if (res.data) {
          this.form.wasteUserList[index].itemName = res.data.itemName;
          this.form.wasteUserList[index].itemMeasure = res.data.itemMeasure;
          this.form.wasteUserList[index].createdBy = res.data.createdBy;
          this.form.wasteUserList[index].createdTime = res.data.createdTime;
        } else {
          this.$message({
            message: '未找到物料编码：' + row.itemNo + ",请重新输入！",
            type: "warning",
          });
        }
      },
      async getList(str) {
        this.listLoading = true
        try {
          if (str == 'clear') {
            this.paramForm = {}
            this.pages = {
              total: 0,
              page_num: 1,
              page_size: 10
            }
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
      handleClassifyListChange(v) {
        console.log(v, 'v')
      },
      async operHandle(type, item) {
        try {
          switch (type) {
            case 1: // 新增工序设置
              this.form.wasteProcedureList.push(
                {
                  wasteId: this.id,
                  workOrderNo: '',
                  procedureName: '',
                  procedureCode: '',
                  createdBy: '',
                  createdTime: '',
                  itemCount: 0
                }
              )
              break
            case 2: // 新增物料领取
              this.form.wasteUserList.push({
                wasteId: this.id,
                itemNo: '',
                itemName: '',
                itemCount: '',
                itemMeasure: '',
                createdBy: '',
                createdTime: ''
              })
              break
            case 3: // 删除工序设置
              if (this.form.wasteProcedureList.length > 1) {
                this.form.wasteProcedureList.splice(item, 1)
              } else {
                this.$message({
                  message: '不能删除',
                  type: 'error'
                })
              }
              break
            case 4: // 查看物料领取详情
              this.$router.push({
                name: 'workWasteBom',
                query: {
                  id: this.id,
                  bomNo: item.bomNo,
                }
              })
              break
            case 5: // 删除物料领取
              if (this.form.wasteUserList.length > 1) {
                this.form.wasteUserList.splice(item, 1)
              } else {
                this.$message({
                  message: '不能删除',
                  type: 'error'
                })
              }
              break
            case 6: // 返回
              this.$router.push({
                name: 'workWasteList'
              })
              break
            default:
          }
        } finally {
          setTimeout(() => {
            this.flag = true
          }, 2000)
        }
      },
      closeDia() {
        this.info = []
      },
      async confirm() {
        try {
          if (this.flag) {
            this.flag = false;
            var isValidate = false;
            console.log(this.form)
            this.form.wasteProcedureList.forEach((item, index) => {
              if (!item.workOrderNo || !item.itemCount) {
                isValidate = true;
                this.$message({
                  message: '工序设置第' + (index + 1) + '行数据不能为空',
                  type: "warning",
                });
                return;
              }
            });
            if (isValidate) {
              return;
            }
            var isValidate1 = false;
            this.form.wasteUserList.forEach((item, index) => {
              if (!item.itemNo || !item.itemCount) {
                isValidate1 = true;
                this.$message({
                  message: '物料领取第' + (index + 1) + '行数据不能为空',
                  type: "warning",
                });
                return;
              }
            });
            if (isValidate1) {
              return;
            }
            const res = await workWasteApi.work_waste_confirm({params: this.form})
            if (res.data) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.$router.push({
                name: 'workWasteList'
              })
            }
          }
        } finally {
          setTimeout(() => this.flag = true, 1000)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
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
