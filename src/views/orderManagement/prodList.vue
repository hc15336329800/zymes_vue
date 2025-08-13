<!--任务分配-->
<template>
  <div class="app-container">

<!--    搜索框-->
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
      <!--      <el-form-item label="母件图纸号" class="condition">-->
      <!--        <BomNoSelect ref="BomNoSelect" :item-no.sync="queryParams.params.parentItemNo"/>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="子件图纸号" class="condition">-->
      <!--        <multipleBomNo ref="multipleBomNo" :item-nos.sync="queryParams.params.childItemNos"/>-->
      <!--      </el-form-item>-->
       <el-form-item label="BOM号" class="condition">
        <el-input
          v-model="queryParams.bomNo"
          maxlength="50"
          show-word-limit
          placeholder="请输入BOM号"
          clearable
          style="width:180px"
        />
      </el-form-item>
      <el-form-item label="状态" class="condition">
        <el-select v-model="queryParams.orderDtlStatus" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in statusList"
            :key="dict.code"
            :label="dict.name"
            :value="dict.code"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="订单号" class="condition">
        <el-input
          v-model="queryParams.orderNo"
          maxlength="32"
          show-word-limit
          placeholder="请输入订单号"
          clearable
          @input="handleOrderNoInput"
          style="width:180px"
        />
      </el-form-item>

      <!-- 新增：物料名称模糊查询 -->
      <el-form-item label="物料名称" class="condition">
        <el-input
          v-model="queryParams.itemName"
          maxlength="10"
          show-word-limit
          placeholder="请输入物料名称"
          clearable
          @input="handleItemNameInput"
          style="width:180px"
        />
      </el-form-item>


      <el-form-item class="commen-button">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
      </el-form-item>
      <el-form-item class="commen-button reset">
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
      <el-form-item></el-form-item>
    </el-form>
<!--    工具栏-->
    <el-row class="mb8">
      <el-button
        type="primary"
        class="commen-button"
        v-if="hasPerm('B006002000004')"
        v-show="buttonShow"
        icon="el-icon-plus"
        @click="procAlloc"
      >工序下发
      </el-button>
      <el-button type="primary" class="mb_20" @click="operHandle()">批量关闭</el-button>
    </el-row>

<!--    表格列表-->
    <!--    <el-table :data="pageList" class="commen-table mt_20" @selection-change="handleSelectionChange"    @sort-change="handleSortChange"     >-->
    <el-table
      ref="treeTable"
      :data="pageList"
      :row-key="row => row.id"
      lazy
      :load="loadChildren"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      class="commen-table mt_20"
      @sort-change="handleSortChange"

    >

      <!-- 自定义选择列 -->
      <el-table-column label="选择" width="80">
        <template slot-scope="scope">
          <el-checkbox
            :value="checkedMap[scope.row.id] || false"
            @change="val => onCheckChange(scope.row, val)"
          />
        </template>
      </el-table-column>

<!--      <el-table-column-->
<!--        type="selection"-->
<!--        width="55"-->
<!--        @select="handleSelect"-->
<!--        @select-all="handleSelectAll">-->
<!--      </el-table-column>-->

<!--      <el-table-column type="selection" width="55"></el-table-column>-->
      <el-table-column label="生产单号" align="center" prop="orderNo" sortable="custom" />
      <el-table-column label="图纸号" align="center" prop="topBomNo" sortable="custom" />
      <el-table-column label="部件名称" align="center" prop="itemName" sortable="custom" />
      <el-table-column label="物料号" align="center" prop="itemNo" sortable="custom" />
      <el-table-column label="bom号" align="center" prop="bomNo" sortable="custom" />
      <el-table-column label="计划数量" align="center" prop="itemCount" sortable="custom" />
      <el-table-column label="已生产数量" align="center" prop="productionCount" sortable="custom" />
      <el-table-column label="任务状态" align="center" prop="orderDtlStatusDesc" sortable="custom" />
      <el-table-column label="创建时间" align="center" prop="createdTime" sortable="custom" />
      <el-table-column label="操作" align="center"   class-name="small-padding fixed-width">
        <template slot-scope="scope" >
          <!-- 只有“叶子节点”才显示按钮，根节点（有 children）不显示 -->
          <template v-if="!scope.row.children || scope.row.children.length === 0">
          <!-- 确认后不能编辑和删除 -->
          <el-button
            link
            type="primary"
            icon="Edit"
            v-if="scope.row.orderDtlStatus != '06' && hasPerm('B006002000005') "
            @click="updateOrderStatus(scope.row,'06')"
          >关闭
          </el-button>
<!--          <el-button-->
<!--            link-->
<!--            type="primary"-->
<!--            icon="Delete"-->
<!--            v-if="(scope.row.orderDtlStatus == '03'||scope.row .orderDtlStatus== '04')  && hasPerm('B006002000006')"-->
<!--            @click="updateOrderStatus(scope.row,'07')"-->
<!--          >暂停-->
<!--          </el-button>-->
<!--          <el-button-->
<!--            link-->
<!--            type="primary"-->
<!--            icon="Delete"-->
<!--            v-if="(scope.row.orderDtlStatus == '07'|| scope.row .orderDtlStatus== '06') &&   hasPerm('B006002000007')"-->
<!--            @click="updateOrderStatus(scope.row,'04')"-->
<!--          >恢复-->
<!--          </el-button>-->
        </template>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      style="text-align: right"
      v-show="pageTotal>0"
      :total="pageTotal"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getData"
    />
  </div>
</template>
<script>
import { dictInfo } from '@/api/common'
import { orderPageList, updateAllocation, updateOrderStatus } from '@/api/order/order'

export default {
  components: {
    DateIntervals: () => import('@/components/DateIntervals'),
    Pagination: () => import('@/components/Pagination'),
    BomNoSelect: () => import('@/components/Item/BomNo'),
    multipleBomNo: () => import('@/components/Item/multipleBomNo')
  },
  data() {
    return {

      checkedMap: {}, // id: true/false   自定义复选框


      pageList: [],       // 表格实际渲染的数组数据
      originList: [],     // 存储原始顺序，用于取消排序时还原
      statusList: [],
      selectList: [],
      multipleSelection: [],
      queryParams: {
        orderNo: '',
        parentItemNo: '',
        // childItemNos: [],
        itemName: '',
        bomNo: '', //  BOM号查询条件
        orderDtlStatus: '03',  //待生产
        pageNum: 1,
        pageSize: 20
      },

      form: {},
      pageTotal: 0,
      // pageList: {},
      title: '',
      dialogShow: false,
      buttonShow: false,
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      }
    }
  },
  created() {
    const user = localStorage.getItem('user_info')
    const name = JSON.parse(user).userName
    this.buttonShow = true
    // if(name ==='admin'){
    //   this.buttonShow = true;
    // }else{
    //   this.currentHour = new Date().getHours();
    //   if(this.currentHour === 8 || this.currentHour === 9){
    //     this.buttonShow = true;
    //   }
    // }
    this.getOptionData()
    this.getData()
  },
  methods: {

    //树：模拟懒加载）
    loadChildren(row, resolve) {
      // 模拟懒加载 —— 实际数据已包含所有 children
      setTimeout(() => {
        resolve(row.children || []);
      }, 0); // 不延迟也可以，立即 resolve
    },


    // -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -新增树形组测试// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// ---

    // 勾选或取消当前行
    onCheckChange(row, checked) {
      this.$set(this.checkedMap, row.id, checked);
      // 级联更新子节点
      this.cascadeChildren(row, checked);
      // 更新全选列表
      this.updateSelectedList();
    },


    // 递归设置所有子节点的勾选状态
    cascadeChildren(row, checked) {
      if (!row.children || row.children.length === 0) return;
      row.children.forEach(child => {
        this.$set(this.checkedMap, child.id, checked);
        this.cascadeChildren(child, checked);
      });
    },

    // 更新最终勾选的 selectList
    updateSelectedList() {
      this.selectList = Object.entries(this.checkedMap)
        .filter(([_, v]) => v)
        .map(([k]) => k); // 得到勾选的 id 列表
    },

    // -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// / -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// -// ---

    // 输入框校验
    handleOrderNoInput(val) {
      // 这里可以做更严格校验，如只允许字母数字（可选）
      if (val && val.length > 32) {
        this.queryParams.orderNo = val.slice(0, 32)
      }
    },
    // ========== 新增：物料名称长度校验 ==========
    handleItemNameInput(val) {
      if (val && val.length > 10) {
        this.queryParams.itemName = val.slice(0, 10)
      }
    },

    /** 搜索按钮操作 */
    handleQuery() {
      // this.queryParams.page.page_num = 1
      this.queryParams.pageNum = 1 // 标准分页写法，重置到第1页

      this.getData()
    },
    beforeClose() {
      this.form = {}
      this.$refs['form'].clearValidate()
    },
    /** 重置操作表单 */
    handleReset() {
      this.queryParams = {
        orderNo: '',
        parentItemNo: '',
        // childItemNos: [],
        // ========== 新增 ==========
        itemName: '',
        orderDtlStatus: '',
        pageNum: 1,
        pageSize: 20
      }
      this.getData()
    },
    getOptionData() {
      dictInfo('ORDER_STATUS', r => (this.statusList = r))
    },

    /**
     * el-table 表头点击排序事件，前端本地排序
     * @param {{ prop: string, order: 'ascending'|'descending'|null }} sort
     */
    handleSortChange({ prop, order }) {
      // 没有排序，恢复原始顺序
      if (!order) {
        this.pageList = [...this.originList]
        return
      }

      // 升降序转换
      const sortFlag = order === 'ascending' ? 1 : -1

      // 按数据类型自动排序，空值排最后
      this.pageList = [...this.pageList].sort((a, b) => {
        const valA = a[prop]
        const valB = b[prop]

        if (valA == null && valB != null) return 1
        if (valB == null && valA != null) return -1
        if (valA == null && valB == null) return 0

        // 数字比较
        if (!isNaN(valA) && !isNaN(valB)) {
          return (Number(valA) - Number(valB)) * sortFlag
        }
        // 日期字段名包含 time 或 date，按时间排
        if (/time|date/i.test(prop)) {
          return (new Date(valA) - new Date(valB)) * sortFlag
        }
        // 字符串比较
        return valA.toString().localeCompare(valB.toString(), 'zh-Hans-CN') * sortFlag
      })
    },


    //初始化和查询
    getData() {
      // orderPageList(this.queryParams).then(res => {
      //   this.pageList = res.data|| []
      //   console.log("data:" + this.pageList[0].bomNo);
      //   this.pageTotal = Number(res.page.total_num)
      // })

      orderPageList(this.queryParams).then(res => {
        // 适配后端返回结构，确保是数组
        const arr = Array.isArray(res.data) ? res.data : (res.data?.list || [])
        this.pageList = arr
        this.originList = [...arr]  // 拷贝原始顺序
        this.pageTotal = Number(res.page?.total_num || 0)
      })
    },
    procAlloc() {
      if (this.selectList.length == 0) {
        this.$message.error('请选择工序分配的生产单！')
        return
      }
      this.$router.push({
        name: 'newprocessAllocation',
        query: {
          id: JSON.stringify(this.selectList)
        }
      })
    },
    updateOrderStatus(row, status) {
      updateOrderStatus({
        params: {
          id: row.id,
          orderDtlStatus: status
        }
      }).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.getData()
      })
    },
    // handleSelectionChange(val) {
    //   if (val.length == this.pageList.length) {
    //     //当前页数据全选
    //     val.forEach(item => {
    //       if (this.selectList.every(it => it != item.id)) {
    //         this.selectList.push(item.id)
    //         this.multipleSelection.push(item)
    //       }
    //     })
    //   } else if (val.length > 0) {
    //     //当前页数据部分改动
    //     this.pageList.forEach(item => {
    //       let index = val.findIndex(it => it.id == item.id)
    //       if (index > -1) {
    //         if (this.selectList.every(i => i != item.id)) {
    //           this.selectList.push(item.id)
    //           this.multipleSelection.push(item)
    //         }
    //       } else {
    //         let i = this.selectList.findIndex(i => i == item.id)
    //         if (i > -1) {
    //           this.selectList.splice(i, 1)
    //           this.multipleSelection.splice(i, 1)
    //         }
    //       }
    //     })
    //   } else if (val.length == 0) {
    //     //当前页数据全删除
    //     this.pageList.forEach(item => {
    //       let index = this.selectList.findIndex(it => it == item.id)
    //       if (index > -1) {
    //         this.selectList.splice(index, 1)
    //         this.multipleSelection.splice(index, 1)
    //       }
    //     })
    //   }
    //   console.log(this.multipleSelection, 'this.selectList')
    // },
    operHandle() {
      if (this.selectList.length <= 0) {
        this.$message.error('请选择数据')
        return
      }
      this.$confirm('确认批量关闭', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        updateAllocation({
          params: {
            ids: this.selectList,
            status: '06'
          }
        }).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getData()

        })
      })


    },
    cancel() {
      this.dialogShow = false
      this.form = {}
      this.$refs['form'].clearValidate()
    }
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
