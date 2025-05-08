<template>
  <div class="over_x wrapper pt_30 plr_30 ptb_30">
    <div class>
      <!--  -->
      <div class="flex flex_x_between">
        <div class="flex_shink" style="width:100%">
          <div class="flex" style="flex-wrap: wrap;">
            <div class="flex flex_shink ptb_10 label_wrapper">
              <div class="label fw_bold fs_24 flex_shink">BOM编码</div>
              <div class="ml_10 flex_box">{{ detail.bomNo }}</div>
            </div>
            <div class="flex flex_shink ptb_10 label_wrapper ml_20">
              <div class="label fw_bold fs_24 flex_shink">产品名称</div>
              <div class="ml_10 flex_box">{{ detail.itemName }}</div>
            </div>
            <div class="flex flex_shink ptb_10 label_wrapper">
              <div class="label fw_bold fs_24 flex_shink">订单号</div>
              <div class="ml_10 flex_box">{{ detail.orderNo }}</div>
            </div>
            <div class="flex flex_shink ptb_10 label_wrapper ml_20">
              <div class="label fw_bold fs_24 flex_shink">外协厂商</div>
              <div class="ml_10 flex_box">{{ detail.acctName }}</div>
            </div>
            <div class="flex flex_shink ptb_10 label_wrapper">
              <div class="label fw_bold fs_24 flex_shink">产品编码</div>
              <div class="ml_10 flex_box">{{ detail.itemNo }}</div>
            </div>
            <div class="flex flex_shink ptb_10 label_wrapper ml_20">
              <div class="label fw_bold fs_24 flex_shink">外协分配数量</div>
              <div
                class="ml_10 flex_box"
              >{{ detail.outerCount}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ml_40 flex_x_between">
        <div class="mb_20 flex_row flex_x_between">
          <div class="rz_item flex_c_center flex_shink ptb_20 plr_10">
            <div
              class="mb_20 fw_bold fs_38"
            >{{ detail.reportCount}}
            </div>
            <div class="fw_bold">累计上报数量</div>
          </div>
          <div class="rz_item flex_c_center flex_shink ptb_20 plr_10">
            <div
              class="mb_20 fw_bold fs_38"
            >{{ detail.realCount}}
            </div>
            <div class="fw_bold">验收通过数量</div>
          </div>
          <div class="rz_item flex_c_center flex_shink ptb_20 plr_10">
            <div
              class="mb_20 fw_bold fs_38"
            >{{ detail.deffCount}}
            </div>
            <div class="fw_bold">验收拒绝数量</div>
          </div>
          <div class="rz_item flex_c_center flex_shink ptb_20 plr_10">
            <div
              class="mb_20 fw_bold fs_38"
            >{{ detail.pendingCount}}
            </div>
            <div class="fw_bold">待完成数量</div>
          </div>
        </div>
      </div>
      <!--  -->
      <!-- <el-row class="flex_row ptb_20 c_b fw_bold fs_24">

        </el-row>
        <el-form :inline="true" :model="paramForm" label-width="100px" label-position="left">
          <el-form-item label="报工时间">
            <el-date-picker
              v-model="paramForm.createdTime"
              class="input"
              type="date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              placeholder="选择日期时间"
            />
          </el-form-item>
          <el-form-item label="报工人">
            <el-input v-model="paramForm.createdBy" class="input" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="paramForm.status" placeholder="请选择" class="input">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="" @click="operHandle(1)">查询</el-button>
            <el-button class="ml_20" @click="getList('clear')">重置</el-button>
          </el-form-item>
      </el-form>-->

      <el-table
        id="isTable"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        fit
        border
        highlight-current-row
        class="table mb_30 w_100"
      >
        <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
        <el-table-column
          v-for="item in tableList"
          :key="item.label"
          align="center"
          :label="item.label"
        >
          <template slot-scope="scope">
            <template v-if="item.label == '状态'">
              <!-- 待接收   外协单状态;01：领取，02:报工，03:确认，04:拒绝 -->
              <span>  {{getStatusObj[scope.row.reviewStatus]}}</span>
              <!-- <span v-if="scope.row.reviewStatus == '01'">验收通过</span>
              <span v-if="scope.row.reviewStatus == '02'">验收拒绝</span> -->
              <!-- 已接收 -->
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

      <div class="w_100 flex_row flex_x_center">
        <el-button type="primary" plain class="ml_20" @click="operHandle(5)">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    newouter_log_page_list,
    newouter_log_page_list_data
  } from '@/api/outsourcingManagement'
  import {getStatusObj, getStatusList} from '@/utils/dictionary.js'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        detail: {},
        getStatusObj,
        tableList: [
          {
            label: '报工时间',
            value: 'createdTime'
          },
          {
            label: '报工人',
            value: 'acctName'
          },
          {
            label: '报工数量',
            value: 'reportCount'
          },
          {
            label: '状态',
            value: 'status'
          }
        ],
        statusOptions: [
          {
            value: '00',
            label: '待接受'
          },
          {
            value: '01',
            label: '领取'
          },
          {
            value: '02',
            label: '报工'
          },
          {
            value: '03',
            label: '确认'
          },
          {
            value: '04',
            label: '拒绝'
          }
        ],
        list: [],
        listLoading: true,
        // 分页
        pages: {
          total: 0,
          page_num: 1,
          page_size: 10
        },
        // 查询参数
        paramForm: {
          createdBy: '',
          createdTime: '',
          status: ''
        },
        id: ''
      }
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    async created() {
      if (this.$route.query.id) this.id = this.$route.query.id
      this.outer_log_page_list_data()
      await this.getList('clear')
    },
    methods: {
      async outer_log_page_list_data() {
        // 获取头部信息
        if (this.id) {
          const res = await newouter_log_page_list_data({
            params: {id: this.id}
          })
          if (res.data) {
            this.detail = res.data
            if (!this.detail.itemCount) this.detail.itemCount = 0
            if (!this.detail.outerCount) this.detail.outerCount = 0
            if (!this.detail.pendingCount) this.detail.pendingCount = 0
            if (!this.detail.qualifiedCount) this.detail.qualifiedCount = 0
            if (!this.detail.unqualifiedCount) this.detail.unqualifiedCount = 0
          }
        }
      },
      async getList(str) {
        this.listLoading = true
        try {
          if (str == 'clear') {
            this.paramForm = {
              createdBy: '',
              createdTime: '',
              status: ''
            }
            this.pages = {
              total: 0,
              page_num: 1,
              page_size: 10
            }
          }
          const res = await newouter_log_page_list({
            page: {
              page_num: this.pages.page_num,
              page_size: this.pages.page_size
            },
            params: {id: this.id}
          })
          console.log(res, 'res')
          if (res.data instanceof Array) {
            let data = res.data.map(item => {
              let status = this.statusOptions.find(it => it.value == item.status)
              return {
                ...item,
                statusStr: status
                  ? status.label
                  : item.status == '00'
                    ? '待验收'
                    : item.status
              }
            })
            this.list = data
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
        switch (type) {
          case 1: // 查询
            this.pages.page_num = 1
            this.pages.total = 0
            this.getList()
            break
          case 2: // 接收
            await this.$confirm('确认 接收？', '提示', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            })
            // let res = await actAdd(form)
            //     this.$message({
            //        message: "操作成功",
            //         type: 'success'
            //     });
            this.getList()
            break
          case 3: // 报工
            this.form = JSON.parse(JSON.stringify(item))
            this.dialogVisible = true
            break
          case 4: // 报工日志
            this.$router.push({
              name: 'outsourcingOrderLogs',
              query: {id: item.id}
            })
            break
          case 5: // 返回
            this.$router.push({
              path: '/outsourcingManagement'
            })
            break
          default:
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wrapper {
    min-height: 100vh;
  }

  .content {
    min-width: 1478px;
  }

  .input {
    width: 380px;
  }

  ::v-deep .el-form--inline .el-form-item {
    margin-right: 20px;
  }

  .label_wrapper {
    width: 300px;
  }

  .label {
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
