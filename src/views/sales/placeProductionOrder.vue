<template>
  <div class="app-container">
    <el-card>
      <el-form
        :inline="true"
        ref="form2"
        :rule="rules"
        :model="form2"
        label-width="80px"
        label-position="left"
      >
        <el-form-item
          label="承诺交期"
          prop="deliverTime"
          :rules="[{ required: true, message: '请选择承诺交期', trigger: 'blur' }]"
        >
          <el-date-picker
            v-model="form2.deliverTime"
            type="date"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            class="mr_30"
            placeholder="选择日期"
            style="width: 187px;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="类型"
          :rules="[{ required: true, message: '请选择类型', trigger: 'blur' }]"
          prop="bizType"
        >
          <el-select v-model="form2.bizType" placeholder="请选择">
            <el-option
              :key="item.code"
              v-for="item in getSalesOption"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="类型"
          :rules="[{ required: true, message: '请选择类型', trigger: 'blur' }]"
          prop="bizType"
          v-show="false"
        >
        </el-form-item>
      </el-form>
    </el-card>
    <el-table
      id="isTable"
      v-loading="listLoading"
      @selection-change="handleSelectionChange"
      :data="list"
      element-loading-text="Loading"
      fit
      border
      highlight-current-row
      class="table mb_30"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        v-for="item in tableList"
        :key="item.label"
        align="center"
        :label="item.label"
        :width="item.label == '下单数量'?250:''"
      >
        <template slot-scope="scope">
          <template v-if="item.label == '下单数量'">
            <el-input-number v-model="scope.row.orderedNum"></el-input-number>
          </template>
          <template v-else-if="item.label == '操作'">
            <div class="flex_row flex_x_between">
              <div class="cur_point c_02" @click="operHandle(4,scope.row)">查看详情</div>
            </div>
          </template>
          <template v-else>{{ scope.row[item.value] }}</template>
        </template>
      </el-table-column>
    </el-table>
    <div class="w_100 flex_row flex_x_center">
      <el-button type plain class="ml_20" @click="operHandle(1)">取消</el-button>
      <el-button type="primary" class="ml_20" @click="operHandle(2)">保存并提交审批</el-button>
    </div>
  </div>
</template>
<script>
  import {
    place_page_list,
    place_order,
    get_sales_value,
    get_sales_option
  } from '@/api/sales'
  import {dictInfo} from '@/api/common'

  export default {
    data() {
      return {
        getSalesOption: [],
        form2: {},
        rules: {
          name: [{required: true, message: '请输入活动名称', trigger: 'blur'}],
          region: [
            {required: true, message: '请选择活动区域', trigger: 'change'}
          ]
        },
        selectList: [],
        tableList: [
          {
            label: '订单号',
            value: 'orderNo'
          },
          {
            label: '关联客户',
            value: 'custName'
          },
          {
            label: '图纸号',
            value: 'bomNo'
          },
          {
            label: '需求数量',
            value: 'needNum'
          },
          {
            label: '待下单数量',
            value: 'waitOrderedNum'
          },
          {
            label: '下单数量',
            value: 'waitOrderedNum',
          },
          // {
          //   label: '操作',
          //   value: 'procedureCode'
          // }
        ],
        list: [],
        listLoading: false
      }
    },
    async created() {
      this.getSelectOption();
      await this.getList('clear')
    },
    methods: {
      async getList(str) {
        this.listLoading = true
        try {
          if (str == 'clear') {
            this.paramForm = {}
            this.date = null
            this.pages = {
              total: 0,
              page_num: 1,
              page_size: 10
            }
          }
          if (this.date) {
            this.paramForm.startDate = this.date[0]
            this.paramForm.endDate = this.date[1]
          }
          var ids = JSON.parse(this.$route.query.id)
          const res = await place_page_list({
            page: {
              page_num: this.pages.page_num,
              page_size: this.pages.page_size
            },
            params: {list: ids}
          })
          if (res.data) {
            this.list = res.data
            this.list.forEach(item => {
              item.orderedNum = item.waitOrderedNum
            })
          }
        } finally {
          this.listLoading = false
        }
      },
      getSelectOption() {
        dictInfo("ORDER_TYPE", res => this.getSalesOption = res)
      },
      handleSelectionChange(val) {
        this.selectList = val
        // this.selectList = this.multipleSelection
        console.log(this.selectList)
      },

      // handleSelectionChange(val) {

      //     this.multipleSelection = val;
      // },
      async operHandle(type, item, index) {
        switch (type) {
          case 1: // 返回
            this.$router.push({
              name: 'salesManagesment'
            })
            break
          case 2: // 保存并提交
            // console.log(this.selectProductTemp)

            const validate2 = await this.$refs.form2.validate()
            if (validate2) {
              if (this.selectList.length == 0) {
                this.$message.error('请选择下生产单数据')
                return
              }
              var list = []
              this.selectList.forEach(item => {
                list.push({
                  id: item.id,
                  orderedNum: item.orderedNum
                })
              })
              await place_order({
                page: {
                  page_num: 1,
                  page_size: 1
                },
                params: {
                  deliverTime: this.form2.deliverTime,
                  bizType: this.form2.bizType,
                  list: list
                }
              })
              this.dialogVisible3 = false
              this.operHandle(1)
            }

            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getList('clear')

            break
          case 4: // 查看详情
            this.$router.push({
              name: 'BOMDetail',
              query: {
                id: item.bomNo
              }
            })
            break

          default:
        }
      }
    }
  }
</script>
