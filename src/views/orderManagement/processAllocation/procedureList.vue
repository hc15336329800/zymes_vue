<!--工序分配页面-->
<template>
  <div
    class="w_100 pt_30 plr_30 ptb_30 process-allocation"
    v-loading="listLoading"
    style="padding-top:20px;"
    element-loading-spinner="el-icon-loading"
  >
    <el-table
      id="isTable"
      border
      :data="list"
      ref="commenTable"
      fit
      :key="isUpdate"
      :span-method="objectSpanMethod"
      highlight-current-row
      class="table mb_10 isTable2"
    >
      <el-table-column align="center" label="图纸号" prop="bomNo"></el-table-column>
      <el-table-column align="center" label="工序名称" prop="procedureName"></el-table-column>
      <el-table-column align="center" label="总数" prop="totalCount"></el-table-column>
      <el-table-column align="center" label="已分配数量" prop="workerAllocCount"></el-table-column>
      <el-table-column align="center" label="已生产数量" prop="prodCount"></el-table-column>
      <el-table-column align="center" label="可分配数" prop="waitAllocCount"></el-table-column>
      <el-table-column align="center" label="中间件使用数" prop="midCount"></el-table-column>
      <el-table-column align="center" label="设备" prop="bomNo" width="220">
        <template slot-scope="scope">
          <Device
            :bind-id.sync="scope.row.workDeviceId"
            :pageName="'procedureList'"
            :deviceList.sync="deviceList"
          />
        </template>
      </el-table-column>

      <el-table-column align="center" label="分配数量" prop="bomNo" width="160">
        <template slot-scope="scope">
          <el-input
            v-model.number="scope.row.workItemCount"
            class="input1"
            type="number"
            :ref="'input' + scope.$index"
            @keyup.enter.native="handleEnter(scope.$index)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="工单号" prop="workOrderNo"></el-table-column>
      <el-table-column align="center" label="报工数量" prop="workReportCount"></el-table-column>

      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <el-button
              link
              type="primary"
              icon="Edit"
              @click="addRow(scope.$index,scope.row)"
            >再次分配</el-button>
            <el-button
              link
              type="primary"
              icon="Edit"
              @click="deleteData(scope.$index,scope.row)"
            >删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div style="width:100%;text-align:center;">
      <el-button type="primary" plain class @click="back()">返回</el-button>
      <el-button type="primary" class @click="save()">保存</el-button>
    </div>
  </div>
</template>

<script>
import {
  proc_procedure_list,
  submit_alloc_proc,
  deleteData,
  proc_detail
} from '@/api/order'
import {deviceSelect} from '@/api/device/deviceInfo'

// [新增] 工序名称与设备ID的固定映射表
const procedureDeviceMap = {
  '激光切割下料': '424949962023788544',
  '预装焊接': '424859913508773888',
  '打码': '424949505515741184',
  '铆铭牌': '424974103321927680',
  '包装': '424859706293379072',
  '倒角': '424950346687602688',
  '左立板预装': '424860069373304832',
  '左立板焊接': '424859913508773888',
  '右立板预装': '424860069373304832',
  '右立板焊接': '424859913508773888',
  '预装': '424860069373304832',
  '左立板焊后调平': '424859994123296768',
  '右立板焊后调平': '424859994123296768',
  '装框入库发货': '427747339575123968',
  '打磨遮蔽': '424983016339562496',
  '喷粉': '424973040892141568',
  '检验组挂防护上件': '424951282155806720',
  '装配调整': '424974103321927680',
  '调整平面度及尺寸': '424859994123296768',
  '火焰校正': '424859994123296768',
  '机头座预装': '424860069373304832',
  '焊接': '424859913508773888',
  '机头座焊接': '424859913508773888',
  '预装小件': '424860069373304832',
  '焊后调平': '424859994123296768',
  '砸轴套': '424974103321927680',
  '改成预装焊接及螺母': '424860069373304832',
  '加工平面及孔': '424950493689569280',
  '预装焊接前贴板': '424860069373304832',
  '焊接油缸座': '424859913508773888',
  '焊接后调整': '424859994123296768',
  '组装焊接电线环': '424859913508773888',
  '焊接固定板': '424859913508773888',
  '机器人预装焊接上板': '424950932417961984',
  '铣平面': '424950493689569280',
  '预装上板焊合': '424860069373304832',
  '铆钉': '424974103321927680',
  '喷砂': '424951176589369344',
  '预装油缸座': '424860069373304832',
  '总成平整度，尺寸矫正': '424859994123296768',
  '总成试装装配护栏': '424974103321927680',
  '焊后加工': '424950493689569280',
  '总装': '424974103321927680',
  '喷砂前防护': '424983016339562496',
  '修磨切割纹': '424949846894338048',
  '卸防护': '425239381603672064',
  '一次预装': '424860069373304832',
  '二次预装': '424860069373304832',
  '攻丝': '424948342544293888',
  '预装下件': '425239381603672064',
  '调整平面': '424950828344696832',
  '折弯': '424950245286109184',
  '车床加工': '424950493689569280',
  '清渣修磨': '424859821687070720',
  '调整检验': '424859994123296768',
  '装运总装车间': '424960035571785728',
  '下件': '425239381603672064',
  '总成顺丝及调整': '424973656825683968',
  '装配油箱电池侧': '424974103321927680',
  '下料': '424949962023788544',
  '装框': '427747339575123968',
  '沉孔': '424950640133693440',
  '预装焊接螺母': '424860069373304832',
  '火焰切割外形': '424950120539119616',
  '加工坡口': '424950346687602688',
  '打磨机修磨': '424949846894338048',
  '装车': '424960035571785728',
  '调整': '424859994123296768',
  '火焰切割下料': '424950120539119616',
  '调平': '424950828344696832',
  '加工2个R弧': '424950493689569280',
  '机器人折弯': '424950245286109184',
  '钻孔': '424950640133693440',
  'U型抬杠装配': '424974103321927680',
  '圆管切割机下料': '424950740994121728',
  '焊接机器人预装焊接': '424950932417961984',
  '围弯': '424871737725706240',
  '衬管下料': '424950740994121728',
  '钻孔攻丝': '424950640133693440',
  '切除多余部分': '001',
  '切割圆弧': '424859821687070720',
  '压型': '424951108410957824',
  '压边': '424950245286109184',
  '总成修整装配': '424974103321927680',
  '修磨圆弧': '424859821687070720',
  '下料围弯': '424950740994121728',
  '机器人补焊': '424950932417961984',
  '机器人焊接': '424950932417961984',
  '人工焊接': '424859913508773888',
  '人工补焊': '424859913508773888',
  '机器人预装': '424860069373304832',
  '改为修磨毛刺及微连接': '424859821687070720',
  '焊接后调平': '424859994123296768',
  '清抛': '424951176589369344',
  '装片1个': '424951176589369344',
  '吹砂': '424951176589369344',
  '吹水': '424979166555693056',
  '成品': '424974103321927680',
  '铆接': '002'
}

export default {
  name: 'procedureList',
  data() {
    return {
      listLoading: false,
      paramForm: {},
      saveList: [],
      allRroups: null,
      editIdx: null,
      list: [],
      isUpdate: Math.random(),
      workOptions: [],
      deviceList: [],
      modelTypes: [],
      modelTypeName: null,
      allocTypeModel: null,
      prdCount: null,
      // 分页
      pages: {
        total: 0,
        page_num: 1,
        page_size: 100
      },
      procedureDeviceMap   // [新增] 将映射表挂载到组件实例
    }
  },
  components: {
    CommenTable: () => import('./commenTable.vue'),
    Device: () => import('@/components/Device')
  },
  methods: {
    getDeviceList() {
      deviceSelect({}).then(res => {
        this.deviceList = res.data
      })
    },
    objectSpanMethod({row, column, rowIndex, columnIndex}) {
      if (columnIndex <= 6 && row.colLen >= 1) {
        return {
          colspan: 1,
          rowspan: row.colLen
        }
      } else {
        return {
          colspan: 1,
          rowspan: 1
        }
      }
    },
    addRow(idx, row) {
      this.$set(row, 'colLen', 0)
      var rows = JSON.parse(JSON.stringify(row))
      this.$set(rows, 'workDeviceId', null)
      this.$set(rows, 'workItemCount', null)
      this.$set(rows, 'workId', null)
      this.$set(rows, 'workOrderNo', null)
      this.$set(rows, 'workReportCount', null)
      this.list.splice(idx, 0, rows)
    },

    deleteData(k, item) {
      if (!item.workId) {
        this.list.splice(k, 1)
      } else {
        this.$confirm('确认要删除数据吗?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deleteData({
              params: {
                id: item.workId
              }
            }).then(res => {
              this.getList()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            })
          })
          .then(() => {
          })
      }
    },
    back() {
      this.$router.back()
    },

    // 保存按钮
    async save(item, k) {
      this.saveList = []
      console.log("....", this.list)
      this.list.forEach(item => {
        this.saveList.push({
          id: item.id,
          workOrderId: item.workId,
          deviceId: item.workDeviceId,
          allocCount: item.workItemCount
        })
      })

      await submit_alloc_proc({
        params: {
          shiftType: this.$route.query.shiftType,
          groupId:   this.$route.query.groupId,  // ← 新增
          list: this.saveList
        }
      })
      this.$message({
        type: 'success',
        message: '提交成功'
      })
      this.getList('clear')
    },

    async getList(str, id) {
      this.listLoading = true
      this.editIdx = null
      try {
        if (str == 'clear') {
          this.paramForm = {}

          this.pages = {
            total: 0,
            page_num: 1,
            page_size: 100
          }
        }
        var paramsId = JSON.parse(this.$route.query.id)
        const res = await proc_procedure_list({
          params: {
            ids: paramsId,
            shiftType: this.$route.query.shiftType,
            groupId:   this.$route.query.groupId      // [MOD] 新增
          }
        })
        this.listLoading = false
        if (res.data) {
          this.list = res.data
          this.list.forEach(item => {
            if (!item.workDeviceId) {
              // [新增] 根据工序名称自动映射设备ID
              const mapped = this.procedureDeviceMap[item.procedureName]
              if (mapped) {
                this.$set(item, 'workDeviceId', mapped)
              } else if (item.deviceId) {
                this.$set(item, 'workDeviceId', item.deviceId)
              }
            }
          })
        }
      } finally {
      }
    },
    handleEnter(index) {
      if (index < this.list.length - 1) {
        this.$nextTick(() => {
          this.$refs[`input${index + 1}`].focus();
        });
      }
    }
  },
  async created() {
    this.getDeviceList()
    await this.getList('clear')
  },
  async activated() {
    // await this.getGroupSelect()
    await this.getList('clear')
  },
}
</script>

<style lang="scss" scoped>
.process-allocation {
  .delete-icon {
    position: absolute;
    right: 31px;
    top: 23px;
    cursor: pointer;
    color: rgb(255, 73, 73);
  }

  .procedure {
    background: #fff;
    margin-top: 0px;
    font-size: 16px;
    border-bottom: 15px solid #f6f8fa;
    padding: 20px 28px;

    &.last-child {
      border-bottom: none;
    }

    .add-box {
      // width: 50%;
      display: flex;
      align-items: flex-start;

      div {
        &:first-child {
          width: 160px;
        }

        &:last-child {
          width: calc(100% - 160px);
          // border: 2px solid #eee;
        }
      }
    }

    .procedure-content {
      border: 1px #eee solid;
      border-top: none;
      padding: 10px;
    }

    .procedure-info {
      position: relative;
      background: #e9f4ff;
      padding-right: 20px;
      border: 1px #fafafa solid;

      .icons {
        position: absolute;
        right: 10px;
        top: 20px;
        font-size: 22px;
        color: #999999;
        cursor: pointer;
      }

      ul {
        padding-left: 10px;
        padding-right: 17px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }

      .canEdit {
        color: #556490;
        cursor: pointer;
        font-size: 16px;
        font-weight: 700;
      }

      li {
        float: left;
        list-style: none;
        margin-right: 20px;

        a {
          text-decoration: none;
          color: #333;
          line-height: 18px;
          font-weight: 400;
        }
      }

      .procedure-number {
        font-size: 26px;
        color: #d3d2d2;
        font-weight: bold;
        position: absolute;
        left: -34px;
      }

      .procedure-name {
        font-size: 20px;
        margin-bottom: 20px;
        font-weight: bold;
        color: #333;
        cursor: pointer;
      }

      .procedure-opt {
        margin: 0 20px 20px 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .procedure-data {
        margin-left: 20px;
        margin-right: 33px;
      }

      .public01 {
        font-size: 16px;
        font-weight: bold;
        color: red;
        height: 40px;

        display: inline-block;
        margin-right: 20px;

        i {
          display: inline-block;
          //   background: url(../../../../assets/customer/customer-03.png) no-repeat 0px
          //     0px;
          width: 18px;
          height: 18px;
          margin-top: 10px;
          margin-right: 4px;
          float: left;
        }
      }

      .public02 {
        font-size: 16px;
        color: #333;
        font-weight: 400;
      }

      li {
        &:last-child {
          margin-right: 0px;
        }
      }
    }

    .procedure-list {
      .list-01 {
        border: 2px #eee solid;
        border-bottom: none;

        .list-department {
          border-right: none;
        }
      }

      .public03 {
        .list-add {
          margin-top: 16px;
          border: 1px #eee solid;
          border-top: none;
          height: 195px;
          overflow: hidden;

          .list-work {
            height: 137px;
            overflow-y: scroll !important;

            p {
              color: #666;
              font-size: 16px !important;
              font-weight: 400;
              margin: 5px 20px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              cursor: pointer;

              a {
                color: #666;
              }
            }

            .work-result {
              margin: 5px 20px;
              font-size: 16px !important;
              color: #666;

              span.resultContent > span {
                color: red;
                font-weight: bold;
                font-size: 16px !important;
              }
            }
          }
        }
      }

      .public03 {
        .list-public {
          display: block;
          cursor: pointer;
          text-decoration: none;
          font-size: 16px !important;
          position: relative;
          font-weight: bold;
          color: #333;
          height: 44px;
          line-height: 44px;
          background: #fafafa;
          border: 1px #eee solid;
          padding-left: 20px;

          .contactsModal {
            display: inline-block;
            width: 100%;
          }

          i {
            display: inline-block;
            width: 16px !important;
            height: 16px !important;
            float: right;
            margin-top: 16px;
            margin-right: 16px !important;
          }
        }
      }
    }

    .procedure-list {
      overflow: hidden;
    }
  }
}
</style>
