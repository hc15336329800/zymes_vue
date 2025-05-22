<template>
  <div class="app-container">
    <el-card>
      <el-form
        :inline="true"
        ref="form2"
        :model="form2"
        label-width="80px"
        label-position="left"
      >
        <!-- 承诺交期 -->
        <el-form-item
          label="承诺交期"
          prop="deliverTime"
          :rules="[{ required: true, message: '请选择承诺交期', trigger: 'blur' }]"
        >
          <el-date-picker
            v-model="form2.deliverTime"
            type="date"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            class="mr_30"
            placeholder="选择日期"
            style="width: 187px;"
          />
        </el-form-item>

        <!-- 类型 -->
        <el-form-item
          label="类型"
          prop="bizType"
          :rules="[{ required: true, message: '请选择类型', trigger: 'blur' }]"
        >
          <el-select v-model="form2.bizType" placeholder="请选择">
            <el-option
              v-for="item in getSalesOption"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <el-table
      id="isTable"
      v-loading="listLoading"
      @selection-change="handleSelectionChange"
      :data="list"
      element-loading-text="Loading"
      fit
      border
      highlight-current-row
      class="table mb_30"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        v-for="item in tableList"
        :key="item.label"
        align="center"
        :label="item.label"
        :width="item.label === '下单数量' ? 250 : ''"
      >
        <template slot-scope="scope">
          <template v-if="item.label === '下单数量'">
            <el-input-number v-model="scope.row.orderedNum" />
          </template>
          <template v-else>{{ scope.row[item.value] }}</template>
        </template>
      </el-table-column>
    </el-table>

    <div class="w_100 flex_row flex_x_center">
      <el-button type plain class="ml_20" @click="operHandle(1)">取消</el-button>
      <el-button type="primary" class="ml_20" @click="operHandle(2)">保存并提交审批</el-button>
    </div>
  </div>
</template>
<script>
import { place_page_list, place_order } from '@/api/sales' // 引入销售相关接口
import { dictInfo } from '@/api/common' // 引入通用字典信息方法

export default {
  data() {
    return {
      // 销售类型下拉框选项（通过字典获取）
      getSalesOption: [],

      // 表单对象（用于绑定承诺交期和类型）
      form2: {},

      // 用户在表格中勾选的列表数据
      selectList: [],

      // 表格列配置
      tableList: [
        { label: '订单号', value: 'orderNo' },
        { label: '关联客户', value: 'custName' },
        { label: '图纸号', value: 'bomNo' },
        { label: '需求数量', value: 'needNum' },
        { label: '待下单数量', value: 'waitOrderedNum' },
        { label: '下单数量', value: 'waitOrderedNum' } // 可编辑字段
      ],

      // 表格数据列表
      list: [],

      // 加载状态（控制表格 loading 动画）
      listLoading: false
    }
  },

  // 组件创建时执行的钩子函数
  async created() {
    this.getSelectOption()       // 获取下拉字典项
    await this.getList('clear')  // 加载表格数据，参数标记为清空状态
  },

  methods: {
    /**
     * 获取表格数据列表
     * @param {String} resetFlag - 当为 'clear' 时，重置分页信息
     */
    async getList(resetFlag) {
      this.listLoading = true
      try {
        if (resetFlag === 'clear') {
          // 初始化分页信息（默认每页 10 条）
          this.pages = {
            total: 0,
            page_num: 1,
            page_size: 10
          }
        }

        // 从路由参数中获取 ID 列表（JSON 格式的数组）
        const ids = JSON.parse(this.$route.query.id)

        // 调用后端接口获取数据列表
        const res = await place_page_list({
          page: {
            page_num: this.pages.page_num,
            page_size: this.pages.page_size
          },
          params: { list: ids }
        })

        if (res.data) {
          // 把每一条数据的 orderedNum 初始化为 waitOrderedNum
          this.list = res.data.map(item => ({
            ...item,
            orderedNum: item.waitOrderedNum
          }))
        }
      } finally {
        this.listLoading = false // 无论成功失败，关闭 loading 状态
      }
    },

    /**
     * 获取销售类型字典项（用于下拉框）
     */
    getSelectOption() {
      dictInfo('ORDER_TYPE', res => (this.getSalesOption = res))
    },

    /**
     * 表格选中项变化时触发
     * @param {Array} val - 当前选中的表格项
     */
    handleSelectionChange(val) {
      this.selectList = val
    },

    /**
     * 通用操作方法
     * @param {Number} type - 操作类型（1=取消，2=保存提交，4=查看详情）
     * @param {Object} item - 当前操作的数据项（仅详情用）
     */
    async operHandle(type, item) {
      switch (type) {
        case 1: // 取消：返回上一页
          this.$router.push({ name: 'salesManagesment' })
          break

        case 2: // 保存并提交审批
          // 表单校验
          const valid = await this.$refs.form2.validate()
          if (!valid) return

          // 判断是否选中了下生产单
          if (!this.selectList.length) {
            this.$message.error('请选择下生产单数据')
            return
          }

          // 组装提交列表（只保留 id 和用户修改的下单数量）
          const payloadList = this.selectList.map(item => ({
            id: item.id,
            orderedNum: item.orderedNum
          }))

          // 提交到后端接口
          await place_order({
            page: { page_num: 1, page_size: 1 }, // 后端要求分页参数（可忽略）
            params: {
              deliverTime: this.form2.deliverTime, // 承诺交期
              bizType: this.form2.bizType,         // 业务类型
              list: payloadList                     // 提交数据列表
            }
          })

          // 提示成功，跳转回销售管理页，并刷新列表
          this.$message.success('操作成功')
          this.operHandle(1) // 返回
          this.getList('clear') // 重新加载
          break

        case 4: // 查看 BOM 详情
          this.$router.push({
            name: 'BOMDetail',
            query: { id: item.bomNo }
          })
          break
      }
    }
  }
}
</script>
