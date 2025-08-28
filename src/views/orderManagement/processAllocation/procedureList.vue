<!--工序分配列表-->
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
      <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
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



      <el-table-column align="center" label="分配数量" prop="workItemCount" width="160">
        <template slot-scope="scope">

          <el-input v-model="scope.row.workItemCount" class="input1" type="text" :ref="'input'+scope.$index"
                    placeholder="追加数量" @input="scope.row.workItemCount = formatToInt(scope.row.workItemCount)"
                    @keyup.enter.native="handleEnter(scope.$index)" />

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
import { devicePageList } from '@/api/device/deviceInfo' // 使用设备台账接口

/ / 工序名称与设备ID的固定映射表
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

      // [移除] 根据写死的 DEVICE_ID_NAME_MAP 初始化设备下拉选项（已弃用，改用接口台账）
      // deviceOptions: Object.entries(DEVICE_ID_NAME_MAP).map(([value, label]) => ({ value, label })),

      deviceList: [],                     // [修改] 台账设备数据（下拉源）
      deviceIdSet: new Set(),             // [新增] 台账设备ID集合（字符串），用于快速校验
      deviceMap: {}                       // [新增] 台账设备映射：{ id(字符串): name }
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

// ================= 【设备台账】补充健壮性 =================
    async getDeviceList(){
      const query={ page:{page_num:1,page_size:100}, params:{} };
      const res=await devicePageList(query);
      const raw=Array.isArray(res&&res.data)?res.data:[];
      this.deviceList = raw.map(it=>({ code:String(it.id), name:it.deviceName }));
      this.deviceIdSet = new Set(this.deviceList.map(d=>d.code));
      this.deviceMap  = this.deviceList.reduce((m,d)=>(m[d.code]=d.name,m),{});
    },


    // [移除] 根据写死的 DEVICE_ID_NAME_MAP 查名称（已不再使用）
//  getDeviceName(id) {
//    return DEVICE_ID_NAME_MAP[id] || '未知设备'
//  },

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
     async save() {
      this.saveList = [];
       const getInt = v => {
        if (v == null || v === '') return NaN;
        const s = String(v).replace(/[^\d.]/g, '');
        const n = parseInt(s, 10);
        return Number.isFinite(n) ? n : NaN;
      };
       const groupSum = new Map(); // key: item.id, val: { sum, max }

       for (let i = 0; i < this.list.length; i++) {
        const item = this.list[i];
        const rowNo = i + 1;

         if (!item.workDeviceId) {
          this.$message.error(`第 ${rowNo} 行未选择设备`);
          return;
        }

         // —— 数字规整 ——
         const delta=getInt(item.workItemCount);                         // 本次“追加数”
         const wait =getInt(item.waitAllocCount);                        // 可分配口径（前端口径）
         const issued = getInt(item.workerAllocCount) || 0;              // 已分配（展示口径）
         // 【新增-稳妥兜底】旧计划数优先取接口的 planTotalCount；缺失时在“行内已有工单且只有一单”的情况下回退到 issued
         const prevPlanRaw = Number(item.__prevPlanTotalCount||0);
         const prevPlan = item.workId ? (prevPlanRaw>0 ? prevPlanRaw : issued) : 0;  // 【修改点①】追加时的“旧计划数”

         // —— 基本校验 ——
         if(!Number.isInteger(delta)||delta<1){ this.$message.error(`第 ${rowNo} 行分配数量必须为正整数（≥1）`); return; }
         if(!Number.isInteger(wait) ||wait<0){ this.$message.error(`第 ${rowNo} 行可分配数异常，请检查数据源`); return; }
         if(delta>wait){ this.$message.error(`第 ${rowNo} 行本次分配不得超过可分配数 ${wait}`); return; }


         // —— 关键转换：追加→最终 ——
         const allocTotal = item.workId ? (prevPlan + delta) : delta;    // 【修改点②】有工单=追加，无工单=新增

         // —— 同工序多行合计不超发 ——
         const gk=item.id; const cur=groupSum.get(gk)||{sum:0,max:wait}; cur.sum+=delta; cur.max=wait; groupSum.set(gk,cur);


         this.saveList.push({
          id: item.id,
           workOrderId: item.workId || '',    // 有=更新，无=新增
          deviceId: item.workDeviceId,
           allocCount: allocTotal             // 【修改点③】传“最终计划数”
        });
      }

       // —— 合计校验（同一工序多行） ——
       for (const {sum,max} of groupSum.values()){
         if(sum>max){ this.$message.error(`存在同一工序/图纸的多行合计超出可分配：合计 ${sum} > 可分配 ${max}`); return; }
       }

       // —— 提交 ——
       await submit_alloc_proc({ params:{ shiftType:this.$route.query.shiftType, groupId:this.$route.query.groupId, list:this.saveList }});
       this.$message({type:'success',message:'提交成功'});
       // this.back();

       this.$router.go(-1);

    },

// ================= 【获取工序分配列表】关键映射 =================
    async getList(str,id){
      this.listLoading=true; this.editIdx=null;
      try{
        if(str=='clear'){ this.paramForm={}; this.pages={total:0,page_num:1,page_size:100}; }
        const paramsId=JSON.parse(this.$route.query.id);
        const res=await proc_procedure_list({ params:{ ids:paramsId, shiftType:this.$route.query.shiftType, groupId:this.$route.query.groupId }});

        if(res && res.data){
          this.list=(res.data||[]).map(it=>{
            const total = Number(it.totalCount||0);
            const allocated = Number(it.workerAllocCount||0);
            const wait = Math.max(total - allocated, 0);                         // 【修改】统一“可分配”口径
            // 【新增】旧计划数优先级：planTotalCount > workPlanTotalCount > workItemPlan(候选) > assignCount > workerAllocCount > 0
            const prevPlan = it.workId
              ? Number(it.planTotalCount ?? it.workPlanTotalCount ?? it.workItemPlan ?? it.assignCount ?? it.workerAllocCount ?? 0) || 0
              : 0;

            const devId = it.deviceId!=null ? String(it.deviceId) : null;
            const mappedDev = (devId && this.deviceIdSet.has(devId)) ? devId : null;

            return {
              ...it,
              waitAllocCount: wait,                               // 展示/校验用
              workItemCount: this.formatToInt(wait),              // 默认“把剩余可分配一次加满”，也可手改
              workDeviceId: mappedDev,
              __prevPlanTotalCount: prevPlan                      // 【新增】保存旧计划数，供 save() 使用
            };
          });
        }
      } finally { this.listLoading=false; }
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
    // [修改] 顺序：先加载台账，再加载工序列表，确保自动映射可用
    await this.getDeviceList()                 // [修改] 页面初始化加载台账数据
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
