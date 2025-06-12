<template>
  <div class="w_100 pt_30 plr_30 ptb_30">
    <el-row>
      <el-col :xs="8" :sm="8" :lg="8" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">订单名称</div>
        <div class="ml_10">{{ orderInfo.orderDesc}}</div>
      </el-col>
      <el-col :xs="8" :sm="8" :lg="8" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">订单类型</div>
        <div class="ml_10">{{ orderInfo.orderTypeName }}</div>
      </el-col>
      <el-col :xs="8" :sm="8" :lg="8" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">接收人</div>
        <div class="ml_10">{{ orderInfo.receiveUser }}</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="8" :sm="8" :lg="8" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">订单号</div>
        <div class="ml_10">{{ orderInfo.orderNo }}</div>
      </el-col>
      <el-col :xs="8" :sm="8" :lg="8" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">制单人</div>
        <div class="ml_10">{{ orderInfo.createUser }}</div>
      </el-col>
      <el-col :xs="8" :sm="8" :lg="8" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">订单状态</div>
        <div class="ml_10">{{ orderInfo.orderDtlStatusName }}</div>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :span="6">
        <el-row class="c_b fw_bold fs_24 ptb_20">BOM组成</el-row>
        <el-tree
          :data="detail.childUseList"
          :props="{children: 'childUseList',label: 'itemName',value: 'itemNo'}"
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :span="18">
        <el-row class="c_b fw_bold fs_24 ptb_20">工序配置</el-row>
        <el-row>
          <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
            <div class="label fw_bold fs_24">物料编码</div>
            <div class="ml_10">{{ procedure.itemNo }}</div>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
            <div class="label fw_bold fs_24">产品名称</div>
            <div class="ml_10">{{ procedure.itemName }}</div>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
            <div class="label fw_bold fs_24">BOM编码</div>
            <div class="ml_10">{{ procedure.bomNo }}</div>
          </el-col>
          <!-- <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
            <div class="label fw_bold fs_24">
              辅助用量
            </div>
            <div class="ml_10">
              {{ procedure.itemMeasureAssist }}
            </div>
          </el-col>-->
        </el-row>

        <el-table
          :data="procedure.procedureList"
          element-loading-text="Loading"
          fit
          border
          highlight-current-row
          class="table mb_30"
        >
          <el-table-column
            v-for="item in tableList"
            :key="item.label"
            align="center"
            :label="item.label"
            :width="item.label != &quot;工序分配&quot;? 120 : item.label == &quot;操作&quot; ? 100 : &quot;&quot;"
          >
            <template slot-scope="scope">
              <div v-if="item.label == &quot;操作&quot;" class="flex_row flex_x_center">
                <div class="cur_point c_02" @click="operHandle(1,scope.row)">工序分配</div>
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
          <el-button type="primary" plain class="ml_20" @click="operHandle(3)">返回</el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 新增、编辑弹窗 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="600px"
      top="10vh"
      @close="closeDia"
    >
      <div>
        <el-table
          id="isTable"
          v-loading="listLoading"
          :data="info"
          element-loading-text="Loading"
          fit
          border
          highlight-current-row
          class="table mb_30"
        >
          <el-table-column
            v-for="item in tableList1"
            :key="item.label"
            align="center"
            :label="item.label"
            :width="item.label == &quot;操作&quot; ? 100 : &quot;&quot;"
          >
            <template slot-scope="scope">
              <div v-if="item.label == &quot;操作工&quot;" class="flex_row flex_x_center">
                <pinyin-select
                  :selectList="workCopyOptions"
                  labelName="employeeName"
                  lableId="employeeNo"
                  :value="scope.row.employeeNo"
                  :selectChange.sync="scope.row.employeeNo"
                ></pinyin-select>
                <!-- <el-select v-model="scope.row.employeeNo" placeholder="请选择" class="input1">
                  <div class="search-input">
                    <el-input placeholder="请输入内容" size="mini" prefix-icon="el-icon-search" v-model="dropDownValue"
                      @input="dropDownSearch" clearable></el-input>
                  </div>
                  <div slot="empty" class="search-input">
                    <el-input placeholder="请输入内容" size="mini" prefix-icon="el-icon-search" v-model="dropDownValue"
                      @input="dropDownSearch" clearable></el-input>
                    <p>无搜索内容</p>
                  </div>
                  <el-option v-for="(item,key) in workCopyOptions" :key="key" :label="item.employeeName"
                    :value="item.employeeNo" />
                </el-select>-->
              </div>

              <!-- <template v-if="item.label == &quot;操作工&quot;">
                <el-select v-model="scope.row.employeeNo" placeholder="请选择" class="input1">
                  <el-option v-for="item in workOptions" :key="item.id" :label="item.employeeName"
                    :value="item.employeeNo" />
                </el-select>
              </template>-->
              <template v-if="item.label == &quot;占比&quot;">
                <el-input v-model="scope.row.percentage" class="input1"/>
              </template>
              <div v-else-if="item.label == &quot;操作&quot;" class="flex_row flex_x_center">
                <div class="cur_point c_02" @click="operHandle(2,scope.$index)">删除</div>
              </div>
              <template v-else>{{ scope.row[item.value] }}</template>
            </template>
          </el-table-column>
        </el-table>
        <div class="w_100 flex_row mb_20">
          <el-button type="primary" icon="el-icon-plus" @click="operHandle(4)">增加一行</el-button>
        </div>
        <div class="w_100 flex_row flex_x_center">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" plain class="ml_20" @click="confirm">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  // import MultipleImage from "@/components/Upload/MultipleImage.vue"
  import {get_all_workers} from '@/api/common'
  import {
    work_detail,
    update_order_work,
    get_outer_procedure
  } from '@/api/order'
  import pinyinSelect from '@/components/pinyinSelect.vue'
  import {get_item_procedure} from '@/api/product'

  export default {
    components: {
      pinyinSelect
    },
    data() {
      return {
        selectItem: {},
        tableList: [
          {
            label: '工序名称',
            value: 'procedureName'
          },
          {
            label: '单价',
            value: 'hoursWorkName'
          },
          {
            label: '工序车间名称',
            value: 'workShopName'
          },
          {
            label: '加工数量',
            value: 'canOuterCount'
          },
          {
            label: '设备编码',
            value: 'procedureCode'
          },
          {
            label: '设备名称',
            value: 'procedureName'
          },
          {
            label: '工序分配',
            value: 'procedureWorkersName'
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
          page_size: 10
        },
        // 查询参数
        paramForm: {
          name: '',
          code: '',
          status: ''
        },
        title: '',
        dialogVisible: false, // 新增编辑弹窗
        info: [],
        rules: {
          name: [
            {
              required: true,
              message: '',
              trigger: ['blur', 'change']
            }
          ],
          img: [
            {
              required: true,
              message: '',
              trigger: ['blur', 'change']
            }
          ]
        },
        tableList1: [
          {
            label: '操作工',
            value: 'id'
          },
          {
            label: '占比',
            value: 'name'
          },
          {
            label: '操作',
            value: ''
          }
        ],
        workOptions: [],
        workCopyOptions: [],
        detail: {},
        procedure: {
          procedureList: []
        },
        id: '',
        bomNo: '',
        orderNo: '',
        flag: true,
        type: false,
        selectBom: {},
        orderInfo: {},
        dropDownValue: ''
      }
    },
    async created() {
      if (this.$route.query.orderInfo)
        this.orderInfo = JSON.parse(this.$route.query.orderInfo)
      if (this.$route.query.id) this.id = this.$route.query.id
      if (this.$route.query.bomNo) this.bomNo = this.$route.query.bomNo
      if (this.$route.query.orderNo) this.orderNo = this.$route.query.orderNo
      if (this.$route.query.type)
        this.type = this.$route.query.type == 2 ? true : false
      this.getDetail()
    },
    methods: {
      dropDownSearch() {
        var _this = this
        // _this.valueMeta = [];
        _this.workCopyOptions = _this.workOptions.filter(_this.filterSearch)
      },
      filterSearch(item) {
        return item.employeeName.includes(this.dropDownValue)
      },
      clearDrop($event) {
        //此处的clearDrop用于解决搜索内容不存在时，所有内容无法显示的bug
        if ($event) {
          this.dropDownValue = ''
          this.workCopyOptions = this.workOptions
        }
      },
      async getItemProcedureN(data) {
        console.log(this.selectBom)
        const res = await get_outer_procedure({
          params: {
            // bomNo: this.selectBom.bomNo,
            id: this.id,
            type: '01',
            itemNo: this.selectBom.itemNo
          }
        })
        if (res.data) {
          let procedureWorkersName = ''
          res.data.procedureList.map(item => {
            procedureWorkersName = ''
            if (item.procedureWorkers && item.procedureWorkers.length > 0) {
              item.procedureWorkers.map(value => {
                procedureWorkersName +=
                  value.employeeName + '(' + value.percentage + '%),'
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
      async get_all_workers() {
        // 获取员工信息
        const res = await get_all_workers()
        if (res.data) {
          this.workOptions = res.data
          this.workCopyOptions = res.data
        }
      },
      async getDetail() {
        // 获取详情
        if (this.id) {
          const res = await work_detail({
            params: {
              bomNo: this.bomNo,
              id: this.id
            }
          })
          if (res.data) {
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
      initWorks(item) {
        this.info = item.procedureWorkers
      },
      async operHandle(type, item) {
        console.log(item)

        switch (type) {
          case 1: // 工序分配
            this.get_all_workers()
            this.info = []
            this.initWorks(item)
            this.selectItem = item
            console.log(this.selectItem)
            this.dialogVisible = true
            break
          case 2: // 删除
            console.log(item)
            if (this.info.length > 1) {
              this.info.splice(item, 1)
            } else {
              this.$message({
                message: '不能删除',
                type: 'error'
              })
            }
            break
          case 3: // 返回
            this.$router.push({
              path: '/orderManagement'
            })
            break
          case 4: // 新增一行工序分配
            if (!item || !item.procedureWorkers) {
              if (!item) {
                item = {}
                item['procedureWorkers'] = []
              } else {
                item['procedureWorkers'] = []
              }
            }
            if (!this.info) {
              this.info = []
            }
            this.info.push({
              employeeNo: '',
              percentage: ''
            })
            break
          default:
        }
      },
      menuSelect(index, path) {
        console.log(index, path)
      },
      handleNodeClick(data) {
        this.selectBom = data
        console.log(data, 'data')
        this.getItemProcedureN(data)
      },
      closeDia() {
        this.info = []
      },
      async updateOrderWork(info, isDefault) {
        console.log(this.selectBom)
        console.log(this.selectItem)
        // return

        let param = {
          params: {
            itemNo: this.selectBom.itemNo,
            procedureCode: this.selectItem.procedureCode,
            orderDetailId: this.id,
            orderNo: this.orderNo,
            list: info,
            saveDefault: isDefault
          }
        }
        let res = await update_order_work(param)
        if (res.tx_code == '00') {
          this.dialogVisible = false
          this.getItemProcedureN(this.selectBom)
        }
      },
      async confirm() {
        // console.log(this.selectProductTemp)
        try {
          if (this.flag) {
            let that = this
            this.flag = false
            console.log(this.info)
            let info = JSON.parse(JSON.stringify(this.info))

            let emplist = []
            info.map(item => {
              this.workOptions.map(value => {
                if (item.employeeNo == value.employeeNo) {
                  item['employeeName'] = value.employeeName
                }
                if (item.employeeNo == value.employeeName) {
                  item['employeeNo'] = value.employeeNo
                }
              })
              let items = {
                employeeName: item.employeeName,
                employeeNo: item.employeeNo,
                percentage: item.percentage
              }
              emplist.push(items)
            })
            info = emplist

            await this.$confirm(
              '是否按照此修改后的名单作为新的默认名单？',
              '分配确认',
              {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
              }
            )
              .then(r => {
                console.log(r)
                if (r == 'confirm') {
                  that.updateOrderWork(info, true)
                } else {
                  that.updateOrderWork(info, false)
                }
              })
              .catch(e => {
                if (e == 'cancel') {
                  that.updateOrderWork(info, false)
                }
              })
          }
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .input1 {
    width: 160px;
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
