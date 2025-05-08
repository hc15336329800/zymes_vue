<template>
  <div class="w_100 pt_30 plr_30 ptb_30">
    <el-row>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">订单号</div>
        <div class="ml_10">{{ midInfo.orderNo }}</div>
      </el-col>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">图纸号</div>
        <div class="ml_10">{{ midInfo.bomNo }}</div>
      </el-col>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">产品编码</div>
        <div class="ml_10">{{ midInfo.itemNo }}</div>
      </el-col>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">产品名称</div>
        <div class="ml_10">{{ midInfo.itemName }}</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">部门</div>
        <div class="ml_10">{{ midInfo.deptName }}</div>
      </el-col>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">业务类型</div>
        <div class="ml_10">{{ midInfo.bizTypeName }}</div>
      </el-col>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">出库状态</div>
        <div class="ml_10">{{ midInfo.outStatusName }}</div>
      </el-col>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">同步状态</div>
        <div class="ml_10">{{ midInfo.syncStatusName }}</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">领料时间</div>
        <div class="ml_10">{{ midInfo.outTime }}</div>
      </el-col>
      <el-col :xs="6" :sm="6" :lg="6" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">领料人</div>
        <div class="ml_10">{{ midInfo.outUser }}</div>
      </el-col>
    </el-row>

    <el-row>
      <el-col>
        <el-button type="primary" plain class="mb_20" @click="operHandle(4)">新增物料出库</el-button>
        <el-table
          :data="list"
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
          >
            <template slot-scope="scope">
              <template>
                <div v-if="item.value=='enoughCount'">{{ scope.row[item.value]?'是':'否' }}</div>
                <div
                  v-else-if="item.value=='reviewStatus'"
                >{{
                  scope.row[item.value]=='00'?'待审核':scope.row[item.value]=='01'?'审核通过':scope.row[item.value]=='02'?'审核拒绝':'不需要审核'
                  }}
                </div>
                <div v-else>{{ scope.row[item.value] }}</div>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right" width="200">
            <template slot-scope="scope">
              <div class="flex_row flex_x_between">
                <div
                  class="cur_point c_02"
                  style="margin-right:10px;"
                  @click="operHandle(1,scope.row)"
                >修改
                </div>
                <div
                  class="cur_point c_02"
                  style="margin-right:10px;"
                  v-if="scope.row.reviewStatus=='99' || scope.row.reviewStatus=='00'"
                  @click="operHandle(5,scope.row)"
                >物料替换
                </div>
                <div class="cur_point c_02" @click="operHandle(2,scope.row)">删除</div>
              </div>
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
        <div class="w_100 flex_row flex_x_center">
          <el-button type="primary" plain class="ml_20" @click="operHandle(3)">返回</el-button>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      title="物料管理"
      :visible.sync="dialogVisible1"
      width="600px"
      top="10vh"
      @close="closeDia"
    >
      <div>
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="产品编码" prop="itemNo">
            <el-input v-model="form.itemNo" class="w_100" @change="showDetail()"/>
          </el-form-item>
          <el-form-item label="数量" prop="itemCount">
            <el-input v-model="form.itemCount" class="w_100"/>
          </el-form-item>
          <el-form-item label="辅助量" prop="itemCountAssist">
            <el-input v-model="form.itemCountAssist" class="w_100"/>
          </el-form-item>
          <el-form-item label="辅助用料单位" prop="itemMeasure">
            <el-input v-model="form.itemMeasure" class="w_100"/>
          </el-form-item>
        </el-form>
        <div class="w_100 flex_row flex_x_center">
          <el-button @click="closeDialog('dialogVisible1')">取消</el-button>
          <el-button type="primary" plain class="ml_20" @click="confirm(1)">确定</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="物料替换"
      :visible.sync="dialogVisible2"
      width="600px"
      top="10vh"
      @close="closeDia2"
    >
      <div>
        <el-form ref="form2" :model="form2" label-width="120px">
          <el-form-item
            label="替换产品编码"
            prop="itemNo"
            :rules="[{ required: true, message: '请输入替换产品编码', trigger: 'blur' }]"
          >
            <el-select v-model="form2.itemNo" filterable placeholder="请选择">
              <el-option
                v-for="(item,key) in itemCopyOptions"
                :key="key"
                :label="item.itemInfo"
                :value="item.itemNo"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="物料数量"
            prop="itemCount"
            :rules="[{ required: true, message: '请输入物料数量', trigger: 'blur' }]"
          >
            <el-input v-model="form2.itemCount" class/>
          </el-form-item>
          <el-form-item label="辅助数量" prop="itemCountAssist">
            <el-input v-model="form2.itemCountAssist" class/>
          </el-form-item>
        </el-form>
        <div class="w_100 flex_row flex_x_center">
          <el-button @click="closeDialog('dialogVisible2')">取消</el-button>
          <el-button type="primary" plain class="ml_20" @click="confirm2(1)">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  // import MultipleImage from "@/components/Upload/MultipleImage.vue"
  import {get_all_workers} from '@/api/common'
  import {
    dtl_page_list,
    dtl_item_info,
    dtl_delete,
    dtl_add,
    dtl_update,
    item_replace
  } from '@/api/outOrder'
  import {get_item_list} from '@/api/order'

  export default {
    components: {},
    data() {
      return {
        dialogVisible2: false,
        itemCopyOptions: null,
        tableList: [
          {
            label: '物料编码',
            value: 'itemNo'
          },
          {
            label: '物料名称',
            value: 'itemName'
          },
          {
            label: '计划用料量',
            value: 'planItemCount'
          },
          {
            label: '实际用料量',
            value: 'realItemCount'
          },
          {
            label: '库存量',
            value: 'oriItemCount'
          },
          {
            label: '库位',
            value: 'location'
          },
          {
            label: '库存是否充足',
            value: 'enoughCount'
          },
          {
            label: '物料单位',
            value: 'itemMeasure'
          },
          {
            label: '规格型号',
            value: 'itemModel'
          },
          {
            label: '辅助量',
            value: 'itemCountAssist'
          },
          {
            label: '辅助单位',
            value: 'itemMeasureAssist'
          },
          {
            label: '审核状态',
            value: 'reviewStatus',
            width: 150
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
        form2: {}, //物料替换
        // 查询参数
        paramForm: {
          itemNo: '',
          storeId: ''
        },
        title: '',
        dialogVisible: false, // 新增编辑弹窗
        info: [],
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
        detail: {},
        procedure: {
          procedureList: []
        },
        midInfo: {},
        bomNo: '',
        flag: true,
        selectItem: {},
        form: {
          itemCountAssist: '',
          itemMeasure: '',
          itemNo: '',
          itemCount: ''
        },
        dialogVisible1: false
      }
    },
    async created() {
      this.get_item_list()
      if (this.$route.query.info)
        this.midInfo = JSON.parse(this.$route.query.info)
      this.paramForm.storeId = this.midInfo.id
      this.paramForm.itemNo = this.midInfo.itemNo
      this.getList()
    },
    methods: {
      async get_item_list() {
        const res = await get_item_list()
        if (res.data) {
          this.itemCopyOptions = res.data
        }
      },
      closeDia2() {
        this.$refs.form2.clearValidate()
        this.form2 = {}
      },
      async confirm2() {
        //物料替换
        const validate = await this.$refs.form2.validate()
        if (!validate) {
          return
        }
        let res = await item_replace({
          params: this.form2
        })
        this.dialogVisible2 = false
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        setTimeout(() => {
          this.getList()
        }, 1000)
      },
      async showDetail() {
        let res = await dtl_item_info({
          params: {
            itemNo: this.form.itemNo
          }
        })
        this.form.itemCountAssist = res.data.itemCountAssist
        this.form.itemMeasure = res.data.itemMeasure
      },
      closeDialog(name) {
        this[name] = false
      },
      async get_all_workers() {
        // 获取员工信息
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
          const res = await dtl_page_list({
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
      async operHandle(type, item) {
        switch (type) {
          case 1: // 工序分配
            this.form = JSON.parse(JSON.stringify(item))
            this.form['itemCount'] = this.form.planItemCount
            this.dialogVisible1 = true
            break
          case 2: // 删除
            await this.$confirm('确认删除？', '提示', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            })
            let res = await dtl_delete({
              params: item.id
            })
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getList()
            break
          case 3: // 返回
            this.$router.push({
              name: 'outList'
            })
            break
          case 4: // 新增一行工序分配
            this.dialogVisible1 = true
            this.form = {
              itemCountAssist: '',
              itemMeasure: '',
              itemNo: '',
              itemCount: ''
            }
            break
          case 5: // 物料替换
            this.dialogVisible2 = true
            this.form2.id = item.id
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

      async confirm() {
        try {
          if (this.flag) {
            this.flag = false
            let info = JSON.parse(JSON.stringify(this.form))
            console.log(this.form)
            if (info.id) {
              let res = await dtl_update({
                params: {
                  id: this.midInfo.id,
                  itemNo: info.itemNo,
                  itemCount: info.itemCount,
                  itemCountAssist: info.itemCountAssist
                }
              })
              if (res.tx_code == '00') {
                this.dialogVisible1 = false
                this.getList()
              }
            } else {
              let res = await dtl_add({
                params: {
                  storeId: this.midInfo.id,
                  itemNo: info.itemNo,
                  itemCount: info.itemCount,
                  itemCountAssist: info.itemCountAssist
                }
              })
              if (res.tx_code == '00') {
                this.dialogVisible1 = false
                this.getList()
              }
            }
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
    },
    beforeRouteLeave(to, from, next) {
      // 设置下一个路由的 meta
      to.meta.keepAlive = true // B 跳转到 A 时，让 A 缓存，即不刷新
      next()
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
