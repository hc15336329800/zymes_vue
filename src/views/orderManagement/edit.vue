<template>
  <div class="w_100 pt_30 plr_30 ptb_30">

    <el-form ref="form" :inline="true" :model="form" :rules="rules" label-width="100px" label-position="left">
      <el-form-item label="制单人" prop="createUser">
        <el-input v-model="form.createUser" class="input" :disabled="id"/>
      </el-form-item>
      <el-form-item label="提单人" prop="applyUser">
        <el-input v-model="form.applyUser" class="input" :disabled="id"/>
      </el-form-item>
      <el-form-item label="接收人" prop="receiveUser">
        <el-input v-model="form.receiveUser" class="input" :disabled="id"/>
      </el-form-item>
      <el-form-item label="承诺交期" prop="deliverTime">
        <el-date-picker v-model="form.deliverTime" class="input" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" :picker-options="pickerOptions"/>
      </el-form-item>
      <el-form-item label="订单名称" prop="orderDesc">
        <el-input v-model="form.orderDesc" class="input" :disabled="id"/>
      </el-form-item>
      <el-form-item label="订单类型" prop="orderType">
        <el-select v-model="form.orderType" placeholder="请选择" class="input" :disabled="id">
          <el-option :key="item.id" v-for="(item,k) in getSalesOption" :label="item.value" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div>
      <el-table id="isTable" v-loading="listLoading" :data="form.orderDetails" element-loading-text="Loading" fit border
                highlight-current-row class="table mb_30">
        <el-table-column align="center" label="BOM编码">
          <template slot-scope="scope">
            <el-input v-model="scope.row.bomNo" class="input1" :disabled="id"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="数量">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.count" class="input1"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <div class="w_100 flex_row flex_x_center">
              <div class="cur_point c_02" @click="operHandle(1,scope)">查看详情</div>
              <div class="cur_point c_02 ml_20" @click="operHandle(2,scope.$index)" v-if="!id">删除</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="w_100 flex_row mb_40" v-if="!id">
        <el-button type="primary" icon="el-icon-plus" @click="operHandle(3)">增加一行</el-button>
      </div>
    </div>
    <div class="w_100 flex_row flex_x_center">
      <el-button @click="operHandle(4)">取消</el-button>
      <el-button type="primary" plain class="ml_20" @click="confirm">确定</el-button>
    </div>
  </div>
</template>
<script>
  // import MultipleImage from "@/components/Upload/MultipleImage.vue"
  import {get_sales_value, get_sales_option} from '@/api/sales'
  import {
    get_all_workers
  } from '@/api/common'
  import {
    MessageBox,
    Message
  } from 'element-ui'
  import {
    orderAdd,
    orderUpdate,
    getDetail
  } from '@/api/order'

  export default {
    components: {
      // MultipleImage
    },
    data() {
      return {
        getSalesOption: null,
        // 表单
        form: {
          receiveUser: '',
          applyUser: '',
          createUser: '',
          orderType: '',
          orderDesc: '',
          deliverTime: '',
          orderDetails: []
        },
        pickerOptions: {
          disabledDate(v) {
            return v.getTime() < new Date().getTime() - 86400000;
          }
        },
        listLoading: false,
        rules: {
          receiveUser: [{
            required: true,
            message: '请输入',
            trigger: ['blur', 'change']
          }],
          applyUser: [{
            required: true,
            message: '请输入',
            trigger: ['blur', 'change']
          }],
          createUser: [{
            required: true,
            message: '请输入',
            trigger: ['blur', 'change']
          }],
          orderType: [{
            required: true,
            message: '请选择',
            trigger: ['blur', 'change']
          }],
          orderDesc: [{
            required: true,
            message: '请输入',
            trigger: ['blur', 'change']
          }],
          deliverTime: [{
            required: true,
            message: '请选择',
            trigger: ['blur', 'change']
          }]
        },
        id: null,
        flag: true,
        info: {}
      }
    },
    async created() {
      this.getSalesOption = get_sales_option()
      if (this.$route.query.info) {
        this.info = JSON.parse(this.$route.query.info)
        this.id = this.info.id
        this.form.receiveUser = this.info.receiveUser
        this.form.applyUser = this.info.applyUser
        this.form.orderType = this.info.orderType
        this.form.orderDesc = this.info.orderDesc
        this.form.createUser = this.info.createUser
        this.form.deliverTime = this.info.deliverTime
        this.form.orderDetails = [{
          count: this.info.itemCount,
          bomNo: this.info.bomNo
        }]
      }
      // this.getDetail()
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
          const res = await getDetail()
          if (res.data) {
            let data = res.data
            this.form = res.data
          }
        }
      },
      async operHandle(type, item) {
        switch (type) {
          case 1: // 查看详情
            console.log(item.row.bomNo)
            if (!item || !item.row.bomNo || item.row.bomNo == undefined) {
              this.$message({
                message: '请输入Bom',
                type: 'error'
              })
            } else {
              this.$router.push({
                name: 'orderBom',
                query: {
                  id: item.row.bomNo,
                  info: JSON.stringify(this.info)
                }
              })
            }
            break;
          case 2: // 删除
            if (this.form.orderDetails.length > 1) {
              this.form.orderDetails.splice(item, 1)
            } else {
              this.$message({
                message: '不能删除',
                type: 'error'
              })
            }
            break
          case 3: // 新增一行
            this.form.orderDetails.push({
              employeeNo: '',
              percentage: ''
            })
            break
          case 4: // 取消
            this.$router.push({
              name: 'orderList'
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
      async confirm() {
        // console.log(this.selectProductTemp)
        try {
          if (this.flag) {
            this.flag = false
            const validate = await this.$refs.form.validate()
            if (validate) {
              console.log(this.form)
              const form = JSON.parse(JSON.stringify(this.form))
              console.log(form)
              let detailList = []
              let detail = {}

              if (form.orderDetails.length == 0) {
                Message({
                  message: '请添加BOM信息',
                  type: 'error',
                  duration: 5 * 1000
                })
                return
              }
              form.orderDetails.map(r => {
                detail = {
                  bomNo: r.bomNo,
                  count: r.count
                }
                detailList.push(detail)
              })
              form.orderDetails = detailList
              let res
              if (this.id) {
                res = await orderUpdate({
                  params: {
                    id: this.id,
                    itemCount: this.form.orderDetails[0].count,
                    deliverTime: this.form.deliverTime
                  }
                })
              } else {
                res = await orderAdd({
                  params: form
                })
              }
              this.$message({
                message: "操作成功",
                type: 'success'
              })
              this.$router.push({
                name: 'orderList'
              })
            }
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
  .input {
    width: 380px;
  }

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
