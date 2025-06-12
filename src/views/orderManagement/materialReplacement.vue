<template>
  <div class="w_100 pt_30 plr_30 ptb_30 newOrderOuter">
    <el-card class="box-card mb_30">
      <el-form
        :inline="true"
        :model="paramForm"
        label-width="98px"
        class="orderManagement-form"
        label-position="left"
      >
        <el-form-item label="订单号：">
          <el-input v-model="paramForm.orderNo"/>
        </el-form-item>
        <el-form-item label="图纸号：">
          <!-- <el-input v-model="paramForm.bomNo" /> -->
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
        <el-form-item label="物料编码：">
          <el-input v-model="paramForm.itemNo"/>
        </el-form-item>
        <el-form-item label="物料名称：">
          <el-input v-model="paramForm.itemNo"/>
        </el-form-item>
        <el-form-item class="commen-no-bg">
          <el-button type="primary" icon="el-icon-search" class @click="operHandle(1)">查询</el-button>
          <el-button class="ml_20" icon="el-icon-refresh" @click="getList('clear')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-button type="primary" plain class="mb_20" @click="operHandle(1)">批量替换物料</el-button>

    <el-table
      v-loading="listLoading"
      :data="procedure.procedureList"
      element-loading-text="Loading"
      fit
      border
      highlight-current-row
      class="table mb_30"
      @select="handleSelectionChange"
      @select-all="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <!-- :width="item.label != &quot;工序分配&quot;? 120 : item.label == &quot;操作&quot; ? 100 : &quot;&quot;" -->
      <el-table-column
        v-for="item in tableList"
        :key="item.label"
        align="center"
        :label="item.label"
      >
        <template slot-scope="scope">
          <div v-if="item.label == &quot;替换物料&quot;" class="flex_row flex_x_center">
            <div class="cur_point c_02" @click="operHandle(1,scope.row)">分配外协厂商</div>
          </div>
          <template v-else>{{ scope.row[item.value] }}</template>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination background layout="prev, pager,next,  sizes, slot" :total="pages.total"
        :current-page="pages.page_num" :page-size="pages.page_size" @current-change="handleCurrentChange"
        @size-change="handleSizeChange">
        <span class="product-total">共{{ pages.total }}条</span>
    </el-pagination>-->
    <div class="w_100 flex_row flex_x_center">
      <el-button type plain class="ml_20" @click="operHandle(3)">取消</el-button>
      <el-button type="primary" class="ml_20" @click="operHandle(4)">提交审批</el-button>
    </div>

    <!-- 新增、编辑弹窗 -->
    <el-dialog title="分配外协厂商1" visible.sync="true" width="600px" top="10vh" @close="closeDia">
      <div
        v-for="(item,k) in companyArr"
        :key="k"
        :class="k==companyArr.length-1?'flex_center flex_x_between':'bd_b_e mb_20 flex_center flex_x_between'"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="外协厂商" prop="employeeNo">
            <!-- <el-select v-model="form.employeeNo" filterable placeholder="请选择" style="width:200px;">
              <el-option
                v-for="item in workOptions"
                :key="item.id"
                :label="item.employeeName"
                :value="item.employeeNo"
              />
            </el-select>-->
            <pinyin-select
              :selectList="workOptions"
              labelName="employeeName"
              lableId="employeeNo"
              :value="form.employeeNo"
              :selectChange.sync="form.employeeNo"
            ></pinyin-select>
          </el-form-item>
          <el-form-item label="分配数量" prop="outerCount">
            <el-input v-model="form.outerCount" style="width:200px;" type="number"/>
          </el-form-item>
        </el-form>
        <div class="cur_point c_02" @click="companyOpe(2,k)">删除</div>
      </div>
      <el-button type="primary" class="mb_20" @click="companyOpe(1)">新增</el-button>
      <div class="w_100 flex_row flex_x_center">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" plain class="ml_20" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    work_detail,
    get_outer_detail,
    update_order_outer,
    get_outer_procedure,
    get_all_outer,
    update_order_work,
    get_bom_list,
    get_bom_list_keyword
  } from '@/api/order'
  import pinyinSelect from '@/components/pinyinSelect.vue'

  export default {
    data() {
      return {
        bomNoList: [],
        companyArr: [{}, {}],
        selectItem: {},
        tableList: [
          {
            label: '图纸号',
            value: ''
          },
          {
            label: '订单号',
            value: 'hoursWorkName'
          },
          {
            label: '物料编码',
            value: 'workShopName'
          },
          {
            label: '物料名称',
            value: 'canOuterCount'
          },
          {
            label: '规格',
            value: 'procedureCode'
          },
          {
            label: '计量单位',
            value: 'procedureName'
          },
          {
            label: '所需数量',
            value: 'procedureName'
          },
          {
            label: '实际库存',
            value: 'procedureName'
          },
          {
            label: '替换物料',
            value: ''
          }
        ],
        list: [{}],
        listLoading: false,
        // 分页
        pages: {
          total: 0,
          page_num: 1,
          page_size: 10
        },
        // 查询参数
        paramForm: {
          name: '',
          code: '',
          status: ''
        },
        dialogVisible: false, // 新增编辑弹窗
        form: {
          employeeNo: '',
          outerCount: '',
          employeeName: ''
        },
        rules: {
          employeeNo: [
            {
              required: true,
              message: '请选择',
              trigger: ['blur', 'change']
            }
          ],
          outerCount: [
            {
              required: true,
              message: '请输入',
              trigger: ['blur', 'change']
            }
          ]
        },
        detail: {},
        id: '',
        orderNo: '',
        bomNo: '',
        workOptions: [],
        procedure: {
          procedureList: []
        },
        selectList: [], //已选择的数据
        selectBom: {},
        orderInfo: {}
      }
    },

    components: {
      pinyinSelect
    },
    async created() {
      // await this.get_BOM()
      if (this.$route.query.id) {
        this.id = this.$route.query.id
      }
      if (this.$route.query.orderInfo)
        this.orderInfo = JSON.parse(this.$route.query.orderInfo)
      if (this.$route.query.bomNo) this.bomNo = this.$route.query.bomNo
      if (this.$route.query.orderNo) this.orderNo = this.$route.query.orderNo
      this.getDetail()
    },
    methods: {
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
      async get_BOM() {
        const res = await get_bom_list({
          page: {
            page_num: 1,
            page_size: 500
          }
        })
        this.bomNoList = res.data
      },
      companyOpe(type, k) {
        switch (type) {
          case 1: // 新增外协厂商
            this.companyArr.push({})
            break
          case 2: // 编辑分配外协厂商
            this.companyArr.splice(k, 1)
            break
        }
      },
      async getItemProcedureN(data) {
        const res = await get_outer_procedure({
          params: {
            // bomNo: data.bomNo,
            id: this.id,
            type: '00',
            itemNo: this.selectBom.itemNo
          }
        })
        if (res.tx_code == '00') {
          let procedureWorkersName = ''
          res.data.procedureList.map(item => {
            procedureWorkersName = ''
            if (item.procedureWorkers && item.procedureWorkers.length > 0) {
              item.procedureWorkers.map(value => {
                procedureWorkersName +=
                  value.employeeName + '(' + value.outerCount + '),'
              })
            }
            item['procedureWorkersName'] = procedureWorkersName.slice(
              0,
              procedureWorkersName.length - 1
            )
            item['hoursWorkName'] = item.hoursWork + '（元）'
          })
          this.procedure = res.data
        }
      },
      async get_all_outer() {
        // 获取外协商
        const res = await get_all_outer()
        if (res.tx_code == '00') {
          this.workOptions = res.data
        }
      },
      async getDetail() {
        // 获取详情
        if (this.id) {
          const res = await get_outer_detail({
            params: {
              bomNo: this.bomNo,
              id: this.id
            }
          })
          if (res.tx_code == '00') {
            var child = {
              bomNo: res.data.bomNo,
              childUseList: [res.data],
              itemCount: res.data.itemCount,
              itemMeasure: res.data.itemMeasure,
              itemMeasureAssist: res.data.itemMeasureAssist,
              itemModel: res.data.itemModel,
              itemName: res.data.itemName,
              itemNo: res.data.itemNo,
              location: res.data.location,
              procedureList: res.data.procedureList
            }

            this.detail = child

            this.selectBom = res.data
            console.log(res.data.itemNo)
            this.getItemProcedureN(res.data)
          }
        }
      },
      async getList(str) {
        this.listLoading = true
        try {
          if (str == 'clear') {
            this.paramForm = {
              name: '',
              code: '',
              status: ''
            }
            this.pages = {
              total: 0,
              page_num: 1,
              page_size: 10
            }
          }
          // this.tabs携带
          // console.log(this.paramForm,'this.paramForm')
          // let res = await actManage(this.paramForm)
          // if(res){
          //     this.list = res.data;
          //     this.total = res.page.total_num;
          //     this.page_size = res.data.per_page ? parseInt(res.data.per_page) : 20;
          // }
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
        if (!item || !item.procedureWorkers) {
          if (!item) {
            item = {}
            item['procedureWorkers'] = []
          } else {
            item['procedureWorkers'] = []
          }
        }

        console.log(item)
        switch (type) {
          case 1: // 新增分配外协厂商
            // this.form = JSON.parse(JSON.stringify(item))
            this.get_all_outer()
            this.selectItem = item
            this.form = {}
            this.dialogVisible = true
            this.$nextTick(() => {
              this.$refs.form.clearValidate()
            })

            break
          case 2: // 编辑分配外协厂商
            this.form = {}
            this.selectItem = item
            this.dialogVisible = true
            this.$nextTick(() => {
              this.$refs.form.clearValidate()
            })
            break
          case 3: // 返回
            this.$router.push({
              path: '/orderManagement'
            })
            break
          case 4: // 提交审批
            this.$router.push({
              path: '/orderManagement'
            })
            break
          default:
        }
      },
      menuSelect(index, path) {
        console.log(index, path)
      },
      handleNodeClick(data) {
        console.log(data, 'data')
        this.selectList = []
        this.selectBom = data
        this.procedure = {
          ...data
        }
        this.getItemProcedureN(data)
      },
      closeDia() {
        this.form = {
          employeeNo: '',
          outerCount: '',
          employeeName: ''
        }
      },
      async updateOrderWork(info, isDefault) {
        console.log(this.selectItem)

        let param
        if (this.selectItem.procedureCode > 0) {
          param = {
            params: {
              itemNo: this.selectBom.itemNo,
              procedureCodes: [this.selectItem.procedureCode],
              orderDetailId: this.id,
              orderNo: this.orderNo,
              outerDistribution: info
            }
          }
        } else {
          if (this.selectList.length == 0) {
            this.$message({
              message: '请选择工序',
              type: 'success'
            })
            return
          }
          param = {
            params: {
              itemNo: this.selectBom.itemNo,
              procedureCodes: this.selectList,
              orderDetailId: this.id,
              orderNo: this.orderNo,
              outerDistribution: info
            }
          }
        }

        console.log(param)
        let res = await update_order_outer(param)
        if (res.tx_code == '00') {
          this.dialogVisible = false
          this.getItemProcedureN(this.selectBom)
        }
      },

      async confirm() {
        // console.log(this.selectProductTemp)
        try {
          let that = this
          console.log(this.form)
          const form = JSON.parse(JSON.stringify(this.form))
          console.log(form)

          if (!form.employeeNo) {
            this.$message({
              message: '请选择外协厂商',
              type: 'error'
            })
            return
          }
          if (!form.outerCount) {
            this.$message({
              message: '请输入数量',
              type: 'error'
            })
            return
          }
          if (form.outerCount <= 0) {
            this.$message({
              message: '请输入大于0的数值 ',
              type: 'error'
            })
            return
          }

          this.workOptions.map(value => {
            if (form.employeeNo == value.employeeNo) {
              form['employeeName'] = value.employeeName
            }
          })

          await this.$confirm('是否分配外协？', '分配确认', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(r => {
              if (r == 'confirm') {
                that.updateOrderWork(form, true)
              }
            })
            .catch(e => {
            })
        } finally {
          setTimeout(() => (this.flag = true), 1000)
        }
      },
      getImg(img) {
        this.form.img = img
        this.$refs.form.validateField('img')
      },
      rmImage() {
        this.form.img = ''
        this.$refs.form.validateField('img')
      },
      handleSelectionChange(val) {
        console.log(this.procedure.procedureList)
        if (val.length == this.procedure.procedureList.length) {
          //当前页数据全选
          val.forEach(item => {
            if (this.selectList.every(it => it != item.procedureCode)) {
              this.selectList.push(item.procedureCode)
            }
          })
        } else if (val.length > 0) {
          //当前页数据部分改动
          this.procedure.procedureList.forEach(item => {
            let index = val.findIndex(
              it => it.procedureCode == item.procedureCode
            )
            if (index > -1) {
              if (this.selectList.every(i => i != item.procedureCode)) {
                this.selectList.push(item.procedureCode)
              }
            } else {
              let i = this.selectList.findIndex(i => i == item.procedureCode)
              if (i > -1) this.selectList.splice(i, 1)
            }
          })
        } else if (val.length == 0) {
          //当前页数据全删除
          this.procedure.procedureList.forEach(item => {
            let index = this.selectList.findIndex(it => it == item.procedureCode)
            if (index > -1) this.selectList.splice(index, 1)
          })
        }
        console.log(this.selectList, 'this.selectList')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .input1 {
    width: 240px;
  }

  ::v-deep .my_label {
    width: 120px;
  }

  ::v-deep .newOrderOuter {
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
