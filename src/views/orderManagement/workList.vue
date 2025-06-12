<template>
  <div class="w_100 pt_30 plr_30 ptb_30">
    <!-- 筛选条件 -->
    <el-card class="box-card mb_30">
      <el-form :inline="true" :model="paramForm" label-width="80px" label-position="left">
        <el-form-item label="图纸号">
          <!-- <el-input v-model="paramForm.bomNo"/> -->
          <el-select
            v-model="paramForm.bomNos"
            multiple
            placeholder="请选择"
            filterable
            class="input1"
            clearable
            remote
            :remote-method="remoteMethod2"
          >
            <el-option
              v-for="(item,id) in bomNoList"
              :key="id"
              :label="item.bomNo"
              :value="item.bomNo"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="paramForm.orderNo"/>
        </el-form-item>
        <el-form-item label="工单号">
          <el-input v-model="paramForm.workOrderNo"/>
        </el-form-item>
        <el-form-item label="工序名称">
          <el-select
            v-model="paramForm.procedureName"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in options"
              :key="item.procedureCode"
              :label="item.procedureName"
              :value="item.procedureName"
            ></el-option>
          </el-select>
          <!-- <el-input v-model="paramForm.procedureName" /> -->
        </el-form-item>
        <el-form-item label="车间" prop="workShopName">
          <el-select v-model="paramForm.workShopName" placeholder="请选择">
            <el-option
              v-for="item in getWorkCenterList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="commen-no-bg">
          <el-button type="primary" icon="el-icon-search" class @click="operHandle(1)">查询</el-button>
          <el-button class="ml_20" icon="el-icon-refresh" @click="getList('clear')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
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
      <el-table-column type="index" fixed label="序号" align="center" width="60px"></el-table-column>

      <el-table-column key="00" fixed align="center" label="订单号" width="160">
        <template slot-scope="scope">{{scope.row.orderNo}}</template>
      </el-table-column>
      <el-table-column key="00" fixed align="center" prop="bomNo" label="图纸号" width="160"></el-table-column>
      <el-table-column
        v-for="item in tableList"
        :key="item.label"
        align="center"
        :label="item.label"
      >
        <template slot-scope="scope">{{ scope.row[item.value] }}</template>
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

    <!-- 下达 -->
    <el-dialog title="下达" :visible.sync="dialogVisible1" width="600px" top="10vh" @close="closeDia">
      <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="工序名称">
            <div>{{ form.procedureName }}</div>
          </el-form-item>
          <el-form-item label="下达数量" prop="assignCount">
            <el-input v-model="form.assignCount" class="w_100"/>
          </el-form-item>
        </el-form>
        <div class="w_100 flex_row flex_x_center">
          <el-button @click="closeDialog('dialogVisible1')">取消</el-button>
          <el-button type="primary" plain class="ml_20" @click="confirm(1)">确定</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 报工 -->
    <el-dialog title="报工" :visible.sync="dialogVisible2" width="600px" top="10vh" @close="closeDia">
      <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="工序名称">
            <div>{{ form.procedureName }}</div>
          </el-form-item>
          <el-form-item label="正品数量" prop="reportCount">
            <el-input v-model="form.reportCount" class="w_100"/>
          </el-form-item>
        </el-form>
        <div class="w_100 flex_row flex_x_center">
          <el-button @click="closeDialog('dialogVisible2')">取消</el-button>
          <el-button type="primary" plain class="ml_20" @click="confirm(2)">确定</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 次品补录 -->
    <el-dialog
      title="次品补录"
      :visible.sync="dialogVisible3"
      width="600px"
      top="10vh"
      @close="closeDia"
    >
      <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="工序名称">
            <div>{{ form.procedureName }}</div>
          </el-form-item>
          <el-form-item label="次品数量" prop="itemCount">
            <el-input v-model="form.itemCount" class="w_100"/>
          </el-form-item>
          <el-form-item label="整改完成时间" prop="finishTime">
            <el-date-picker
              v-model="form.finishTime"
              class="input"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            />
          </el-form-item>
          <el-form-item label="次品原因" prop="wasteDesc">
            <el-input v-model="form.wasteDesc" class="w_100"/>
          </el-form-item>
        </el-form>
        <div class="w_100 flex_row flex_x_center">
          <el-button @click="closeDialog('dialogVisible3')">取消</el-button>
          <el-button type="primary" plain class="ml_20" @click="confirm(3)">确定</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 次品报工 -->
    <el-dialog
      title="次品报工"
      :visible.sync="dialogVisible4"
      width="600px"
      top="10vh"
      @close="closeDia"
    >
      <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="工序名称">
            <div>{{ form.procedureName }}</div>
          </el-form-item>
          <el-form-item label="次品数量" prop="reportCount">
            <el-input v-model="form.reportCount" class="w_100"/>
          </el-form-item>
        </el-form>
        <div class="w_100 flex_row flex_x_center">
          <el-button @click="closeDialog('dialogVisible4')">取消</el-button>
          <el-button type="primary" plain class="ml_20" @click="confirm(4)">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { page_list_for_pro } from '@/api/work'
import { remote_list, get_bom_list, get_bom_list_keyword } from '@/api/order'

import { get_work_center_list } from '@/api/getWorkCenter'
export default {
  components: {
    UploadExcelComponent
  },
  data() {
    return {
      tableList: [
        // {
        //   label: '序号',
        //   value: 'id'
        // },
        // {
        //   label: '工单号',
        //   value: 'workOrderNo'
        // },
        // {
        //   label: '订单号',
        //   value: 'orderNo'
        // },
        // {
        //   label: '图纸号',
        //   value: 'bomNo'
        // },
        {
          label: '工序编码',
          value: 'procedureCode'
        },
        {
          label: '工序名称',
          value: 'procedureName'
        },

        {
          label: '计划数量',
          value: 'planTotalCount',
          width: 50
        },
        {
          label: '待下达数量',
          value: 'waitAssignCount',
          width: 50
        },
        {
          label: '已下达数量',
          value: 'assignCount',
          width: 50
        },
        {
          label: '已报工数量',
          value: 'reportCount',
          width: 50
        },
        {
          label: '正品数量',
          value: 'realCount'
        },
        {
          label: '次品数量',
          value: 'deffCount'
        },
        {
          label: '次品补录数量',
          value: 'wasteCount'
        },
        {
          label: '次品报工数量',
          value: 'wasteReportCount'
        },
        {
          label: '外协数量',
          value: 'outerCount'
        },
        {
          label: '外协报工数量',
          value: 'outerReportCount'
        }
      ],

      options: [],
      list: [
        {
          id: '76411',
          orderDtlStatus: '01'
        }
      ],
      listLoading: false,
      // 分页
      pages: {
        total: 0,
        page_num: 1,
        page_size: 10
      },
      bomNoList: [],
      // 查询参数
      paramForm: {
        orderNo: '',
        bomNos: [],
        workOrderNo: '',
        procedureName: '',
        workShopName: ''
      },
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      form: {},
      getWorkCenterList: [],
      rules: {
        assignCount: [
          {
            required: true,
            trigger: ['blur', 'change'],
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
        ],
        itemCount: [
          {
            required: true,
            trigger: ['blur', 'change'],
            validator: (rule, value, callback) => {
              let reg = /^(\+)?\d+(\.\d+)?$/
              if (value === '') {
                callback(new Error('请输入次品数量'))
              } else if (!reg.test(value)) {
                callback(new Error('为正数'))
              } else {
                callback()
              }
            }
          }
        ],
        reportCount: [
          {
            required: true,
            message: '请输入',
            trigger: ['blur', 'change'],
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
        ],
        wasteDesc: [
          {
            required: true,
            message: '请输入次品原因',
            trigger: ['blur', 'change']
          }
        ],
        finishTime: [
          {
            required: true,
            message: '请选择整改完成时间',
            trigger: ['blur', 'change']
          }
        ]
      },
      flag: true
    }
  },
  async created() {
    await this.getWorkCenter()
    // await this.get_BOM()
    await this.getList('clear')
  },
  methods: {
    async get_BOM() {
      const res = await get_bom_list({
        page: {
          page_num: 1,
          page_size: 500
        }
      })
      this.bomNoList = res.data
    },
    remoteMethod2(query) {
      if (query !== '') {
        setTimeout(async () => {
          var res = await get_bom_list_keyword({
            params: {
              bomNo: query
            }
          })
          this.bomNoList = res.data
        }, 200)
      } else {
        this.bomNoList = []
      }
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(async () => {
          this.loading = false
          this.options = (await remote_list({
            params: {
              shortCode: query
            }
          })).data
        }, 200)
      } else {
        this.options = []
      }
    },
    async getWorkCenter() {
      //获取车间的下拉框
      var result = await get_work_center_list()
      this.getWorkCenterList = result.data
    },
    closeDialog(name) {
      // this.$nextTick(()=>{
      //   this.$refs.form.clearValidate()
      //   })
      this[name] = false
      this.assignCount = ''
      this.itemCount = ''
      this.finishTime = ''
      this.wasteDesc = ''
      this.reportCount = ''
    },
    async getList(str) {
      this.listLoading = true
      try {
        if (str == 'clear') {
          this.paramForm = {
            orderNo: '',
            bomNos: [],
            workOrderNo: '',
            procedureName: '',
            workShopName: ''
          }
          if (this.getWorkCenterList && this.getWorkCenterList.length > 0) {
            this.$set(
              this.paramForm,
              'workShopName',
              this.getWorkCenterList[0].code
            )
          }
          this.pages = {
            total: 0,
            page_num: 1,
            page_size: 10
          }
        }
        const res = await page_list_for_pro({
          page: {
            page_num: this.pages.page_num,
            page_size: this.pages.page_size
          },
          params: this.paramForm
        })
        console.log(res, 'res')
        if (res.data) {
          this.list = res.data
          this.pages.total = res.page.total_num - 0
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
    async operHandle(type, item) {
      // const self = this;
      /** 清空校验 */
      try {
        switch (type) {
          case 1: // 查询
            this.pages.page_num = 1
            this.pages.total = 0
            this.getList()
            break
          case 2: // 下达
            this.form = JSON.parse(JSON.stringify(item))
            this.form.assignCount = ''
            this.dialogVisible1 = true
            break
          case 3: // 报工
            this.form = JSON.parse(JSON.stringify(item))
            this.form.reportCount = ''
            this.dialogVisible2 = true
            break
          case 4: // 次品补录
            this.form = JSON.parse(JSON.stringify(item))
            this.form.wasteDesc = ''
            this.dialogVisible3 = true
            break
          case 5: // 次品报工
            this.form = JSON.parse(JSON.stringify(item))
            this.form.reportCount = ''
            this.dialogVisible4 = true
            break
          case 6: // 查看详情
            this.$router.push({
              name: 'workDetail',
              query: { id: item.id }
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
      this.form = {}
    },
    async confirm(type) {
      // console.log(this.selectProductTemp)
      try {
        if (this.flag) {
          this.flag = false
          const form = this.form
          const validate = await this.$refs.form.validate()
          if (validate) {
            if (type == 1) {
              //下达
              await work_assign_add({
                params: { workOrderId: form.id, assignCount: form.assignCount }
              })
              this.dialogVisible1 = false
            } else if (type == 2) {
              //报工
              await work_report_add({
                params: {
                  isWasteReport: '0',
                  workOrderId: form.id,
                  reportCount: form.reportCount - 0
                }
              })
              this.dialogVisible2 = false
            } else if (type == 3) {
              //次品补录
              const form1 = {
                workOrderId: form.id,
                workOrderNo: form.workOrderNo,
                orderNo: form.orderNo,
                bomNo: form.bomNo,
                procedureCode: form.procedureCode,
                procedureName: form.procedureName,
                itemNo: form.itemNo,
                itemName: form.itemName,
                finishTime: form.finishTime,
                wasteDesc: form.wasteDesc,
                itemCount: form.itemCount,
                createdBy: form.createdBy,
                createdTime: form.createdTime
              }
              await work_waste_add({ params: form1 })
              this.dialogVisible3 = false
            } else if (type == 4) {
              //次品报工
              await work_report_add({
                params: {
                  isWasteReport: '1',
                  workOrderId: form.id,
                  reportCount: form.reportCount
                }
              })
              this.dialogVisible4 = false
            }
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getList('clear')
          }
        }
      } finally {
        setTimeout(() => (this.flag = true), 1000)
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
