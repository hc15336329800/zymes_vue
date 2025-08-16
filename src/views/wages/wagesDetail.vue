<!--工资明细-->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">

      <!-- 改成输入框绑定筛选参数 bomNo -->
      <el-form-item label="图纸号" class="condition">
        <el-input v-model="queryParams.params.bomNo" placeholder="请输入图纸号" clearable />
      </el-form-item>
      <el-form-item prop="workOrderNo" label="工单号" class="condition">
        <el-input v-model="queryParams.params.workOrderNo" />
      </el-form-item>
      <el-form-item label="工人" class="condition">
        <pinyinSelect :selectList="userList" labelName="name" lableId="code" :value="queryParams.params.userId"
                      :selectChange.sync="queryParams.params.userId"></pinyinSelect>
      </el-form-item>
      <el-form-item label="工序名称" class="condition">
        <multipleProcedure :bind-name.sync='queryParams.params.procedureNames' />
      </el-form-item>
      <el-form-item label="报工时间" class="condition">
        <DateIntervals
          ref="userInfoDateIntervals"
          @getData="getData"
          :beginTime.sync="queryParams.params.beginTime"
          :endTime.sync="queryParams.params.endTime"
        />
      </el-form-item>
      <el-form-item class="commen-button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
      </el-form-item>
      <el-form-item class="commen-button reset">
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>

      <el-form-item class="commen-button">
        <el-button type="primary" icon="el-icon-download" @click="handleExport">导出个人工资表</el-button>
      </el-form-item>

      <el-form-item class="commen-button">
        <el-button type="primary" icon="el-icon-download" @click="handleExportAllSign">导出全部工资表</el-button>
      </el-form-item>

      <el-form-item class="commen-button">
        <el-button type="primary" icon="el-icon-plus" @click="openCreate">新增</el-button>
      </el-form-item>

      <el-form-item></el-form-item>
    </el-form>

    <el-table :data="pageList" class="commen-table mt_20">
      <el-table-column type="index" width="55" label="序号"></el-table-column>
      <el-table-column label="订单号" align="center" prop="orderNo" />
      <el-table-column label="图纸号" align="center" prop="bomNo" />
      <el-table-column label="工人" align="center" prop="userName" />

      <el-table-column label="工单号" align="center" prop="workOrderNo" />
      <el-table-column label="工序" align="center" prop="procedureName" />
      <el-table-column label="加工件数" align="center" prop="userCount" />
      <el-table-column label="单价" align="center" prop="hoursFixed" />
      <el-table-column label="工资" align="center" prop="wages" />
      <el-table-column label="报工时间" align="center" prop="createdTime" min-width="110"/>
      <el-table-column
        label="备注"
        align="center"
        prop="remark"
        min-width="80"
        show-overflow-tooltip
      />

      <el-table-column label="操作" align="center" width="120" min-width="120" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-button type="text" size="mini" @click="openEdit(row)">编辑</el-button>
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

    <el-dialog :visible.sync="editDialogVisible" title="编辑工资明细" width="480px" append-to-body>
      <el-form :model="editForm" :rules="editRules" ref="editRef" label-width="90px" class="commen-form">

        <el-form-item label="加工件数" prop="userCount">
          <el-input-number v-model="editForm.userCount" :min="0" :step="0.5" :precision="2" @change="recalcWages" />
        </el-form-item>

        <el-form-item label="单价" prop="hoursFixed">
          <el-input-number v-model="editForm.hoursFixed" :min="0" :step="0.5" :precision="2" @change="recalcWages" />
        </el-form-item>

        <el-form-item label="工资">
          <el-input v-model="editForm.wages" disabled />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="editForm.remark" :rows="3" maxlength="100" show-word-limit />
        </el-form-item>

      </el-form>

      <span slot="footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleEditOk">保 存</el-button>
  </span>
    </el-dialog>


    <!-- 新增：工资明细 -->
    <el-dialog :visible.sync="addDialogVisible" title="新增工资明细" width="520px" append-to-body>
      <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="100px" class="commen-form">

        <el-form-item label="工人" prop="userId">
          <!-- 用你已经在页面里加载过的 userList -->
          <pinyinSelect :selectList="userList" labelName="name" lableId="code"
                        :value="addForm.userId"
                        :selectChange.sync="addForm.userId" />
        </el-form-item>

        <el-form-item label="工单号" prop="workOrderNo">
          <el-input v-model="addForm.workOrderNo" placeholder="请输入工单号（或在后端用它换取 workOrderId）" clearable />
        </el-form-item>

        <!-- 若你的后端 create 直接用 workOrderId，可把上面这项改成选择框或隐藏，改为给 addForm.workOrderId 赋值 -->

        <el-form-item label="加工件数" prop="userCount">
          <el-input-number v-model="addForm.userCount" :min="0" :step="0.1" :precision="2" @change="recalcAddWages" />
        </el-form-item>

        <el-form-item label="单价" prop="hoursFixed">
          <el-input-number v-model="addForm.hoursFixed" :min="0" :step="0.1" :precision="2" @change="recalcAddWages" />
        </el-form-item>

        <el-form-item label="工资">
          <el-input v-model="addForm.wages" disabled />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="addForm.remark" :rows="3" maxlength="100" show-word-limit />
        </el-form-item>
      </el-form>

      <span slot="footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleCreateOk">确 定</el-button>
  </span>
    </el-dialog>


  </div>
</template>
<script>
import { dictInfo } from '@/api/common'
import { downloadSalaryAll, wages_detail_page_list, wages_export_detail ,downloadSalaryAllTable} from '@/api/wages'
import { wages_update } from '@/api/wages'
import { wages_create } from '@/api/wages'


import pinyinSelect from '@/components/pinyinSelect.vue'

export default {
  components: {
    pinyinSelect,
    DateIntervals: () => import('@/components/DateIntervals'),
    Pagination: () => import('@/components/Pagination'),
    BomNoSelect: () => import('@/components/Item/BomNo'),
    UserSelect: () => import('@/components/user/userSelect'),
    multipleProcedure: () => import('@/components/Item/multipleProcedure')
  },
  data() {
    return {
      userTitle: '工人',
      workShopList: [],
      statusList: [],
      userList: [],
      queryParams: {
        params: {
          bomNo: ''
        },
        page: {
          page_num: 1,
          page_size: 10
        }
      },
      form: {},
      pageTotal: 0,
      pageList: {},
      title: '',

      //修改接口
      dialogShow: false,
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      editDialogVisible: false,
      editForm: { id: '', userCount: 0, hoursFixed: 0, wages: 0, remark: '' },
      editRules: {
        userCount: [{ required: true, message: '请输入加工件数', trigger: 'change' }],
        hoursFixed: [{ required: true, message: '请输入单价', trigger: 'change' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }] // 后端要求备注必填
      },

      //新增接口
      addDialogVisible: false,
      addForm: {
        userId: '',        // 默认赋值为当前登录人
        workOrderNo: '',   // 或者使用 workOrderId（看你的后端）
        // workOrderId: '', // 如果你的后端按 id 入参，打开它并在提交时带上
        userCount: 0,
        hoursFixed: 0,
        wages: 0,
        remark: ''
      },
      addRules: {
        userId: [{ required: true, message: '请选择工人', trigger: 'change' }],
        // 二选一：一般推荐至少要有工单号（由后端换 id）
        workOrderNo: [{ required: true, message: '请输入工单号', trigger: 'blur' }],
        // 如果你的后端只吃 workOrderId，就把上面的校验换成对 workOrderId 的校验
        userCount: [{ required: true, message: '请输入加工件数', trigger: 'change' }],
        hoursFixed: [{ required: true, message: '请输入单价', trigger: 'change' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      }
    }
  },
  created() {

    //获取用户信息  当前登录用户  当前用户
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}')
    console.log('当前登录用户id----:', userInfo.id)


    // const user = localStorage.getItem('user_info');
    // const name = JSON.parse(user).userName;
    // console.log('当前登录用户名称----:', name)

    // ✅ 初始化时设置 userId 为当前用户
    this.queryParams.params.userId = userInfo.id

    this.getSelectOptions()
    this.getData()

    // 设置新增默认工人 = 当前登录人
     this.addForm.userId = userInfo.id

  },
  methods: {


    // 导出工资明细
    handleExport() {
      // 前端必填校验（可选）
      const { userId, beginTime, endTime } = this.queryParams.params
      if (!userId || !beginTime || !endTime) {
        this.$message.error('工人和报工时间为必填！')
        return
      }
      this.$message.loading && this.$message.loading('导出中...')
      wages_export_detail(this.queryParams.params).then(res => {
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = '工人工资明细.xlsx'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(link.href)
        this.$message.success('导出成功')
      }).catch(() => this.$message.error('导出失败'))
    },

    // 导出工资明细
    handleExportAllSign() {
      // 前端必填校验（可选）
      const { userId, beginTime, endTime } = this.queryParams.params
      if ( !beginTime || !endTime) {
        this.$message.error('报工时间为必填！')
        return
      }
      this.$message.loading && this.$message.loading('导出中...')
      downloadSalaryAllTable(this.queryParams.params).then(res => {
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = '工人工资明细.xlsx'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(link.href)
        this.$message.success('导出成功')
      }).catch(() => this.$message.error('导出失败'))
    },


// 组件中：导出全部工资明细（仅包含有工资的记录）
    handleExportAll() {
      this.$message.loading && this.$message.loading('导出中...')

      const { beginTime, endTime } = this.queryParams.params
      if (!beginTime || !endTime) {
        this.$message.error('请先选择报工时间范围')
        return
      }

      downloadSalaryAll({ beginTime, endTime })
        .then(res => {
          // 将返回数据转成 Blob（zip）
          const blob = new Blob([res.data], { type: 'application/zip' })
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          // 文件名：工人工资明细_开始-结束.zip
          const start = beginTime.replace(/-/g, '')
          const end = endTime.replace(/-/g, '')
          link.download = `工人工资明细_${start}-${end}.zip`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(link.href)
          this.$message.success('导出成功')
        })
        .catch(() => {
          this.$message.error('导出失败')
        })
    },

    getSelectOptions() {
      dictInfo('USER_INFO', r => (this.userList = r))


    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page.page_num = 1
      this.getData()
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
      this.$refs.userInfoDateIntervals.initDateData()
      this.getData()
    },
    getData() {
      wages_detail_page_list(this.queryParams).then(res => {
        this.pageList = res.data
        this.pageTotal = Number(res.page.total_num)
      })
    },


    // 打开编辑弹窗
    openEdit(row) {
      if (!row.id) {
        this.$message.error('缺少记录ID');
        return;
      }
      // 接口返回是字符串数字，这里统一转为 Number
      const uc = Number(row.userCount || 0);
      const hf = Number(row.hoursFixed || 0);
      this.editForm = {
        id: row.id,
        userCount: uc,
        hoursFixed: hf,
        wages: this.mul(uc, hf),
        remark: row.remark || ''
      };
      this.editDialogVisible = true;
    },

    // 保存
    handleEditOk() {
      this.$refs.editRef.validate(valid => {
        if (!valid) return;
        // wages 按件数*单价自动带给后端
        const payload = {
          id: this.editForm.id,
          userCount: Number(this.editForm.userCount),
          hoursFixed: Number(this.editForm.hoursFixed),
          wages: Number(this.editForm.wages),
          remark: (this.editForm.remark || '').trim()
        };
        wages_update(payload)
          .then(() => {
            this.$message.success('保存成功');
            this.editDialogVisible = false;
            this.getData();
          })
          .catch(() => this.$message.error('保存失败'));
      });
    },

    // 联动计算工资
    recalcWages() {
      const { userCount, hoursFixed } = this.editForm;
      this.editForm.wages = this.mul(Number(userCount || 0), Number(hoursFixed || 0));
    },

    // 小数乘法保留两位
    mul(a, b) {
      return Number((a * b).toFixed(2));
    },

    openCreate() {
      // 初始化表单（默认工人仍用当前登录人）
      const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}')
      this.addForm = {
        userId: userInfo.id || '',
        workOrderNo: '',
        // workOrderId: '',
        userCount: 0,
        hoursFixed: 0,
        wages: 0,
        remark: ''
      }
      this.addDialogVisible = true
    },

    handleCreateOk() {
      this.$refs.addRef.validate(valid => {
        if (!valid) return
        const payload = {
          userId: this.addForm.userId,
          workOrderNo: (this.addForm.workOrderNo || '').trim(),
          // 如果你的后端要求 workOrderId，就把这行换成 workOrderId: this.addForm.workOrderId
          userCount: Number(this.addForm.userCount),
          hoursFixed: Number(this.addForm.hoursFixed),
          wages: Number(this.addForm.wages),
          remark: (this.addForm.remark || '').trim()
        }
        wages_create(payload)
          .then(() => {
            this.$message.success('新增成功')
            this.addDialogVisible = false
            this.getData() // 刷新列表
          })
          .catch(() => this.$message.error('新增失败'))
      })
    },

    recalcAddWages() {
      const { userCount, hoursFixed } = this.addForm
      this.addForm.wages = this.mul(Number(userCount || 0), Number(hoursFixed || 0))
    },



  },
  watch: {
    'editForm.userCount'(v) { this.recalcWages() },
    'editForm.hoursFixed'(v) { this.recalcWages() },
    'addForm.userCount'() { this.recalcAddWages() },
    'addForm.hoursFixed'() { this.recalcAddWages() }
  }

}
</script>

<style lang="scss" scoped>
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
