<template>
  <div class="app-container">
    <!-- 筛选条件 -->
    <el-form
      :inline="true"
      class="query-form commen-search"
      :model="paramForm"
      label-width="80px"
      label-position="left"
    >
      <el-form-item label="目的地" class="condition">
        <el-input v-model="paramForm.destination"/>
      </el-form-item>
      <el-form-item label="客户" class="condition">
        <el-input v-model="paramForm.customer"/>
      </el-form-item>
      <el-form-item label="司机" class="condition">
        <el-input v-model="paramForm.driver"/>
      </el-form-item>
      <el-form-item label="状态" class="condition">
        <el-select v-model="paramForm.status" placeholder="请选择" style="width: 187px;">
          <el-option
            :key="item.id"
            v-for="(item,k) in getSalesOption"
            :label="item.value"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发货日期" class="condition">
        <el-date-picker
          v-model="date2"
          type="daterange"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item class="commen-button">
        <el-button type="primary" icon="el-icon-search" @click="operHandle(1)">查询</el-button>
      </el-form-item>
      <el-form-item class="commen-button reset">
        <el-button icon="el-icon-refresh" @click="getList('clear')">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="flex flex-start">
      <el-button
        type="primary"
        class="mb_20"
        v-if="hasPerm('B004002000002')"
        icon="el-icon-plus"
        @click="operHandle(3)"
      >新增发货申请
      </el-button>
      <upload-excel-component
        text="导入"
        v-if="hasPerm('B004002000005')"
        :on-success="handleSuccess"
        :on-change="handleError"
        :fileNameType="'file'"
        class="ml_10 mr_10"
        ref="uploadGong"
      />
    </div>
    <el-link
      :underline="false"
      @click="downLoadTemp()"
      style="color:#3145ec;cursor:pointer;margin-right:10px;margin-bottom:20px;float: right;"
    >下载模板
    </el-link>
    <el-table
      id="isTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      border
      @selection-change="handleSelectionChange"
      highlight-current-row
      class="table mb_30"
    >
      <el-table-column
        v-for="item in tableList"
        :key="item.label"
        align="center"
        :label="item.label"
        :width="item.label == &quot;操作&quot; ? 230 : &quot;&quot;"
      >
        <template slot-scope="scope">
          <template
            v-if="item.label == &quot;状态&quot;"
          >{{ scope.row.status == "00" ? "待确认": "已确认" }}
          </template>
          <template v-else-if="item.label == '司机'">
            <div class="cur_point c_02" @click="batch(2,scope.row)">{{scope.row.driver}}</div>
          </template>
          <template v-else-if="item.label == &quot;操作&quot;">
            <div class="flex_row flex_center">
              <el-button
                link
                type="primary"
                icon="Edit"
                @click="batch(1,scope.row) "
                v-if="scope.row.status == '00' && hasPerm('B004002000003') "
              >编辑
              </el-button>
              <el-button
                link
                type="primary"
                icon="Edit"
                v-if="hasPerm('B004002000004')"
                @click="batch(2,scope.row)"
              >查看详情
              </el-button>
              <el-button
                link
                type="primary"
                icon="Edit"
                @click="batch(3,scope.row)"
                v-if="scope.row.status == '00' && hasPerm('B004002000006')"
              >删除
              </el-button>
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
    <el-dialog
      title="编辑发货申请"
      :visible.sync="dialogVisible"
      width="600px"
      top="10vh"
      @close="closeDia"
    >
      <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item
            label="关联客户"
            :rules="[{ required: true, message: '请输入关联客户', trigger: 'blur' }]"
          >
            <el-input v-model="form.custName" disabled class="w_100"/>
          </el-form-item>
          <el-form-item
            label="图纸号"
            prop="bomNo"
            :rules="[{ required: true, message: '请输入图纸号', trigger: 'blur' }]"
          >
            <el-input v-model="form.bomNo" disabled class="w_100"/>
          </el-form-item>
          <el-form-item label="申请发货数量" prop="needNum">
            <el-input v-model.number="form.needNum" class="w_100"/>
          </el-form-item>
        </el-form>
        <div class="w_100 flex_row flex_x_center">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" plain class="ml_20" @click="confirm">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {sales_new_import_delivery} from '@/api/sales'
  import workWasteApi from '@/api/workWasteApi'
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'
  import {get_new_export} from '@/api/common'
  import {
    new_delivery_page_list,
    delete_new_delivery_page_list,
    edit_new_delivery_page_list
  } from '@/api/order'

  export default {
    components: {
      UploadExcelComponent
    },
    data() {
      return {
        form: {},
        date: [],
        selectList: [],
        multipleSelection: [],
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
            label: '操作',
            value: ''
          }
        ],
        list: [],
        listLoading: false,
        // 分页
        pages: {
          total: 0,
          page_num: 1,
          page_size: 20
        },
        date2: [],
        // 查询参数
        paramForm: {}
      }
    },
    async created() {
      await this.getList('clear')
    },
    methods: {
      async batch(type, item) {
        if (!item && this.selectList.length == 0) {
          this.$message.error('请勾选要操作的数据')
          return
        }
        if (type == 1) {
          this.$router.push({
            name: 'editShipment',
            query: {
              id: item.id
            }
          })
        }
        if (type == 2) {
          // 查看详情
          this.$router.push({
            name: 'detailShipment',
            query: {
              id: item.id,
              type: 'detail',
              isDisabled_flag: 'false'
            }
          })
        }
        if (type == 3) {
          //删除
          await this.$confirm(
            '发货申请删除后将不可恢复，是否继续此操作',
            '删除确认',
            {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
          this.flag = false
          var res2 = await delete_new_delivery_page_list({
            params: {
              id: item.id
            }
          })
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getList()
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
      },

      downLoadTemp() {
        get_new_export('/api/sales/delivery_order/down_temp', {})
      },

      async handleError(file, type) {
        this.$refs.uploadGong.loading = false
      },
      async handleSuccess(file, type) {
        let res
        this.$refs.uploadGong.loading = false
        res = await sales_new_import_delivery(file)
        if (res) {
          this.getList()
          this.$message({
            type: 'success',
            message: '导入成功'
          })
        }
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
              page_size: 20
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
          var res = await edit_new_delivery_page_list({
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
          case 2: // 编辑
            this.dialogVisible = true
            this.form.bomNo = item.bomNo
            this.form.custName = item.custName
            this.form.id = item.id
            this.form.needNum = null
            break
          case 3: // 新增
            this.$router.push({
              name: 'addShipment'
            })
            break
          case 4: // 删除
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
