<template>
  <div class="w_100 pt_30 plr_30 ptb_30">
    <!-- 筛选条件 -->
    <el-card class="box-card mb_30">
      <el-form :inline="true" :model="paramForm" label-width="90px" label-position="left">
        <el-form-item label="目的地：">
          <el-input v-model="paramForm.destination"/>
        </el-form-item>
        <el-form-item label="客户：">
          <el-input v-model="paramForm.customer"/>
        </el-form-item>
        <el-form-item label="司机：">
          <el-input v-model="paramForm.driver"/>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="paramForm.status" placeholder="请选择" style="width: 187px;">
            <el-option
              :key="item.id"
              v-for="(item, k) in getSalesOption"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发货日期：">
          <el-date-picker
            v-model="date2"
            type="daterange"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item class="commen-no-bg">
          <el-button type="primary" icon="el-icon-search" class @click="operHandle(1)">查询</el-button>
          <el-button class="ml_20" icon="el-icon-refresh" @click="getList('clear')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-button
      type="primary"
      icon="el-icon-s-management"
      v-if="hasPerm('B006006000001')"
      class="mb_20"
      @click="operHandle(3)"
    >批量确认
    </el-button>
    <!--    <el-button type="primary" class="mb_20" @click="operHandle(4)">修改发货数量</el-button>-->
    <el-button type="primary" class="mb_20" @click="operHandle(5)" v-if="hasPerm('B006006000002')">
      <img
        src="@/assets/images/export.png"
        style="width:14px;vertical-align:center;margin-right:4px;"
        alt
      >导出
    </el-button>
    <!-- :selectable="selectable" -->
    <el-table
      id="isTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      border
      ref="multipleTable"
      highlight-current-row
      @selection-change="handleSelectionChange"
      class="table mb_30"
    >
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column
        v-for="item in  tableList "
        :key="item.label"
        align="center"
        :label="item.label"
        :width="item.label == '操作' ? 170 : ''"
      >
        <template slot-scope="scope">
          <template v-if="item.label == '状态'">{{ scope.row.status == "00" ? "待确认" : "已确认" }}</template>
          <template v-else-if="item.label == '司机'">
            <div class="cur_point c_02" @click="batch(scope.row)">{{scope.row.driver}}</div>
          </template>
          <template v-else-if="item.label == '操作'">
            <div class="flex_row flex_center">
              <div
                class="cur_point c_02"
                @click="print(scope.row)"
                v-if="hasPerm('B006006000003')"
              >打印
              </div>
              <div
                class="cur_point c_02"
                @click="operHandle(3, scope.row)"
                v-if="scope.row.status == '00' && hasPerm('B006006000004')"
                style="margin-left:10px;"
              >确认
              </div>
              <div
                class="cur_point c_02"
                @click="operHandle(4, scope.row)"
                v-if="(scope.row.status == '01'&& scope.row.commitStatus == '00') && hasPerm('B006006000006')"
                style="margin-left:15px;"
              >修改数量
              </div>
              <div
                class="cur_point c_02"
                v-if="hasPerm('B006006000005')"
                @click="batch(scope.row)"
                style="margin-left:10px;"
              >查看详情
              </div>
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
      <span class="product-total">共{{ pages.total }}条</span>
    </el-pagination>
  </div>
</template>
<script>
  import workWasteApi from '@/api/workWasteApi'
  import {get_new_export} from '@/api/common'
  import {
    delivery_page_list,
    new_delivery_page_list,
    delete_delivery_page_list,
    edit_delivery_page_list,
    new_audit_delivery_page_list
  } from '@/api/order'
  import {get_sales_value} from '@/api/sales'

  export default {
    data() {
      return {
        form: {},
        date: [],
        rules: {
          needNum: [
            {
              required: true,
              trigger: 'change',
              validator: (rule, value, callback) => {
                let reg = /^(\+)?\d+(\.\d+)?$/
                if (value === '') {
                  callback(new Error('请输入'))
                } else if (!reg.test(value)) {
                  callback(new Error('为正数'))
                } else {
                  callback()
                }
              }
            }
          ]
        },
        getSalesOption: [
          {
            id: '00',
            value: '待确认'
          },
          {
            id: '01',
            value: '已确认'
          }
        ],
        dialogVisible: false,
        tableList: [
          // {
          //   label: '序号',
          //   value: 'id'
          // },
          {
            label: '司机',
            value: 'driver'
          },
          {
            label: '发货日期',
            value: 'deliveryDate'
          },
          {
            label: '目的地',
            value: 'destination'
          },

          {
            label: '客户',
            value: 'customer'
          },
          {
            label: '状态',
            value: 'status'
          },
          {
            label: '提交仓库',
            value: 'commitStatusDesc'
          },

          {
            label: '操作',
            value: ''
          }
        ],
        list: [],
        multipleSelection: [],
        listLoading: false,
        // 分页
        pages: {
          total: 0,
          page_num: 1,
          page_size: 10
        },
        selectList: [],
        date2: [],
        // 查询参数
        paramForm: {}
      }
    },
    async created() {
      await this.getList('clear')
    },
    methods: {
      print(row) {
        const printUrl = `${
          process.env.VUE_APP_BASE_API
        }/api/export/delivery/exportMain?id=${row.id}`
        window.open(printUrl, '_blank')
      },
      batch(item) {
        if (!item && this.selectList.length == 0) {
          this.$message.error('请勾选要操作的数据')
          return
        }
        // isDisabled_flag 字符串 'true' || 'false' 销售管理不禁用,生产管理要禁用
        this.$router.push({
          name: 'detailShipment',
          query: {
            id: item.id,
            type: 'detail',
            backPage: 'orderPage',
            isDisabled_flag: 'true'
          }
        })
      },
      selectable: function (row, index) {
        if (row.status == '00') {
          return true
        } else {
          return false
        }
      },
      handleSelectionChange(val) {
        if (val.length == this.list.length) {
          //当前页数据全选
          val.forEach(item => {
            if (this.selectList.every(it => it != item.id)) {
              this.selectList.push(item.id)
              this.multipleSelection.push(item)
            }
          })
        } else if (val.length > 0) {
          //当前页数据部分改动
          this.list.forEach(item => {
            let index = val.findIndex(it => it.id == item.id)
            if (index > -1) {
              if (this.selectList.every(i => i != item.id)) {
                this.selectList.push(item.id)
                this.multipleSelection.push(item)
              }
            } else {
              let i = this.selectList.findIndex(i => i == item.id)
              if (i > -1) {
                this.selectList.splice(i, 1)
                this.multipleSelection.splice(i, 1)
              }
            }
          })
        } else if (val.length == 0) {
          //当前页数据全删除
          this.list.forEach(item => {
            let index = this.selectList.findIndex(it => it == item.id)
            if (index > -1) {
              this.selectList.splice(index, 1)
              this.multipleSelection.splice(index, 1)
            }
          })
        }
        console.log(this.multipleSelection, 'this.selectList')
      },
      closeDia() {
        this.$refs.form.clearValidate()
      },
      async getList(str) {
        this.listLoading = true
        try {
          if (str == 'clear') {
            this.date = []
            this.date2 = []
            this.paramForm = {}
            this.pages = {
              total: 0,
              page_num: 1,
              page_size: 10
            }
          }
          if (this.date) {
            this.paramForm.applyStartDate = this.date[0]
            this.paramForm.applyEndDate = this.date[1]
          } else {
            delete this.paramForm.applyStartDate
            delete this.paramForm.applyEndDate
          }
          if (this.date2) {
            this.paramForm.startDate = this.date2[0]
            this.paramForm.endDate = this.date2[1]
          } else {
            delete this.paramForm.startDate
            delete this.paramForm.endDate
          }
          const res = await new_delivery_page_list({
            page: {
              page_num: this.pages.page_num,
              page_size: this.pages.page_size
            },
            params: this.paramForm
          })
          if (res.data) {
            res.data.map(item => {
              item['commitStatusDesc'] =
                item['commitStatus'] === '00' ? '未提交审核' : '已提交'
            })
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
      async confirm() {
        const validate = await this.$refs.form.validate()
        if (validate) {
          var form = JSON.parse(JSON.stringify(this.form))
          delete form.bomNo
          var res = await edit_delivery_page_list({
            params: form
          })
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.dialogVisible = false
          this.getList()
        }
      },
      async operHandle(type, item) {
        switch (type) {
          case 1: // 查询
            this.pages.page_num = 1
            this.pages.total = 0
            this.getList()
            break
          case 3: // 批量确认
            if (item) {
              // this.page
              this.selectList = [item.id]
            }
            if (this.selectList.length == 0) {
              this.$message.error('请勾选要操作的数据')
              return
            }
            await this.$confirm('是否确认', '提示', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            })
            var res2 = await new_audit_delivery_page_list({
              params: {
                ids: this.selectList
              }
            })
            if (res2.tx_code == '00') {
              this.$message({
                type: 'success',
                message: '确认完成'
              })
              this.selectList = []
              this.getList()
            }

            break
          case 4: //批量修改发货数量
            if (!item && this.selectList.length == 0) {
              this.$message.error('请勾选要操作的数据')
              return
            }
            this.$router.push({
              name: 'detailShipment',
              query: {
                id: item.id,
                type: 'detail',
                type2: 'num',
                isDisabled_flag: 'true'
              }
            })
            break
          case 5: //导出
            if (!item && this.selectList.length == 0) {
              this.$message.error('请勾选要操作的数据')
              return
            }
            let param = {
              ids: item ? [item.id] : this.selectList
            }
            get_new_export('api/sales/delivery_order/export_order', {
              page: {page_num: 1, page_size: 1},
              params: param
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
