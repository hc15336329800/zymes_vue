<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="pageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="项目类型" align="center" prop="checkTypeDesc"/>
      <el-table-column label="项目内容" align="center" width="240px" prop="checkContent" :show-overflow-tooltip="true"/>
      <el-table-column label="项目标准" align="center" width="240px" prop="checkStandard" :show-overflow-tooltip="true"/>
      <el-table-column label="备注" align="center" width="240px" prop="remark" :show-overflow-tooltip="true"/>
    </el-table>
    <pagination
      style="text-align: right"
      v-show="pageTotal>0"
      :total="pageTotal"
      :page.sync="queryParams.page.page_num"
      :limit.sync="queryParams.page.page_size"
      @pagination="getList"
    />
  </div>
</template>

<script>

  import {itemPageList} from '@/api/device/checkItem'

  export default {
    name: "Checksubject",
    props: {
      checkType: {
        type: String
      },
      itemIds: {
        type: String
      }
    },
    components: {
      Pagination: () => import('@/components/Pagination')
    },
    data() {
      return {
        pageTotal: 0,
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        selectedRows: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 点检项目表格数据
        pageList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          params: {},
          page: {
            page_num: 1,
            page_size: 10
          }
        },
      };
    },
    created() {
      this.getList();
    },
    watch: {
      checkType(newVal, oldVal) {
        this.checkType = newVal
        this.getList()
      },
      itemIds(newVal, oldVal) {
        this.$emit('update:itemIds', newVal)
      }
    },
    methods: {
      /** 查询点检项目列表 */
      getList() {
        this.loading = true;
        this.queryParams.params.checkType = this.checkType
        if (this.itemIds) {
          this.queryParams.params.ids = this.itemIds.split(",")
        }
        itemPageList(this.queryParams).then(res => {
          this.pageList = res.data;
          this.pageTotal = Number(res.page.total_num)
          this.loading = false;
        });
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
        this.itemIds = this.ids.join(",")
        this.$emit('update:itemIds', this.itemIds)

      },

    }
  };
</script>
