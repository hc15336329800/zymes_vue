<!--工单报工-->
<template>
  <div class="app-container">

    <!--    工具栏-->
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
      <el-form-item label="图纸号" class="condition">
        <BomNoSelect :item-no.sync="queryParams.params.itemNo"/>
      </el-form-item>
      <!--      <el-form-item prop="workOrderNo" label="工单号" class="condition">-->
      <!--        <el-input v-model="queryParams.params.workOrderNo"/>-->
      <!--      </el-form-item>-->
      <el-form-item label="车间" class="condition">
        <el-select
          v-model="queryParams.params.deptId"
          clearable
          placeholder="请选择状态"
          style="width:140px;"
          filterable
        >
          <el-option
            :key="dept.code"
            v-for="(dept) in workShopList"
            :label="dept.name"
            :value="dept.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="设备" class="condition">-->
      <!--        <deviceSelected :bind-id.sync="queryParams.params.deviceId"/>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="状态" class="condition">-->
      <!--        <el-select v-model="queryParams.params.status" placeholder="请选择">-->
      <!--          <el-option key="00" label="全部" value=""/>-->
      <!--          <el-option key="01" label="未完成" value="01"/>-->
      <!--          <el-option key="02" label="已完成" value="02"/>-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item label="工序名称" class="condition">
        <multipleProcedure :bind-name.sync="queryParams.params.procedureNames"/>
      </el-form-item>
      <el-form-item class="commen-button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
      </el-form-item>
      <el-form-item class="commen-button reset">
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>

      <!-- [RESTORE] 批量报工按钮（不推荐） -->
<!--      <el-form-item class="commen-button">-->
<!--        <el-button type="primary" @click="allHandleReport" v-show="buttonShow">-->
<!--          批量报工-->
<!--        </el-button>-->
<!--      </el-form-item>-->


    </el-form>
    <el-row class="mb8">
      <!--      <el-button type="primary" class="commen-button" icon="el-icon-plus" @click="handleAdd">新增</el-button>-->
    </el-row>

<!--    表格-->
    <el-table :data="pageList" class="commen-table mt_20"  @selection-change="handleSelectionChange">
<!--      <el-table-column type="selection" width="55"></el-table-column>-->
<!--      <el-table-column type="index" width="50" label="序号"></el-table-column>-->
      <el-table-column label="订单号" align="center" prop="orderNo"  min-width="100"/>

      <el-table-column label="分组编号" align="center"  v-if="false" prop="groupId"   min-width="100"/>

      <el-table-column label="bom号" align="center" prop="bomNo"   min-width="100"/>
      <el-table-column label="物料号" align="center" prop="itemNo"/>
      <el-table-column label="物料名" align="center" prop="itemName"/>
<!--      <el-table-column label="图纸号" align="center" prop="bomNo"/>-->
       <el-table-column label="工单号" align="center" prop="workOrderNo"/>
      <el-table-column label="工序" align="center" prop="procedureName"/>
      <el-table-column label="设备" align="center" prop="deviceName"/>
      <el-table-column label="车间" align="center" prop="deptName"/>
<!--      <el-table-column label="班次" align="center" prop="shiftType" :formatter="statusFormatter"/>-->
<!--      <el-table-column label="分配数量" align="center" prop="planTotalCount"/>-->
<!--      <el-table-column label="已下达数量" align="center" prop="assignCount"/>-->
      <!-- 深黄色   加粗 -->
      <el-table-column label="已下达数量" align="center">
        <template slot-scope="scope">
          <span class="assign-count-highlight">{{ scope.row.assignCount }}</span>
        </template>
      </el-table-column>

<!--      <el-table-column label="可下达数量" align="center" prop="waitAssignCount"/>-->
      <el-table-column label="待验收正品数量" align="center" prop="toReviewRealCount"/>
      <el-table-column label="正品数量" align="center" prop="realCount"/>
      <el-table-column label="待确认次品数量" align="center" prop="toReviewDeffCount"/>
      <el-table-column label="次品数量" align="center" prop="deffCount"/>
      <el-table-column label="工单状态" align="center" prop="state"/>
      <el-table-column label="更新时间" align="center" prop="updatedTime" width="100"/>
      <el-table-column label="操作" align="center"  >
        <template slot-scope="scope">
          <!-- 确认后不能编辑和删除 -->

          <el-button link type="primary"   icon="Delete" @click="handleReport(scope.row)" v-show="buttonShow">
            报工
          </el-button>
          <el-button v-if="scope.row.deviceName.indexOf('折弯机') !==-1" link type="primary" icon="Delete"
                     @click="handleHastrue(scope.row,0)">开始
          </el-button>
          <el-button v-if="scope.row.deviceName.indexOf('折弯机') !==-1" link type="primary" icon="Delete"
                     @click="handleHastrue(scope.row,1)">完成
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      style="text-align: right"
      v-show="pageTotal>0"
      :total="pageTotal"
      :page.sync="queryParams.page.page_num"
      :limit.sync="queryParams.page.page_size"
      @pagination="getData"
    />

    <!-- 分组对话框 -->
    <el-dialog title="报工提交" :visible.sync="dialogShow1" width="480px" @close="beforeClose1">
      <el-form
        :model="reportForm"
        class="commen-form"
        :rules="rules1"
        ref="reportForm"
        label-width="80px"
      >
        <el-form-item prop="procedureName" label="工序名称" class="condition">
          <el-input v-model="reportForm.procedureName" :disabled="true"/>
        </el-form-item>
        <el-form-item label="报工类型" class="condition" prop="groupId" style="width:100%;">
          <el-select
            v-model="reportForm.reportType"
            clearable
            placeholder="请选择分组"
            style="width:100%;"
            filterable
            disabled
          >
            <el-option
              :key="dept.code"
              v-for="(dept) in reportTypeList"
              :label="dept.name"
              :value="dept.code"
            ></el-option>
          </el-select>
        </el-form-item>

<!--        <el-form-item label="分组备用" class="condition" prop="groupId">-->
<!--          <el-select-->
<!--            v-model="reportForm.groupId"-->
<!--            clearable-->
<!--            placeholder="请选择分组"-->
<!--            style="width:200px;"-->
<!--            filterable-->
<!--          >-->
<!--            <el-option-->
<!--              :key="dept.code"-->
<!--              v-for="(dept) in groupList"-->
<!--              :label="dept.name"-->
<!--              :value="dept.code"-->
<!--            ></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        -->

          <!-- [MOD] 只读显示：禁用下拉 -->
        <!-- 只读分组：用户无法修改，只做回显 -->
        <el-form-item label="所属分组" class="condition">
          <el-select v-model="reportForm.groupId" :disabled="true" style="width:100%;">
            <el-option
              v-for="grp in groupList"
              :key="grp.code"
              :label="grp.name"
              :value="grp.code"
            />
          </el-select>
        </el-form-item>


        <!--        正品数量-->
        <el-form-item prop="realCount" label="正品数量">
          <div class="assign-input-group">  <!-- 自定义左右按钮 -->
            <el-input v-model.number="reportForm.realCount"
                      class="assign-input"
                      oninput="this.value=this.value.replace(/[^0-9.]/g,'')">
            </el-input>
            <el-button-group   class="assign-btn-group"    style="margin-left:4px;">
              <el-button icon="el-icon-minus" size="mini" @click="decAssignRealCount"/>
              <el-button icon="el-icon-plus"  size="mini" @click="  incAssignRealCount"/>
            </el-button-group>
          </div>
        </el-form-item>


        <!--        次品数量-->
        <el-form-item prop="deffCount" label="次品数量">
          <div class="assign-input-group">  <!-- 自定义左右按钮 -->
            <el-input v-model.number="reportForm.deffCount"
                      class="assign-input"
                      oninput="this.value=this.value.replace(/[^0-9.]/g,'')">
            </el-input>
            <el-button-group   class="assign-btn-group"    style="margin-left:4px;">
              <el-button icon="el-icon-minus" size="mini" @click="decAssignDeffCount"/>
              <el-button icon="el-icon-plus"  size="mini" @click="  incAssignDeffCount"/>
            </el-button-group>
          </div>
        </el-form-item>


        <div class="dialog-footer" style="text-align: center;width:100%;">
          <el-button @click="cancel1">取 消</el-button>
          <el-button type="primary" @click="submitForm1">确认完成</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- 添加或修改对话框 -->
    <el-dialog title="确认" :visible.sync="dialogShow2" width="480px" @close="beforeClose1">
      <el-form
        :model="reportForm1"
        class="commen-form"
        :rules="rules2"
        ref="reportForm1"
        label-width="80px"
      >
        <el-form-item prop="procedureName" label="已选择序号" class="condition" v-if="showFormItem">
          <el-input v-model="reportForm1.ids" :disabled="true"/>
        </el-form-item>
        <el-form-item label="报工类型" class="condition" prop="groupId">
          <el-select
            v-model="reportForm1.reportType"
            clearable
            placeholder="请选择分组"
            style="width:200px;"
            filterable

          >
            <el-option
              :key="dept.code"
              v-for="(dept) in reportTypeList"
              :label="dept.name"
              :value="dept.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分组" class="condition" prop="groupId">
          <el-select
            v-model="reportForm1.groupId"
            clearable
            placeholder="请选择分组"
            style="width:200px;"
            filterable
          >
            <el-option
              :key="dept.code"
              v-for="(dept) in groupList"
              :label="dept.name"
              :value="dept.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="dialog-footer" style="text-align: center;width:100%;">
          <el-button @click="cancel1">取 消</el-button>
          <el-button type="primary" @click="submitForm2">确认完成</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import {dictInfo} from '@/api/common'
  import {addAssign, addReport,addAllReport, workOrderList, saveItemand, getRealnumber,allAddAssign} from '@/api/workOrder/workOrder'
  import {groupSelected} from '@/api/group/group'


  export default {
    components: {
      DateIntervals: () => import('@/components/DateIntervals'),
      Pagination: () => import('@/components/Pagination'),
      BomNoSelect: () => import('@/components/Item/BomNo'),
      WorkShop: () => import('@/components/Dept/workShop'),
      deviceSelected: () => import('@/components/Device/deviceSelected'),
      multipleProcedure: () => import('@/components/Item/multipleProcedure')
    },
    data() {
      return {
        queryParams: {
          params: {
            status:'01'
          },
          page: {
            page_num: 1,
            page_size: 10
          }
        },
        reportForm: {},
        reportForm1: {},
        groupList: [],
        reportTypeList: [],
        pageTotal: 0,
        pageList: {},
        workShopList: [],
        dialogShow1: false,
        dialogShow2: false,
        showFormItem: false,
        buttonShow: false,
        multipleSelection: [],
        rules1: {
          realCount: [
            { required: true, message: '请输入正品数量', trigger: 'blur' },
            {                                             // [MOD] 数值 0-100
              validator: (r, v, cb) => {
                const num = Number(v);
                if (isNaN(num))      cb(new Error('只能输入数字'));
                else if (num < 0 || num > 100) cb(new Error('范围 0-100'));
                else cb();
              }, trigger: 'blur'
            }
          ],
          deffCount: [
            { required: true, message: '请输入次品数量', trigger: 'blur' },
            {
              validator: (r, v, cb) => {
                const num = Number(v);
                if (isNaN(num))      cb(new Error('只能输入数字'));
                else if (num < 0 || num > 100) cb(new Error('范围 0-100'));
                else cb();
              }, trigger: 'blur'
            }
          ],
          groupId: [{required: true, message: '请选择分组', trigger: 'blur'}],
          reportType: [
            {required: true, message: '请选择报工类型', trigger: 'blur'}
          ]
        },
        rules2: {
          groupId: [{required: true, message: '请选择分组', trigger: 'blur'}],
          reportType: [
            {required: true, message: '请选择报工类型', trigger: 'blur'}
          ]
        },
        selectList: []
      }
    },
    created() {
      const user = localStorage.getItem('user_info');
      const name = JSON.parse(user).userName;
      this.buttonShow = true;
      this.getSelectOptions()
      this.getData()
    },
    methods: {


      ///////////////////////////////////////////////////////////数值增减///////////////////////////////////////////////////////////

      /* ---------- 数量 ±1 ---------- */
      clamp(val) {                              // 公用限幅
        if (isNaN(val) || val < 0)   return 0;
        if (val > 100)               return 100;
        return val;
      },

      incAssignRealCount() {
        this.reportForm.realCount = this.clamp((Number(this.reportForm.realCount) || 0) + 1);
      },
      decAssignRealCount() {
        this.reportForm.realCount = this.clamp((Number(this.reportForm.realCount) || 0) - 1);
      },
      incAssignDeffCount() {
        this.reportForm.deffCount = this.clamp((Number(this.reportForm.deffCount) || 0) + 1);
      },
      decAssignDeffCount() {
        this.reportForm.deffCount = this.clamp((Number(this.reportForm.deffCount) || 0) - 1);
      },

      ///////////////////////////////////////////////////////////报工///////////////////////////////////////////////////////////

      // [RESTORE] 单行报工 —— 打开 dialogShow1
      handleReport(row) {

        // 剩余可报工 = 已下达 − 已报正品 − 已报次品
        const maxRemain = Math.max(
          0,
          Number(row.assignCount || 0) - Number(row.realCount || 0) - Number(row.deffCount || 0)
        );

        // 部分设备需实时获取已生产数量
        const needFetch = row.deviceName.includes('切管机') ||
          row.deviceName.includes('火焰切割机') ||
          row.deviceName.includes('焊接');

        const openDialog = (real) => {
          this.reportForm = {
            workOrderId: row.id,
            procedureName: row.procedureName,
            realCount: real,
            deffCount: 0,
            reportType: this.reportTypeList[2]?.code || '',
            groupId: row.groupId || '',
            maxRemain                    // <-- 保存到表单，后面校验用
          };
          this.dialogShow1 = true;
        };

        if (needFetch) {
          getRealnumber(row).then(res => openDialog(res.data || 0));
        } else {
          openDialog(row.waitReportCount || 0);
        }
      },


      //  单个报工提交接口
      submitForm1() {
        this.$refs.reportForm.validate(valid => {
          if (!valid) return;

          /* ===== 业务层二次校验 ===== */
          const real = Number(this.reportForm.realCount);
          const deff = Number(this.reportForm.deffCount);
          const remain = Number(this.reportForm.maxRemain);        // 可报工上限

          // 正品：必须有值且 > 0
          if (isNaN(real) || real <= 0) {
            this.$message.error('正品数量必须大于 0');
            return;
          }

          // 次品：允许 0，但不能为空
          if (this.reportForm.deffCount === '' || this.reportForm.deffCount === null || isNaN(deff)) {
            this.$message.error('次品数量不能为空，可填 0');
            return;
          }

          // 可报工数量校验
            if (real + deff > remain) {
            this.$message.error(`正品+次品之和不能超过剩余可报工数量 ${remain}`);
                return;
          }

          // （可选）再次确保两者均在 0–100 之间
          if (real > 100 || deff > 100) {
            this.$message.error('数量区间必须在 0–100');
            return;
          }
          /* ======================== */

          // addReport({ params: this.reportForm }).then(() => {
          //   this.$message.success('报工成功');
          //   this.dialogShow1 = false;
          //   this.getData();
          // });
          // === 二次确认 ===
          this.$confirm(
            `确认完成本次报工吗？`,
            '提示',
            { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
          ).then(() => {
            // 用户点击“确定”后才真正提交
            addReport({ params: this.reportForm }).then(() => {
              this.$message.success('报工成功');
              this.dialogShow1 = false;
              this.getData();
            });
          }).catch(() => {
            /* 用户点取消——不做任何操作 */
          });



        });
      },

      // // [RESTORE] 批量报工（不推荐  ）
      // allHandleReport() {
      //   if (this.selectList.length === 0) {
      //     this.$message.error('请勾选数据！');
      //     return;
      //   }
      //   this.reportForm1 = {
      //     ids: this.selectList,
      //     reportType: '',
      //     groupId: ''
      //   };
      //   this.showFormItem = true;
      //   this.dialogShow2 = true;
      // },
      //
      // // [RESTORE] 批量报工提交
      // submitForm2() {
      //   this.$refs.reportForm1.validate(valid => {
      //     if (!valid) return;
      //     addAllReport({ params: this.reportForm1 }).then(() => {
      //       this.$message.success('批量报工成功');
      //       this.dialogShow2 = false;
      //       this.getData();
      //     });
      //   });
      // },

      ///////////////////////////////////////////////////////////其他///////////////////////////////////////////////////////////

      getSelectOptions() {
        dictInfo('WORK_SHOP', r => (this.workShopList = r))
        dictInfo('REPORT_TYPE', r => (this.reportTypeList = r))


        groupSelected({}).then(res => {
          this.groupList = res.data
        })
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.page.page_num = 1
        this.getData()
      },
      beforeClose1() {
        this.reportForm = {}
        this.$refs['reportForm'].clearValidate()
      },

      /** 重置操作表单 */
      handleReset() {
        this.queryParams = {
          page: {
            page_num: 1,
            page_size: 10
          },
          params: {}
        }
        this.getData()
      },
      getData() {
        workOrderList(this.queryParams).then(res => {
          this.pageList = res.data
          this.pageTotal = Number(res.page.total_num)
        })
      },


      handleHastrue(row, statu) {
        row.dataStatus = statu;
        saveItemand({
          params: row
        }).then(res => {
          this.getData()
          this.$message({
            type: 'success',
            message: '开始加工'
          })
        })
      },


      cancel1() {
        this.dialogShow1 = false
        this.reportForm = {}
        this.$refs['reportForm'].clearValidate()
      },
      statusFormatter(row, column) {
        if (row.shiftType === '01') {
          return '白班';
        } else if (row.shiftType === '02') {
          return '夜班';
        }
        return '未知';
      },

      handleSelectionChange(val) {
        if (val.length == this.pageList.length) {
          // console.log(this.pageList)
          //当前页数据全选
          this.pageList.forEach(item => {
            console.log(item)
            if (this.selectList.every(it => it != item.id)) {
              this.selectList.push(item.id)
              this.multipleSelection.push(item)
            }
          })
        } else if (val.length > 0) {
          //当前页数据部分改动
          this.pageList.forEach(item => {
            let index = val.findIndex(it => it.id == item.id)
            if (index > -1) {
              if (this.selectList.every(i => i != item.id)) {
                this.selectList.push(item.id)
                this.multipleSelection.push(item)
              }
            } else {
              let i = this.selectList.findIndex(i => i == item.id)
              if (i > -1) {
                this.selectList.splice(i, 1)
                this.multipleSelection.splice(i, 1)
              }
            }
          })
        } else if (val.length == 0) {
          //当前页数据全删除
          this.pageList.forEach(item => {
            let index = this.selectList.findIndex(it => it == item.id)
            if (index > -1) {
              this.selectList.splice(index, 1)
              this.multipleSelection.splice(index, 1)
            }
          })
        }
        console.log(this.multipleSelection, 'this.selectList')
      }
    }
  }
</script>

<style lang="scss" scoped>

//////////////////////////以下为新增的输入框//////////////////////////

/* scoped 样式示例，可按需调整 */
.assign-input-group {
  display: inline-flex;
  align-items: center;

  .assign-input {
    width:  60%;      // 输入框宽度
    margin: 0 4px;
  }
}

/* 统一输入框 + 按钮高度/宽度 */
.assign-input-group {
  display: flex;
  align-items: center;

  /* 输入框高度 */
  .el-input__inner {
    height: 32px;
    line-height: 32px;
  }

  /* 按钮组 */
  .assign-btn-group {
    .el-button {
      height: 35px;        /* 同输入框 */
      width: 60px;         /* ← 自行调整按钮宽度 */
      padding: 0;          /* 去掉左右内边距 */
    }
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/* 高亮“已下达数量已下达数量” */
.assign-count-highlight {
  font-weight: 700;
  color: #d48806;   /* 深黄色，可按需微调 */
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  .input {
    width: 380px;
  }

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
