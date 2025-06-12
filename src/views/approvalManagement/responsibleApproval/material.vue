<template>
  <div class="w_100 pt_30 plr_30 ptb_30">
    <!-- 筛选条件 -->
    <el-card class="box-card mb_30">
      <el-form :inline="true" :model="paramForm" label-width="85px" label-position="left">
        <el-form-item label="订单号">
          <el-input v-model="paramForm.orderNo"/>
        </el-form-item>
        <el-form-item label="图纸号">
          <!-- <el-input v-model="paramForm.bomNo"/> -->
          <el-select
            v-model="paramForm.bomNos"
            multiple
            placeholder="请选择"
            filterable
            remote
            :remote-method="remoteMethod2"
            class="input1"
            clearable
          >
            <el-option
              v-for="(item,id) in bomNoList"
              :key="id"
              :label="item.bomNo"
              :value="item.bomNo"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请人">
          <el-input v-model="paramForm.createdBy"/>
        </el-form-item>
        <el-form-item label="申请日期">
          <el-date-picker v-model="date" type="date" placeholder="选择日期" style="width: 187px;"></el-date-picker>
        </el-form-item>
        <el-form-item label="物料编码">
          <el-input v-model="paramForm.orgiItemNo"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class @click="operHandle(1)">查询</el-button>
          <el-button class="ml_20" @click="getList('clear')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-row class="flex_row pb_10 c_b fw_bold fs_24">
      <el-button type="primary" @click="operHandle2(1)">审核通过</el-button>
      <el-button type="primary" @click="operHandle2(2)">审核不通过</el-button>
    </el-row>
    <el-table
      id="isTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      border
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      highlight-current-row
      class="table mb_30"
    >
      <el-table-column align="center" type="selection" :selectable="selectable" width="55"></el-table-column>
      <el-table-column
        v-for="item in tableList"
        :key="item.label"
        align="center"
        :label="item.label"
        :width="item.width"
      >
        <template slot-scope="scope">
          <template v-if="item.label == '状态'">
            {{scope.row.reviewStatus =="00" ? "待审核": scope.row.reviewStatus =="01" ?
            "审核通过":scope.row.reviewStatus =="02" ?
            "审核不通过":scope.row.reviewStatus}}
            <i
              class="el-icon-warning-outline link-type"
              v-if="scope.row.reviewStatus=='02'"
              @click="showReason(scope.row.reviewDesc)"
            ></i>
          </template>
          <template v-else-if="item.label == '操作类型'">
            <div v-if="scope.row.reviewStatus =='00'" style="width:180px;">
              <div class="flex_row flex_center" style="width:180px">
                <div
                  class="cur_point c_02"
                  style="width:50%;"
                  @click="operHandle2(1,scope.row)"
                >审核通过
                </div>
                <div
                  class="cur_point c_02 ml_20"
                  style="width:50%;"
                  @click="operHandle2(2,scope.row)"
                >审核不通过
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            {{ scope.row[item.value] }}
            <!-- <i class="el-icon-warning-outline link-type" @click="showReason"></i> -->
          </template>
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
  // import MultipleImage from "@/components/Upload/MultipleImage.vue"
  // import { work_log } from '@/api/work'
  import {
    page_list_audit,
    item_replace_audit_pass,
    item_replace_audit_reject
  } from '@/api/approval'

  import {get_bom_list, get_bom_list_keyword} from '@/api/order'

  export default {
    components: {
      // MultipleImage
    },
    data() {
      return {
        bomNoList: [],
        selectList: [],
        date: [],
        tableList: [
          {
            label: '图纸号',
            value: 'bomNo'
          },
          {
            label: '订单号',
            value: 'orderNo'
          },
          {
            label: '物料编码',
            value: 'orgiItemNo'
          },
          {
            label: '物料名称',
            value: 'orgiItemName'
          },
          {
            label: '规格',
            value: 'itemModel',
            width: '100'
          },
          {
            label: '计量单位',
            value: 'itemMeasure'
          },
          {
            label: '所需数量',
            value: 'needItemCount'
          },
          {
            label: '申请替换为',
            value: 'repItemName'
          },
          {
            label: '状态',
            value: 'reviewStatus'
          },
          {
            label: '操作类型',
            value: '',
            width: '200'
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
          // procedureName: '',
          // orderNo: '',
          // bomNo: ''
        }
      }
    },
    async created() {
      // await this.get_BOM()
      await this.getList('clear')
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
      handleSelectionChange(val) {
        if (val.length == this.list.length) {
          //当前页数据全选
          val.forEach(item => {
            if (this.selectList.every(it => it != item.id)) {
              this.selectList.push(item.id)
            }
          })
        } else if (val.length > 0) {
          //当前页数据部分改动
          this.list.forEach(item => {
            let index = val.findIndex(it => it.id == item.id)
            if (index > -1) {
              if (this.selectList.every(i => i != item.id)) {
                this.selectList.push(item.id)
              }
            } else {
              let i = this.selectList.findIndex(i => i == item.id)
              if (i > -1) this.selectList.splice(i, 1)
            }
          })
        } else if (val.length == 0) {
          //当前页数据全删除
          this.list.forEach(item => {
            let index = this.selectList.findIndex(it => it == item.id)
            if (index > -1) this.selectList.splice(index, 1)
          })
        }
        console.log(this.selectList, 'this.selectList')
      },
      selectable: function (row, index) {
        if (row.reviewStatus == '00') {
          return true
        } else {
          return false
        }
      },
      async operHandle2(type, item) {
        if (item) {
          // this.page
          this.selectList = [item.id]
        }
        if (this.selectList.length == 0) {
          this.$message.error('请勾选要操作的数据')
          return
        }
        // const self = this;
        /** 清空校验 */
        try {
          switch (type) {
            case 1: // 确认审核通过
              await this.$confirm('确认审核通过？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
              })
              var res = await item_replace_audit_pass({
                params: {
                  idList: this.selectList,
                  reviewStatus: '01'
                }
              })
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              setTimeout(() => {
                this.getList()
              }, 2000)
              break
            case 2: // 下达
              await this.$prompt('请填写审核不通过的原因', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass: 'auditClass',
                inputType: 'textarea'
              })
                .then(({value}) => {
                  console.log(value)
                  if (!value || value.length == 0) {
                    this.$message.error('请填写审核不通过的原因！')
                    return
                  }
                  var res2 = item_replace_audit_reject({
                    params: {
                      reviewDesc: value,
                      idList: this.selectList,
                      reviewStatus: '02'
                    }
                  })
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  })
                  setTimeout(() => {
                    this.getList()
                  }, 2000)
                })
                .catch(() => {
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
      showReason(reason) {
        //查看审批拒绝原因
        this.$alert(reason, '审批拒绝原因', {
          confirmButtonText: '关闭',
          customClass: 'close-center',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${action}`
            })
          }
        })
      },
      showReason(reason) {
        //查看审批拒绝原因
        this.$alert(reason, '审批拒绝原因', {
          confirmButtonText: '关闭',
          customClass: 'close-center',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${action}`
            })
          }
        })
      },
      async getList(str) {
        this.listLoading = true
        try {
          if (str == 'clear') {
            this.paramForm = {
              // procedureName: '',
              // orderNo: '',
              // bomNo: ''
            }
            this.pages = {
              total: 0,
              page_num: 1,
              page_size: 10
            }
          }
          if (this.date) {
            this.paramForm.startTime = this.date[0]
            this.paramForm.endTime = this.date[1]
          }
          const res = await page_list_audit({
            page: {
              page_num: this.pages.page_num,
              page_size: this.pages.page_size
            },
            params: this.paramForm
          })
          if (res.data instanceof Array) {
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
      async operHandle() {
        // 查询
        this.pages.page_num = 1
        this.pages.total = 0
        this.getList()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .input {
    width: 380px;
  }

  ::v-deep .el-message-box .el-message-box__btn {
    text-align: center !important;
  }

  /* ::v-deep .launchApproval-product .el-form-item {
        width: 24%;
        margin-right: 0px !important;
      } */

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
