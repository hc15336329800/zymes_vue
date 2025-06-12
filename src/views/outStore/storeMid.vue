<template>
  <div class="w_100 pt_30 plr_30 ptb_30">
    <el-row>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          订单号
        </div>
        <div class="ml_10">
          {{ midInfo.orderNo }}
        </div>
      </el-col>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          图纸号
        </div>
        <div class="ml_10">
          {{ midInfo.bomNo }}
        </div>
      </el-col>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          产品编码
        </div>
        <div class="ml_10">
          {{ midInfo.itemNo }}
        </div>
      </el-col>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          产品名称
        </div>
        <div class="ml_10">
          {{ midInfo.itemName }}
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          部门
        </div>
        <div class="ml_10">
          {{ midInfo.deptName }}
        </div>
      </el-col>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          业务类型
        </div>
        <div class="ml_10">
          {{ midInfo.bizTypeName }}
        </div>
      </el-col>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          出库状态
        </div>
        <div class="ml_10">
          {{ midInfo.outStatusName }}
        </div>
      </el-col>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          同步状态
        </div>
        <div class="ml_10">
          {{ midInfo.syncStatusName }}
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          领料时间
        </div>
        <div class="ml_10">
          {{ midInfo.outTime }}
        </div>
      </el-col>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          领料人
        </div>
        <div class="ml_10">
          {{ midInfo.outUser }}
        </div>
      </el-col>
    </el-row>

    <el-row>

      <el-col>

        <el-table :data="list" element-loading-text="Loading" fit border highlight-current-row
                  class="table mb_30">
          <el-table-column v-for="item in tableList" :key="item.label" align="center" :label="item.label"
                           :width="item.label != &quot;工序分配&quot;? 120 : item.label == &quot;操作&quot; ? 100 : &quot;&quot;">
            <template slot-scope="scope">
              <template>
                {{ scope.row[item.value] }}
              </template>
            </template>
          </el-table-column>
          <!--          <el-table-column label="操作" width="200" align="center" fixed="right">-->
          <!--            <template slot-scope="scope">-->
          <!--              <div class="flex_row flex_x_between">-->
          <!--                <div class="cur_point c_02" @click="operHandle(1,scope.row)">修改中间件</div>-->
          <!--                <div class="cur_point c_02" @click="operHandle(2,scope.row)">删除</div>-->
          <!--              </div>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
        </el-table>
        <el-pagination background layout="prev, pager,next,  sizes, slot" :total="pages.total"
                       :current-page="pages.page_num"
                       :page-size="pages.page_size" @current-change="handleCurrentChange"
                       @size-change="handleSizeChange">
          <span class="product-total">共{{ pages.total }}条</span>
        </el-pagination>
        <div class="w_100 flex_row flex_x_center">
          <el-button type="primary" plain class="ml_20" @click="goBack()">返回</el-button>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="修改中间件" :visible.sync="dialogVisible1" width="600px" top="10vh" @close="closeDia">
      <div>
        <el-form ref="form" :model="form" label-width="120px">

          <el-form-item label="数量" prop="count	">
            <el-input v-model="form.count" class="w_100"/>
          </el-form-item>
        </el-form>
        <div class="w_100 flex_row flex_x_center">
          <el-button @click="closeDialog('dialogVisible1')">取消</el-button>
          <el-button type="primary" plain class="ml_20" @click="confirm(1)">确定</el-button>
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
    store_mid_list,
  } from '@/api/outOrder'

  export default {
    components: {},
    data() {
      return {
        tableList: [
          {
            label: '订单号',
            value: 'orderNo'
          },
          {
            label: '中间件产品编码',
            value: 'itemNo'
          },
          {
            label: '产品名称',
            value: 'itemName'
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
            label: '工序序号',
            value: 'procedureSeqNo'
          },
          {
            label: '图纸号',
            value: 'bomNo'
          },
          {
            label: '库存数量',
            value: 'itemCount'
          },
          {
            label: '单位',
            value: 'itemMeasure'
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
          itemNo: '',
          storeId: '',
        },
        title: '',
        dialogVisible: false, // 新增编辑弹窗
        info: [],
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
        midInfo: {},
        bomNo: '',
        flag: true,
        selectItem: {},
        form: {},
        dialogVisible1: false,
      }
    },
    async created() {
      if (this.$route.query.info) this.midInfo = JSON.parse(this.$route.query.info)
      this.paramForm.storeId = this.midInfo.id
      this.paramForm.itemNo = this.midInfo.itemNo
      this.getList()
    },
    methods: {
      closeDialog(name) {
        this[name] = false;
      },
      async get_all_workers() { // 获取员工信息
        const res = await get_all_workers()
        if (res.data) {
          this.workOptions = res.data
        }
      },
      async getList(str) {
        this.listLoading = true
        try {
          if (str == 'clear') {
            this.pages = {
              total: 0,
              page_num: 1,
              page_size: 10
            }
          }
          const res = await store_mid_list({
            page: {
              page_num: this.pages.page_num,
              page_size: this.pages.page_size
            },
            params: this.paramForm
          })
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
      handleClassifyListChange(v) {
        console.log(v, 'v')
      },
      //初始化工序分配
      initWorks(item) {
        this.info = item.procedureWorkers
      },
      goBack() {
        this.$router.back();
      },
      menuSelect(index, path) {
        console.log(index, path)
      },

      closeDia() {
        this.info = []
      },

      async confirm() {
        try {
          if (this.flag) {
            this.flag = false
            let info = JSON.parse(JSON.stringify(this.form))
            console.log(this.form)
            // let res = await mid_update({
            //   params: {
            //     id: info.id,
            //     count: info.count
            //   }
            // })
            // if (res.tx_code == '00') {
            //   this.dialogVisible1 = false
            //   this.getList()
            // }
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
