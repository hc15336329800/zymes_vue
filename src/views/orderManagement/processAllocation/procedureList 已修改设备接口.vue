
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

      <!-- 设备列 -->
      <el-table-column align="center" label="设备" prop="bomNo" width="220">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.workDeviceId"
            placeholder="请选择设备"
            clearable
            filterable
            style="width: 100%;"
          > <!-- [修改] 使用原生 el-select -->
            <el-option
              v-for="item in deviceList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option> <!-- [修改] 绑定台账数据 -->
          </el-select>
        </template>
      </el-table-column>



      <el-table-column align="center" label="分配数量" prop="bomNo" width="160">
        <template slot-scope="scope">

          <el-input
            v-model="scope.row.workItemCount"
            class="input1"
            type="text"
            :ref="'input' + scope.$index"
            @input="scope.row.workItemCount = formatToInt(scope.row.workItemCount)"
            @keyup.enter.native="handleEnter(scope.$index)"
          />

        </template>
      </el-table-column>



    </el-table>

    <div style="width:100%;text-align:center;">
      <el-button type="primary" plain class @click="back()">返回</el-button>
      <el-button type="primary" class @click="save()">分配</el-button>
    </div>
  </div>
</template>
<script>
import { deleteData, proc_procedure_list, submit_alloc_proc } from '@/api/order'
 import { devicePageList } from '@/api/device/deviceInfo' // [修改] 使用设备台账接口


// [MOD] 写死：deviceId → 设备名称，用于显示名称
const DEVICE_ID_NAME_MAP = {
  '424949962023788480': '数控激光切割机',
  '424950245286109184': '数控折弯机',
  '424949846894338048': '打磨机',
  '424950828344696832': '调平机',
  '424950640133693440': '钻孔机床',
  '424950740994121664': '数控激光切管机',
  '424859821687070720': '角磨机',
  '424859913508773824': '焊机',
  '424860069373304832': '预装胎',
  '0': '未知设备',
  '424950493689569280': '数控加工机床',
  '424951176589369280': '抛丸机',
  '424948342544293824': '攻丝机',
  '424859994123296768': '调整设备',
  '424960035571785664': '叉车转运',
  '424951282155806720': '上件升降机',
  '424973040892141568': '喷塑枪',
  '425239381603672064': '下件升降机',
  '424973656825683968': '顺丝调整设备',
  '424974103321927680': '装配工具',
  '427747339575123968': '调平打包',
  '424950346687602624': '坡口机',
  '424950120539119616': '数控火焰切割机',
  '424950932417961984': '焊接机器人',
  '424871737725706240': '弯管机',
  '424951108410957760': '冲压机',
  '424979166555693056': '吹水设备',
  '424949505515741184': '打标机',
  '424859706293379136': '扎捆机',
  '424983016339562496': '打磨遮蔽'
}

// [MOD] 写死：procedureCode → deviceId（务必与 keys 一致）
const PROCEDURE_DEVICE_MAP = {
  '1': '424949962023788480', '2': '424950245286109184', '3': '424949962023788480', '4': '424949846894338048',
  '5': '424950828344696832', '6': '424950640133693440', '7': '424950640133693440', '8': '424950740994121664',
  '9': '424859821687070720', '10': '424859913508773824', '11': '424860069373304832', '12': '424859913508773824',
  '13': '0', '14': '424950493689569280', '15': '424950640133693440', '16': '424951176589369280',
  '17': '424949846894338048', '18': '424948342544293824', '19': '424950828344696832', '20': '424860069373304832',
  '21': '424859913508773824', '22': '424859821687070720', '23': '424859994123296768', '24': '424960035571785664',
  '25': '424951282155806720', '26': '424973040892141568', '27': '425239381603672064', '28': '424973656825683968',
  '29': '424974103321927680', '30': '427747339575123968', '31': '0', '32': '424950640133693440',
  '34': '424860069373304832', '35': '424950346687602624', '36': '424950640133693440', '37': '424860069373304832',
  '38': '424950120539119616', '39': '424950346687602624', '40': '424960035571785664', '41': '424950346687602624',
  '42': '424859994123296768', '43': '424950120539119616', '44': '424950640133693440', '50': '424950640133693440',
  '51': '424950493689569280', '52': '424860069373304832', '54': '424951282155806720', '55': '424950640133693440',
  '56': '424950245286109184', '60': '424950346687602624', '61': '424859913508773824', '63': '424974103321927680',
  '64': '424950740994121664', '65': '424950932417961984', '66': '424871737725706240', '67': '424950740994121664',
  '69': '424949962023788480', '70': '0', '71': '424859821687070720', '72': '424859821687070720',
  '73': '424951108410957760', '74': '424871737725706240', '75': '424950245286109184', '76': '424974103321927680',
  '79': '424859821687070720', '81': '424950932417961984', '82': '424950932417961984', '83': '424859913508773824',
  '84': '424859913508773824', '86': '424860069373304832', '88': '424949846894338048', '89': '424948342544293824',
  '90': '424859994123296768', '92': '424950493689569280', '93': '424949846894338048', '94': '424950493689569280',
  '95': '424951176589369280', '96': '424948342544293824', '97': '424951176589369280', '98': '424951176589369280',
  '99': '424979166555693056', '100': '424949505515741184', '101': '424974103321927680', '102': '424859706293379136',
  '103': '424950346687602624', '104': '424950493689569280', '105': '424950640133693440', '106': '424860069373304832',
  '107': '424859913508773824', '108': '424860069373304832', '109': '424859913508773824', '110': '424859994123296768',
  '111': '424859994123296768', '112': '427747339575123968', '113': '424983016339562496', '114': '424973040892141568',
  '115': '424951282155806720', '116': '424974103321927680', '117': '424859994123296768', '118': '424859994123296768',
  '119': '424860069373304832', '120': '424859913508773824', '121': '424860069373304832', '122': '424859994123296768',
  '123': '424974103321927680', '124': '424948342544293824', '125': '424860069373304832', '126': '424860069373304832',
  '127': '424948342544293824', '128': '424860069373304832', '129': '424948342544293824', '131': '424948342544293824',
  '132': '424948342544293824', '133': '424860069373304832', '134': '424860069373304832', '135': '424948342544293824',
  '136': '424948342544293824', '137': '424860069373304832', '138': '424860069373304832', '139': '424950640133693440',
  '140': '424860069373304832', '141': '424859913508773824', '142': '424859994123296768', '143': '424859821687070720',
  '144': '424859913508773824', '145': '424859913508773824', '146': '424950932417961984', '148': '424950640133693440',
  '151': '424950932417961984', '152': '424950493689569280', '153': '424950640133693440', '154': '424950640133693440',
  '155': '424950640133693440', '156': '424860069373304832', '157': '424974103321927680', '158': '424974103321927680',
  '159': '424860069373304832', '161': '424860069373304832', '162': '424860069373304832', '163': '424860069373304832',
  '164': '424859913508773824', '165': '424859994123296768', '166': '424974103321927680', '167': '424950493689569280',
  '168': '424974103321927680', '169': '424983016339562496', '170': '425239381603672064', '171': '424860069373304832',
  '173': '424860069373304832', '174': '424860069373304832', '175': '424950120539119616', '178': '424950640133693440',
  '179': '424950640133693440', '180': '425239381603672064', '181': '424974103321927680', '182': '424950640133693440',
  '200': '424950493689569280', '999': '424974103321927680'
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
      // deviceList: [],
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

      // [MOD] 根据 DEVICE_ID_NAME_MAP 初始化设备下拉选项
      deviceOptions: Object.entries(DEVICE_ID_NAME_MAP).map(([value, label]) => ({ value, label })),

      deviceList: [],                     // [修改] 台账设备数据

    }
  },
  components: {
    CommenTable: () => import('./commenTable.vue')
   },
  methods: {

    //去除后三位小数点
    formatToInt(val) {
      // 只保留正整数，去掉小数部分
      if (val == null || val === '') return ''
      // 去掉非数字和小数点字符
      val = val.toString().replace(/[^\d.]/g, '')
      // 取整数部分
      const intVal = parseInt(val, 10)
      return isNaN(intVal) ? '' : intVal.toString()
    },

    getDeviceList() { // [修改] 使用设备台账接口获取设备列表
      const query = {
        page: { page_num: 1, page_size: 100 }, // [修改] 固定每页100条
        params: {}
      }
      devicePageList(query).then(res => { // [修改]
        this.deviceList = (res.data || []).map(item => ({ // [修改] 字段映射为下拉框需要的格式
          code: item.id,
          name: item.deviceName
        }))
      })
    },

    // [MOD] 根据写死的 DEVICE_ID_NAME_MAP 查名称
    getDeviceName(id) {
      return DEVICE_ID_NAME_MAP[id] || '未知设备'
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
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
    // 保存按钮
    async save() {
      this.saveList = []

      // [MOD] 目的：统一把参与比较的值数值化，并校验为正整数，避免字符串/NaN/小数导致的误判
      for (const [index, item] of this.list.entries()) {
        // [MOD] 新增：保留原始值，转为数字用于比较
        const rawVal = item.workItemCount
        const rawMax = item.waitAllocCount
        const val = Number(rawVal)
        const max = Number(rawMax)

        // [MOD] 新增：必填校验（保持原有语义）
        if (rawVal == null || rawVal === '') {
          this.$message.error(`第 ${index + 1} 行未填写分配数量`)
          return
        }

        // [MOD] 新增：类型与取值校验——必须为正整数（≥1）
        if (!Number.isFinite(val) || !Number.isInteger(val) || val < 1) {
          this.$message.error(`第 ${index + 1} 行分配数量必须为正整数（≥1）`)
          return
        }

        // [MOD] 新增：max 合法性校验
        if (!Number.isFinite(max) || max < 0) {
          this.$message.error(`第 ${index + 1} 行可分配数异常，请检查数据源`)
          return
        }

        // [MOD] 修改：范围提示与逻辑统一为 1 ~ max（原提示为 0 ~ max 且代码用 val < 1）
        if (val > max) {
          this.$message.error(`第 ${index + 1} 行分配数量必须在 1 ~ ${max} 之间`)
          return
        }

        // ✅ 原 saveList 构造逻辑保留（仅将 allocCount 使用数值化后的 val）
        this.saveList.push({
          id: item.id,
          workOrderId: item.workId,
          deviceId: item.workDeviceId,
          allocCount: val // [MOD] 用数值化后的 val，避免后端再转型
        })
      }

      // ✅ 原提交逻辑保留
      await submit_alloc_proc({
        params: {
          shiftType: this.$route.query.shiftType,
          groupId: this.$route.query.groupId,
          list: this.saveList
        }
      })

      this.$message({ type: 'success', message: '提交成功' })
      // this.getList('clear');
      this.back() // 👈 执行返回
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
            groupId: this.$route.query.groupId      // [MOD] 新增
          }
        })
        this.listLoading = false
        if (res.data) {
          this.list = res.data
          this.list.forEach(item => {

            // 【关键步骤】根据procedureCode查设备ID，并赋值到workDeviceId
            const devId = PROCEDURE_DEVICE_MAP[item.procedureCode]
            this.$set(item, 'workDeviceId', devId || '0')

            // 🌟 新增：初始化时直接过滤掉小数
            if (item.workItemCount !== undefined && item.workItemCount !== null) {
              item.workItemCount = this.formatToInt(item.workItemCount)
            }

          })
        }
      } finally {
      }
    },
    handleEnter(index) {
      if (index < this.list.length - 1) {
        this.$nextTick(() => {
          this.$refs[`input${index + 1}`].focus()
        })
      }
    }
  },
  async created() {

    this.getDeviceList()                 // [修改] 页面初始化加载台账数据
    await this.getList('clear')

  },
  async activated() {
    // await this.getGroupSelect()
    await this.getList('clear')
  }
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
