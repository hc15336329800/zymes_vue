<template>
  <div class="w_100 pt_30 plr_30 ptb_30">
    <el-row>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          BOM编码
        </div>
        <div class="ml_10">
          {{ detail.bomNo }}
        </div>
      </el-col>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          BOM名称
        </div>
        <div class="ml_10">
          {{ detail.itemName }}
        </div>
      </el-col>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          计量单位
        </div>
        <div class="ml_10">
          {{ detail.itemMeasure }}
        </div>
      </el-col>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          库存量
        </div>
        <div class="ml_10">
          {{ detail.itemCount }}
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          产品编码
        </div>
        <div class="ml_10">
          {{ detail.itemNo }}
        </div>
      </el-col>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          规格型号
        </div>
        <div class="ml_10">
          {{ detail.itemModel }}
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="12" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          库位
        </div>
        <div class="ml_10">
          {{ detail.location }}
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :span="6">
        <el-row class="c_b fw_bold fs_24 ptb_20">
          BOM组成
        </el-row>
        <el-tree :data="detail.childUseList" :props="{children: 'childUseList',label: 'itemName',value: 'itemNo'}"
                 @node-click="handleNodeClick"/>
      </el-col>
      <el-col :span="18">
        <el-row class="c_b fw_bold fs_24 ptb_20">
          工序配置
        </el-row>
        <el-row>
          <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
            <div class="label fw_bold fs_24">
              物料编码
            </div>
            <div class="ml_10">
              {{ procedure.itemNo }}
            </div>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
            <div class="label fw_bold fs_24">
              产品名称
            </div>
            <div class="ml_10">
              {{ procedure.itemName }}
            </div>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
            <div class="label fw_bold fs_24">
              BOM编码
            </div>
            <div class="ml_10">
              {{ procedure.bomNo }}
            </div>
          </el-col>
          <!-- <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
            <div class="label fw_bold fs_24">
              辅助用量
            </div>
            <div class="ml_10">
              {{ procedure.itemMeasureAssist }}
            </div>
          </el-col> -->
        </el-row>

        <el-table :data="procedure.procedureList" element-loading-text="Loading" fit border highlight-current-row
                  class="table mb_30">
          <el-table-column v-for="item in tableList" :key="item.label" align="center" :label="item.label"
                           :width="item.label != &quot;工序分配&quot;? 120 : item.label == &quot;操作&quot; ? 100 : &quot;&quot;">
            <template slot-scope="scope">
              <div v-if="item.label == &quot;操作&quot;" class="flex_row flex_x_center">
                <div class="cur_point c_02" @click="operHandle(1,scope.row)">工序分配</div>
              </div>
              <template v-else>
                {{ scope.row[item.value] }}
              </template>
            </template>
          </el-table-column>
        </el-table>

        <div class="w_100 flex_row flex_x_center">
          <el-button type="primary" plain class="ml_20" @click="operHandle(3)">返回</el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 新增、编辑弹窗 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="600px" top="10vh" @close="closeDia">
      <div>
        <el-table id="isTable" v-loading="listLoading" :data="info" element-loading-text="Loading" fit border
                  highlight-current-row class="table mb_30">
          <el-table-column v-for="item in tableList1" :key="item.label" align="center" :label="item.label"
                           :width="item.label == &quot;操作&quot; ? 100 : &quot;&quot;">
            <template slot-scope="scope">
              <template v-if="item.label == &quot;操作工&quot;">
                <el-select v-model="scope.row.employeeNo" placeholder="请选择" class="input1">
                  <el-option v-for="item in workOptions" :key="item.id" :label="item.employeeName"
                             :value="item.employeeNo"/>
                </el-select>
              </template>
              <template v-if="item.label == &quot;占比&quot;">
                <el-input v-model="scope.row.percentage" class="input1" type="number" max="100" maxlength="3"/>
              </template>
              <div v-else-if="item.label == &quot;操作&quot;" class="flex_row flex_x_center">
                <div class="cur_point c_02" @click="operHandle(2,scope.$index)">删除</div>
              </div>
              <template v-else>
                {{ scope.row[item.value] }}
              </template>
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
  import {
    get_all_workers
  } from '@/api/common'
  import {
    get_bom_detail,
    get_item_procedure,
    update_order_work
  } from '@/api/product'

  export default {
    components: {
      // MultipleImage
    },
    data() {
      return {
        tableList: [{
          label: '序号',
          value: 'seqNo'
        },
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
          name: [{
            required: true,
            message: '',
            trigger: ['blur', 'change']
          }],
          img: [{
            required: true,
            message: '',
            trigger: ['blur', 'change']
          }]
        },
        tableList1: [{
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
        detail: {},
        procedure: {
          procedureList: []
        },
        id: '',
        bomNo: '',
        flag: true,
        selectItem: {}
      }
    },
    async created() {
      if (this.$route.query.id) this.id = this.$route.query.bomNo
      if (this.$route.query.id) this.bomNo = this.$route.query.id
      this.getDetail()
    },
    methods: {
      async get_all_workers() { // 获取员工信息
        const res = await get_all_workers()
        if (res.data) {
          this.workOptions = res.data
        }
      },
      async getDetail() { // 获取详情
        if (this.id) {
          const res = await get_bom_detail({
            params: {
              bomNo: this.id
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
              procedureList: res.data.procedureList,
            }

            this.detail = child
            this.getItemProcedure(res.data.itemNo)
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
      async getItemProcedure(itemNo) {
        const res = await get_item_procedure({
          params: {
            itemNo: itemNo
          }
        })
        if (res.data) {
          let procedureWorkersName = ''
          if (res.data.procedureList) {
            res.data.procedureList.map(item => {
              procedureWorkersName = ''
              if (item.procedureWorkers) {
                item.procedureWorkers.map(value => {
                  procedureWorkersName += value.employeeName + '(' + value.percentage + '%),'
                })

                item['procedureWorkersName'] = procedureWorkersName.slice(0, procedureWorkersName.length - 1)
              }
              item['hoursWorkName'] = item.hoursWork + '（元）'
            })
          }
          this.procedure = res.data
        }
      },
      handleNodeClick(data) {
        //获取工序
        this.getItemProcedure(data.itemNo)
        // this.procedure = { ...data }
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
      //初始化工序分配
      initWorks(item) {
        this.info = item.procedureWorkers
      },
      async operHandle(type, item) {
        switch (type) {
          case 1: // 工序分配
            // this.info = JSON.parse(JSON.stringify(item))
            this.get_all_workers()
            this.info = []
            this.initWorks(item)
            this.selectItem = item
            this.dialogVisible = true
            break
          case 2: // 删除
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
              name: 'confirm',
              query: {
                id: this.bomNo,
              }
            })
            break
          case 4: // 新增一行工序分配
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

      closeDia() {
        this.info = []
      },
      async updateOrderWork(info, isDefault) {
        let param = {
          "params": {
            "itemNo": this.selectItem.itemNo,
            "procedureCode": this.selectItem.procedureCode,
            "orderDetailId": this.selectItem.orderDetailId,
            "orderNo": this.selectItem.orderNo,
            "list": info,
            "saveDefault": isDefault
          }
        }
        let res = await update_order_work(param)
        if (res.tx_code == '00') {
          this.dialogVisible = false
          this.getItemProcedure(this.selectItem.itemNo)
        }
      },
      async confirm() {
        try {
          if (this.flag) {
            this.flag = false
            let info = JSON.parse(JSON.stringify(this.info))

            let emplist = []
            info.map(item => {

              this.workOptions.map(value => {
                if (item.employeeNo == value.employeeNo) {
                  item['employeeName'] = value.employeeName
                }
              })
              let items = {
                employeeName: item.employeeName,
                employeeNo: item.employeeNo,
                percentage: item.percentage,
              }
              emplist.push(items)
            })
            info = emplist
            let that = this
            await this.$confirm('是否按照此修改后的名单作为新的默认名单？', '分配确认', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(r => {
              if (r == 'confirm') {
                that.updateOrderWork(info, true)
              }

            }).catch(e => {
              console.log(e)
              if (e == 'cancel') {
                that.updateOrderWork(info, false)
              }
            })
          }
        } finally {
          setTimeout(() => this.flag = true, 1000)
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
